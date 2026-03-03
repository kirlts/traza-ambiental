/**
 * Tests simplificados para funciones de envío de emails
 * Estos tests verifican la funcionalidad básica sin requerir mocks complejos
 */

import {
  sendWelcomeEmail,
  sendAprobacionEmail,
  sendRechazoEmail,
  sendVencimiento30DiasEmail,
  sendVencimiento15DiasEmail,
  sendSuspensionEmail,
} from "@/lib/emails/send";

// Mock nodemailer completamente
jest.mock("nodemailer", () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-123" }),
    verify: jest.fn().mockResolvedValue(true),
  })),
}));

describe("Funciones de envío de emails - Tests Simplificados", () => {
  beforeEach(() => {
    process.env.SMTP_HOST = "smtp.test.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "test@test.com";
    process.env.SMTP_PASS = "testpass";
    process.env.FROM_EMAIL = "noreply@trazambiental.com";
    process.env.FROM_NAME = "TrazAmbiental";
  });

  it("sendWelcomeEmail debería completarse sin errores", async () => {
    const result = await sendWelcomeEmail("test@example.com", "Test User", "Transportista");
    expect(result).toBe(true);
  });

  it("sendAprobacionEmail debería completarse sin errores", async () => {
    const result = await sendAprobacionEmail("test@example.com", "Test User", "RCA");
    expect(result).toBe(true);
  });

  it("sendRechazoEmail debería completarse sin errores", async () => {
    const result = await sendRechazoEmail(
      "test@example.com",
      "Test User",
      "RCA",
      "Motivo de rechazo"
    );
    expect(result).toBe(true);
  });

  it("sendVencimiento30DiasEmail debería completarse sin errores", async () => {
    const result = await sendVencimiento30DiasEmail(
      "test@example.com",
      "Test User",
      "RCA",
      new Date()
    );
    expect(result).toBe(true);
  });

  it("sendVencimiento15DiasEmail debería completarse sin errores", async () => {
    const result = await sendVencimiento15DiasEmail(
      "test@example.com",
      "Test User",
      "RCA",
      new Date()
    );
    expect(result).toBe(true);
  });

  it("sendSuspensionEmail debería completarse sin errores", async () => {
    const result = await sendSuspensionEmail("test@example.com", "Test User", "RCA");
    expect(result).toBe(true);
  });
});
