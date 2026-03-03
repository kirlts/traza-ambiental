import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isProductor } from "@/lib/auth-helpers";
import {
  getAnioDeclaracionActual,
  calcularFechaLimiteDeclaracion,
  calcularDiasRestantes,
} from "@/lib/helpers/declaracion-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isProductor(session)) {
      return NextResponse.json(
        { error: "Acceso denegado. Solo productores pueden acceder." },
        { status: 403 }
      );
    }

    const anio = getAnioDeclaracionActual();
    const fechaLimite = calcularFechaLimiteDeclaracion(anio);
    const diasRestantes = calcularDiasRestantes(fechaLimite);

    // Buscar si ya existe una declaración para este año
    const declaracionExistente = await prisma.declaracionAnual.findUnique({
      where: {
        productorId_anio: {
          productorId: session.user.id!,
          anio,
        },
      },
      include: {
        categorias: true,
      },
    });

    return NextResponse.json({
      anio,
      fechaLimite: fechaLimite.toISOString(),
      diasRestantes,
      declaracionExistente: declaracionExistente
        ? {
            id: declaracionExistente.id,
            estado: declaracionExistente.estado,
            folio: declaracionExistente.folio,
            totalUnidades: declaracionExistente.totalUnidades,
            totalToneladas: declaracionExistente.totalToneladas,
            categorias: declaracionExistente.categorias,
            fechaDeclaracion: declaracionExistente.fechaDeclaracion?.toISOString(),
          }
        : null,
    });
  } catch (error: unknown) {
    console.error("Error al obtener período activo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
