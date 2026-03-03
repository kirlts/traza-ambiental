#!/usr/bin/env node
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("🔍 Verificando usuarios y roles en la base de datos...\n");

    // Obtener todos los usuarios con sus roles
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    console.log(`📊 Total de usuarios encontrados: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. Usuario: ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   RUT: ${user.rut || "No definido"}`);
      console.log(`   Activo: ${user.active}`);
      console.log(`   Cuenta Aprobada: ${user.cuentaAprobada}`);
      console.log(
        `   Roles: ${user.userRoles.map((ur) => ur.role.name).join(", ") || "Sin roles"}`
      );
      console.log("");
    });

    // Verificar si hay usuarios con rol GENERADOR
    const generadores = users.filter((user) =>
      user.userRoles.some((ur) => ur.role.name === "GENERADOR")
    );

    console.log(`🏭 Usuarios con rol GENERADOR: ${generadores.length}`);
    if (generadores.length > 0) {
      generadores.forEach((gen) => {
        console.log(`   - ${gen.name} (${gen.email})`);
      });
    } else {
      console.log("   ⚠️  No hay usuarios con rol GENERADOR");
    }
  } catch (error) {
    console.error("❌ Error al consultar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
