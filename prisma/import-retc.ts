import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import https from "https";
import csv from "csv-parser";

const prisma = new PrismaClient();

// URL del catálogo oficial de establecimientos (ejemplo, debe ser configurada)
// Si no hay una URL estable, el script priorizará un archivo local en data/retc-establecimientos.csv
const RETC_DATASET_URL = process.env.RETC_DATASET_URL || "";
const LOCAL_FILE_PATH = path.join(process.cwd(), "data", "retc-establecimientos.csv");

interface RetcRecord {
  ID: string;
  RAZON_SOCIAL: string;
  DIRECCION: string;
  COMUNA: string;
  REGION: string;
  RUBRO: string;
  ESTADO: string;
}

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err: ReturnType<typeof JSON.parse>) => {
        fs.unlink(dest, () => {}); // Delete partial file
        reject(err);
      });
  });
}

async function processFile(filePath: string) {
  const records: RetcRecord[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ";" })) // Ajustar separador según el CSV real del RETC
      .on("data", (data: ReturnType<typeof JSON.parse>) => {
        // Mapeo flexible de columnas (ajustar según encabezados reales)
        const record: RetcRecord = {
          ID: data.ID || data.ID_RETC || data.VU_ID,
          RAZON_SOCIAL: data.RAZON_SOCIAL || data.NOMBRE_EMPRESA,
          DIRECCION: data.DIRECCION || data.CALLE,
          COMUNA: data.COMUNA,
          REGION: data.REGION,
          RUBRO: data.RUBRO || data.CIIU,
          ESTADO: data.ESTADO || "ACTIVO",
        };
        if (record.ID) records.push(record);
      })
      .on("end", async () => {
        console.log(`📦 Procesando ${records.length} registros...`);

        let processed = 0;
        let errors = 0;

        // Procesar en lotes para no saturar conexiones
        const BATCH_SIZE = 100;
        for (let i = 0; i < records.length; i += BATCH_SIZE) {
          const batch = records.slice(i, i + BATCH_SIZE);

          await Promise.all(
            batch.map(async (rec) => {
              try {
                await prisma.retcEstablecimiento.upsert({
                  where: { retcId: rec.ID },
                  update: {
                    razonSocial: rec.RAZON_SOCIAL,
                    direccion: rec.DIRECCION,
                    comuna: rec.COMUNA,
                    region: rec.REGION,
                    rubro: rec.RUBRO,
                    estado: rec.ESTADO,
                    fuenteDatos: "Importación Manual CSV",
                    fechaImportacion: new Date(),
                  },
                  create: {
                    retcId: rec.ID,
                    razonSocial: rec.RAZON_SOCIAL,
                    direccion: rec.DIRECCION,
                    comuna: rec.COMUNA,
                    region: rec.REGION,
                    rubro: rec.RUBRO,
                    estado: rec.ESTADO,
                    fuenteDatos: "Importación Manual CSV",
                  },
                });
              } catch {
                // Ignorar errores puntuales para no detener el proceso masivo
                errors++;
              }
            })
          );

          processed += batch.length;
          if (processed % 1000 === 0) {
            console.log(`⏳ Progreso: ${processed}/${records.length}`);
          }
        }

        console.log(`✅ Finalizado. Procesados: ${processed}, Errores: ${errors}`);
        resolve();
      })
      .on("error", reject);
  });
}

async function main() {
  console.log("🏭 Iniciando importación de datos RETC...");

  if (fs.existsSync(LOCAL_FILE_PATH)) {
    console.log(`📂 Archivo local encontrado: ${LOCAL_FILE_PATH}`);
    await processFile(LOCAL_FILE_PATH);
  } else if (RETC_DATASET_URL) {
    console.log(`⬇️ Descargando archivo desde: ${RETC_DATASET_URL}`);
    await downloadFile(RETC_DATASET_URL, LOCAL_FILE_PATH);
    await processFile(LOCAL_FILE_PATH);
  } else {
    console.error(
      "❌ No se encontró archivo local (data/retc-establecimientos.csv) ni URL configurada."
    );
    console.log(
      '💡 Por favor, coloca el archivo CSV descargado del RETC en la carpeta "data" con el nombre "retc-establecimientos.csv"'
    );
  }
}

main()
  .catch((e: ReturnType<typeof JSON.parse>) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
