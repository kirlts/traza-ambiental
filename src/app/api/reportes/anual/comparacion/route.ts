import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos
    const userRoles = (session.user as { roles?: string[] }).roles || [];
    const hasAccess = userRoles.some((role: string) =>
      ["Sistema de Gestión", "Productor"].includes(role)
    );
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const anioActual = parseInt(
      searchParams.get("anioActual") || new Date().getFullYear().toString()
    );

    // Determinar sistemaGestionId
    let sistemaGestionId: string;
    if (userRoles.includes("Sistema de Gestión")) {
      sistemaGestionId = session.user.id;
    } else if (userRoles.includes("Productor")) {
      sistemaGestionId = session.user.id;
    } else {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    // Obtener datos de los últimos 3 años (incluyendo el actual)
    const anios = [];
    for (let i = 0; i < 3; i++) {
      anios.push(anioActual - i);
    }

    interface ComparacionItem {
      anio: number;
      toneladas: number;
      metaValorizacion: number;
      porcentajeCumplimiento: number;
      totalCertificados: number;
    }
    const comparacion: ComparacionItem[] = [];

    for (const anio of anios) {
      const fechaInicio = new Date(anio, 0, 1);
      const fechaFin = new Date(anio, 11, 31, 23, 59, 59);

      const certificados = await prisma.certificado.findMany({
        where: {
          estado: "emitido",
          fechaEmision: {
            gte: fechaInicio,
            lte: fechaFin,
          },
          sistemaGestionId,
        },
      });

      const totalToneladas = certificados.reduce((sum, cert: ReturnType<typeof JSON.parse>) => {
        return sum + cert.pesoValorizado / 1000;
      }, 0);

      const metas = await prisma.meta.findMany({
        where: {
          anio,
          OR: [{ sistemaGestionId }, { productorId: sistemaGestionId }],
        },
      });

      const metaValorizacion =
        metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "valorizacion")
          ?.metaToneladas || 0;

      comparacion.push({
        anio,
        toneladas: totalToneladas,
        metaValorizacion,
        porcentajeCumplimiento:
          metaValorizacion > 0 ? (totalToneladas / metaValorizacion) * 100 : 0,
        totalCertificados: certificados.length,
      });
    }

    // Calcular variaciones
    const comparacionConVariacion = comparacion.map(
      (item: ReturnType<typeof JSON.parse>, index) => {
        if (index === 0) {
          return {
            ...item,
            variacion: 0,
            variacionPorcentaje: 0,
          };
        }

        const anterior = comparacion[index - 1];
        const variacion = item.toneladas - anterior.toneladas;
        const variacionPorcentaje =
          anterior.toneladas > 0 ? (variacion / anterior.toneladas) * 100 : 0;

        return {
          ...item,
          variacion,
          variacionPorcentaje,
        };
      }
    );

    return NextResponse.json({
      comparacion: comparacionConVariacion,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)
        : "Error desconocido";
    console.error("Error en /api/reportes/anual/comparacion:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: errorMessage,
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
