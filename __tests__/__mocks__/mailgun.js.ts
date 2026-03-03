/**
 * Mock de Mailgun.js para tests
 */

// Test básico para que Jest no falle
describe("Mailgun Mock", () => {
  it("debe existir", () => {
    expect(mockMailgunClient).toBeDefined();
    expect(mockMessagesCreate).toBeDefined();
  });
});

export const mockMessagesCreate = jest.fn();
export const mockDomainsList = jest.fn();

// Mock del cliente de Mailgun
export const mockMailgunClient = {
  messages: {
    create: mockMessagesCreate,
  },
  domains: {
    list: mockDomainsList,
  },
};

// Mock de la clase Mailgun
export const mockMailgunConstructor = jest.fn();

// Mock por defecto: envío exitoso
mockMessagesCreate.mockResolvedValue({
  id: "<mock-message-id@mailgun.org>",
  status: "queued",
  message: "Queued. Thank you.",
});

// Mock de lista de dominios
mockDomainsList.mockResolvedValue({
  items: [
    {
      name: "sandbox123.mailgun.org",
      state: "active",
      created_at: "2024-01-01T00:00:00.000Z",
    },
  ],
});

// Clase Mailgun mockeada
class Mailgun {
  constructor(formData: any) {
    mockMailgunConstructor(formData);
  }

  client(config: any) {
    return mockMailgunClient;
  }
}

export default Mailgun;
