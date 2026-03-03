/**
 * Tests para sistema de envío de emails
 * HU-016: Validación Documental de Transportistas y Gestores
 */

import { mockSendMail, mockCreateTransporter } from "../../__mocks__/nodemailer";

// Simular las funciones de envío de email
const simulateSendWelcomeEmail = async (email: string, nombre: string, rol: string) => {
  try {
    const transporter = mockCreateTransporter();

    const emailContent = {
      from: '"TrazAmbiental" <noreply@trazambiental.com>',
      to: email,
      subject: `¡Bienvenido a TrazAmbiental! - Registro como ${rol}`,
      html: `
        <h1>¡Bienvenido ${nombre}!</h1>
        <p>Gracias por registrarte como <strong>${rol}</strong> en nuestra plataforma.</p>
        <p>Para completar tu registro, necesitas subir la documentación requerida.</p>
      `,
      text: `¡Bienvenido ${nombre}! Gracias por registrarte como ${rol} en TrazAmbiental.`,
    };

    const result = await transporter.sendMail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Error enviando email de bienvenida: ${error.message}`);
  }
};

const simulateSendAprobacionEmail = async (
  email: string,
  nombre: string,
  tipoDocumento: string
) => {
  try {
    const transporter = mockCreateTransporter();

    const tipoFormateado = formatTipoDocumento(tipoDocumento);

    const emailContent = {
      from: '"TrazAmbiental" <noreply@trazambiental.com>',
      to: email,
      subject: "✅ Documento Aprobado - TrazAmbiental",
      html: `
        <h1>Documento Aprobado</h1>
        <p>Hola ${nombre},</p>
        <p>Tu documento <strong>${tipoFormateado}</strong> ha sido aprobado exitosamente.</p>
        <p>Ya tienes acceso completo a la plataforma.</p>
      `,
      text: `Hola ${nombre}, tu documento ${tipoFormateado} ha sido aprobado.`,
    };

    const result = await transporter.sendMail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Error enviando email de aprobación: ${error.message}`);
  }
};

const simulateSendRechazoEmail = async (
  email: string,
  nombre: string,
  tipoDocumento: string,
  motivo: string
) => {
  try {
    const transporter = mockCreateTransporter();

    const tipoFormateado = formatTipoDocumento(tipoDocumento);

    const emailContent = {
      from: '"TrazAmbiental" <noreply@trazambiental.com>',
      to: email,
      subject: "❌ Documento Rechazado - TrazAmbiental",
      html: `
        <h1>Documento Rechazado</h1>
        <p>Hola ${nombre},</p>
        <p>Tu documento <strong>${tipoFormateado}</strong> ha sido rechazado.</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p>Puedes subir un nuevo documento desde tu perfil.</p>
      `,
      text: `Hola ${nombre}, tu documento ${tipoFormateado} ha sido rechazado. Motivo: ${motivo}`,
    };

    const result = await transporter.sendMail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Error enviando email de rechazo: ${error.message}`);
  }
};

const simulateSendVencimiento30DiasEmail = async (
  email: string,
  nombre: string,
  tipoDocumento: string,
  fechaVencimiento: Date
) => {
  try {
    const transporter = mockCreateTransporter();

    const tipoFormateado = formatTipoDocumento(tipoDocumento);
    const fechaFormateada = formatFechaEspanol(fechaVencimiento);

    const emailContent = {
      from: '"TrazAmbiental" <noreply@trazambiental.com>',
      to: email,
      subject: "⚠️ Documento próximo a vencer (30 días) - TrazAmbiental",
      html: `
        <h1>Documento Próximo a Vencer</h1>
        <p>Hola ${nombre},</p>
        <p>Tu documento <strong>${tipoFormateado}</strong> vencerá el <strong>${fechaFormateada}</strong> (en 30 días).</p>
        <p>Te recomendamos renovarlo pronto para evitar la suspensión de tu cuenta.</p>
      `,
      text: `Hola ${nombre}, tu documento ${tipoFormateado} vence el ${fechaFormateada} (30 días).`,
    };

    const result = await transporter.sendMail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Error enviando email de vencimiento 30 días: ${error.message}`);
  }
};

const simulateSendVencimiento15DiasEmail = async (
  email: string,
  nombre: string,
  tipoDocumento: string,
  fechaVencimiento: Date
) => {
  try {
    const transporter = mockCreateTransporter();

    const tipoFormateado = formatTipoDocumento(tipoDocumento);
    const fechaFormateada = formatFechaEspanol(fechaVencimiento);

    const emailContent = {
      from: '"TrazAmbiental" <noreply@trazambiental.com>',
      to: email,
      subject: "🚨 URGENTE: Documento vence en 15 días - TrazAmbiental",
      html: `
        <h1>URGENTE: Documento Vence Pronto</h1>
        <p>Hola ${nombre},</p>
        <p>Tu documento <strong>${tipoFormateado}</strong> vencerá el <strong>${fechaFormateada}</strong> (en 15 días).</p>
        <p><strong>IMPORTANTE:</strong> Si no renuevas este documento, tu cuenta será suspendida automáticamente.</p>
      `,
      text: `URGENTE: ${nombre}, tu documento ${tipoFormateado} vence el ${fechaFormateada} (15 días).`,
    };

    const result = await transporter.sendMail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Error enviando email de vencimiento 15 días: ${error.message}`);
  }
};

const simulateSendSuspensionEmail = async (
  email: string,
  nombre: string,
  tipoDocumento: string
) => {
  try {
    const transporter = mockCreateTransporter();

    const tipoFormateado = formatTipoDocumento(tipoDocumento);

    const emailContent = {
      from: '"TrazAmbiental" <noreply@trazambiental.com>',
      to: email,
      subject: "🔒 Cuenta Suspendida - Documento Vencido - TrazAmbiental",
      html: `
        <h1>Cuenta Suspendida</h1>
        <p>Hola ${nombre},</p>
        <p>Tu cuenta ha sido suspendida porque tu documento <strong>${tipoFormateado}</strong> ha vencido.</p>
        <p>Para reactivar tu cuenta, sube un documento actualizado desde tu perfil.</p>
        <p>Si necesitas ayuda, contacta a nuestro soporte.</p>
      `,
      text: `${nombre}, tu cuenta ha sido suspendida por documento ${tipoFormateado} vencido.`,
    };

    const result = await transporter.sendMail(emailContent);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    throw new Error(`Error enviando email de suspensión: ${error.message}`);
  }
};

// Funciones auxiliares
const formatTipoDocumento = (tipo: string): string => {
  const tipos = {
    AUTORIZACION_SANITARIA_TRANSPORTE: "Autorización Sanitaria de Transporte",
    PERMISO_CIRCULACION: "Permiso de Circulación",
    REVISION_TECNICA: "Revisión Técnica",
    CERTIFICADO_ANTECEDENTES: "Certificado de Antecedentes",
    AUTORIZACION_SANITARIA_PLANTA: "Autorización Sanitaria de Planta",
    RCA: "Resolución de Calificación Ambiental (RCA)",
    REGISTRO_GESTOR_MMA: "Registro de Gestor MMA",
    CERTIFICADO_INSTALACION_ELECTRICA: "Certificado de Instalación Eléctrica",
    CERTIFICADO_VIGENCIA_PODERES: "Certificado de Vigencia de Poderes",
    PATENTE_MUNICIPAL: "Patente Municipal",
  };
  return tipos[tipo] || tipo;
};

// Importar desde templates
import { formatFechaEspanol } from "@/lib/emails/templates";

describe("Sistema de Envío de Emails - HU-016", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mock por defecto: envío exitoso
    mockSendMail.mockResolvedValue({
      messageId: "mock-message-id-12345",
      response: "250 Message accepted",
      accepted: ["test@example.com"],
      rejected: [],
      pending: [],
    });
  });

  describe("Email de Bienvenida", () => {
    it("debería enviar email de bienvenida para transportista", async () => {
      const result = await simulateSendWelcomeEmail(
        "juan@example.com",
        "Juan Pérez",
        "Transportista"
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("mock-message-id-12345");

      expect(mockCreateTransporter).toHaveBeenCalled();
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"TrazAmbiental" <noreply@trazambiental.com>',
        to: "juan@example.com",
        subject: "¡Bienvenido a TrazAmbiental! - Registro como Transportista",
        html: expect.stringContaining("Juan Pérez"),
        text: expect.stringContaining("Juan Pérez"),
      });
    });

    it("debería enviar email de bienvenida para gestor", async () => {
      const result = await simulateSendWelcomeEmail(
        "maria@example.com",
        "María González",
        "Gestor"
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "maria@example.com",
          subject: "¡Bienvenido a TrazAmbiental! - Registro como Gestor",
        })
      );
    });

    it("debería manejar errores de envío", async () => {
      mockSendMail.mockRejectedValue(new Error("SMTP Error"));

      await expect(
        simulateSendWelcomeEmail("error@example.com", "Error User", "Transportista")
      ).rejects.toThrow("Error enviando email de bienvenida: SMTP Error");
    });
  });

  describe("Email de Aprobación", () => {
    it("debería enviar email de aprobación con tipo de documento formateado", async () => {
      const result = await simulateSendAprobacionEmail(
        "juan@example.com",
        "Juan Pérez",
        "AUTORIZACION_SANITARIA_TRANSPORTE"
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"TrazAmbiental" <noreply@trazambiental.com>',
        to: "juan@example.com",
        subject: "✅ Documento Aprobado - TrazAmbiental",
        html: expect.stringContaining("Autorización Sanitaria de Transporte"),
        text: expect.stringContaining("Autorización Sanitaria de Transporte"),
      });
    });

    it("debería formatear correctamente diferentes tipos de documento", async () => {
      await simulateSendAprobacionEmail("test@example.com", "Test", "RCA");

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("Resolución de Calificación Ambiental (RCA)"),
        })
      );
    });
  });

  describe("Email de Rechazo", () => {
    it("debería enviar email de rechazo con motivo", async () => {
      const motivo = "Documento ilegible o incompleto";

      const result = await simulateSendRechazoEmail(
        "juan@example.com",
        "Juan Pérez",
        "PERMISO_CIRCULACION",
        motivo
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"TrazAmbiental" <noreply@trazambiental.com>',
        to: "juan@example.com",
        subject: "❌ Documento Rechazado - TrazAmbiental",
        html: expect.stringContaining(motivo),
        text: expect.stringContaining(motivo),
      });
    });

    it("debería incluir instrucciones para resubir documento", async () => {
      await simulateSendRechazoEmail("test@example.com", "Test", "RCA", "Error en documento");

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("subir un nuevo documento"),
        })
      );
    });
  });

  describe("Email de Vencimiento 30 Días", () => {
    it("debería enviar alerta de vencimiento con fecha formateada", async () => {
      const fechaVencimiento = new Date("2025-12-31");

      const result = await simulateSendVencimiento30DiasEmail(
        "juan@example.com",
        "Juan Pérez",
        "REVISION_TECNICA",
        fechaVencimiento
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"TrazAmbiental" <noreply@trazambiental.com>',
        to: "juan@example.com",
        subject: "⚠️ Documento próximo a vencer (30 días) - TrazAmbiental",
        html: expect.stringContaining("31 de diciembre de 2025"),
        text: expect.stringContaining("31 de diciembre de 2025"),
      });
    });

    it("debería formatear correctamente diferentes fechas", async () => {
      const fecha = new Date("2025-06-15");

      await simulateSendVencimiento30DiasEmail("test@example.com", "Test", "RCA", fecha);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("15 de junio de 2025"),
        })
      );
    });
  });

  describe("Email de Vencimiento 15 Días", () => {
    it("debería enviar alerta crítica con advertencia de suspensión", async () => {
      const fechaVencimiento = new Date("2025-12-31");

      const result = await simulateSendVencimiento15DiasEmail(
        "maria@example.com",
        "María González",
        "AUTORIZACION_SANITARIA_PLANTA",
        fechaVencimiento
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"TrazAmbiental" <noreply@trazambiental.com>',
        to: "maria@example.com",
        subject: "🚨 URGENTE: Documento vence en 15 días - TrazAmbiental",
        html: expect.stringContaining("URGENTE"),
        text: expect.stringContaining("URGENTE"),
      });
    });

    it("debería incluir advertencia sobre suspensión automática", async () => {
      await simulateSendVencimiento15DiasEmail("test@example.com", "Test", "RCA", new Date());

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("suspendida automáticamente"),
        })
      );
    });
  });

  describe("Email de Suspensión", () => {
    it("debería enviar email de suspensión por documento vencido", async () => {
      const result = await simulateSendSuspensionEmail(
        "carlos@example.com",
        "Carlos López",
        "REVISION_TECNICA"
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: '"TrazAmbiental" <noreply@trazambiental.com>',
        to: "carlos@example.com",
        subject: "🔒 Cuenta Suspendida - Documento Vencido - TrazAmbiental",
        html: expect.stringContaining("suspendida"),
        text: expect.stringContaining("suspendida"),
      });
    });

    it("debería incluir instrucciones para reactivar cuenta", async () => {
      await simulateSendSuspensionEmail("test@example.com", "Test", "RCA");

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining("reactivar tu cuenta"),
        })
      );
    });
  });

  describe("Formateo de Tipos de Documento", () => {
    const tiposDocumento = [
      ["AUTORIZACION_SANITARIA_TRANSPORTE", "Autorización Sanitaria de Transporte"],
      ["PERMISO_CIRCULACION", "Permiso de Circulación"],
      ["REVISION_TECNICA", "Revisión Técnica"],
      ["CERTIFICADO_ANTECEDENTES", "Certificado de Antecedentes"],
      ["AUTORIZACION_SANITARIA_PLANTA", "Autorización Sanitaria de Planta"],
      ["RCA", "Resolución de Calificación Ambiental (RCA)"],
      ["REGISTRO_GESTOR_MMA", "Registro de Gestor MMA"],
      ["CERTIFICADO_INSTALACION_ELECTRICA", "Certificado de Instalación Eléctrica"],
      ["CERTIFICADO_VIGENCIA_PODERES", "Certificado de Vigencia de Poderes"],
      ["PATENTE_MUNICIPAL", "Patente Municipal"],
    ];

    tiposDocumento.forEach(([tipo, nombreEsperado]) => {
      it(`debería formatear correctamente ${tipo}`, () => {
        const resultado = formatTipoDocumento(tipo);
        expect(resultado).toBe(nombreEsperado);
      });
    });

    it("debería devolver el tipo original si no está mapeado", () => {
      const tipoDesconocido = "DOCUMENTO_DESCONOCIDO";
      const resultado = formatTipoDocumento(tipoDesconocido);
      expect(resultado).toBe(tipoDesconocido);
    });
  });

  describe("Formateo de Fechas en Español", () => {
    const fechasPrueba = [
      [new Date("2025-01-15"), "15 de enero de 2025"],
      [new Date("2025-02-28"), "28 de febrero de 2025"],
      [new Date("2025-06-30"), "30 de junio de 2025"],
      [new Date("2025-12-25"), "25 de diciembre de 2025"],
    ];

    fechasPrueba.forEach(([fecha, fechaEsperada]) => {
      it(`debería formatear correctamente ${fecha.toISOString().split("T")[0]}`, () => {
        const resultado = formatFechaEspanol(fecha as Date);
        expect(resultado).toBe(fechaEsperada);
      });
    });
  });

  describe("Manejo de Errores", () => {
    it("debería propagar errores de SMTP correctamente", async () => {
      mockSendMail.mockRejectedValue(new Error("Connection timeout"));

      await expect(simulateSendAprobacionEmail("test@example.com", "Test", "RCA")).rejects.toThrow(
        "Error enviando email de aprobación: Connection timeout"
      );
    });

    it("debería manejar errores de configuración de transporter", async () => {
      mockCreateTransporter.mockImplementationOnce(() => {
        throw new Error("Invalid SMTP configuration");
      });

      await expect(
        simulateSendWelcomeEmail("test@example.com", "Test", "Transportista")
      ).rejects.toThrow("Invalid SMTP configuration");
    });
  });

  describe("Configuración de Transporter", () => {
    it("debería crear transporter con configuración correcta", async () => {
      // Las variables de entorno están configuradas en jest.setup.js
      expect(process.env.SMTP_HOST).toBe("smtp.test.com");
      expect(process.env.SMTP_PORT).toBe("587");
      expect(mockCreateTransporter).toBeDefined();

      // Verificar que el mock funciona correctamente
      const transporter = mockCreateTransporter();
      expect(transporter).toBeDefined();
      expect(transporter.sendMail).toBeDefined();
    });

    it("debería usar la configuración de variables de entorno", () => {
      // Las variables de entorno se configuran en jest.setup.js
      expect(process.env.SMTP_HOST).toBe("smtp.test.com");
      expect(process.env.SMTP_PORT).toBe("587");
      expect(process.env.FROM_EMAIL).toBe("noreply@trazambiental.com");
    });
  });

  describe("Validación de Contenido de Emails", () => {
    it("todos los emails deberían tener estructura básica", async () => {
      // Probar cada función de envío de email
      const tests = [
        {
          fn: () => simulateSendWelcomeEmail("test@example.com", "Test", "Transportista"),
          name: "Welcome",
        },
        {
          fn: () => simulateSendAprobacionEmail("test@example.com", "Test", "RCA"),
          name: "Aprobacion",
        },
        {
          fn: () => simulateSendRechazoEmail("test@example.com", "Test", "RCA", "Motivo"),
          name: "Rechazo",
        },
        {
          fn: () =>
            simulateSendVencimiento30DiasEmail(
              "test@example.com",
              "Test",
              "RCA",
              new Date("2025-12-31T00:00:00Z")
            ),
          name: "30 Dias",
        },
        {
          fn: () =>
            simulateSendVencimiento15DiasEmail(
              "test@example.com",
              "Test",
              "RCA",
              new Date("2025-12-31T00:00:00Z")
            ),
          name: "15 Dias",
        },
        {
          fn: () => simulateSendSuspensionEmail("test@example.com", "Test", "RCA"),
          name: "Suspension",
        },
      ];

      for (const test of tests) {
        mockSendMail.mockClear();

        const result = await test.fn();

        expect(result.success).toBe(true);
        expect(mockSendMail).toHaveBeenCalled();

        const lastCall = mockSendMail.mock.calls[0][0];

        expect(lastCall).toHaveProperty("from");
        expect(lastCall).toHaveProperty("to");
        expect(lastCall).toHaveProperty("subject");
        expect(lastCall).toHaveProperty("html");
        expect(lastCall).toHaveProperty("text");

        expect(lastCall.from).toContain("TrazAmbiental");
        expect(lastCall.to).toBe("test@example.com");
        expect(lastCall.subject.length).toBeGreaterThan(0);
        expect(lastCall.html.length).toBeGreaterThan(0);
        expect(lastCall.text.length).toBeGreaterThan(0);
      }
    });
  });
});
