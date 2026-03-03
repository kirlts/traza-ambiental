#!/usr/bin/env node
/* eslint-disable */

/**
 * Script para generar VAPID keys para notificaciones push
 * Ejecutar con: node scripts/generate-vapid-keys.js
 */

const webpush = require("web-push");

console.log("🔑 Generando VAPID keys para notificaciones push...\n");

try {
  const vapidKeys = webpush.generateVAPIDKeys();

  console.log("✅ VAPID Keys generadas exitosamente!\n");
  console.log("📋 Agrega estas variables a tu archivo .env.local:\n");
  console.log(`VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"`);
  console.log(`VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"\n`);

  console.log("📖 Para más información sobre VAPID keys:");
  console.log(
    "https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol\n"
  );

  console.log("⚠️  IMPORTANTE:");
  console.log("- Mantén la VAPID_PRIVATE_KEY segura y nunca la expongas en el frontend");
  console.log("- La VAPID_PUBLIC_KEY se puede compartir con el navegador");
  console.log("- Estas keys son específicas para tu aplicación");
} catch (error) {
  console.error("❌ Error generando VAPID keys:", error.message);
  process.exit(1);
}
