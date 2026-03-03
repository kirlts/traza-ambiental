import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint requerido" }, { status: 400 });
    }

    // Eliminar la suscripción
    const deletedSubscription = await prisma.pushSubscription.deleteMany({
      where: {
        userId: session.user.id,
        endpoint: endpoint,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Suscripción eliminada exitosamente",
      deletedCount: deletedSubscription.count,
    });
  } catch (error: unknown) {
    console.error("❌ Error eliminando suscripción push:", error);

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
