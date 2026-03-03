/* eslint-disable */
import { PrismaClient, EstadoAutorizacion, TratamientoTipo } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando migración de autorizaciones sanitarias...");

  // 1. Obtener perfiles verificados que tienen número de resolución
  const verifiedProfiles = await prisma.managerLegalProfile.findMany({
    where: {
      status: "VERIFICADO",
      isResolutionVerified: true,
      resolutionNumber: { not: null },
    },
    include: {
      manager: true,
    },
  });

  console.log(`📋 Encontrados ${verifiedProfiles.length} perfiles verificados para migrar.`);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const profile of verifiedProfiles) {
    if (!profile.resolutionNumber) continue;

    try {
      // Verificar si ya existe
      const existingAuth = await prisma.autorizacionSanitaria.findUnique({
        where: { numeroResolucion: profile.resolutionNumber },
      });

      if (existingAuth) {
        console.log(
          `⚠️  Resolución ${profile.resolutionNumber} ya existe para gestor ${profile.manager.email}. Saltando.`
        );
        skippedCount++;
        continue;
      }

      // Crear autorización por defecto
      // Asumimos todos los tratamientos para no romper operación
      const tratamientos = Object.values(TratamientoTipo);

      // Fechas estimadas
      const fechaEmision = profile.updatedAt; // Fecha de verificación aproximada
      const fechaVencimiento = new Date(profile.updatedAt);
      fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 5); // 5 años vigencia default

      await prisma.autorizacionSanitaria.create({
        data: {
          gestorId: profile.managerId,
          numeroResolucion: profile.resolutionNumber,
          autoridadEmisora: "SEREMI (Migrado)",
          fechaEmision: fechaEmision,
          fechaVencimiento: fechaVencimiento,
          tratamientosAutorizados: tratamientos,
          capacidadAnualTn: profile.authorizedCapacity || 10000, // Default 10k si no existe
          categoriasResiduos: ["NEUMATICOS", "ENVASES"], // Defaults genéricos
          estado: EstadoAutorizacion.VIGENTE,
          observaciones: "Migración automática de perfil legal anterior",
          registradoPor: "MIGRATION_SCRIPT",
        },
      });

      console.log(`✅ Migrado: ${profile.manager.email} - Res: ${profile.resolutionNumber}`);
      migratedCount++;
    } catch (error) {
      console.error(`❌ Error migrando ${profile.manager.email}:`, error);
      errorCount++;
    }
  }

  console.log("--- Resumen ---");
  console.log(`Total: ${verifiedProfiles.length}`);
  console.log(`Migrados: ${migratedCount}`);
  console.log(`Saltados: ${skippedCount}`);
  console.log(`Errores: ${errorCount}`);
}

main()
  .catch((e: ReturnType<typeof JSON.parse>) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
