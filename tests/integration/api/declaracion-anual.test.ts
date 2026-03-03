import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/productor/declaracion-anual/route";

// Mock de Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    declaracionAnual: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    categoriaDeclarada: {
      create: jest.fn(),
    },
  },
}));

// Mock de autenticación
jest.mock("@/lib/auth-helpers", () => ({
  isProductor: jest.fn(() => true),
  getCurrentUser: jest.fn(() => ({
    id: "user-1",
    email: "productor@test.com",
    role: "productor",
  })),
}));

describe("/api/productor/declaracion-anual", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("retorna declaración existente para el período activo", async () => {
      const mockDeclaracion = {
        id: "decl-1",
        anio: 2024,
        estado: "borrador",
        totalUnidades: 1000,
        totalToneladas: 25.5,
        categorias: [
          {
            tipo: "A",
            nombre: "Vehículos livianos",
            cantidadUnidades: 800,
            pesoToneladas: 20.0,
          },
        ],
      };

      const { prisma } = require("@/lib/prisma");
      prisma.declaracionAnual.findFirst.mockResolvedValue(mockDeclaracion);

      const request = new NextRequest("http://localhost:3000/api/productor/declaracion-anual");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.declaracion).toEqual(mockDeclaracion);
    });

    it("retorna null cuando no hay declaración existente", async () => {
      const { prisma } = require("@/lib/prisma");
      prisma.declaracionAnual.findFirst.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/productor/declaracion-anual");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.declaracion).toBeNull();
    });
  });

  describe("POST", () => {
    it("crea nueva declaración correctamente", async () => {
      const mockDeclaracionData = {
        anio: 2024,
        categorias: [
          {
            tipo: "A",
            nombre: "Vehículos livianos",
            cantidadUnidades: 1000,
            pesoToneladas: 25.0,
          },
        ],
      };

      const mockDeclaracionCreada = {
        id: "decl-1",
        anio: 2024,
        estado: "borrador",
        totalUnidades: 1000,
        totalToneladas: 25.0,
      };

      const { prisma } = require("@/lib/prisma");
      prisma.declaracionAnual.create.mockResolvedValue(mockDeclaracionCreada);
      prisma.categoriaDeclarada.create.mockResolvedValue({});

      const request = new NextRequest("http://localhost:3000/api/productor/declaracion-anual", {
        method: "POST",
        body: JSON.stringify(mockDeclaracionData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.declaracion).toEqual(mockDeclaracionCreada);
      expect(prisma.declaracionAnual.create).toHaveBeenCalledTimes(1);
    });

    it("valida datos requeridos", async () => {
      const request = new NextRequest("http://localhost:3000/api/productor/declaracion-anual", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Datos requeridos");
    });
  });
});
