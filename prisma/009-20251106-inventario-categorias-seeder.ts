import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeder para categorías de productos de inventario
 * Crea categorías básicas para neumáticos fuera de uso (NFU)
 */
export async function main() {
  console.log("📦 Creando categorías de productos de inventario...\n");

  const categorias = [
    {
      nombre: "Neumático de Pasajero",
      descripcion: "Neumáticos usados de vehículos de pasajeros (turismos, sedanes, SUVs)",
      activa: true,
    },
    {
      nombre: "Neumático de Camión",
      descripcion: "Neumáticos usados de vehículos de carga pesada y camiones",
      activa: true,
    },
    {
      nombre: "Neumático de Moto",
      descripcion: "Neumáticos usados de motocicletas y scooters",
      activa: true,
    },
    {
      nombre: "Neumático de Bicicleta",
      descripcion: "Neumáticos usados de bicicletas",
      activa: true,
    },
    {
      nombre: "Neumático Industrial",
      descripcion: "Neumáticos usados de maquinaria industrial y agrícola",
      activa: true,
    },
    {
      nombre: "Neumático Recauchado",
      descripcion: "Neumáticos que han sido recauchados y están fuera de uso",
      activa: true,
    },
  ];

  let creadas = 0;
  let existentes = 0;

  for (const categoriaData of categorias) {
    try {
      // IMPORTANTE: Verificar existencia ANTES del upsert para determinar correctamente
      // si el registro fue creado o actualizado. NO usar comparación de timestamps
      // (createdAt === updatedAt) porque es poco confiable debido a:
      // - Precisión de timestamps de la base de datos
      // - Timing de transacciones
      // - Ejecución de queries
      const categoriaExistente = await prisma.categoriaProducto.findUnique({
        where: { nombre: categoriaData.nombre },
      });

      const categoria = await prisma.categoriaProducto.upsert({
        where: { nombre: categoriaData.nombre },
        update: {
          descripcion: categoriaData.descripcion,
          activa: categoriaData.activa,
        },
        create: categoriaData,
      });

      // Usar la verificación previa (no timestamps) para determinar si fue creada o actualizada
      if (!categoriaExistente) {
        console.log(`✅ Creada: ${categoria.nombre}`);
        creadas++;
      } else {
        console.log(`↻ Actualizada: ${categoria.nombre}`);
        existentes++;
      }
    } catch (error: unknown) {
      console.error(
        `❌ Error con categoría ${categoriaData.nombre}:`,
        error instanceof Error
          ? error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)
          : String(error)
      );
    }
  }

  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Categorías creadas: ${creadas}`);
  console.log(`   - Categorías existentes: ${existentes}`);
  console.log(`   - Total: ${categorias.length}\n`);

  await prisma.$disconnect();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error: ReturnType<typeof JSON.parse>) => {
      console.error("Error en seeder:", error);
      process.exit(1);
    });
}
