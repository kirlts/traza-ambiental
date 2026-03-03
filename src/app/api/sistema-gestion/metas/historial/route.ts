import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSistemaGestion } from "@/lib/auth-helpers";
import { obtenerHistorialMetas } from "@/lib/helpers/metas-helpers";

/**
 * GET /api/sistema-gestion/metas/historial
 * Obtiene el historial de metas de todos los años
 */
export async function GET() {
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

    // Obtener historial
    const historial = await obtenerHistorialMetas(session.user.id);

    return NextResponse.json({
      historial,
    });
  } catch (error: unknown) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json({ error: "Error al obtener historial de metas" }, { status: 500 });
  }
}
