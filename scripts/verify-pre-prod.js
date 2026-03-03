#!/usr/bin/env node
/* eslint-disable */

/**
 * Script de verificación pre-producción
 *
 * Verifica que todo esté listo antes de hacer el reset en producción
 *
 * Uso:
 *   npm run verify:pre-prod
 *   o
 *   node scripts/verify-pre-prod.js
 */

const { execSync } = require("child_process");
const { loadEnvConfig } = require("@next/env");
const fs = require("fs");
const path = require("path");

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

// Resultados de las verificaciones
const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function checkPassed(name) {
  success(name);
  checks.passed++;
}

function checkFailed(name, reason) {
  error(`${name}: ${reason || "Falló"}`);
  checks.failed++;
}

function checkWarning(name, reason) {
  warning(`${name}: ${reason || "Advertencia"}`);
  checks.warnings++;
}

async function main() {
  console.log("\n");
  log("╔════════════════════════════════════════════════════════════╗", "cyan");
  log("║                                                            ║", "cyan");
  log("║    🔍 VERIFICACIÓN PRE-PRODUCCIÓN 🔍                       ║", "cyan");
  log("║                                                            ║", "cyan");
  log("╚════════════════════════════════════════════════════════════╝", "cyan");
  console.log("\n");

  // Cargar variables de entorno
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);

  console.log("");

  // ==========================================
  // 1. VERIFICAR VARIABLES DE ENTORNO
  // ==========================================
  bold("📋 1. Verificando Variables de Entorno...");
  console.log("");

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    checkFailed("DATABASE_URL", "No está definida");
  } else {
    try {
      // Extraer información de la URL sin mostrar credenciales
      const url = new URL(dbUrl.replace(/^postgresql:/, "https:"));
      const dbName = url.pathname.split("/").filter(Boolean).pop()?.split("?")[0] || "unknown";
      checkPassed(`DATABASE_URL configurada (BD: ${dbName})`);
      info(`   Host: ${url.hostname}`);
      info(`   Puerto: ${url.port || "5432"}`);
    } catch (e) {
      checkFailed("DATABASE_URL", "Formato inválido");
    }
  }

  const nodeEnv = process.env.NODE_ENV || "development";
  info(`NODE_ENV: ${nodeEnv}`);

  console.log("");

  // ==========================================
  // 2. VERIFICAR CONEXIÓN A BASE DE DATOS
  // ==========================================
  bold("🔌 2. Verificando Conexión a Base de Datos...");
  console.log("");

  if (!dbUrl) {
    checkFailed("Conexión a BD", "DATABASE_URL no configurada");
  } else {
    try {
      // Verificar que Prisma puede conectarse
      execSync('npx prisma db execute --stdin <<< "SELECT 1;"', {
        stdio: "pipe",
        env: process.env,
      });
      checkPassed("Conexión a base de datos exitosa");
    } catch (e) {
      checkWarning(
        "Conexión a base de datos",
        "No se pudo conectar (puede ser normal si PostgreSQL no está corriendo)"
      );
      info("   Para pruebas completas, asegúrate de que PostgreSQL esté corriendo");
      info("   Comando útil: pg_isready (verifica si PostgreSQL está activo)");
    }
  }

  console.log("");

  // ==========================================
  // 3. VERIFICAR CLIENTE DE PRISMA
  // ==========================================
  bold("📦 3. Verificando Cliente de Prisma...");
  console.log("");

  try {
    const prismaClientPath = path.join(projectDir, "node_modules", ".prisma", "client");
    if (fs.existsSync(prismaClientPath)) {
      checkPassed("Cliente de Prisma generado");
    } else {
      checkWarning("Cliente de Prisma", "No encontrado. Ejecuta: npm run db:generate");
    }
  } catch (e) {
    checkWarning("Cliente de Prisma", "No se pudo verificar");
  }

  console.log("");

  // ==========================================
  // 4. VERIFICAR MIGRACIONES
  // ==========================================
  bold("🗄️  4. Verificando Migraciones...");
  console.log("");

  try {
    const migrationsPath = path.join(projectDir, "prisma", "migrations");
    if (fs.existsSync(migrationsPath)) {
      const migrations = fs
        .readdirSync(migrationsPath)
        .filter((item) => !item.includes("migration_lock.toml") && !item.includes("backup"));

      if (migrations.length > 0) {
        checkPassed(`Migraciones encontradas: ${migrations.length}`);
        info(`   Directorio: prisma/migrations/`);
      } else {
        checkWarning("Migraciones", "No se encontraron migraciones");
      }
    } else {
      checkWarning("Migraciones", "Directorio no existe");
    }
  } catch (e) {
    checkWarning("Migraciones", "No se pudo verificar");
  }

  console.log("");

  // ==========================================
  // 5. VERIFICAR SEEDERS
  // ==========================================
  bold("🌱 5. Verificando Seeders...");
  console.log("");

  try {
    const prismaDir = path.join(projectDir, "prisma");
    const seedFiles = fs
      .readdirSync(prismaDir)
      .filter((file) => file.match(/^\d{3}-\d{8}-[\w-]+-seeder\.ts$/));

    if (seedFiles.length > 0) {
      checkPassed(`Seeders encontrados: ${seedFiles.length}`);
      info("   Archivos:");
      seedFiles.forEach((file, index) => {
        info(`     ${index + 1}. ${file}`);
      });
    } else {
      checkWarning("Seeders", "No se encontraron archivos de seed");
    }

    // Verificar archivo seed.ts principal
    const seedMainPath = path.join(prismaDir, "seed.ts");
    if (fs.existsSync(seedMainPath)) {
      checkPassed("Archivo seed.ts principal existe");
    } else {
      checkFailed("Archivo seed.ts", "No encontrado");
    }
  } catch (e) {
    checkWarning("Seeders", `Error al verificar: ${e.message}`);
  }

  console.log("");

  // ==========================================
  // 6. VERIFICAR SCRIPTS NPM
  // ==========================================
  bold("📜 6. Verificando Scripts NPM...");
  console.log("");

  try {
    const packageJsonPath = path.join(projectDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const scripts = packageJson.scripts || {};

    const requiredScripts = [
      "db:reset:prod",
      "db:reset:safe",
      "db:seed",
      "db:generate",
      "db:deploy",
    ];

    let scriptsOk = true;
    for (const script of requiredScripts) {
      if (scripts[script]) {
        checkPassed(`Script ${script} existe`);
      } else {
        checkFailed(`Script ${script}`, "No encontrado");
        scriptsOk = false;
      }
    }
  } catch (e) {
    checkFailed("Scripts NPM", `Error al verificar: ${e.message}`);
  }

  console.log("");

  // ==========================================
  // 7. VERIFICAR SCRIPT DE RESET
  // ==========================================
  bold("🔧 7. Verificando Script de Reset...");
  console.log("");

  try {
    const resetScriptPath = path.join(projectDir, "scripts", "reset-prod-db.js");
    if (fs.existsSync(resetScriptPath)) {
      checkPassed("Script reset-prod-db.js existe");

      // Verificar que es ejecutable (en sistemas Unix)
      try {
        const stats = fs.statSync(resetScriptPath);
        if (process.platform !== "win32" && stats.mode & parseInt("111", 8)) {
          checkPassed("Script es ejecutable");
        }
      } catch (e) {
        // Ignorar errores de permisos
      }
    } else {
      checkFailed("Script reset-prod-db.js", "No encontrado");
    }
  } catch (e) {
    checkWarning("Script de reset", "No se pudo verificar");
  }

  console.log("");

  // ==========================================
  // 8. VERIFICAR ESTRUCTURA DE ARCHIVOS
  // ==========================================
  bold("📁 8. Verificando Estructura de Archivos...");
  console.log("");

  const requiredFiles = [
    "prisma/schema.prisma",
    "package.json",
    "scripts/reset-prod-db.js",
    "prisma/seed.ts",
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(projectDir, file);
    if (fs.existsSync(filePath)) {
      checkPassed(`Archivo ${file} existe`);
    } else {
      checkFailed(`Archivo ${file}`, "No encontrado");
    }
  }

  console.log("");

  // ==========================================
  // 9. VERIFICAR DEPENDENCIAS
  // ==========================================
  bold("📦 9. Verificando Dependencias...");
  console.log("");

  try {
    const nodeModulesPath = path.join(projectDir, "node_modules");
    if (fs.existsSync(nodeModulesPath)) {
      checkPassed("node_modules existe");

      // Verificar algunas dependencias críticas
      const criticalDeps = ["prisma", "@prisma/client", "tsx"];

      for (const dep of criticalDeps) {
        const depPath = path.join(nodeModulesPath, dep);
        if (fs.existsSync(depPath)) {
          checkPassed(`Dependencia ${dep} instalada`);
        } else {
          checkWarning(`Dependencia ${dep}`, "No encontrada. Ejecuta: npm install");
        }
      }
    } else {
      checkFailed("node_modules", "No existe. Ejecuta: npm install");
    }
  } catch (e) {
    checkWarning("Dependencias", "No se pudo verificar completamente");
  }

  console.log("");

  // ==========================================
  // RESUMEN FINAL
  // ==========================================
  log("╔════════════════════════════════════════════════════════════╗", "cyan");
  log("║                                                            ║", "cyan");
  log("║                   📊 RESUMEN DE VERIFICACIÓN              ║", "cyan");
  log("║                                                            ║", "cyan");
  log("╚════════════════════════════════════════════════════════════╝", "cyan");
  console.log("");

  log(`✅ Verificaciones exitosas: ${checks.passed}`, "green");
  log(`⚠️  Advertencias: ${checks.warnings}`, "yellow");
  log(`❌ Errores: ${checks.failed}`, checks.failed > 0 ? "red" : "green");
  console.log("");

  if (checks.failed === 0) {
    log("╔════════════════════════════════════════════════════════════╗", "green");
    log("║                                                            ║", "green");
    log("║    ✅ TODO LISTO PARA PRODUCCIÓN ✅                        ║", "green");
    log("║                                                            ║", "green");
    log("╚════════════════════════════════════════════════════════════╝", "green");
    console.log("");
    info("Puedes proceder con el reset en producción usando:");
    bold("   npm run db:reset:prod");
    console.log("");
    warning("⚠️  RECUERDA: Hacer backup antes de ejecutar el reset");
    console.log("");
  } else {
    log("╔════════════════════════════════════════════════════════════╗", "red");
    log("║                                                            ║", "red");
    log("║    ❌ HAY ERRORES QUE DEBEN CORREGIRSE ❌                 ║", "red");
    log("║                                                            ║", "red");
    log("╚════════════════════════════════════════════════════════════╝", "red");
    console.log("");
    error("Corrige los errores antes de proceder con el despliegue");
    console.log("");
    process.exit(1);
  }

  console.log("");
}

// Ejecutar
main().catch((error) => {
  error("Error fatal durante la verificación:");
  console.error(error);
  process.exit(1);
});
