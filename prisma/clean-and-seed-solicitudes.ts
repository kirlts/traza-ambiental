/* eslint-disable @typescript-eslint/no-require-imports */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanAndSeed() {
  console.log("🗑️ Eliminando solicitudes existentes...");

  // Eliminar todas las solicitudes
  const deleted = await prisma.solicitudRetiro.deleteMany({});
  console.log(`✅ Eliminadas ${deleted.count} solicitudes`);

  console.log("");
  console.log("📦 Creando nuevas solicitudes...");

  // Ejecutar el seed normal
  const { exec } = require("child_process");

  exec(
    "npx tsx prisma/006-20251030-solicitudes-retiro-seeder.ts",
    (error: ReturnType<typeof JSON.parse>, stdout: string, stderr: string) => {
      if (error) {
        console.error("Error ejecutando seeder:", error);
        return;
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
    }
  );
}

cleanAndSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
