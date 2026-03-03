import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

/**
 * Coordinador principal de seeds
 * Ejecuta automáticamente todos los archivos que sigan el patrón:
 * XXX-YYYYMMDD-nombre-descriptivo-seeder.ts
 *
 * Orden de ejecución:
 * 1. Se ordenan por el prefijo numérico (001, 002, 003, etc.)
 * 2. Cada archivo debe exportar una función 'main', 'seed' o 'default'
 * 3. El sufijo '-seeder' identifica claramente que son archivos de seed
 *
 * Control de ejecución:
 * - INITIALIZE_DB_AND_SEED_DATA=true: Ejecuta seeds (desarrollo o primer deploy)
 * - INITIALIZE_DB_AND_SEED_DATA=false: Omite seeds (deploys subsecuentes en producción)
 */
async function main() {
  console.log("🌱 Iniciando seeder completo del Sistema REP - TrazAmbiental...");
  console.log("");

  // Verificar flag de inicialización
  const shouldInitialize = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !shouldInitialize) {
    console.log("ℹ️  Seeds omitidos en producción (INITIALIZE_DB_AND_SEED_DATA=false)");
    console.log("   Solo se aplicarán migraciones de base de datos.");
    console.log("   Para ejecutar seeds, configura INITIALIZE_DB_AND_SEED_DATA=true");
    return;
  }

  if (!isProduction && !shouldInitialize) {
    console.log("⚠️  INITIALIZE_DB_AND_SEED_DATA no está configurado como 'true'");
    console.log("   En desarrollo se recomienda usar: INITIALIZE_DB_AND_SEED_DATA=true");
    console.log("   Omitiendo seeds...");
    return;
  }

  console.log(`📍 Entorno: ${isProduction ? "PRODUCCIÓN" : "DESARROLLO"}`);
  console.log(`🔧 Modo: Inicialización y seeds activos`);
  console.log("");

  try {
    // Obtener todos los archivos de seed en orden
    const seedFiles = await getSeedFiles();

    if (seedFiles.length === 0) {
      console.log(
        "⚠️  No se encontraron archivos de seed con el patrón XXX-YYYYMMDD-nombre-seeder.ts"
      );
      return;
    }

    console.log("📋 Archivos de seed encontrados:");
    seedFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log("");

    // Ejecutar cada seed en orden
    for (let i = 0; i < seedFiles.length; i++) {
      const seedFile = seedFiles[i];
      console.log(`🔄 [${i + 1}/${seedFiles.length}] Ejecutando ${seedFile}...`);

      try {
        // Importar y ejecutar el seed
        const seedModule = await import(`./${seedFile.replace(".ts", "")}`);

        // Buscar función principal (main, seed, o la función exportada)
        const seedFunction = seedModule.main || seedModule.seed || seedModule.default;

        if (typeof seedFunction === "function") {
          await seedFunction();
          console.log(`✅ ${seedFile} completado exitosamente\n`);
        } else {
          console.log(`⚠️  ${seedFile} no tiene función main, seed o default exportada\n`);
        }
      } catch (error: unknown) {
        console.error(`❌ Error ejecutando ${seedFile}:`, error);
        throw error;
      }
    }

    console.log("🎉 ¡Todos los seeds ejecutados exitosamente!");
    console.log("");
    console.log("🚀 El sistema está listo para usar con:");
    console.log("   - Configuración de metas REP");
    console.log("   - Todos los roles y usuarios de prueba");
    console.log("   - Sistema de gestión con datos de ejemplo");
  } catch (error: unknown) {
    console.error("❌ Error durante la ejecución de los seeds:", error);
    throw error;
  }
}

/**
 * Obtiene todos los archivos de seed en orden numérico
 * Patrón: XXX-YYYYMMDD-nombre-descriptivo-seeder.ts
 */
async function getSeedFiles(): Promise<string[]> {
  const prismaDir = __dirname;
  const files = fs.readdirSync(prismaDir);

  // Filtrar archivos que sigan el patrón XXX-YYYYMMDD-nombre-seeder.ts
  const seedFiles = files
    .filter((file) => {
      const match = file.match(/^(\d{3})-(\d{8})-[\w-]+-seeder\.ts$/);
      return match !== null;
    })
    .sort((a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) => {
      // Extraer número del prefijo para ordenar
      const numA = parseInt(a.match(/^(\d{3})/)?.[1] || "0");
      const numB = parseInt(b.match(/^(\d{3})/)?.[1] || "0");
      return numA - numB;
    });

  return seedFiles;
}

main()
  .catch((e: ReturnType<typeof JSON.parse>) => {
    console.error("❌ Error en el coordinador de seeds:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
