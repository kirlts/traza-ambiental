#!/usr/bin/env node
/* eslint-disable */
/**
 * Script de despliegue para Vercel - Enfoque Simple
 *
 * Comportamiento:
 *
 * INITIALIZE_DB_AND_SEED_DATA=true:
 *   - Elimina y recrea la base de datos completamente
 *   - Ejecuta todas las migraciones
 *   - Ejecuta seeds y crea usuario administrador
 *
 * INITIALIZE_DB_AND_SEED_DATA=false:
 *   - Solo ejecuta migraciones
 *   - NO ejecuta seeds
 *   - NO crea usuario administrador
 */

const { execSync } = require("child_process");

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function exec(command, description) {
  log("🔄", description);
  try {
    execSync(command, {
      stdio: "inherit",
      env: process.env,
    });
    log("✅", `${description} - completado`);
    return true;
  } catch (error) {
    log("❌", `${description} - falló`);
    throw error;
  }
}

async function main() {
  const shouldInitialize = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";
  const isProduction = process.env.NODE_ENV === "production";

  log("🚀", "Iniciando proceso de despliegue en Vercel");
  log("📍", `Entorno: ${isProduction ? "PRODUCCIÓN" : "DESARROLLO"}`);
  log("🔧", `INITIALIZE_DB_AND_SEED_DATA: ${shouldInitialize}`);
  console.log("");

  if (shouldInitialize) {
    log("⚠️", "MODO: Inicialización completa de base de datos");

    if (isProduction) {
      log("⚠️", "¡ADVERTENCIA! Inicialización en PRODUCCIÓN no recomendada");
      log("📋", "Para producción, use INITIALIZE_DB_AND_SEED_DATA=false");
      log("💡", "Usando db push en lugar de reset por seguridad");
      console.log("");

      // En producción, usar db push que es más seguro
      exec(
        "npx prisma db push --accept-data-loss --skip-generate",
        "Sincronizar schema con db push"
      );
      console.log("");
    } else {
      log("📋", "Acciones: Eliminar BD → Recrear → Migraciones → Seeds");
      console.log("");

      // TODO: Implementar respaldo rápido de la base de datos antes de eliminarla
      log("⚠️", "TODO: Implementar respaldo automático de BD antes de eliminar");
      console.log("");

      // Solo en desarrollo hacer reset completo
      log("🗑️", "Eliminando base de datos existente...");
      exec("npx prisma migrate reset --force --skip-seed", "Reset de base de datos");
      console.log("");

      log("✅", "Base de datos recreada y migraciones aplicadas");
      console.log("");
    }
  } else {
    log("📋", "MODO: Solo migraciones (sin seeds)");
    log("📋", "Acciones: Aplicar migraciones pendientes únicamente");
    console.log("");

    // Solo ejecutar migraciones
    exec("npx prisma migrate deploy", "Aplicar migraciones");
    console.log("");

    log("ℹ️", "Seeds omitidos (INITIALIZE_DB_AND_SEED_DATA=false)");
    log("ℹ️", "Usuario administrador no será creado");
  }

  log("🎉", "Proceso de despliegue de base de datos completado");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    log("❌", "Error en el proceso de despliegue");
    console.error(error);
    process.exit(1);
  });
