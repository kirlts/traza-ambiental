/**
 * Mock de Nodemailer para tests
 */

// Test básico para que Jest no falle
describe("Nodemailer Mock", () => {
  it("debe existir", () => {
    expect(mockCreateTransporter).toBeDefined();
    expect(mockSendMail).toBeDefined();
  });
});

export const mockSendMail = jest.fn();

// Mock del transporter con todos los métodos necesarios
export const mockTransporter = {
  sendMail: mockSendMail,
  verify: jest.fn().mockResolvedValue(true),
  close: jest.fn(),
  use: jest.fn(),
};

export const mockCreateTransporter = jest.fn(() => mockTransporter);

// Mock por defecto: envío exitoso
mockSendMail.mockResolvedValue({
  messageId: "mock-message-id-12345",
  response: "250 Message accepted",
  accepted: ["test@example.com"],
  rejected: [],
  pending: [],
});

const nodemailer = {
  createTransporter: mockCreateTransporter,
};

export default nodemailer;
