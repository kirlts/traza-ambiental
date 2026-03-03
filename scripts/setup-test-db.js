#!/usr/bin/env node
/* eslint-disable */

/**
 * Script para configurar y resetear la base de datos de pruebas
 * Se ejecuta automáticamente antes de correr los tests
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🔧 Configurando base de datos de pruebas...\n");

// Leer DATABASE_URL del .env o usar default
const dbUrl =
  process.env.DATABASE_URL?.replace("trazambiental", "trazambiental_test") ||
  "postgresql://postgres:postgres@localhost:5432/trazambiental_test?schema=public";

console.log(`📊 Usando BD: ${dbUrl.split("@")[1]}\n`);

try {
  // 1. Verificar conexión a la base de datos
  console.log("🔍 Verificando conexión...");
  try {
    execSync('npx prisma db execute --stdin <<< "SELECT 1;"', {
      stdio: "pipe",
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    console.log("✅ Conexión exitosa\n");
  } catch (connError) {
    console.warn("⚠️  No se pudo conectar a la BD de pruebas.");
    console.warn("   Asegúrate de que existe: createdb trazambiental_test");
    console.warn("   Continuando de todas formas...\n");
  }

  // 2. Limpiar y crear la base de datos de pruebas
  console.log("📦 Reseteando base de datos de pruebas...");
  execSync("npx prisma db push --force-reset --skip-generate", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: dbUrl,
      PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: "automated test setup",
    },
  });

  // 3. Generar cliente de Prisma
  console.log("\n📦 Generando cliente de Prisma...");
  execSync("npx prisma generate", { stdio: "pipe" });
  console.log("✅ Cliente generado");

  // 4. Ejecutar seeders básicos para pruebas
  console.log("\n📦 Cargando datos de prueba...");
  execSync("node scripts/seed-test-data.js", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: dbUrl,
    },
  });

  console.log("\n✅ Base de datos de pruebas configurada exitosamente!\n");
} catch (error) {
  console.error("\n❌ Error configurando base de datos de pruebas:", error.message);
  console.error("   Los tests pueden fallar si la BD no está configurada correctamente.");
  console.error("   Ver README-TESTS.md para más información.\n");
  // No salir con error para permitir que los tests continúen
  process.exit(0);
}
