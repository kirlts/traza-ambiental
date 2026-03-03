import { PrismaClient, EstadoSolicitud } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed específico para HU-009: Recepción y Validación de Carga
 *
 * Prepara datos de prueba para probar la funcionalidad de validación de recepciones.
 *
 * Escenario de prueba:
 * - Solicitudes en estado ENTREGADA_GESTOR asignadas al gestor
 * - Datos de transportista ya registrados (peso, cantidad, etc.)
 * - Gestor con RUT válido
 */
export async function main() {
  console.log("🧪 Preparando datos de prueba para HU-009: Recepción y Validación\n");

  // Solo crear datos demo si se está inicializando la BD
  const shouldCreateDemo = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";
  if (!shouldCreateDemo) {
    console.log("ℹ️  Seed de datos demo omitido (INITIALIZE_DB_AND_SEED_DATA=false).");
    return;
  }

  try {
    // 1. Asegurar que el gestor tenga RUT válido
    console.log("📝 Verificando datos del gestor...");
    const gestor = await prisma.user.findFirst({
      where: { email: "gestor@trazambiental.com" },
    });

    if (!gestor) {
      throw new Error("Gestor no encontrado");
    }

    // Actualizar RUT si es necesario
    if (gestor.rut !== "76.123.456-7") {
      await prisma.user.update({
        where: { id: gestor.id },
        data: { rut: "76.123.456-7" },
      });
      console.log("✅ RUT del gestor actualizado: 76.123.456-7");
    }

    // 2. Obtener transportista
    const transportista = await prisma.user.findFirst({
      where: { email: "transportista@trazambiental.com" },
    });

    if (!transportista) {
      throw new Error("Transportista no encontrado");
    }

    // 3. Crear solicitudes de prueba en estado ENTREGADA_GESTOR
    console.log("\n📦 Creando solicitudes de prueba...");

    const solicitudesPrueba = [
      {
        folio: "SOL-20251103-0001",
        generadorId: gestor.id, // Usar gestor como generador para simplificar
        transportistaId: transportista.id,
        vehiculoId: null,
        estado: EstadoSolicitud.ENTREGADA_GESTOR,

        // Datos de retiro
        direccionRetiro: "Av. Industrial 123",
        region: "Metropolitana",
        comuna: "Santiago",
        fechaPreferida: new Date(),
        horarioPreferido: "manana",
        categoriaA_cantidad: 15,
        categoriaA_pesoEst: 150,
        categoriaB_cantidad: 0,
        categoriaB_pesoEst: 0,
        pesoTotalEstimado: 150,
        cantidadTotal: 15,
        nombreContacto: "Juan Pérez",
        telefonoContacto: "912345678",
        instrucciones: "Entregar en recepción principal",

        // Datos del transportista (simulando recolección completada)
        pesoReal: 148, // 98.7% del estimado
        cantidadReal: 15,
        fechaRecoleccion: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás

        // Datos de entrega al gestor
        fechaEntregaGestor: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        gestorId: gestor.id,
        fotos: [],
      },
      {
        folio: "SOL-20251103-0002",
        generadorId: gestor.id,
        transportistaId: transportista.id,
        vehiculoId: null,
        estado: EstadoSolicitud.ENTREGADA_GESTOR,

        // Datos de retiro
        direccionRetiro: "Calle Comercio 456",
        region: "Valparaíso",
        comuna: "Valparaíso",
        fechaPreferida: new Date(),
        horarioPreferido: "tarde",
        categoriaA_cantidad: 0,
        categoriaA_pesoEst: 0,
        categoriaB_cantidad: 8,
        categoriaB_pesoEst: 240,
        pesoTotalEstimado: 240,
        cantidadTotal: 8,
        nombreContacto: "Ana López",
        telefonoContacto: "998765432",
        instrucciones: "Coordinar con supervisor de turno",

        // Datos del transportista
        pesoReal: 250, // 104.2% del estimado (discrepancia significativa)
        cantidadReal: 8,
        fechaRecoleccion: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás

        // Datos de entrega al gestor
        fechaEntregaGestor: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        gestorId: gestor.id,
        fotos: [],
      },
      {
        folio: "SOL-20251103-0003",
        generadorId: gestor.id,
        transportistaId: transportista.id,
        vehiculoId: null,
        estado: EstadoSolicitud.ENTREGADA_GESTOR,

        // Datos de retiro
        direccionRetiro: "Ruta 68 Km 45",
        region: "Metropolitana",
        comuna: "Colina",
        fechaPreferida: new Date(),
        horarioPreferido: "manana",
        categoriaA_cantidad: 10,
        categoriaA_pesoEst: 100,
        categoriaB_cantidad: 5,
        categoriaB_pesoEst: 150,
        pesoTotalEstimado: 250,
        cantidadTotal: 15,
        nombreContacto: "Pedro Sánchez",
        telefonoContacto: "923456789",
        instrucciones: "Acceso por portón principal",

        // Datos del transportista
        pesoReal: 248, // 99.2% del estimado
        cantidadReal: 15,
        fechaRecoleccion: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 horas atrás

        // Datos de entrega al gestor
        fechaEntregaGestor: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
        gestorId: gestor.id,
        fotos: [],
      },
    ];

    // Crear las solicitudes
    for (const solicitudData of solicitudesPrueba) {
      // Verificar si ya existe
      const existente = await prisma.solicitudRetiro.findUnique({
        where: { folio: solicitudData.folio },
      });

      if (!existente) {
        await prisma.solicitudRetiro.create({
          data: solicitudData,
        });
        console.log(`✅ Creada solicitud ${solicitudData.folio}`);
      } else {
        // Actualizar si ya existe pero no está validada
        if (existente.estado === EstadoSolicitud.ENTREGADA_GESTOR && !existente.pesoReal) {
          await prisma.solicitudRetiro.update({
            where: { id: existente.id },
            data: {
              ...solicitudData,
              id: existente.id,
              folio: existente.folio,
              createdAt: existente.createdAt,
              updatedAt: new Date(),
            },
          });
          console.log(`🔄 Actualizada solicitud ${solicitudData.folio}`);
        } else {
          console.log(`⏭️  Saltando ${solicitudData.folio} (ya procesada)`);
        }
      }
    }

    // 4. Verificar el resultado final
    console.log("\n🎯 Verificación final:");

    const recepcionesPendientes = await prisma.solicitudRetiro.findMany({
      where: {
        estado: EstadoSolicitud.ENTREGADA_GESTOR,
        gestorId: gestor.id,
      },
      include: {
        generador: { select: { name: true } },
        transportista: { select: { name: true } },
      },
    });

    console.log(`📊 Recepciones pendientes para HU-009: ${recepcionesPendientes.length}`);

    if (recepcionesPendientes.length > 0) {
      console.log("\n📋 Solicitudes listas para validar:");
      recepcionesPendientes.forEach((sol, index) => {
        console.log(`   ${index + 1}. ${sol.folio}`);
        console.log(`      📍 ${sol.direccionRetiro}, ${sol.comuna}`);
        console.log(`      🚛 ${sol.transportista?.name}`);
        console.log(`      📦 ${sol.pesoReal}kg | ${sol.cantidadReal} unidades`);
        console.log("");
      });
    }

    // 5. Información para testing
    console.log("🎮 Información para testing HU-009:");
    console.log("   👤 Gestor: gestor@trazambiental.com");
    console.log("   🔑 Password: gestor123");
    console.log("   🏭 RUT del gestor: 76.123.456-7");
    console.log("   📍 URL del módulo: /dashboard/gestor/recepciones");
    console.log("");
    console.log("💡 Escenarios de prueba disponibles:");
    console.log("   1. SOL-20251103-0001: Validación normal (ligera discrepancia)");
    console.log("   2. SOL-20251103-0002: Discrepancia significativa (+4.2% en peso)");
    console.log("   3. SOL-20251103-0003: Validación mixta (A + B categorías)");

    console.log("\n✅ Seed HU-009 completado exitosamente!");
    console.log("🚀 El módulo de recepción y validación está listo para pruebas.");
  } catch (error: unknown) {
    console.error("❌ Error en seed HU-009:", error);
    throw error;
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en seed HU-009:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
