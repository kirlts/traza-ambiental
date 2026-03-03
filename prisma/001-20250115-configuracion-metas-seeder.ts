import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed para configuración inicial de metas REP
 * Según normativa actual de la Ley REP 20.920 y D.S. N°8
 */
async function seed() {
  console.log("📊 Configurando porcentajes de metas REP...");

  // Porcentajes progresivos según normativa REP
  // Estos valores son referenciales y deben ajustarse según normativa vigente
  const porcentajesMetasREP = {
    "2024": {
      recoleccion: 20,
      valorizacion: 75,
    },
    "2025": {
      recoleccion: 25,
      valorizacion: 80,
    },
    "2026": {
      recoleccion: 30,
      valorizacion: 85,
    },
    "2027": {
      recoleccion: 35,
      valorizacion: 90,
    },
    "2028": {
      recoleccion: 40,
      valorizacion: 90,
    },
    "2029": {
      recoleccion: 45,
      valorizacion: 95,
    },
    "2030": {
      recoleccion: 50,
      valorizacion: 95,
    },
  };

  try {
    const config = await prisma.configuracionMetasREP.upsert({
      where: { id: "config-metas-rep" },
      update: {
        porcentajes: JSON.stringify(porcentajesMetasREP),
        ultimaActualizacion: new Date(),
        actualizadoPor: "sistema",
      },
      create: {
        id: "config-metas-rep",
        porcentajes: JSON.stringify(porcentajesMetasREP),
        ultimaActualizacion: new Date(),
        actualizadoPor: "sistema",
      },
    });

    console.log("✅ Configuración de metas REP creada exitosamente");
    console.log("");
    console.log("📋 Porcentajes configurados:");
    Object.entries(porcentajesMetasREP).forEach(([anio, valores]) => {
      console.log(
        `   ${anio}: Recolección ${valores.recoleccion}% | Valorización ${valores.valorizacion}%`
      );
    });
    console.log("");

    return config;
  } catch (error: unknown) {
    console.error("❌ Error al crear configuración de metas:", error);
    throw error;
  }
}

// Exportar función principal
export { seed as main };
export default seed;

// Ejecutar si se llama directamente
if (require.main === module) {
  seed()
    .catch((e: ReturnType<typeof JSON.parse>) => {
      console.error("❌ Error en el seed de configuración:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
