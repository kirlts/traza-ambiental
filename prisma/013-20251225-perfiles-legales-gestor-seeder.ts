import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed de perfiles legales para gestores
 * Crea perfiles legales verificados para todos los gestores existentes
 */
async function seed() {
  console.log("🏭 Creando perfiles legales para gestores...");

  // 1. Buscar todos los usuarios con rol de Gestor
  const gestores = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: "Gestor",
          },
        },
      },
    },
    include: {
      perfilLegalGestor: true,
    },
  });

  if (gestores.length === 0) {
    console.log("⚠️  No se encontraron gestores en el sistema");
    return;
  }

  console.log(`📋 Encontrados ${gestores.length} gestor(es)`);

  let creados = 0;
  let actualizados = 0;
  let omitidos = 0;

  for (const gestor of gestores) {
    if (gestor.perfilLegalGestor) {
      // Si ya tiene perfil legal, verificar que esté verificado
      if (gestor.perfilLegalGestor.status === "VERIFICADO") {
        console.log(`✅ ${gestor.name || gestor.email} - Ya tiene perfil verificado`);
        omitidos++;
      } else {
        // Actualizar a VERIFICADO
        await prisma.managerLegalProfile.update({
          where: { managerId: gestor.id },
          data: {
            status: "VERIFICADO",
            verifiedAt: new Date(),
            isRetcVerified: true,
            isResolutionVerified: true,
            hasRepModule: true,
          },
        });
        console.log(`🔄 ${gestor.name || gestor.email} - Perfil actualizado a VERIFICADO`);
        actualizados++;
      }
    } else {
      // Crear perfil legal verificado para gestor
      await prisma.managerLegalProfile.create({
        data: {
          managerId: gestor.id,
          status: "VERIFICADO",
          // Nivel 1: Identidad
          retcId: `RETC-GESTOR-${gestor.id.slice(-6)}`,
          retcFileUrl: "/uploads/dummy/retc-gestor-test.pdf",
          isRetcVerified: true,
          // Nivel 2: Operativa
          resolutionNumber: `RES-GESTOR-${gestor.id.slice(-6)}`,
          resolutionFileUrl: "/uploads/dummy/resolucion-gestor-test.pdf",
          authorizedCapacity: 10000, // 10,000 toneladas/año
          isResolutionVerified: true,
          // Nivel 3: Ecosistema
          hasRepModule: true,
          gransicPartner: "GRANSIC Test Partner",
          verifiedAt: new Date(),
        },
      });
      console.log(`✨ ${gestor.name || gestor.email} - Perfil legal creado y VERIFICADO`);
      creados++;
    }
  }

  // Resumen
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("📊 RESUMEN DE PERFILES LEGALES GESTORES");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`✅ Perfiles creados:     ${creados}`);
  console.log(`🔄 Perfiles actualizados: ${actualizados}`);
  console.log(`⏭️  Perfiles omitidos:    ${omitidos}`);
  console.log(`📦 Total procesados:      ${gestores.length}`);
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("✅ Perfiles legales de gestores completados");
  console.log("   Los gestores ahora pueden recibir y procesar residuos");
  console.log("═══════════════════════════════════════════════════════════════\n");
}

// Exportar función principal
export { seed as main };
export default seed;

// Ejecutar si se llama directamente
if (require.main === module) {
  seed()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en el seed de perfiles legales de gestores:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
