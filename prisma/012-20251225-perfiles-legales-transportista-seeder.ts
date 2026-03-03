import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed de perfiles legales para transportistas
 * Crea perfiles legales verificados para todos los transportistas existentes
 */
async function seed() {
  console.log("🚛 Creando perfiles legales para transportistas...");

  // 1. Buscar todos los usuarios con rol de Transportista
  const transportistas = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: "Transportista",
          },
        },
      },
    },
    include: {
      perfilLegal: true,
    },
  });

  if (transportistas.length === 0) {
    console.log("⚠️  No se encontraron transportistas en el sistema");
    return;
  }

  console.log(`📋 Encontrados ${transportistas.length} transportista(s)`);

  let creados = 0;
  let actualizados = 0;
  let omitidos = 0;

  for (const transportista of transportistas) {
    if (transportista.perfilLegal) {
      // Si ya tiene perfil legal, verificar que esté verificado
      if (transportista.perfilLegal.status === "VERIFICADO") {
        console.log(`✅ ${transportista.name || transportista.email} - Ya tiene perfil verificado`);
        omitidos++;
      } else {
        // Actualizar a VERIFICADO
        await prisma.carrierLegalProfile.update({
          where: { carrierId: transportista.id },
          data: {
            status: "VERIFICADO",
            verifiedAt: new Date(),
            isRetcVerified: true,
            isResolutionVerified: true,
            isSinaderVerified: true,
          },
        });
        console.log(
          `🔄 ${transportista.name || transportista.email} - Perfil actualizado a VERIFICADO`
        );
        actualizados++;
      }
    } else {
      // Crear perfil legal verificado
      await prisma.carrierLegalProfile.create({
        data: {
          carrierId: transportista.id,
          status: "VERIFICADO",
          retcId: `RETC-TEST-${transportista.id.slice(-6)}`,
          sanitaryResolution: `RES-SANITARIA-${transportista.id.slice(-6)}`,
          resolutionDate: new Date(),
          baseOperations: "Metropolitana",
          retcFileUrl: "/uploads/dummy/retc-test.pdf",
          resolutionFileUrl: "/uploads/dummy/resolucion-test.pdf",
          sinaderFileUrl: "/uploads/dummy/sinader-test.pdf",
          isRetcVerified: true,
          isResolutionVerified: true,
          isSinaderVerified: true,
          verifiedAt: new Date(),
        },
      });
      console.log(
        `✨ ${transportista.name || transportista.email} - Perfil legal creado y VERIFICADO`
      );
      creados++;
    }
  }

  // Resumen
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("📊 RESUMEN DE PERFILES LEGALES");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`✅ Perfiles creados:     ${creados}`);
  console.log(`🔄 Perfiles actualizados: ${actualizados}`);
  console.log(`⏭️  Perfiles omitidos:    ${omitidos}`);
  console.log(`📦 Total procesados:      ${transportistas.length}`);
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("✅ Perfiles legales de transportistas completados");
  console.log("   Los transportistas ahora pueden aceptar solicitudes");
  console.log("═══════════════════════════════════════════════════════════════\n");
}

// Exportar función principal
export { seed as main };
export default seed;

// Ejecutar si se llama directamente
if (require.main === module) {
  seed()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en el seed de perfiles legales:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
