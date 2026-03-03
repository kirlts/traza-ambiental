#!/usr/bin/env node
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabaseStructure() {
  try {
    console.log("Conectando a la base de datos...");
    // Intentar una consulta raw para ver las columnas de la tabla users
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `;

    console.log("Columnas encontradas en la tabla users:");
    console.table(result);

    const cuentaAprobada = result.find(
      (r) => r.column_name === "cuentaAprobada" || r.column_name === "cuenta_aprobada"
    );

    if (cuentaAprobada) {
      console.log("✅ La columna cuentaAprobada existe en la base de datos.");
    } else {
      console.log("❌ La columna cuentaAprobada NO existe en la base de datos.");
    }
  } catch (error) {
    console.error("Error al consultar la estructura:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStructure();
