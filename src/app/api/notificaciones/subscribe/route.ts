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
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Guardar o actualizar la suscripción
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId: session.user.id,
          endpoint: subscription.endpoint,
        },
      },
      update: {
        keys: subscription.keys,
        userAgent: request.headers.get("user-agent") || undefined,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Suscripción guardada exitosamente",
      subscriptionId: pushSubscription.id,
    });
  } catch (error: unknown) {
    console.error("❌ Error en suscripción push:", error);

    // Manejar errores específicos de Prisma
    if ((error as ReturnType<typeof JSON.parse>).code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una suscripción para este endpoint" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
