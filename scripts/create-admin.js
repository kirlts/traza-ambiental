#!/usr/bin/env node
/* eslint-disable */
// scripts/create-admin.ts
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

function isStrongPasswordAdmin(password: string) {
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function generateStrongPasswordAdmin(length = 20) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?";
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const bytes = crypto.randomBytes(length);
    let password = "";

    for (let i = 0; i < length; i += 1) {
      password += chars[bytes[i] % chars.length];
    }

    if (isStrongPasswordAdmin(password)) {
      return password;
    }
  }

  throw new Error("No se pudo generar una contraseña segura.");
}

async function main() {
  try {
    const email = (process.env.ADMIN_EMAIL || "").trim();
    const roleName = process.env.ADMIN_ROLE_NAME || "Administrador";
    const name = process.env.ADMIN_NAME || "Admin Principal";
    const rut = process.env.ADMIN_RUT;

    if (!email) {
      throw new Error("Falta ADMIN_EMAIL para crear el usuario admin.");
    }

    let rawPassword = process.env.ADMIN_PASSWORD;
    let generatedPassword = false;

    if (!rawPassword) {
      rawPassword = generateStrongPasswordAdmin();
      generatedPassword = true;
    }

    if (!isStrongPasswordAdmin(rawPassword)) {
      throw new Error(
        "La contraseña no cumple requisitos mínimos (12+ y complejidad)."
      );
    }

    const password = await bcrypt.hash(rawPassword, 12);

    // 1. Asegurar que el rol existe
    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: roleName, description: "Administrador del Sistema" },
      });
      console.log("Rol ADMIN creado.");
    }

    // 2. Crear o actualizar usuario
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password,
      },
      create: {
        email,
        name,
        password,
        rut: rut || undefined,
        roles: {
          create: { roleId: role.id },
        },
      },
    });

    // Asegurar relación de rol
    const userRole = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
    });

    if (!userRole) {
      await prisma.userRole.create({
        data: { userId: user.id, roleId: role.id },
      });
    }

    console.log(`Usuario Admin creado/actualizado: ${email}`);
    if (generatedPassword) {
      console.log(`Contraseña generada (guardar en un lugar seguro): ${rawPassword}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
