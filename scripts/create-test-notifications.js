#!/usr/bin/env node
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createTestNotifications() {
  try {
    console.log("🔄 Creando notificaciones de prueba...");

    // Obtener el ID del usuario admin
    const adminUser = await prisma.user.findFirst({
      where: { email: "admin@trazambiental.com" },
    });

    if (!adminUser) {
      console.log("❌ Usuario admin no encontrado");
      return;
    }

    console.log("👤 Usuario admin encontrado:", adminUser.id);

    // Crear notificaciones de prueba
    const notifications = [
      {
        id: "notif-test-1",
        userId: adminUser.id,
        tipo: "alerta_plazo",
        titulo: "Alerta de Plazo",
        mensaje: "Tienes 5 días para completar tu declaración mensual.",
        leida: false,
      },
      {
        id: "notif-test-2",
        userId: adminUser.id,
        tipo: "declaracion_aprobada",
        titulo: "Declaración Aprobada",
        mensaje: "Tu declaración anual ha sido aprobada exitosamente.",
        leida: false,
      },
      {
        id: "notif-test-3",
        userId: adminUser.id,
        tipo: "meta_cumplida",
        titulo: "Meta Cumplida",
        mensaje: "¡Felicitaciones! Has cumplido tu meta de recolección del mes.",
        leida: false,
      },
    ];

    for (const notif of notifications) {
      await prisma.notificacion.upsert({
        where: { id: notif.id },
        update: notif,
        create: notif,
      });
    }

    console.log("✅ Notificaciones creadas exitosamente");

    // Verificar que se crearon
    const count = await prisma.notificacion.count({
      where: { userId: adminUser.id },
    });
    console.log("📊 Total de notificaciones para admin:", count);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestNotifications();
