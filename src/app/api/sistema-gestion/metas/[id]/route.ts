import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSistemaGestion } from "@/lib/auth-helpers";
import { actualizarMetaSchema } from "@/lib/validations/metas-sistema";
import { validarModificacionMeta, registrarAuditoria } from "@/lib/helpers/metas-helpers";
import { esModificacionSignificativa } from "@/lib/validations/metas-sistema";

/**
 * GET /api/sistema-gestion/metas/[id]
 * Obtiene una meta específica
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user || !isSistemaGestion(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const meta = await prisma.meta.findUnique({
      where: { id },
      include: {
        desgloses: true,
        declaracion: {
          select: {
            id: true,
            folio: true,
            anio: true,
          },
        },
      },
    });

    if (!meta) {
      return NextResponse.json({ error: "Meta no encontrada" }, { status: 404 });
    }

    // Verificar que la meta pertenece al usuario
    if (meta.sistemaGestionId !== session.user.id) {
      return NextResponse.json({ error: "No tiene permisos para ver esta meta" }, { status: 403 });
    }

    return NextResponse.json({ meta });
  } catch (error: unknown) {
    console.error("Error al obtener meta:", error);
    return NextResponse.json({ error: "Error al obtener meta" }, { status: 500 });
  }
}

/**
 * PUT /api/sistema-gestion/metas/[id]
 * Actualiza una meta existente
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user || !isSistemaGestion(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    // Buscar la meta existente
    const metaExistente = await prisma.meta.findUnique({
      where: { id },
    });

    if (!metaExistente) {
      return NextResponse.json({ error: "Meta no encontrada" }, { status: 404 });
    }

    // Verificar propiedad
    if (metaExistente.sistemaGestionId !== session.user.id) {
      return NextResponse.json(
        { error: "No tiene permisos para modificar esta meta" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar datos
    const validacion = actualizarMetaSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          detalles: validacion.error.issues,
        },
        { status: 400 }
      );
    }

    const { metaToneladas, justificacion } = validacion.data;

    // Validar que se puede modificar
    const validacionModificacion = validarModificacionMeta(
      metaExistente.metaToneladas,
      metaToneladas,
      metaExistente.avanceToneladas
    );

    if (!validacionModificacion.valida) {
      return NextResponse.json({ error: validacionModificacion.mensaje }, { status: 400 });
    }

    // Verificar si es una modificación significativa
    const esSignificativa = esModificacionSignificativa(metaExistente.metaToneladas, metaToneladas);

    if (esSignificativa && !justificacion) {
      return NextResponse.json(
        {
          error: "Modificación significativa",
          mensaje: "Este cambio supera el 10% de la meta original. Se requiere justificación.",
          requiereJustificacion: true,
        },
        { status: 400 }
      );
    }

    // Actualizar la meta
    const metaActualizada = await prisma.meta.update({
      where: { id },
      data: {
        metaToneladas,
        justificacionCambio: justificacion,
        modificadoPor: session.user.id,
        porcentajeAvance: (metaExistente.avanceToneladas / metaToneladas) * 100,
      },
      include: {
        desgloses: true,
      },
    });

    // Registrar en auditoría
    await registrarAuditoria(
      session.user.id,
      "modificar_meta",
      "Meta",
      id,
      {
        metaToneladas: metaExistente.metaToneladas,
      },
      {
        metaToneladas,
      },
      justificacion
    );

    return NextResponse.json({
      meta: metaActualizada,
      mensaje: "Meta actualizada exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error al actualizar meta:", error);
    return NextResponse.json({ error: "Error al actualizar meta" }, { status: 500 });
  }
}

/**
 * DELETE /api/sistema-gestion/metas/[id]
 * Elimina una meta (solo si no tiene avance)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || !isSistemaGestion(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const meta = await prisma.meta.findUnique({
      where: { id },
    });

    if (!meta) {
      return NextResponse.json({ error: "Meta no encontrada" }, { status: 404 });
    }

    // Verificar propiedad
    if (meta.sistemaGestionId !== session.user.id) {
      return NextResponse.json(
        { error: "No tiene permisos para eliminar esta meta" },
        { status: 403 }
      );
    }

    // No permitir eliminar si ya tiene avance
    if (meta.avanceToneladas > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar una meta con avance registrado",
          mensaje: "La meta ya tiene avance de " + meta.avanceToneladas + " toneladas",
        },
        { status: 400 }
      );
    }

    // Eliminar la meta (los desgloses se eliminan en cascada)
    await prisma.meta.delete({
      where: { id },
    });

    // Registrar en auditoría
    await registrarAuditoria(
      session.user.id,
      "eliminar_meta",
      "Meta",
      id,
      {
        anio: meta.anio,
        tipo: meta.tipo,
        metaToneladas: meta.metaToneladas,
      },
      null,
      "Meta eliminada por el usuario"
    );

    return NextResponse.json({
      mensaje: "Meta eliminada exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error al eliminar meta:", error);
    return NextResponse.json({ error: "Error al eliminar meta" }, { status: 500 });
  }
}
