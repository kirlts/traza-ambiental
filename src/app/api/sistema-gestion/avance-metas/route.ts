import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSistemaGestion } from "@/lib/auth-helpers";
import { calcularAvanceAnual, proyectarCumplimientoMeta } from "@/lib/helpers/metas-helpers";

/**
 * GET /api/sistema-gestion/avance-metas
 * Obtiene el avance actual de las metas con proyecciones
 * Query params: anio? (opcional, default: año actual)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      console.error("[avance-metas] No hay sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isSistemaGestion(session)) {
      console.error("[avance-metas] Usuario no es sistema de gestión:", session.user.roles);
      return NextResponse.json(
        { error: "Acceso denegado. Se requiere rol Sistema de Gestión" },
        { status: 403 }
      );
    }

    // Obtener año de query params
    const { searchParams } = new URL(request.url);
    const anioParam = searchParams.get("anio");
    const anio = anioParam ? parseInt(anioParam) : new Date().getFullYear();

    // Calcular avance anual
    const avance = await calcularAvanceAnual(session.user.id, anio);

    // Proyecciones
    const proyeccionRecoleccion = avance.recoleccion
      ? proyectarCumplimientoMeta(
          avance.recoleccion.metaToneladas,
          avance.recoleccion.avanceToneladas
        )
      : null;

    const proyeccionValorizacion = avance.valorizacion
      ? proyectarCumplimientoMeta(
          avance.valorizacion.metaToneladas,
          avance.valorizacion.avanceToneladas
        )
      : null;

    return NextResponse.json({
      anio,
      avance,
      proyecciones: {
        recoleccion: proyeccionRecoleccion,
        valorizacion: proyeccionValorizacion,
      },
    });
  } catch (error: unknown) {
    console.error("[avance-metas] Error:", error);
    console.error(
      "[avance-metas] Stack:",
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).stack
        : "No stack trace available"
    );
    return NextResponse.json(
      {
        error: "Error al calcular avance de metas",
        details:
          error instanceof Error
            ? error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error)
            : String(error),
      },
      { status: 500 }
    );
  }
}
