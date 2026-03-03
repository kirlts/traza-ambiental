import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/register/route";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    solicitudRegistroGenerador: {
      create: jest.fn(),
    },
  },
}));

// Mock de bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn((password) => `hashed-${password}`),
}));

// Mock de validación RUT
jest.mock("@/lib/validations/rut", () => ({
  validarRUT: jest.fn(() => true),
}));

describe("/api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registra nuevo generador exitosamente", async () => {
    const mockUserData = {
      empresa: {
        rut: "76.123.456-7",
        razonSocial: "Empresa Test SPA",
        direccion: "Av. Test 123",
        comuna: "Santiago",
        region: "Metropolitana",
        telefono: "+56912345678",
      },
      representante: {
        rut: "12.345.678-9",
        nombres: "Juan",
        apellidos: "Pérez",
        cargo: "Gerente General",
        email: "juan@empresa.com",
        telefono: "+56987654321",
      },
      credenciales: {
        email: "admin@empresa.com",
        password: "Password123!",
      },
    };

    const { prisma } = require("@/lib/prisma");
    prisma.user.findUnique.mockResolvedValue(null); // No existe usuario
    prisma.solicitudRegistroGenerador.create.mockResolvedValue({
      id: "solicitud-1",
      estado: "pendiente",
    });

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(mockUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Solicitud registrada");
  });

  it("rechaza registro con email duplicado", async () => {
    const mockUserData = {
      empresa: { rut: "76.123.456-7", razonSocial: "Empresa Test" },
      representante: {
        rut: "12.345.678-9",
        nombres: "Juan",
        apellidos: "Pérez",
        email: "juan@empresa.com",
      },
      credenciales: { email: "admin@empresa.com", password: "Password123!" },
    };

    const { prisma } = require("@/lib/prisma");
    prisma.user.findUnique.mockResolvedValue({ id: "user-1" }); // Usuario existe

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(mockUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Email ya registrado");
  });

  it("valida RUT inválido", async () => {
    const { validarRUT } = require("@/lib/validations/rut");
    validarRUT.mockReturnValue(false); // RUT inválido

    const mockUserData = {
      empresa: { rut: "12.345.678-0", razonSocial: "Empresa Test" },
      representante: {
        rut: "12.345.678-9",
        nombres: "Juan",
        apellidos: "Pérez",
        email: "juan@empresa.com",
      },
      credenciales: { email: "admin@empresa.com", password: "Password123!" },
    };

    const request = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(mockUserData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("RUT inválido");
  });
});
