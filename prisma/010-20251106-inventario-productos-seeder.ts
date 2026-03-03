import { PrismaClient } from "@prisma/client";

const _unused = new PrismaClient();

/**
 * Seeder para productos de ejemplo del inventario
 * OMITIDO: Los modelos de inventario (CategoriaProducto, Producto) no existen en el schema actual
 */
export async function main() {
  console.log(
    "⚠️  Seed de productos de inventario omitido - Modelos de inventario no existen en schema actual"
  );
  console.log(
    "ℹ️  Para usar inventario, agregar los modelos CategoriaProducto y Producto al schema"
  );
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
