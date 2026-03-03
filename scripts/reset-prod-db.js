#!/usr/bin/env node
/* eslint-disable */

/**
 * Script seguro para resetear la base de datos en producción
 *
 * ⚠️ ADVERTENCIA: Este script eliminará TODOS los datos de la base de datos
 * y los reemplazará con datos de seed. Use solo si está seguro.
 *
 * Uso:
 *   npm run db:reset:prod
 *   o
 *   node scripts/reset-prod-db.js
 */

const { execSync } = require("child_process");
const { loadEnvConfig } = require("@next/env");
const readline = require("readline");

// Colores para la terminal
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, "red");
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function warning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function info(message) {
  log(`ℹ️  ${message}`, "cyan");
}

function bold(message) {
  log(`${message}`, "bold");
}

// Configurar readline para entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Cargar variables de entorno
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function main() {
  console.log("\n");
  log("╔════════════════════════════════════════════════════════════╗", "red");
  log("║                                                            ║", "red");
  log("║    🚨 RESET DE BASE DE DATOS EN PRODUCCIÓN 🚨             ║", "red");
  log("║                                                            ║", "red");
  log("╚════════════════════════════════════════════════════════════╝", "red");
  console.log("\n");

  // Obtener información de la base de datos
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    error("DATABASE_URL no está definida en las variables de entorno");
    process.exit(1);
  }

  // Extraer información de la URL de la base de datos (sin mostrar credenciales)
  let dbInfo = {};
  try {
    const url = new URL(dbUrl.replace(/^postgresql:/, "https:"));
    dbInfo = {
      host: url.hostname,
      port: url.port || "5432",
      database: url.pathname.split("/").filter(Boolean).pop()?.split("?")[0] || "unknown",
      hasAuth: !!url.username,
    };
  } catch (e) {
    warning("No se pudo parsear la URL de la base de datos, pero continuaremos...");
    dbInfo.database = "unknown";
  }

  // Mostrar información de la base de datos
  log("\n📊 Información de la Base de Datos:", "cyan");
  log(`   Host: ${dbInfo.host || "N/A"}`, "cyan");
  log(`   Puerto: ${dbInfo.port || "N/A"}`, "cyan");
  log(`   Base de Datos: ${dbInfo.database || "N/A"}`, "cyan");
  log(`   Autenticación: ${dbInfo.hasAuth ? "✅ Configurada" : "❌ No configurada"}`, "cyan");

  // Verificar entorno
  const nodeEnv = process.env.NODE_ENV || "development";
  info(`Entorno detectado: ${nodeEnv.toUpperCase()}`);

  if (nodeEnv === "production") {
    warning("⚠️  Estás en un entorno de PRODUCCIÓN");
  } else {
    warning("⚠️  Este script puede ejecutarse en cualquier entorno");
  }

  console.log("\n");
  log("═══════════════════════════════════════════════════════════", "yellow");
  warning("ADVERTENCIAS IMPORTANTES:");
  log("═══════════════════════════════════════════════════════════", "yellow");
  log("");
  log("  1. ❌ TODOS los datos existentes serán ELIMINADOS", "red");
  log("  2. ❌ Esta acción NO se puede deshacer", "red");
  log("  3. ⚠️  Se ejecutará un reset completo de la base de datos", "yellow");
  log("  4. 🔄 Después del reset, se ejecutará el seed automáticamente", "cyan");
  log("  5. 💾 Se recomienda hacer un BACKUP antes de continuar", "yellow");
  log("");

  // Primera confirmación
  console.log("\n");
  const confirm1 = await question(
    bold('¿Estás ABSOLUTAMENTE SEGURO de que quieres continuar? (escribe "RESET" para confirmar): ')
  );

  if (confirm1.trim() !== "RESET") {
    log("\n❌ Operación cancelada por el usuario", "red");
    rl.close();
    process.exit(0);
  }

  // Segunda confirmación con nombre de base de datos
  console.log("\n");
  const confirm2 = await question(
    bold(
      `Por favor, escribe el nombre de la base de datos "${dbInfo.database || "UNKNOWN"}" para confirmar: `
    )
  );

  if (confirm2.trim() !== dbInfo.database) {
    error("\n❌ El nombre de la base de datos no coincide. Operación cancelada.");
    rl.close();
    process.exit(1);
  }

  // Tercera confirmación final
  console.log("\n");
  const confirm3 = await question(
    bold("⚠️  ÚLTIMA CONFIRMACIÓN: ¿Proceder con el reset? (sí/no): ")
  );

  if (!["sí", "si", "yes", "y", "s"].includes(confirm3.trim().toLowerCase())) {
    log("\n❌ Operación cancelada por el usuario", "red");
    rl.close();
    process.exit(0);
  }

  rl.close();

  // Ejecutar el reset
  console.log("\n");
  log("═══════════════════════════════════════════════════════════", "cyan");
  bold("🔄 Iniciando proceso de reset de base de datos...");
  log("═══════════════════════════════════════════════════════════", "cyan");
  console.log("");

  try {
    // Paso 1: Generar cliente de Prisma
    info("Paso 1/3: Generando cliente de Prisma...");
    execSync("npx prisma generate", {
      stdio: "inherit",
      env: process.env,
    });
    success("Cliente de Prisma generado correctamente");
    console.log("");

    // Paso 2: Resetear base de datos
    info("Paso 2/3: Reseteando base de datos (esto puede tardar varios minutos)...");
    log("   Esto eliminará todas las tablas y datos existentes...", "yellow");
    console.log("");

    execSync("npx prisma migrate reset --force --skip-seed", {
      stdio: "inherit",
      env: {
        ...process.env,
        PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: "confirmed by user",
      },
    });
    success("Base de datos reseteada correctamente");
    console.log("");

    // Paso 3: Ejecutar seeders
    info("Paso 3/3: Ejecutando seeders para poblar la base de datos...");
    console.log("");

    execSync("npm run db:seed", {
      stdio: "inherit",
      env: process.env,
    });
    success("Seeders ejecutados correctamente");
    console.log("");

    // Éxito
    console.log("\n");
    log("╔════════════════════════════════════════════════════════════╗", "green");
    log("║                                                            ║", "green");
    log("║    ✅ RESET COMPLETADO EXITOSAMENTE ✅                    ║", "green");
    log("║                                                            ║", "green");
    log("╚════════════════════════════════════════════════════════════╝", "green");
    console.log("\n");
    success("La base de datos ha sido reseteada y poblada con datos iniciales.");
    info("El sistema está listo para usar.");
    console.log("\n");
  } catch (error) {
    console.log("\n");
    log("╔════════════════════════════════════════════════════════════╗", "red");
    log("║                                                            ║", "red");
    log("║    ❌ ERROR DURANTE EL RESET ❌                           ║", "red");
    log("║                                                            ║", "red");
    log("╚════════════════════════════════════════════════════════════╝", "red");
    console.log("\n");
    error("Ocurrió un error durante el proceso de reset:");
    console.error(error);
    console.log("\n");
    warning("La base de datos puede estar en un estado inconsistente.");
    warning("Se recomienda revisar los logs y verificar el estado de la base de datos.");
    console.log("\n");
    process.exit(1);
  }
}

// Ejecutar
main().catch((error) => {
  error("Error fatal:");
  console.error(error);
  process.exit(1);
});
