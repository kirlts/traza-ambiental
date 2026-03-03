/**
 * Mock de NextAuth para tests
 */

// Test básico para que Jest no falle
describe("NextAuth Mock", () => {
  it("debe existir", () => {
    expect(mockAuth).toBeDefined();
    expect(mockSession).toBeDefined();
  });
});

export const mockAuth = jest.fn();

export const mockSession = {
  user: {
    id: "test-user-id",
    email: "test@example.com",
    nombre: "Test User",
    roles: ["Transportista"],
  },
  expires: "2025-12-31",
};

// Mock por defecto: usuario autenticado como transportista
mockAuth.mockResolvedValue(mockSession);

export const auth = mockAuth;
