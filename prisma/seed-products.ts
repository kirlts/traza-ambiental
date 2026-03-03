import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface ProductoData {
  marca: string;
  modelo: string;
  medida: string;
  categoria: string;
  nombre: string;
}

const CATEGORIAS_MAP = {
  A: {
    nombre: "Categoría A - Automóviles y Similares",
    descripcion: "Neumáticos de vehículos particulares, camionetas y similares menores a aro 22.5",
  },
  B: {
    nombre: "Categoría B - Camiones y Buses",
    descripcion:
      "Neumáticos de transporte de carga, buses y maquinaria pesada, aro 22.5 o superior",
  },
};

async function main() {
  console.log("🌱 Iniciando carga masiva de productos...");

  // 1. Cargar datos del JSON
  const dataPath = path.join(process.cwd(), "data", "productos-chile.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const productos: ProductoData[] = JSON.parse(rawData);

  console.log(`📦 Se encontraron ${productos.length} productos para procesar.`);

  // 2. Asegurar Categorías
  const categoriasCache: Record<string, string> = {};

  for (const [key, info] of Object.entries(CATEGORIAS_MAP)) {
    const categoria = await prisma.categoriaProducto.upsert({
      where: { nombre: info.nombre },
      update: {},
      create: {
        nombre: info.nombre,
        descripcion: info.descripcion,
        activa: true,
      },
    });
    categoriasCache[key] = categoria.id;
    console.log(`✅ Categoría asegurada: ${info.nombre}`);
  }

  // 3. Procesar Productos
  let creados = 0;
  const _unused = 0;
  let errores = 0;

  for (const prod of productos) {
    try {
      const categoriaId = categoriasCache[prod.categoria];
      if (!categoriaId) {
        console.warn(
          `⚠️ Categoría no encontrada para producto: ${prod.nombre} (${prod.categoria})`
        );
        errores++;
        continue;
      }

      // Upsert producto
      // La constraint es @@unique([marca, modelo, medidas])
      // Ojo: en el modelo es 'medidas' (plural) pero en JSON puse 'medida' (singular). Ajustaré aquí.

      await prisma.producto.upsert({
        where: {
          marca_modelo_medidas: {
            marca: prod.marca,
            modelo: prod.modelo,
            medidas: prod.medida,
          },
        },
        update: {
          nombre: prod.nombre,
          categoriaId: categoriaId,
          descripcion: `Neumático ${prod.marca} ${prod.modelo} ${prod.medida}`,
          activo: true,
        },
        create: {
          nombre: prod.nombre,
          marca: prod.marca,
          modelo: prod.modelo,
          medidas: prod.medida,
          categoriaId: categoriaId,
          descripcion: `Neumático ${prod.marca} ${prod.modelo} ${prod.medida}`,
          activo: true,
        },
      });

      // No hay forma fácil de saber si fue create o update con upsert sin hacer query antes,
      // pero para efectos de log asumiremos éxito.
      creados++;
    } catch (error: unknown) {
      console.error(`❌ Error procesando ${prod.nombre}:`, error);
      errores++;
    }
  }

  console.log(`
🏁 Carga finalizada:
   - Procesados: ${creados}
   - Errores: ${errores}
  `);
}

main()
  .catch((e: ReturnType<typeof JSON.parse>) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
