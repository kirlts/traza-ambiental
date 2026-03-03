#!/usr/bin/env node
/* eslint-disable */
// scripts/create-gestor.ts
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const email = "gestor.prueba@traza.com";
    const password = await bcrypt.hash("password123", 10);
    const roleName = "GESTOR";

    // 1. Asegurar que el rol existe
    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: roleName, description: "Gestor de Residuos" },
      });
      console.log("Rol GESTOR creado.");
    }

    // 2. Crear o actualizar usuario
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password,
        roles: {
          connectOrCreate: {
            where: { userId_roleId: { userId: "temp-id", roleId: role.id } }, // Hacky but works for upsert logic usually or just connect
            create: { roleId: role.id },
          },
        },
      },
      create: {
        email,
        name: "Gestor Prueba S.A.",
        password,
        rut: "77.888.999-K",
        roles: {
          create: { roleId: role.id },
        },
      },
    });

    // Asegurar relación de rol si upsert update no funcionó bien con connect
    const userRole = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
    });

    if (!userRole) {
      await prisma.userRole.create({
        data: { userId: user.id, roleId: role.id },
      });
    }

    console.log(`Usuario Gestor creado/actualizado: ${email} / password123`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
