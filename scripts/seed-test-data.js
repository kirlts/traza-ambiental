#!/usr/bin/env node
/* eslint-disable */

/**
 * Seeder simplificado para datos de prueba
 * Solo carga lo esencial para que los tests funcionen
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "postgresql://postgres:postgres@localhost:5432/trazambiental_test?schema=public",
    },
  },
});

async function main() {
  console.log("🌱 Cargando datos de prueba básicos...\n");

  // Limpiar datos existentes
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ConfiguracionMetas" CASCADE`;

  const hashedPassword = await bcrypt.hash("test123", 10);

  // Crear usuarios de prueba para cada rol
  const usuarios = [
    {
      email: "admin@test.com",
      nombre: "Admin Test",
      rut: "11111111-1",
      roles: ["Administrador"],
      password: hashedPassword,
      emailVerified: new Date(),
      cuentaAprobada: true,
    },
    {
      email: "transportista@test.com",
      nombre: "Transportista Test",
      rut: "22222222-2",
      roles: ["Transportista"],
      password: hashedPassword,
      emailVerified: new Date(),
      cuentaAprobada: true,
    },
    {
      email: "gestor@test.com",
      nombre: "Gestor Test",
      rut: "33333333-3",
      roles: ["Gestor"],
      password: hashedPassword,
      emailVerified: new Date(),
      cuentaAprobada: true,
    },
    {
      email: "generador@test.com",
      nombre: "Generador Test",
      rut: "44444444-4",
      roles: ["Generador"],
      password: hashedPassword,
      emailVerified: new Date(),
      cuentaAprobada: true,
    },
  ];

  for (const user of usuarios) {
    await prisma.user.create({ data: user });
    console.log(`✅ Usuario creado: ${user.email}`);
  }

  // Crear configuración de metas básica
  const currentYear = new Date().getFullYear();
  await prisma.configuracionMetas.create({
    data: {
      año: currentYear,
      porcentajeRecoleccion: 25,
      porcentajeValorizacion: 80,
    },
  });

  console.log(`✅ Configuración de metas ${currentYear} creada\n`);
  console.log("🎉 Datos de prueba cargados exitosamente!\n");
}

main()
  .catch((error) => {
    console.error("❌ Error cargando datos de prueba:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
