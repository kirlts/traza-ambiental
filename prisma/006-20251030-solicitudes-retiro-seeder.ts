import { PrismaClient, EstadoSolicitud } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  console.log("📦 Creando solicitudes de retiro de prueba...");

  // Obtener generadores y regiones
  const generador = await prisma.user.findFirst({
    where: { email: "generador@trazambiental.com" },
    include: { roles: { include: { role: true } } },
  });

  // Obtener múltiples regiones
  const regiones = await prisma.region.findMany({
    where: {
      codigo: {
        in: ["CL-RM", "CL-VS", "CL-BI", "CL-AR"], // Metropolitana, Valparaíso, Biobío, Araucanía
      },
    },
  });

  // Obtener comunas de cada región
  const comunasPorRegion: Record<string, import("@prisma/client").Comuna[]> = {};
  for (const region of regiones) {
    const comunas = await prisma.comuna.findMany({
      where: { regionId: region.id },
      take: 2,
    });
    comunasPorRegion[region.codigo] = comunas;
  }

  if (!generador || regiones.length === 0) {
    console.log("⚠️ No se encontró generador o regiones, saltando seed de solicitudes");
    return;
  }

  // Función para generar folio
  const generarFolio = (index: number) => {
    const date = new Date();
    const fecha = date.toISOString().slice(0, 10).replace(/-/g, "");
    return `SOL-${fecha}-${String(index).padStart(4, "0")}`;
  };

  // Solicitudes de ejemplo distribuidas en múltiples regiones
  const solicitudesData = [
    // Región Metropolitana (CL-RM)
    {
      folio: generarFolio(1),
      regionCodigo: "CL-RM",
      regionNombre: "Región Metropolitana de Santiago",
      direccionRetiro: "Av. Providencia 1234",
      comuna: comunasPorRegion["CL-RM"]?.[0]?.nombre || "Santiago",
      fechaPreferida: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      horarioPreferido: "manana",
      categoriaA_cantidad: 50,
      categoriaA_pesoEst: 500,
      categoriaB_cantidad: 30,
      categoriaB_pesoEst: 450,
      nombreContacto: "Juan Pérez",
      telefonoContacto: "+56912345678",
      instrucciones: "Llamar antes de llegar. Portero en recepción.",
    },
    {
      folio: generarFolio(2),
      regionCodigo: "CL-RM",
      regionNombre: "Región Metropolitana de Santiago",
      direccionRetiro: "Av. Las Condes 5678",
      comuna: comunasPorRegion["CL-RM"]?.[1]?.nombre || "Las Condes",
      fechaPreferida: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      horarioPreferido: "tarde",
      categoriaA_cantidad: 100,
      categoriaA_pesoEst: 1200,
      categoriaB_cantidad: 50,
      categoriaB_pesoEst: 750,
      nombreContacto: "María González",
      telefonoContacto: "+56987654321",
      instrucciones: "Pedestal a la derecha de la entrada principal.",
    },
    // Región de Valparaíso (CL-VS)
    {
      folio: generarFolio(3),
      regionCodigo: "CL-VS",
      regionNombre: "Región de Valparaíso",
      direccionRetiro: "Av. Altamirano 2345",
      comuna: comunasPorRegion["CL-VS"]?.[0]?.nombre || "Valparaíso",
      fechaPreferida: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      horarioPreferido: "manana",
      categoriaA_cantidad: 75,
      categoriaA_pesoEst: 900,
      categoriaB_cantidad: 40,
      categoriaB_pesoEst: 600,
      nombreContacto: "Patricio Moreno",
      telefonoContacto: "+56944556677",
      instrucciones: "Ubicado cerca del puerto. Acceso fácil.",
    },
    {
      folio: generarFolio(4),
      regionCodigo: "CL-VS",
      regionNombre: "Región de Valparaíso",
      direccionRetiro: "Calle Viña del Mar 890",
      comuna: comunasPorRegion["CL-VS"]?.[1]?.nombre || "Viña del Mar",
      fechaPreferida: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      horarioPreferido: "tarde",
      categoriaA_cantidad: 40,
      categoriaA_pesoEst: 500,
      categoriaB_cantidad: 20,
      categoriaB_pesoEst: 350,
      nombreContacto: "Carolina Fernández",
      telefonoContacto: "+56933221100",
      instrucciones: "Edificio residencial. Contactar conserjería.",
    },
    // Región del Biobío (CL-BI)
    {
      folio: generarFolio(5),
      regionCodigo: "CL-BI",
      regionNombre: "Región del Biobío",
      direccionRetiro: "Av. Los Héroes 1234",
      comuna: comunasPorRegion["CL-BI"]?.[0]?.nombre || "Concepción",
      fechaPreferida: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      horarioPreferido: "manana",
      categoriaA_cantidad: 150,
      categoriaA_pesoEst: 1800,
      categoriaB_cantidad: 75,
      categoriaB_pesoEst: 1100,
      nombreContacto: "Alejandro Díaz",
      telefonoContacto: "+56922334455",
      instrucciones: "Gran superficie. Hablar con gerente.",
    },
    // Región de La Araucanía (CL-AR)
    {
      folio: generarFolio(6),
      regionCodigo: "CL-AR",
      regionNombre: "Región de La Araucanía",
      direccionRetiro: "Av. Alemania 5678",
      comuna: comunasPorRegion["CL-AR"]?.[0]?.nombre || "Temuco",
      fechaPreferida: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      horarioPreferido: "manana",
      categoriaA_cantidad: 60,
      categoriaA_pesoEst: 700,
      categoriaB_cantidad: 35,
      categoriaB_pesoEst: 550,
      nombreContacto: "Soledad Muñoz",
      telefonoContacto: "+56911772233",
      instrucciones: "Zona industrial. Coordinar con supervisión.",
    },
  ];

  let solicitudesCreadas = 0;

  for (const solicitudData of solicitudesData) {
    const cantidadTotal = solicitudData.categoriaA_cantidad + solicitudData.categoriaB_cantidad;
    const pesoTotalEstimado = solicitudData.categoriaA_pesoEst + solicitudData.categoriaB_pesoEst;

    try {
      const solicitud = await prisma.solicitudRetiro.create({
        data: {
          folio: solicitudData.folio,
          generadorId: generador.id,
          direccionRetiro: solicitudData.direccionRetiro,
          region: solicitudData.regionNombre,
          comuna: solicitudData.comuna,
          fechaPreferida: solicitudData.fechaPreferida,
          horarioPreferido: solicitudData.horarioPreferido,
          categoriaA_cantidad: solicitudData.categoriaA_cantidad,
          categoriaA_pesoEst: solicitudData.categoriaA_pesoEst,
          categoriaB_cantidad: solicitudData.categoriaB_cantidad,
          categoriaB_pesoEst: solicitudData.categoriaB_pesoEst,
          cantidadTotal,
          pesoTotalEstimado,
          nombreContacto: solicitudData.nombreContacto,
          telefonoContacto: solicitudData.telefonoContacto,
          instrucciones: solicitudData.instrucciones,
          fotos: [],
          estado: EstadoSolicitud.PENDIENTE,
          esBorrador: false,
        },
      });

      // Crear cambio de estado inicial
      await prisma.cambioEstado.create({
        data: {
          solicitudId: solicitud.id,
          estadoAnterior: null,
          estadoNuevo: EstadoSolicitud.PENDIENTE,
          realizadoPor: generador.id,
          notas: "Solicitud creada para pruebas",
        },
      });

      solicitudesCreadas++;
      console.log(`✅ Solicitud creada: ${solicitud.folio}`);
    } catch (error: unknown) {
      if ((error as ReturnType<typeof JSON.parse>).code === "P2002") {
        console.log(`⚠️ Solicitud ${solicitudData.folio} ya existe, omitiendo`);
      } else {
        console.error(`❌ Error creando solicitud ${solicitudData.folio}:`, error);
      }
    }
  }

  console.log(`✅ Se crearon ${solicitudesCreadas} solicitudes de retiro`);

  if (solicitudesCreadas > 0) {
    console.log("");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("📋 SOLICITUDES DE RETIRO DE PRUEBA CREADAS");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("");
    console.log("Las solicitudes están en estado PENDIENTE y disponibles");
    console.log("para que los transportistas las acepten.");
    console.log("");
    console.log("Generador: generador@trazambiental.com");
    console.log("Regiones: Metropolitana, Valparaíso, Biobío, Araucanía");
    console.log("═══════════════════════════════════════════════════════════════");
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en el seed de solicitudes:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
