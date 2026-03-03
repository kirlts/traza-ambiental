import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isProductor } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

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
        productorId: session.user.id,
      },
      include: {
        categorias: true,
        metas: true,
      },
      orderBy: {
        anio: "desc",
      },
    });

    return NextResponse.json({ declaraciones });
  } catch (error: unknown) {
    console.error("Error al obtener historial:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
