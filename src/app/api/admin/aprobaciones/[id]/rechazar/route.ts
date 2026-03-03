import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoVerificacionUsuario, EstadoValidacion } from "@prisma/client";
import { z } from "zod";

// Schema de validación para rechazo
const rechazarSchema = z.object({
  motivoRechazo: z.string().min(10, "El motivo debe tener al menos 10 caracteres"),
  documentosRechazados: z.array(z.string()).optional(), // IDs de documentos específicos a rechazar
});

/**
 * POST /api/admin/aprobaciones/[id]/rechazar
 *
 * Rechaza la documentación de un usuario con un motivo específico.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id: userId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    const isInternalAdmin = admin?.roles.some((ur: ReturnType<typeof JSON.parse>) =>
      ["Administrador", "ADMIN"].includes(ur.role.name)
    );

    if (!isInternalAdmin) {
      return NextResponse.json(
        { error: "No autorizado - Requiere rol administrador" },
        { status: 403 }
      );
    }

    // Parsear el body
    const body = await request.json();
    const validationResult = rechazarSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        documentos: {
          where: { estadoValidacion: EstadoValidacion.PENDIENTE },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (usuario.documentos.length === 0) {
      return NextResponse.json(
        { error: "El usuario no tiene documentos pendientes para rechazar" },
        { status: 400 }
      );
    }

    // Determinar qué documentos rechazar
    const documentosIds =
      validationResult.data.documentosRechazados ||
      usuario.documentos.map((d: ReturnType<typeof JSON.parse>) => d.id);

    // Verificar que todos los documentos pertenezcan al usuario
    const documentosParaRechazar = await prisma.documentoVerificacion.findMany({
      where: {
        id: { in: documentosIds },
        usuarioId: userId,
        estadoValidacion: EstadoValidacion.PENDIENTE,
      },
    });

    if (documentosParaRechazar.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron documentos válidos para rechazar" },
        { status: 400 }
      );
    }

    // Iniciar transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Actualizar documentos a RECHAZADO
      await tx.documentoVerificacion.updateMany({
        where: {
          id: { in: documentosIds },
          usuarioId: userId,
          estadoValidacion: EstadoValidacion.PENDIENTE,
        },
        data: {
          estadoValidacion: EstadoValidacion.RECHAZADO,
          validadoPorId: session.user.id,
          fechaValidacion: new Date(),
          notasValidacion: validationResult.data.motivoRechazo,
        },
      });

      // Crear logs de validación para cada documento rechazado
      const documentosActualizados = await tx.documentoVerificacion.findMany({
        where: {
          id: { in: documentosIds },
          usuarioId: userId,
          estadoValidacion: EstadoValidacion.RECHAZADO,
          validadoPorId: session.user.id,
        },
        select: { id: true, tipoDocumento: true },
      });

      for (const documento of documentosActualizados) {
        await tx.logValidacion.create({
          data: {
            documentoId: documento.id,
            usuarioValidadorId: session.user.id,
            accion: "RECHAZO",
            motivo: validationResult.data.motivoRechazo,
            estadoAnterior: EstadoValidacion.PENDIENTE,
            estadoNuevo: EstadoValidacion.RECHAZADO,
          },
        });
      }

      // Actualizar estado del usuario
      const usuarioActualizado = await tx.user.update({
        where: { id: userId },
        data: {
          estadoVerificacion: EstadoVerificacionUsuario.PENDIENTE_VERIFICACION,
          motivoRechazo: validationResult.data.motivoRechazo,
        },
        include: {
          documentos: true,
        },
      });

      return {
        usuario: usuarioActualizado,
        documentosRechazados: documentosActualizados.length,
      };
    });

    // Enviar email de rechazo
    try {
      const { sendRechazoEmail } = await import("@/lib/emails/send");
      for (const doc of resultado.usuario.documentos) {
        if (validationResult.data.documentosRechazados?.includes(doc.id)) {
          await sendRechazoEmail(
            resultado.usuario.email,
            resultado.usuario.name || "",
            doc.tipoDocumento,
            validationResult.data.motivoRechazo
          );
        }
      }
    } catch (error: unknown) {
      console.error("Error enviando email de rechazo:", error);
    }

    // Preparar respuesta
    const respuesta = {
      usuario: {
        id: resultado.usuario.id,
        name: resultado.usuario.name,
        email: resultado.usuario.email,
        estadoVerificacion: resultado.usuario.estadoVerificacion,
        motivoRechazo: resultado.usuario.motivoRechazo,
      },
      documentosRechazados: resultado.documentosRechazados,
      mensaje: "Documentación rechazada. El usuario debe subir documentos corregidos.",
    };

    return NextResponse.json(respuesta);
  } catch (error: unknown) {
    console.error("Error rechazando documentación:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
