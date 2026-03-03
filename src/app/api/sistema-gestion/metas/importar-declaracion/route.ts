import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSistemaGestion } from "@/lib/auth-helpers";
import { importarDeclaracionSchema } from "@/lib/validations/metas-sistema";
import { registrarAuditoria } from "@/lib/helpers/metas-helpers";

/**
 * POST /api/sistema-gestion/metas/importar-declaracion
 * Importa metas calculadas desde la declaración de un productor
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isSistemaGestion(session)) {
      return NextResponse.json(
        { error: "Acceso denegado. Se requiere rol Sistema de Gestión" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar datos
    const validacion = importarDeclaracionSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          detalles: validacion.error.issues,
        },
        { status: 400 }
      );
    }

    const { declaracionId } = validacion.data;

    // Buscar la declaración
    const declaracion = await prisma.declaracionAnual.findUnique({
      where: { id: declaracionId },
      include: {
        metas: true,
      },
    });

    if (!declaracion) {
      return NextResponse.json({ error: "Declaración no encontrada" }, { status: 404 });
    }

    // Verificar que la declaración esté aprobada
    if (declaracion.estado !== "enviada" && declaracion.estado !== "aprobada") {
      return NextResponse.json(
        {
          error: "La declaración debe estar enviada o aprobada para importar metas",
          estado: declaracion.estado,
        },
        { status: 400 }
      );
    }

    // Buscar las metas generadas de la declaración
    const metasDeclaracion = await prisma.meta.findMany({
      where: {
        declaracionId: declaracionId,
      },
    });

    if (metasDeclaracion.length === 0) {
      return NextResponse.json(
        {
          error: "La declaración no tiene metas calculadas",
          mensaje: "Puede que la declaración aún no haya generado metas automáticamente",
        },
        { status: 404 }
      );
    }

    // Crear las metas para el sistema de gestión
    const metasCreadas = [];

    for (const metaDeclaracion of metasDeclaracion) {
      // Verificar si ya existe
      const metaExistente = await prisma.meta.findFirst({
        where: {
          sistemaGestionId: session.user.id,
          anio: metaDeclaracion.anio,
          tipo: metaDeclaracion.tipo,
        },
      });

      if (metaExistente) {
        // Actualizar la meta existente
        const metaActualizada = await prisma.meta.update({
          where: { id: metaExistente.id },
          data: {
            metaToneladas: metaDeclaracion.metaToneladas,
            declaracionId: declaracionId,
            origen: "importado",
            modificadoPor: session.user.id,
          },
        });
        metasCreadas.push(metaActualizada);

        // Auditar
        await registrarAuditoria(
          session.user.id,
          "modificar_meta",
          "Meta",
          metaActualizada.id,
          {
            metaToneladas: metaExistente.metaToneladas,
            origen: metaExistente.origen,
          },
          {
            metaToneladas: metaDeclaracion.metaToneladas,
            origen: "importado",
            declaracionId,
          },
          `Meta actualizada desde declaración ${declaracion.folio || declaracionId}`
        );
      } else {
        // Crear nueva meta
        const nuevaMeta = await prisma.meta.create({
          data: {
            sistemaGestionId: session.user.id,
            declaracionId: declaracionId,
            anio: metaDeclaracion.anio,
            tipo: metaDeclaracion.tipo,
            metaToneladas: metaDeclaracion.metaToneladas,
            origen: "importado",
          },
        });
        metasCreadas.push(nuevaMeta);

        // Auditar
        await registrarAuditoria(
          session.user.id,
          "crear_meta",
          "Meta",
          nuevaMeta.id,
          null,
          {
            anio: metaDeclaracion.anio,
            tipo: metaDeclaracion.tipo,
            metaToneladas: metaDeclaracion.metaToneladas,
            origen: "importado",
            declaracionId,
          },
          `Meta importada desde declaración ${declaracion.folio || declaracionId}`
        );
      }
    }

    return NextResponse.json({
      metas: metasCreadas,
      declaracion: {
        id: declaracion.id,
        folio: declaracion.folio,
        anio: declaracion.anio,
      },
      mensaje: `Se importaron ${metasCreadas.length} meta(s) exitosamente`,
    });
  } catch (error: unknown) {
    console.error("Error al importar metas:", error);
    return NextResponse.json(
      { error: "Error al importar metas desde declaración" },
      { status: 500 }
    );
  }
}
