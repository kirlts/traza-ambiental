/**
 * Seeder para Regiones y Comunas de Chile
 *
 * Este seeder pobla las tablas `regiones` y `comunas` con los datos oficiales de Chile.
 * Incluye las 15 regiones y 346 comunas actualizadas.
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface RegionData {
  codigo: string;
  numero: number;
  nombre: string;
  comunas: string[];
}

interface DataFile {
  regiones: RegionData[];
}

export async function main() {
  console.log("🗺️  Cargando regiones y comunas de Chile...");

  // Leer el archivo JSON
  const dataPath = path.join(__dirname, "..", "data", "regiones-comunas-chile.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data: DataFile = JSON.parse(rawData);
  const regionesData: RegionData[] = data.regiones;

  console.log(`📋 Se encontraron ${regionesData.length} regiones`);

  let totalComunas = 0;

  // Insertar regiones y comunas
  for (const regionData of regionesData) {
    console.log(`\n🌍 Procesando región: ${regionData.nombre}`);

    // Crear o actualizar región
    const region = await prisma.region.upsert({
      where: { codigo: regionData.codigo },
      update: {
        nombre: regionData.nombre,
      },
      create: {
        codigo: regionData.codigo,
        nombre: regionData.nombre,
      },
    });

    console.log(`   ✅ Región ${regionData.codigo} creada/actualizada`);

    // Crear comunas para esta región en batch (mucho más rápido)
    const comunasData = regionData.comunas.map((comunaNombre) => {
      const comunaCodigo = `${regionData.codigo}-${comunaNombre
        .replace(/\s+/g, "-")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")}`.toUpperCase();

      return {
        codigo: comunaCodigo,
        nombre: comunaNombre,
        regionId: region.id,
      };
    });

    // Usar createMany con skipDuplicates para insertar todas las comunas a la vez
    const result = await prisma.comuna.createMany({
      data: comunasData,
      skipDuplicates: true,
    });

    totalComunas += comunasData.length;
    console.log(`   ✅ ${comunasData.length} comunas procesadas (${result.count} nuevas creadas)`);
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("✨ RESUMEN DE CARGA");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`📊 Total de regiones cargadas: ${regionesData.length}`);
  console.log(`📊 Total de comunas cargadas: ${totalComunas}`);
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("✅ Regiones y comunas de Chile cargadas exitosamente");
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error al cargar regiones y comunas:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
