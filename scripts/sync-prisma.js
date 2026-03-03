#!/usr/bin/env node
/* eslint-disable */

/**
 * Script para sincronizar automáticamente Prisma antes de iniciar el servidor
 */

const { execSync } = require("child_process");

// Colores para la consola
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function syncPrisma() {
  // Sincronizar base de datos con Prisma
  log("🔄 Sincronizando base de datos con Prisma...", "blue");
  try {
    execSync("npx prisma db push", {
      stdio: "pipe",
      encoding: "utf-8",
    });
    log("✅ Base de datos sincronizada correctamente", "green");
  } catch (error) {
    log("⚠️  Advertencia: No se pudo sincronizar la base de datos", "yellow");
    log(`   ${error.message}`, "yellow");
    // Continuar de todos modos, el error podría ser que ya está sincronizada
  }

  // Generar cliente de Prisma
  log("🔄 Generando cliente de Prisma...", "blue");
  try {
    execSync("npx prisma generate", {
      stdio: "pipe",
      encoding: "utf-8",
    });
    log("✅ Cliente de Prisma generado correctamente\n", "green");
  } catch (error) {
    log("❌ Error al generar cliente de Prisma", "red");
    log(`   ${error.message}\n`, "red");
    process.exit(1);
  }
}

// Si se ejecuta directamente, sincronizar
if (require.main === module) {
  syncPrisma().catch((error) => {
    log(`❌ Error: ${error.message}`, "red");
    process.exit(1);
  });
}

module.exports = { syncPrisma };
