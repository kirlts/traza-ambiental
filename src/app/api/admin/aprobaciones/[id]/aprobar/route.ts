import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoVerificacionUsuario, EstadoValidacion } from "@prisma/client";
import { z } from "zod";

// Schema de validación para aprobación
const aprobarSchema = z.object({
  notasValidacion: z.string().optional(),
  validadoContraPortal: z.boolean().default(false),
  portalVerificado: z.string().optional(),
  fechaVerificacionPortal: z.string().optional(),
});

/**
 * POST /api/admin/aprobaciones/[id]/aprobar
 *
 * Aprueba la documentación de un usuario y cambia su estado a verificado.
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
    const validationResult = aprobarSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe y está pendiente
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        documentos: {
          where: { estadoValidacion: { not: EstadoValidacion.VENCIDO } },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (usuario.estadoVerificacion === EstadoVerificacionUsuario.VERIFICADO) {
      return NextResponse.json({ error: "El usuario ya está verificado" }, { status: 400 });
    }

    if (usuario.documentos.length === 0) {
      return NextResponse.json(
        { error: "El usuario no tiene documentos para aprobar" },
        { status: 400 }
      );
    }

    // Iniciar transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Actualizar todos los documentos del usuario a APROBADO
      await tx.documentoVerificacion.updateMany({
        where: {
          usuarioId: userId,
          estadoValidacion: EstadoValidacion.PENDIENTE,
        },
        data: {
          estadoValidacion: EstadoValidacion.APROBADO,
          validadoPorId: session.user.id,
          fechaValidacion: new Date(),
          notasValidacion: validationResult.data.notasValidacion,
          validadoContraPortal: validationResult.data.validadoContraPortal,
          portalVerificado: validationResult.data.portalVerificado,
          fechaVerificacionPortal: validationResult.data.fechaVerificacionPortal
            ? new Date(validationResult.data.fechaVerificacionPortal)
            : null,
        },
      });

      // Crear logs de validación para cada documento
      const documentosActualizados = await tx.documentoVerificacion.findMany({
        where: {
          usuarioId: userId,
          estadoValidacion: EstadoValidacion.APROBADO,
          validadoPorId: session.user.id,
        },
        select: { id: true, tipoDocumento: true, estadoValidacion: true },
      });

      for (const documento of documentosActualizados) {
        await tx.logValidacion.create({
          data: {
            documentoId: documento.id,
            usuarioValidadorId: session.user.id,
            accion: "APROBACIÓN",
            motivo: validationResult.data.notasValidacion || "Documentación aprobada",
            estadoAnterior: EstadoValidacion.PENDIENTE,
            estadoNuevo: EstadoValidacion.APROBADO,
          },
        });
      }

      // Actualizar estado del usuario
      const usuarioActualizado = await tx.user.update({
        where: { id: userId },
        data: {
          estadoVerificacion: EstadoVerificacionUsuario.VERIFICADO,
          fechaVerificacion: new Date(),
          verificadoPorId: session.user.id,
        },
      });

      return {
        usuario: usuarioActualizado,
        documentosAprobados: documentosActualizados.length,
      };
    });

    // Enviar email de aprobación
    try {
      const { sendAprobacionMasivaEmail } = await import("@/lib/emails/send");
      await sendAprobacionMasivaEmail(
        resultado.usuario.email,
        resultado.usuario.name || "",
        resultado.documentosAprobados,
        admin?.name || "Administrador"
      );
    } catch (error: unknown) {
      console.error("Error enviando email de aprobación:", error);
      // No fallar la operación por error de email
    }

    // Preparar respuesta
    const respuesta = {
      usuario: {
        id: resultado.usuario.id,
        name: resultado.usuario.name || "",
        email: resultado.usuario.email,
        estadoVerificacion: resultado.usuario.estadoVerificacion,
        fechaVerificacion: resultado.usuario.fechaVerificacion,
        verificadoPor: admin?.name || "Administrador",
      },
      documentosAprobados: resultado.documentosAprobados,
      mensaje: "Documentación aprobada exitosamente. Email de notificación enviado.",
    };

    return NextResponse.json(respuesta);
  } catch (error: unknown) {
    console.error("Error aprobando documentación:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
