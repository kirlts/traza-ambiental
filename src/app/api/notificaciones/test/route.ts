import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";

// Función para configurar VAPID keys de forma segura
function setupVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (publicKey && privateKey) {
    webpush.setVapidDetails("mailto:test@repchile.cl", publicKey, privateKey);
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Configurar VAPID antes de procesar notificaciones
    if (!setupVapid()) {
      return NextResponse.json(
        { error: "Configuración de notificaciones push no disponible" },
        { status: 503 }
      );
    }

    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: notificationBody, icon, actions, data } = body;

    // Obtener suscripciones del usuario
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.user.id },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "No hay suscripciones activas" }, { status: 400 });
    }

    // Payload de la notificación
    const payload = JSON.stringify({
      title: title || "Notificación de Prueba",
      body: notificationBody || "Esta es una notificación de prueba del Sistema REP Chile",
      icon: icon || "/icon-192.png",
      badge: "/icon-192.png",
      data: {
        type: "test",
        timestamp: Date.now(),
        ...data,
      },
      actions: actions || [
        {
          action: "view-dashboard",
          title: "Ver Dashboard",
        },
      ],
      requireInteraction: true,
      tag: "rep-chile-test",
    });

    // Enviar notificaciones a todas las suscripciones del usuario
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: subscription.keys as unknown as webpush.PushSubscription["keys"],
            },
            payload
          );
          return { success: true, endpoint: subscription.endpoint };
        } catch (error: unknown) {
          console.error("❌ Error enviando notificación:", error);
          return {
            success: false,
            endpoint: subscription.endpoint,
            error:
              error instanceof Error
                ? (error as ReturnType<typeof JSON.parse>).message
                : String(error),
          };
        }
      })
    );

    const successful = results.filter(
      (result) => result.status === "fulfilled" && result.value.success
    ).length;

    const failed = results.length - successful;

    return NextResponse.json({
      success: true,
      message: `Notificación de prueba enviada a ${successful} dispositivo(s)`,
      results: {
        total: results.length,
        successful,
        failed,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error enviando notificación de prueba:", error);

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
