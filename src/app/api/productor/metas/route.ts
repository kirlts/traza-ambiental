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

    // Obtener todas las metas del productor
    const metas = await prisma.meta.findMany({
      where: {
        productorId: session.user.id,
      },
      include: {
        declaracion: {
          select: {
            anio: true,
            folio: true,
            totalToneladas: true,
          },
        },
      },
      orderBy: [{ anio: "desc" }, { tipo: "asc" }],
    });

    return NextResponse.json({ metas });
  } catch (error: unknown) {
    console.error("Error al obtener metas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
