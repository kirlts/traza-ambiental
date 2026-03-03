import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSistemaGestion } from "@/lib/auth-helpers";
import { metaConDesglosesSchema } from "@/lib/validations/metas-sistema";
import { registrarAuditoria } from "@/lib/helpers/metas-helpers";

/**
 * GET /api/sistema-gestion/metas
 * Obtiene las metas del sistema de gestión
 * Query params: anio? (opcional)
 */
export async function GET(request: NextRequest) {
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

    // Obtener año de query params
    const { searchParams } = new URL(request.url);
    const anioParam = searchParams.get("anio");
    const anio = anioParam ? parseInt(anioParam) : new Date().getFullYear();

    // Buscar metas del sistema de gestión
    const metas = await prisma.meta.findMany({
      where: {
        sistemaGestionId: session.user.id,
        anio,
      },
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
      orderBy: {
        tipo: "asc",
      },
    });

    return NextResponse.json({
      metas,
      anio,
    });
  } catch (error: unknown) {
    console.error("Error al obtener metas:", error);
    return NextResponse.json({ error: "Error al obtener metas" }, { status: 500 });
  }
}

/**
 * POST /api/sistema-gestion/metas
 * Crea nuevas metas para el sistema de gestión
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
    const validacion = metaConDesglosesSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          detalles: validacion.error.issues,
        },
        { status: 400 }
      );
    }

    const { anio, tipo, metaToneladas, desgloses, justificacion } = validacion.data;

    // Verificar si ya existe una meta para este año y tipo
    const metaExistente = await prisma.meta.findFirst({
      where: {
        sistemaGestionId: session.user.id,
        anio,
        tipo,
      },
    });

    if (metaExistente) {
      return NextResponse.json(
        {
          error: "Ya existe una meta para este año y tipo",
          mensaje: "Use el método PUT para actualizar la meta existente",
        },
        { status: 409 }
      );
    }

    // Crear la meta
    const meta = await prisma.meta.create({
      data: {
        sistemaGestionId: session.user.id,
        anio,
        tipo,
        metaToneladas,
        origen: "manual",
        desgloses: desgloses
          ? {
              create: desgloses.map((d: ReturnType<typeof JSON.parse>) => ({
                criterio: d.criterio,
                valor: d.valor,
                metaToneladas: d.metaToneladas,
              })),
            }
          : undefined,
      },
      include: {
        desgloses: true,
      },
    });

    // Registrar en auditoría
    await registrarAuditoria(
      session.user.id,
      "crear_meta",
      "Meta",
      meta.id,
      null,
      {
        anio,
        tipo,
        metaToneladas,
      },
      justificacion
    );

    return NextResponse.json(
      {
        meta,
        mensaje: "Meta creada exitosamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error al crear meta:", error);
    return NextResponse.json({ error: "Error al crear meta" }, { status: 500 });
  }
}
