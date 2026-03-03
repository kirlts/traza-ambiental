/**
 * Mock de Prisma para tests
 */

// Test básico para que Jest no falle
describe("Prisma Mock", () => {
  it("debe existir", () => {
    expect(mockPrisma).toBeDefined();
  });
});

export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  documentoVerificacion: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  logValidacion: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  alertaVencimiento: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  vehiculo: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  solicitudRetiro: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

export const prisma = mockPrisma;
