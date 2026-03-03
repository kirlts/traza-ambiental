import { PrismaClient, EstadoSolicitud, MotivoRechazo } from "@prisma/client";
import { startOfMonth, subDays, addDays } from "date-fns";

const prisma = new PrismaClient();

export async function main() {
  console.log("🚛 Iniciando seed para Dashboard de Transportista...");

  // Solo crear datos demo si se está inicializando la BD
  const shouldCreateDemo = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";
  if (!shouldCreateDemo) {
    console.log("ℹ️  Seed de datos demo omitido (INITIALIZE_DB_AND_SEED_DATA=false).");
    return;
  }

  // 1. Encontrar usuarios necesarios
  const transportista = await prisma.user.findUnique({
    where: { email: "transportista@trazambiental.com" },
  });

  const generador = await prisma.user.findUnique({
    where: { email: "generador@trazambiental.com" },
  });

  const gestor = await prisma.user.findUnique({
    where: { email: "gestor@trazambiental.com" },
  });

  if (!transportista || !generador || !gestor) {
    console.error(
      "❌ No se encontraron los usuarios necesarios (transportista, generador, gestor)"
    );
    console.error("   Por favor corre primero el seed de usuarios: npx prisma db seed");
    return;
  }

  console.log(`✅ Usuario Transportista: ${transportista.email}`);

  // 2. Limpiar datos existentes de este transportista (opcional, para evitar duplicados masivos en pruebas repetidas)
  // await prisma.solicitudRetiro.deleteMany({ where: { transportistaId: transportista.id } })
  // await prisma.vehiculo.deleteMany({ where: { transportistaId: transportista.id } })

  // 3. Crear Vehículos
  const vehiculosData = [
    { patente: "DASH-01", tipo: "Camión 3/4", capacidadKg: 5000 },
    { patente: "DASH-02", tipo: "Tolva", capacidadKg: 12000 },
    { patente: "DASH-03", tipo: "Furgón", capacidadKg: 2500 },
  ];

  const vehiculos = [];
  for (const v of vehiculosData) {
    const vehiculo = await prisma.vehiculo.upsert({
      where: { patente: v.patente },
      update: {},
      create: {
        transportistaId: transportista.id,
        patente: v.patente,
        tipo: v.tipo,
        capacidadKg: v.capacidadKg,
        estado: "activo",
      },
    });
    vehiculos.push(vehiculo);
  }
  console.log(`✅ ${vehiculos.length} Vehículos asegurados`);

  // 4. Crear Solicitudes de Retiro en diferentes estados
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);

  const solicitudesData = [
    // --- ACTIVAS (ACEPTADA, RECOLECTADA) ---
    {
      folio: "SOL-ACT-001",
      estado: EstadoSolicitud.ACEPTADA,
      pesoEstimado: 1000,
      vehiculoIndex: 0,
      fecha: subDays(now, 2), // Hace 2 días
    },
    {
      folio: "SOL-ACT-002",
      estado: EstadoSolicitud.RECOLECTADA,
      pesoEstimado: 2000,
      pesoReal: 1950,
      vehiculoIndex: 1,
      fecha: subDays(now, 1), // Ayer
    },

    // --- EN RUTA (EN_CAMINO) ---
    {
      folio: "SOL-RUTA-001",
      estado: EstadoSolicitud.EN_CAMINO,
      pesoEstimado: 1500,
      vehiculoIndex: 0,
      fecha: now, // Hoy
    },
    {
      folio: "SOL-RUTA-002",
      estado: EstadoSolicitud.EN_CAMINO,
      pesoEstimado: 3000,
      vehiculoIndex: 1,
      fecha: now, // Hoy
    },

    // --- COMPLETADAS (ENTREGADA_GESTOR) ESTE MES ---
    {
      folio: "SOL-COMP-001",
      estado: EstadoSolicitud.ENTREGADA_GESTOR,
      pesoEstimado: 1000,
      pesoReal: 1000,
      vehiculoIndex: 2,
      fecha: startOfCurrentMonth, // Principio de mes
      fechaEntrega: addDays(startOfCurrentMonth, 1),
    },
    {
      folio: "SOL-COMP-002",
      estado: EstadoSolicitud.ENTREGADA_GESTOR,
      pesoEstimado: 500,
      pesoReal: 520,
      vehiculoIndex: 2,
      fecha: addDays(startOfCurrentMonth, 2),
      fechaEntrega: addDays(startOfCurrentMonth, 3),
    },

    // --- RECHAZADAS ESTE MES (Para eficiencia) ---
    {
      folio: "SOL-RECH-001",
      estado: EstadoSolicitud.RECHAZADA,
      pesoEstimado: 800,
      vehiculoIndex: null,
      fecha: subDays(now, 5),
      fechaRechazo: subDays(now, 5),
    },
  ];

  console.log("🔄 Creando solicitudes...");

  for (const s of solicitudesData) {
    const vehiculoId =
      s.vehiculoIndex !== null && s.vehiculoIndex !== undefined
        ? vehiculos[s.vehiculoIndex].id
        : null;

    // Verificar si ya existe para no duplicar por folio
    const existing = await prisma.solicitudRetiro.findUnique({
      where: { folio: s.folio },
    });

    if (!existing) {
      await prisma.solicitudRetiro.create({
        data: {
          folio: s.folio,
          generadorId: generador.id,
          transportistaId: transportista.id,
          gestorId: s.estado === EstadoSolicitud.ENTREGADA_GESTOR ? gestor.id : undefined,
          vehiculoId: vehiculoId,
          direccionRetiro: "Calle de Prueba 123",
          region: "RM",
          comuna: "Santiago",
          fechaPreferida: addDays(now, 5),
          horarioPreferido: "Mañana",
          pesoTotalEstimado: s.pesoEstimado,
          pesoReal: s.pesoReal,
          cantidadTotal: 10, // Dummy
          nombreContacto: "Juan Contacto",
          telefonoContacto: "+56912345678",
          estado: s.estado,
          fechaAceptacion: s.fecha,
          fechaRecoleccion: s.estado === EstadoSolicitud.RECOLECTADA ? s.fecha : undefined,
          fechaEntregaGestor: s.fechaEntrega,
          fechaRechazo: s.fechaRechazo,
          motivoRechazo:
            s.estado === EstadoSolicitud.RECHAZADA
              ? MotivoRechazo.HORARIO_NO_DISPONIBLE
              : undefined,
        },
      });
      console.log(`   ✅ Creada: ${s.folio} [${s.estado}]`);
    } else {
      // Actualizar estado y fechas si ya existe para asegurar que aparezca en el dashboard
      await prisma.solicitudRetiro.update({
        where: { id: existing.id },
        data: {
          transportistaId: transportista.id, // Asegurar asignación
          estado: s.estado,
          vehiculoId: vehiculoId,
          fechaAceptacion: s.fecha,
          fechaEntregaGestor: s.fechaEntrega,
          fechaRechazo: s.fechaRechazo,
        },
      });
      console.log(`   Updated: ${s.folio} [${s.estado}]`);
    }
  }

  console.log("✨ Seed Dashboard Transportista completado exitosamente");
}

// Exportar función principal
// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en el seed de transportista:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
