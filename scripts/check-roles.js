#!/usr/bin/env node
/* eslint-disable */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkRoles() {
  try {
    console.log("🔍 Verificando roles en la base de datos...\n");

    const roles = await prisma.role.findMany();

    console.log(`📊 Total de roles encontrados: ${roles.length}\n`);

    roles.forEach((role, index) => {
      console.log(`${index + 1}. Rol: ${role.name}`);
      console.log(`   ID: ${role.id}`);
      console.log(`   Descripción: ${role.description || "Sin descripción"}`);
      console.log(`   Activo: ${role.active}`);
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error al consultar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoles();
