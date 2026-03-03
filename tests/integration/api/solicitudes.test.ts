/**
 * Tests de integración para API de Solicitudes de Retiro
 * HU-003B: Crear Solicitud de Retiro
 */

import { NextRequest } from "next/server";
import { POST as crearSolicitud } from "@/app/api/generador/solicitudes/route";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";

// Mock de next-auth
jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

const { getServerSession } = require("next-auth/next");

describe("POST /api/generador/solicitudes", () => {
  let generadorTest: any;
  let regionTest: any;
  let comunaTest: any;

  beforeAll(async () => {
    // Crear datos de prueba
    regionTest = await prisma.region.create({
      data: {
        codigo: "CL-RM-TEST",
        nombre: "Región Metropolitana Test",
      },
    });

    comunaTest = await prisma.comuna.create({
      data: {
        codigo: "CL-RM-TEST-SAN",
        nombre: "Santiago Test",
        regionId: regionTest.id,
      },
    });

    generadorTest = await prisma.user.create({
      data: {
        email: "generador-test@test.com",
        name: "Generador Test",
        password: "hashedpassword",
        role: "generador",
        status: "aprobado",
      },
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await prisma.solicitudRetiro.deleteMany({
      where: { generadorId: generadorTest.id },
    });
    await prisma.user.delete({ where: { id: generadorTest.id } });
    await prisma.comuna.delete({ where: { id: comunaTest.id } });
    await prisma.region.delete({ where: { id: regionTest.id } });
    await prisma.$disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Autenticación y Autorización", () => {
    it("debe rechazar solicitud sin autenticación", async () => {
      getServerSession.mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(401);

      const json = await response.json();
      expect(json.error).toContain("autenticación");
    });

    it("debe rechazar usuario sin rol generador", async () => {
      const session: Session = {
        user: {
          id: "otro-usuario",
          email: "transportista@test.com",
          role: "transportista",
        },
        expires: "2025-12-31",
      };
      getServerSession.mockResolvedValue(session);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(403);

      const json = await response.json();
      expect(json.error).toContain("permisos");
    });

    it("debe rechazar usuario con cuenta no aprobada", async () => {
      const usuarioNoAprobado = await prisma.user.create({
        data: {
          email: "generador-no-aprobado@test.com",
          name: "Generador No Aprobado",
          password: "hashedpassword",
          role: "generador",
          status: "pendiente",
        },
      });

      const session: Session = {
        user: {
          id: usuarioNoAprobado.id,
          email: usuarioNoAprobado.email,
          role: "generador",
        },
        expires: "2025-12-31",
      };
      getServerSession.mockResolvedValue(session);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(403);

      const json = await response.json();
      expect(json.error).toContain("aprobada");

      // Limpiar
      await prisma.user.delete({ where: { id: usuarioNoAprobado.id } });
    });
  });

  describe("Validación de Datos", () => {
    const mockSession: Session = {
      user: {
        id: "",
        email: "generador-test@test.com",
        role: "generador",
      },
      expires: "2025-12-31",
    };

    beforeEach(() => {
      mockSession.user.id = generadorTest.id;
      getServerSession.mockResolvedValue(mockSession);
    });

    it("debe rechazar solicitud con campos obligatorios faltantes", async () => {
      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({
          // Campos vacíos
        }),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toBeTruthy();
    });

    it("debe rechazar fecha de retiro pasada", async () => {
      const fechaPasada = new Date();
      fechaPasada.setDate(fechaPasada.getDate() - 1);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({
          direccionRetiro: "Calle Test 123",
          region: regionTest.codigo,
          comuna: comunaTest.codigo,
          fechaPreferida: fechaPasada.toISOString(),
          horarioPreferido: "Mañana",
          categoriaA_cantidad: 10,
          categoriaA_pesoEst: 100,
          categoriaB_cantidad: 0,
          categoriaB_pesoEst: 0,
          nombreContacto: "Juan Pérez",
          telefonoContacto: "+56912345678",
        }),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toContain("fecha");
    });

    it("debe rechazar solicitud sin ninguna categoría", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 1);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({
          direccionRetiro: "Calle Test 123",
          region: regionTest.codigo,
          comuna: comunaTest.codigo,
          fechaPreferida: fechaFutura.toISOString(),
          horarioPreferido: "Mañana",
          categoriaA_cantidad: 0,
          categoriaA_pesoEst: 0,
          categoriaB_cantidad: 0,
          categoriaB_pesoEst: 0,
          nombreContacto: "Juan Pérez",
          telefonoContacto: "+56912345678",
        }),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toContain("categoría");
    });

    it("debe rechazar cantidades negativas", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 1);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({
          direccionRetiro: "Calle Test 123",
          region: regionTest.codigo,
          comuna: comunaTest.codigo,
          fechaPreferida: fechaFutura.toISOString(),
          horarioPreferido: "Mañana",
          categoriaA_cantidad: -10,
          categoriaA_pesoEst: 100,
          categoriaB_cantidad: 0,
          categoriaB_pesoEst: 0,
          nombreContacto: "Juan Pérez",
          telefonoContacto: "+56912345678",
        }),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(400);
    });

    it("debe rechazar teléfono con formato inválido", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 1);

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify({
          direccionRetiro: "Calle Test 123",
          region: regionTest.codigo,
          comuna: comunaTest.codigo,
          fechaPreferida: fechaFutura.toISOString(),
          horarioPreferido: "Mañana",
          categoriaA_cantidad: 10,
          categoriaA_pesoEst: 100,
          categoriaB_cantidad: 0,
          categoriaB_pesoEst: 0,
          nombreContacto: "Juan Pérez",
          telefonoContacto: "12345", // Inválido
        }),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toContain("teléfono");
    });
  });

  describe("Creación Exitosa", () => {
    const mockSession: Session = {
      user: {
        id: "",
        email: "generador-test@test.com",
        role: "generador",
      },
      expires: "2025-12-31",
    };

    beforeEach(() => {
      mockSession.user.id = generadorTest.id;
      getServerSession.mockResolvedValue(mockSession);
    });

    it("debe crear solicitud con datos válidos", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 3);

      const datosValidos = {
        direccionRetiro: "Av. Libertador Bernardo O'Higgins 123, Santiago",
        region: regionTest.codigo,
        comuna: comunaTest.codigo,
        fechaPreferida: fechaFutura.toISOString(),
        horarioPreferido: "Mañana",
        categoriaA_cantidad: 50,
        categoriaA_pesoEst: 400.5,
        categoriaB_cantidad: 10,
        categoriaB_pesoEst: 800.75,
        nombreContacto: "María González",
        telefonoContacto: "+56987654321",
        instrucciones: "Tocar timbre del segundo piso",
      };

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.solicitudId).toBeTruthy();
      expect(json.folio).toMatch(/SOL-\d{8}-\d{4}/);

      // Verificar que se guardó en BD
      const solicitud = await prisma.solicitudRetiro.findUnique({
        where: { id: json.solicitudId },
      });

      expect(solicitud).toBeTruthy();
      expect(solicitud?.estado).toBe("pendiente");
      expect(solicitud?.direccionRetiro).toBe(datosValidos.direccionRetiro);
      expect(solicitud?.categoriaA_cantidad).toBe(datosValidos.categoriaA_cantidad);
      expect(solicitud?.cantidadTotal).toBe(60);
      expect(solicitud?.pesoTotalEstimado).toBe(1201.25);
    });

    it("debe generar folio único secuencial", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 3);

      const datosValidos = {
        direccionRetiro: "Calle Test 456",
        region: regionTest.codigo,
        comuna: comunaTest.codigo,
        fechaPreferida: fechaFutura.toISOString(),
        horarioPreferido: "Tarde",
        categoriaA_cantidad: 20,
        categoriaA_pesoEst: 160,
        categoriaB_cantidad: 0,
        categoriaB_pesoEst: 0,
        nombreContacto: "Pedro Soto",
        telefonoContacto: "+56911223344",
      };

      const request1 = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response1 = await crearSolicitud(request1);
      const json1 = await response1.json();

      const request2 = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response2 = await crearSolicitud(request2);
      const json2 = await response2.json();

      // Los folios deben ser diferentes
      expect(json1.folio).not.toBe(json2.folio);

      // Ambos deben tener formato correcto
      expect(json1.folio).toMatch(/SOL-\d{8}-\d{4}/);
      expect(json2.folio).toMatch(/SOL-\d{8}-\d{4}/);
    });

    it("debe crear registro en historial de cambios de estado", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 3);

      const datosValidos = {
        direccionRetiro: "Calle Historia 789",
        region: regionTest.codigo,
        comuna: comunaTest.codigo,
        fechaPreferida: fechaFutura.toISOString(),
        horarioPreferido: "Mañana",
        categoriaA_cantidad: 15,
        categoriaA_pesoEst: 120,
        categoriaB_cantidad: 0,
        categoriaB_pesoEst: 0,
        nombreContacto: "Ana Torres",
        telefonoContacto: "+56922334455",
      };

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response = await crearSolicitud(request);
      const json = await response.json();

      // Verificar historial
      const cambiosEstado = await prisma.cambioEstado.findMany({
        where: { solicitudId: json.solicitudId },
      });

      expect(cambiosEstado).toHaveLength(1);
      expect(cambiosEstado[0].estadoNuevo).toBe("pendiente");
      expect(cambiosEstado[0].estadoAnterior).toBeNull();
      expect(cambiosEstado[0].realizadoPor).toBe(generadorTest.id);
    });
  });

  describe("Casos Límite", () => {
    const mockSession: Session = {
      user: {
        id: "",
        email: "generador-test@test.com",
        role: "generador",
      },
      expires: "2025-12-31",
    };

    beforeEach(() => {
      mockSession.user.id = generadorTest.id;
      getServerSession.mockResolvedValue(mockSession);
    });

    it("debe aceptar instrucciones largas (hasta límite)", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 3);

      const instruccionesLargas = "A".repeat(500); // Máximo 500 caracteres

      const datosValidos = {
        direccionRetiro: "Calle Larga 999",
        region: regionTest.codigo,
        comuna: comunaTest.codigo,
        fechaPreferida: fechaFutura.toISOString(),
        horarioPreferido: "Mañana",
        categoriaA_cantidad: 10,
        categoriaA_pesoEst: 80,
        categoriaB_cantidad: 0,
        categoriaB_pesoEst: 0,
        nombreContacto: "Carlos Ruiz",
        telefonoContacto: "+56933445566",
        instrucciones: instruccionesLargas,
      };

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(201);
    });

    it("debe rechazar instrucciones excesivamente largas", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 3);

      const instruccionesExcesivas = "A".repeat(501); // Excede límite

      const datosValidos = {
        direccionRetiro: "Calle Exceso 111",
        region: regionTest.codigo,
        comuna: comunaTest.codigo,
        fechaPreferida: fechaFutura.toISOString(),
        horarioPreferido: "Mañana",
        categoriaA_cantidad: 10,
        categoriaA_pesoEst: 80,
        categoriaB_cantidad: 0,
        categoriaB_pesoEst: 0,
        nombreContacto: "Laura Díaz",
        telefonoContacto: "+56944556677",
        instrucciones: instruccionesExcesivas,
      };

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(400);
    });

    it("debe aceptar solo categoría A con categoría B en cero", async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 3);

      const datosValidos = {
        direccionRetiro: "Calle Solo A 222",
        region: regionTest.codigo,
        comuna: comunaTest.codigo,
        fechaPreferida: fechaFutura.toISOString(),
        horarioPreferido: "Tarde",
        categoriaA_cantidad: 25,
        categoriaA_pesoEst: 200,
        categoriaB_cantidad: 0,
        categoriaB_pesoEst: 0,
        nombreContacto: "Jorge Morales",
        telefonoContacto: "+56955667788",
      };

      const request = new NextRequest("http://localhost:3000/api/generador/solicitudes", {
        method: "POST",
        body: JSON.stringify(datosValidos),
      });

      const response = await crearSolicitud(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      const solicitud = await prisma.solicitudRetiro.findUnique({
        where: { id: json.solicitudId },
      });

      expect(solicitud?.cantidadTotal).toBe(25);
      expect(solicitud?.pesoTotalEstimado).toBe(200);
    });
  });
});
