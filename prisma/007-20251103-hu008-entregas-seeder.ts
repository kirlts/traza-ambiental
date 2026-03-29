import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed específico para HU-008: Confirmación de Entrega en Planta
 *
 * Prepara datos de prueba para el módulo "Gestiona las entregas pendientes de confirmación al gestor"
 *
 * Escenario de prueba:
 * - Solicitudes en estado RECOLECTADA listas para confirmar entrega
 * - Gestor con RUT válido
 * - Transportista con solicitudes asignadas
 */
export async function main() {
  console.log("🚛 Preparando datos de prueba para HU-008: Confirmación de Entrega en Planta\n");

  // Solo crear datos demo si se está inicializando la BD
  const shouldCreateDemo = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";
  if (!shouldCreateDemo) {
    console.log("ℹ️  Seed de datos demo omitido (INITIALIZE_DB_AND_SEED_DATA=false).");
    return;
  }

  try {
    // 1. Asegurar que el gestor tenga RUT válido
    console.log("📝 Actualizando datos del gestor...");
    await prisma.user.update({
      where: { email: "gestor@trazambiental.com" },
      data: {
        rut: "76.123.456-7", // RUT válido para pruebas
      },
    });
    console.log("✅ Gestor actualizado con RUT válido: 76.123.456-7");

    // 2. Obtener transportista
    const transportista = await prisma.user.findFirst({
      where: { email: "transportista@trazambiental.com" },
    });

    if (!transportista) {
      throw new Error("Transportista no encontrado");
    }

    // 3. Tomar 3 solicitudes ACEPTADA y convertirlas a RECOLECTADA
    console.log("\n📦 Convirtiendo solicitudes ACEPTADA a RECOLECTADA...");

    const solicitudesAceptadas = await prisma.solicitudRetiro.findMany({
      where: { estado: "ACEPTADA" },
      take: 3,
      include: {
        generador: true,
      },
    });

    if (solicitudesAceptadas.length === 0) {
      console.log("⚠️  No hay solicitudes ACEPTADA para convertir");
    } else {
      for (const solicitud of solicitudesAceptadas) {
        // Calcular pesos y cantidades recolectadas (simular recolección completa)
        const pesoReal = solicitud.pesoTotalEstimado * 0.95; // 95% del estimado
        const cantidadReal = solicitud.cantidadTotal; // Cantidad completa

        await prisma.solicitudRetiro.update({
          where: { id: solicitud.id },
          data: {
            estado: "RECOLECTADA",
            pesoReal: pesoReal,
            cantidadReal: cantidadReal,
            fechaRecoleccion: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        });

        console.log(`✅ ${solicitud.folio} - Recolectada con ${pesoReal}kg`);
      }
    }

    // 4. Verificar el resultado final
    console.log("\n🎯 Verificación final:");

    const recolectadas = await prisma.solicitudRetiro.findMany({
      where: { estado: "RECOLECTADA" },
      include: {
        transportista: { select: { name: true } },
        generador: { select: { name: true } },
      },
    });

    console.log(`📊 Solicitudes RECOLECTADA disponibles: ${recolectadas.length}`);

    if (recolectadas.length > 0) {
      console.log("\n📋 Detalles de entregas disponibles:");
      recolectadas.forEach((sol, index) => {
        console.log(`   ${index + 1}. ${sol.folio}`);
        console.log(`      📍 Generador: ${sol.generador?.name || "N/A"}`);
        console.log(`      🚛 Transportista: ${sol.transportista?.name || "No asignado"}`);
        console.log(`      📦 Peso: ${sol.pesoReal}kg | Cantidad: ${sol.cantidadReal} unidades`);
        console.log(
          `      📅 Recolectado: ${sol.fechaRecoleccion?.toLocaleString("es-CL") || "Fecha no disponible"}`
        );
        console.log("");
      });
    }

    // 5. Información para testing
    console.log("🎮 Información para testing HU-008:");
    console.log("   👤 Transportista: transportista@trazambiental.com");
    console.log("   🔑 Password: transportista123");
    console.log("   🏭 Gestor disponible: gestor@trazambiental.com (RUT: 76.123.456-7)");
    console.log("   📍 URL del módulo: /dashboard/transportista/entregas");

    console.log("\n✅ Seed HU-008 completado exitosamente!");
    console.log("🚀 El módulo de confirmación de entregas está listo para pruebas.");
  } catch (error: unknown) {
    console.error("❌ Error en seed HU-008:", error);
    throw error;
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en seed HU-008:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
