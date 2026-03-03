/**
 * Tests unitarios para funciones de envío de emails
 * HU-016: Validación Documental de Transportistas y Gestores
 *
 * NOTA: Estos tests verifican la funcionalidad de envío de emails
 * usando los mocks configurados en __mocks__/nodemailer.ts
 */

import {
  sendWelcomeEmail,
  sendAprobacionEmail,
  sendRechazoEmail,
  sendVencimiento30DiasEmail,
  sendVencimiento15DiasEmail,
  sendSuspensionEmail,
} from "@/lib/emails/send";
import { formatTipoDocumento, formatFechaEspanol } from "@/lib/emails/templates";

// Mock de Mailgun
import { mockMessagesCreate } from "../../__mocks__/mailgun.js.ts";

// Añadir jest.mock para Mailgun
jest.mock("mailgun.js");

describe("Funciones de envío de emails", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar variables de entorno para Mailgun
    process.env.MAILGUN_API_KEY = "test-key";
    process.env.MAILGUN_DOMAIN = "test.domain";
    process.env.FROM_EMAIL = "noreply@test.domain";
    process.env.FROM_NAME = "TrazAmbiental";

    // Resetear mock a éxito por defecto
    mockMessagesCreate.mockResolvedValue({
      id: "<mock-message-id@mailgun.org>",
      status: "queued",
      message: "Queued. Thank you.",
    });
  });

  describe("sendWelcomeEmail", () => {
    it("debería enviar email de bienvenida para transportista", async () => {
      const result = await sendWelcomeEmail("juan@example.com", "Juan Pérez", "Transportista");

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "juan@example.com",
          subject: expect.stringContaining("Transportista"),
          html: expect.stringContaining("Juan Pérez"),
          text: expect.stringContaining("Juan Pérez"),
        })
      );
    });

    it("debería enviar email de bienvenida para gestor", async () => {
      const result = await sendWelcomeEmail("maria@example.com", "María González", "Gestor");

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "maria@example.com",
          subject: expect.stringContaining("Gestor"),
          html: expect.stringContaining("María González"),
          text: expect.stringContaining("María González"),
        })
      );
    });

    it("debería manejar errores de envío", async () => {
      mockMessagesCreate.mockRejectedValueOnce(new Error("Mailgun Error"));

      const result = await sendWelcomeEmail("error@example.com", "Error User", "Transportista");

      expect(result).toBe(false);
    });
  });

  describe("sendAprobacionEmail", () => {
    it("debería enviar email de aprobación", async () => {
      const result = await sendAprobacionEmail(
        "juan@example.com",
        "Juan Pérez",
        "AUTORIZACION_SANITARIA_TRANSPORTE"
      );

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "juan@example.com",
          subject: expect.stringContaining("Aprobado"),
          html: expect.stringContaining("Juan Pérez"),
        })
      );
    });

    it("debería incluir nombre correcto del tipo de documento", async () => {
      await sendAprobacionEmail("test@example.com", "Test User", "RCA");

      const call = mockMessagesCreate.mock.calls[0][1];
      expect(call.html).toContain("Resolución de Calificación Ambiental");
    });

    it("debería manejar tipos de documento desconocidos", async () => {
      const result = await sendAprobacionEmail("test@example.com", "Test User", "TIPO_DESCONOCIDO");

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalled();
    });
  });

  describe("sendRechazoEmail", () => {
    it("debería enviar email de rechazo con motivo", async () => {
      const result = await sendRechazoEmail(
        "juan@example.com",
        "Juan Pérez",
        "RCA",
        "Documento ilegible"
      );

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "juan@example.com",
          subject: expect.stringContaining("Rechazado"),
          html: expect.stringContaining("Juan Pérez"),
          text: expect.stringContaining("Documento ilegible"),
        })
      );
    });

    it("debería incluir instrucciones para resubir documento", async () => {
      await sendRechazoEmail("test@example.com", "Test User", "RCA", "Falta información");

      const call = mockMessagesCreate.mock.calls[0][1];
      expect(call.html).toContain("subir");
      expect(call.html.toLowerCase()).toContain("documento");
    });
  });

  describe("sendVencimiento30DiasEmail", () => {
    it("debería enviar alerta de vencimiento a 30 días", async () => {
      const fechaVencimiento = new Date("2025-12-31T00:00:00Z");

      const result = await sendVencimiento30DiasEmail(
        "juan@example.com",
        "Juan Pérez",
        "REVISION_TECNICA",
        fechaVencimiento
      );

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "juan@example.com",
          subject: expect.stringContaining("30 días"),
          html: expect.stringContaining("Juan Pérez"),
        })
      );
    });

    it("debería formatear correctamente la fecha de vencimiento", async () => {
      const fechaVencimiento = new Date("2025-06-15T00:00:00Z");

      await sendVencimiento30DiasEmail(
        "test@example.com",
        "Test User",
        "PERMISO_CIRCULACION",
        fechaVencimiento
      );

      const call = mockMessagesCreate.mock.calls[0][1];
      expect(call.html).toContain("15 de junio de 2025");
    });
  });

  describe("sendVencimiento15DiasEmail", () => {
    it("debería enviar alerta crítica de vencimiento a 15 días", async () => {
      const fechaVencimiento = new Date("2025-12-31T00:00:00Z");

      const result = await sendVencimiento15DiasEmail(
        "maria@example.com",
        "María González",
        "AUTORIZACION_SANITARIA_PLANTA",
        fechaVencimiento
      );

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "maria@example.com",
          subject: expect.stringContaining("15 días"),
          html: expect.stringContaining("María González"),
        })
      );
    });
  });

  describe("sendSuspensionEmail", () => {
    it("debería enviar email de suspensión por documento vencido", async () => {
      const result = await sendSuspensionEmail(
        "carlos@example.com",
        "Carlos López",
        "REVISION_TECNICA"
      );

      expect(result).toBe(true);
      expect(mockMessagesCreate).toHaveBeenCalledWith(
        "test.domain",
        expect.objectContaining({
          from: "TrazAmbiental <noreply@test.domain>",
          to: "carlos@example.com",
          subject: expect.stringContaining("Suspendida"),
          html: expect.stringContaining("Carlos López"),
          text: expect.stringContaining("suspendida"),
        })
      );
    });

    it("debería incluir instrucciones para reactivar cuenta", async () => {
      await sendSuspensionEmail("test@example.com", "Test User", "RCA");

      const call = mockMessagesCreate.mock.calls[0][1];
      expect(call.html.toLowerCase()).toContain("reactivar");
      expect(call.html.toLowerCase()).toContain("actualizado");
    });
  });

  describe("Formateo de nombres de documentos", () => {
    it("debería formatear correctamente AUTORIZACION_SANITARIA_TRANSPORTE", () => {
      expect(formatTipoDocumento("AUTORIZACION_SANITARIA_TRANSPORTE")).toBe(
        "Autorización Sanitaria de Transporte"
      );
    });

    it("debería formatear correctamente PERMISO_CIRCULACION", () => {
      expect(formatTipoDocumento("PERMISO_CIRCULACION")).toBe("Permiso de Circulación");
    });

    it("debería formatear correctamente REVISION_TECNICA", () => {
      expect(formatTipoDocumento("REVISION_TECNICA")).toBe("Revisión Técnica");
    });

    it("debería formatear correctamente CERTIFICADO_ANTECEDENTES", () => {
      expect(formatTipoDocumento("CERTIFICADO_ANTECEDENTES")).toBe("Certificado de Antecedentes");
    });

    it("debería formatear correctamente AUTORIZACION_SANITARIA_PLANTA", () => {
      expect(formatTipoDocumento("AUTORIZACION_SANITARIA_PLANTA")).toBe(
        "Autorización Sanitaria de Planta"
      );
    });

    it("debería formatear correctamente RCA", () => {
      expect(formatTipoDocumento("RCA")).toBe("Resolución de Calificación Ambiental (RCA)");
    });

    it("debería formatear correctamente REGISTRO_GESTOR_MMA", () => {
      expect(formatTipoDocumento("REGISTRO_GESTOR_MMA")).toBe("Registro de Gestor MMA");
    });

    it("debería formatear correctamente CERTIFICADO_INSTALACION_ELECTRICA", () => {
      expect(formatTipoDocumento("CERTIFICADO_INSTALACION_ELECTRICA")).toBe(
        "Certificado de Instalación Eléctrica"
      );
    });

    it("debería formatear correctamente CERTIFICADO_VIGENCIA_PODERES", () => {
      expect(formatTipoDocumento("CERTIFICADO_VIGENCIA_PODERES")).toBe(
        "Certificado de Vigencia de Poderes"
      );
    });

    it("debería formatear correctamente PATENTE_MUNICIPAL", () => {
      expect(formatTipoDocumento("PATENTE_MUNICIPAL")).toBe("Patente Municipal");
    });
  });

  describe("Formateo de fechas", () => {
    it("debería formatear fechas en español", () => {
      const fecha = new Date("2025-12-31T00:00:00Z");
      expect(formatFechaEspanol(fecha)).toBe("31 de diciembre de 2025");
    });

    it("debería manejar diferentes meses correctamente", () => {
      const fechas = [
        { fecha: new Date("2025-01-15T00:00:00Z"), esperado: "15 de enero de 2025" },
        { fecha: new Date("2025-06-20T00:00:00Z"), esperado: "20 de junio de 2025" },
        { fecha: new Date("2025-11-05T00:00:00Z"), esperado: "5 de noviembre de 2025" },
      ];

      fechas.forEach(({ fecha, esperado }) => {
        expect(formatFechaEspanol(fecha)).toBe(esperado);
      });
    });
  });
});
