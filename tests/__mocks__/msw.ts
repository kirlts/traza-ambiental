import { setupServer } from "msw/node";
import { rest } from "msw";

// Mock handlers para APIs
export const handlers = [
  // Mock de autenticación
  rest.post("/api/auth/signin", (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "productor",
        },
        token: "mock-token",
      })
    );
  }),

  // Mock de declaraciones
  rest.get("/api/productor/declaraciones", (req, res, ctx) => {
    return res(
      ctx.json({
        declaraciones: [
          {
            id: "1",
            anio: 2024,
            estado: "enviada",
            totalUnidades: 1000,
            totalToneladas: 25.5,
            folio: "DECL-2024-001",
          },
        ],
      })
    );
  }),

  // Mock de metas
  rest.get("/api/productor/metas", (req, res, ctx) => {
    return res(
      ctx.json({
        metas: [
          {
            id: "1",
            anio: 2025,
            tipo: "recoleccion",
            metaToneladas: 6.375,
            avanceToneladas: 2.1,
            porcentajeAvance: 32.9,
          },
        ],
      })
    );
  }),

  // Mock de notificaciones
  rest.get("/api/notificaciones", (req, res, ctx) => {
    return res(
      ctx.json({
        notificaciones: [
          {
            id: "1",
            titulo: "Declaración pendiente",
            mensaje: "Tienes una declaración pendiente de envío",
            leida: false,
            fecha: "2025-01-15T10:00:00Z",
          },
        ],
      })
    );
  }),
];

export const server = setupServer(...handlers);
