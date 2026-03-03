import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Seed específico para Sistema de Gestión REP
 * Crea usuarios, roles y metas de ejemplo
 */
async function seed() {
  // Solo crear datos demo si se está inicializando la BD
  const shouldCreateDemo = process.env.INITIALIZE_DB_AND_SEED_DATA === "true";

  if (!shouldCreateDemo) {
    console.log("ℹ️  Seed de datos demo omitido (INITIALIZE_DB_AND_SEED_DATA=false).");
    return;
  }

  console.log("🏢 Configurando sistema de gestión con datos demo...");

  // 1. Crear o verificar rol Sistema de Gestión
  const rolSistemaGestion = await prisma.role.upsert({
    where: { name: "Sistema de Gestión" },
    update: {},
    create: {
      name: "Sistema de Gestión",
      description:
        "Responsable de cumplir metas de recolección y valorización de NFU en nombre de productores",
      active: true,
    },
  });
  console.log("✅ Rol Sistema de Gestión creado/verificado");

  // 2. Crear usuario de prueba Sistema de Gestión
  const passwordHash = await bcrypt.hash("sistema123", 10);

  const sistemaGestion = await prisma.user.upsert({
    where: { email: "sistema@trazambiental.com" },
    update: {},
    create: {
      email: "sistema@trazambiental.com",
      name: "Sistema Gestión Neumáticos S.A.",
      password: passwordHash,
      active: true,
    },
  });
  console.log("✅ Usuario Sistema de Gestión creado");

  // 3. Asignar rol al usuario
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: sistemaGestion.id,
        roleId: rolSistemaGestion.id,
      },
    },
    update: {},
    create: {
      userId: sistemaGestion.id,
      roleId: rolSistemaGestion.id,
    },
  });
  console.log("✅ Rol asignado al usuario");

  // 4. Crear metas de ejemplo para 2024 (ya cumplidas)
  await prisma.meta.upsert({
    where: {
      id: "meta-sg-2024-recoleccion",
    },
    update: {},
    create: {
      id: "meta-sg-2024-recoleccion",
      sistemaGestionId: sistemaGestion.id,
      anio: 2024,
      tipo: "recoleccion",
      metaToneladas: 800.0,
      avanceToneladas: 812.5,
      porcentajeAvance: 101.56,
      origen: "manual",
      cumplida: true,
      fechaCumplimiento: new Date("2024-12-15"),
      estado: "cumplida",
    },
  });

  await prisma.meta.upsert({
    where: {
      id: "meta-sg-2024-valorizacion",
    },
    update: {},
    create: {
      id: "meta-sg-2024-valorizacion",
      sistemaGestionId: sistemaGestion.id,
      anio: 2024,
      tipo: "valorizacion",
      metaToneladas: 640.0,
      avanceToneladas: 658.3,
      porcentajeAvance: 102.86,
      origen: "manual",
      cumplida: true,
      fechaCumplimiento: new Date("2024-12-20"),
      estado: "cumplida",
    },
  });
  console.log("✅ Metas 2024 creadas (cumplidas)");

  // 5. Crear metas de ejemplo para 2025 (en progreso)
  const meta2025Recoleccion = await prisma.meta.upsert({
    where: {
      id: "meta-sg-2025-recoleccion",
    },
    update: {},
    create: {
      id: "meta-sg-2025-recoleccion",
      sistemaGestionId: sistemaGestion.id,
      anio: 2025,
      tipo: "recoleccion",
      metaToneladas: 1000.0,
      avanceToneladas: 450.5,
      porcentajeAvance: 45.05,
      origen: "manual",
      cumplida: false,
      estado: "activa",
    },
  });

  await prisma.meta.upsert({
    where: {
      id: "meta-sg-2025-valorizacion",
    },
    update: {},
    create: {
      id: "meta-sg-2025-valorizacion",
      sistemaGestionId: sistemaGestion.id,
      anio: 2025,
      tipo: "valorizacion",
      metaToneladas: 800.0,
      avanceToneladas: 380.2,
      porcentajeAvance: 47.53,
      origen: "manual",
      cumplida: false,
      estado: "activa",
    },
  });
  console.log("✅ Metas 2025 creadas (en progreso)");

  // 6. Crear desgloses opcionales para meta 2025 recolección
  await prisma.desgloseMeta.createMany({
    data: [
      {
        metaId: meta2025Recoleccion.id,
        criterio: "categoria",
        valor: "A",
        metaToneladas: 600.0,
        avanceToneladas: 280.3,
        porcentajeAvance: 46.72,
      },
      {
        metaId: meta2025Recoleccion.id,
        criterio: "categoria",
        valor: "B",
        metaToneladas: 400.0,
        avanceToneladas: 170.2,
        porcentajeAvance: 42.55,
      },
    ],
  });
  console.log("✅ Desgloses de metas creados");

  // 7. Crear auditoría de ejemplo
  await prisma.auditoriaConfiguracion.create({
    data: {
      usuarioId: sistemaGestion.id,
      accion: "crear_meta",
      entidad: "Meta",
      entidadId: meta2025Recoleccion.id,
      valorAnterior: null,
      valorNuevo: JSON.stringify({
        anio: 2025,
        tipo: "recoleccion",
        metaToneladas: 1000.0,
      }),
      justificacion: "Creación inicial de metas para año 2025",
    },
  });
  console.log("✅ Auditoría de ejemplo creada");

  console.log("✨ Seed de Sistema de Gestión completado exitosamente");
  console.log("\n📧 Usuario demo creado para entorno no productivo.");
}

// Exportar función principal
export { seed as main };
export default seed;

// Ejecutar si se llama directamente
if (require.main === module) {
  seed()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en seed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
