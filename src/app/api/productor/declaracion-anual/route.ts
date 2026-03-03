import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isProductor } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { declaracionAnualSchema } from "@/lib/validations/declaracion-anual";
import { calcularFechaLimiteDeclaracion } from "@/lib/helpers/declaracion-helpers";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isProductor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Obtener todas las declaraciones del productor
    const declaraciones = await prisma.declaracionAnual.findMany({
      where: {
        productorId: session.user.id!,
      },
      include: {
        categorias: true,
      },
      orderBy: {
        anio: "desc",
      },
    });

    return NextResponse.json({ declaraciones });
  } catch (error: unknown) {
    console.error("Error al obtener declaraciones:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isProductor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const body = await request.json();

    // Validar datos con Zod
    const validacion = declaracionAnualSchema.safeParse(body);

    if (!validacion.success) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: validacion.error.issues },
        { status: 400 }
      );
    }

    const { anio, categorias } = validacion.data;

    // Calcular totales
    const totalUnidades = categorias.reduce(
      (sum, cat: ReturnType<typeof JSON.parse>) => sum + cat.cantidadUnidades,
      0
    );
    const totalToneladas = categorias.reduce(
      (sum, cat: ReturnType<typeof JSON.parse>) => sum + cat.pesoToneladas,
      0
    );

    const fechaLimite = calcularFechaLimiteDeclaracion(anio);

    // Crear o actualizar declaración
    const declaracion = await prisma.declaracionAnual.upsert({
      where: {
        productorId_anio: {
          productorId: session.user.id!,
          anio,
        },
      },
      update: {
        totalUnidades,
        totalToneladas: Number(totalToneladas.toFixed(2)),
        categorias: {
          deleteMany: {}, // Eliminar categorías existentes
          create: categorias.map((cat: ReturnType<typeof JSON.parse>) => ({
            tipo: cat.tipo,
            nombre: cat.nombre,
            descripcion: cat.descripcion,
            cantidadUnidades: cat.cantidadUnidades,
            pesoToneladas: Number(cat.pesoToneladas.toFixed(2)),
          })),
        },
      },
      create: {
        productorId: session.user.id!,
        anio,
        fechaLimite,
        totalUnidades,
        totalToneladas: Number(totalToneladas.toFixed(2)),
        estado: "borrador",
        categorias: {
          create: categorias.map((cat: ReturnType<typeof JSON.parse>) => ({
            tipo: cat.tipo,
            nombre: cat.nombre,
            descripcion: cat.descripcion,
            cantidadUnidades: cat.cantidadUnidades,
            pesoToneladas: Number(cat.pesoToneladas.toFixed(2)),
          })),
        },
      },
      include: {
        categorias: true,
      },
    });

    return NextResponse.json({
      declaracion,
      mensaje: "Declaración guardada como borrador exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error al guardar declaración:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
