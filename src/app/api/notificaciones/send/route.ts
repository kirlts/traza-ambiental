import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";
import { Prisma } from "@prisma/client";

type SubscriptionWithUser = Prisma.PushSubscriptionGetPayload<{
  include: { user: { include: { roles: { include: { role: true } } } } };
}>;

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

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: unknown;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  userIds?: string[]; // IDs de usuarios específicos
  roles?: string[]; // Roles de usuarios
  type?: "broadcast" | "users" | "roles"; // Tipo de envío
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

    // Verificar autenticación - solo usuarios autorizados pueden enviar notificaciones
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos (solo admin o sistema de gestión)
    const userRoles = session.user.roles || [];
    const hasPermission = userRoles.some((role) => ["admin", "Sistema de Gestión"].includes(role));

    if (!hasPermission) {
      return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
    }

    const body: NotificationPayload = await request.json();
    const {
      title,
      body: notificationBody,
      userIds,
      roles,
      type = "broadcast",
      ...notificationOptions
    } = body;

    if (!title || !notificationBody) {
      return NextResponse.json({ error: "Título y cuerpo son requeridos" }, { status: 400 });
    }

    // Obtener suscripciones según el tipo de envío
    let subscriptions: SubscriptionWithUser[] = [];

    if (type === "broadcast") {
      // Todas las suscripciones activas
      subscriptions = await prisma.pushSubscription.findMany({
        include: { user: { include: { roles: { include: { role: true } } } } },
      });
    } else if (type === "users" && userIds?.length) {
      // Suscripciones de usuarios específicos
      subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: { in: userIds } },
        include: { user: { include: { roles: { include: { role: true } } } } },
      });
    } else if (type === "roles" && roles?.length) {
      // Suscripciones de usuarios con roles específicos
      const usersWithRoles = await prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: {
                name: { in: roles },
              },
            },
          },
        },
        select: { id: true },
      });

      const userIdsWithRoles = usersWithRoles.map((u) => u.id);

      subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: { in: userIdsWithRoles } },
        include: { user: { include: { roles: { include: { role: true } } } } },
      });
    } else {
      return NextResponse.json(
        { error: "Tipo de envío inválido o parámetros faltantes" },
        { status: 400 }
      );
    }

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No hay suscripciones activas para enviar notificaciones" },
        { status: 400 }
      );
    }

    // Payload de la notificación
    const payload = JSON.stringify({
      title,
      body: notificationBody,
      icon: notificationOptions.icon || "/icon-192.png",
      badge: notificationOptions.badge || "/icon-192.png",
      image: notificationOptions.image,
      data: {
        type: "system",
        timestamp: Date.now(),
        senderId: session.user.id,
        ...(notificationOptions.data as Record<string, unknown>),
      },
      actions: notificationOptions.actions || [
        {
          action: "view-dashboard",
          title: "Ver Dashboard",
        },
      ],
      requireInteraction: notificationOptions.requireInteraction ?? true,
      silent: notificationOptions.silent ?? false,
      tag: notificationOptions.tag || `rep-chile-${Date.now()}`,
    });

    // Enviar notificaciones
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: subscription.keys as unknown as { p256dh: string; auth: string },
            },
            payload
          );

          // Registrar la notificación enviada
          await prisma.notificacion.create({
            data: {
              userId: subscription.userId,
              tipo: "push",
              titulo: title,
              mensaje: notificationBody,
              referencia: notificationOptions.tag,
              leida: false,
            },
          });

          return {
            success: true,
            userId: subscription.userId,
            endpoint: subscription.endpoint,
          };
        } catch (error: unknown) {
          console.error("❌ Error enviando notificación:", error);

          // Registrar notificación fallida (opcional)
          await prisma.notificacion.create({
            data: {
              userId: subscription.userId,
              tipo: "push_failed",
              titulo: "Error de notificación",
              mensaje: `No se pudo enviar: ${title}`,
              referencia: notificationOptions.tag,
              leida: false,
            },
          });

          return {
            success: false,
            userId: subscription.userId,
            endpoint: subscription.endpoint,
            error: error instanceof Error ? error.message : String(error),
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
      message: `Notificación enviada a ${successful} dispositivo(s)`,
      results: {
        total: results.length,
        successful,
        failed,
        type,
        recipients:
          type === "broadcast"
            ? "Todos los usuarios"
            : type === "users"
              ? `${userIds?.length} usuarios específicos`
              : `${roles?.join(", ")} roles`,
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error enviando notificación:", error);

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
