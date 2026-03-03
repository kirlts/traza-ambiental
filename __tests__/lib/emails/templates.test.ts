/**
 * Tests unitarios para templates de email
 * HU-016: Validación Documental de Transportistas y Gestores
 */

import {
  getWelcomeEmailTemplate,
  getAprobacionEmailTemplate,
  getRechazoEmailTemplate,
  getVencimiento30DiasEmailTemplate,
  getVencimiento15DiasEmailTemplate,
  getSuspensionEmailTemplate,
  formatTipoDocumento,
} from "@/lib/emails/templates";

describe("Templates de Email - HU-016", () => {
  describe("formatTipoDocumento", () => {
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

  describe("getWelcomeEmailTemplate", () => {
    it("debería generar template de bienvenida para transportista", () => {
      const template = getWelcomeEmailTemplate("Juan Pérez", "Transportista");

      expect(template.subject).toContain("Bienvenido");
      expect(template.subject).toContain("Transportista");
      expect(template.html).toContain("Juan Pérez");
      expect(template.html).toContain("Transportista");
      expect(template.text).toContain("Juan Pérez");
      expect(template.text).toContain("documentación requerida");
    });

    it("debería generar template de bienvenida para gestor", () => {
      const template = getWelcomeEmailTemplate("María González", "Gestor");

      expect(template.subject).toContain("Bienvenido");
      expect(template.subject).toContain("Gestor");
      expect(template.html).toContain("María González");
      expect(template.html).toContain("Gestor");
      expect(template.text).toContain("María González");
    });

    it("debería incluir información sobre documentación requerida", () => {
      const template = getWelcomeEmailTemplate("Test User", "Transportista");

      expect(template.html).toContain("documentos");
      expect(template.html).toContain("verificación");
      expect(template.text).toContain("documentos");
    });
  });

  describe("getAprobacionEmailTemplate", () => {
    it("debería generar template de aprobación", () => {
      const template = getAprobacionEmailTemplate(
        "Juan Pérez",
        "AUTORIZACION_SANITARIA_TRANSPORTE"
      );

      expect(template.subject).toContain("Aprobado");
      expect(template.html).toContain("Juan Pérez");
      expect(template.html).toContain("Autorización Sanitaria de Transporte");
      expect(template.html).toContain("aprobado");
      expect(template.text).toContain("aprobado");
    });

    it("debería incluir información sobre próximos pasos", () => {
      const template = getAprobacionEmailTemplate("Test User", "REVISION_TECNICA");

      expect(template.html).toContain("acceso completo");
      expect(template.text).toContain("plataforma");
    });

    it("debería formatear correctamente diferentes tipos de documento", () => {
      const template = getAprobacionEmailTemplate("Test User", "RCA");

      expect(template.html).toContain("Resolución de Calificación Ambiental (RCA)");
    });
  });

  describe("getRechazoEmailTemplate", () => {
    it("debería generar template de rechazo con motivo", () => {
      const motivo = "Documento ilegible o incompleto";
      const template = getRechazoEmailTemplate("Juan Pérez", "PERMISO_CIRCULACION", motivo);

      expect(template.subject).toContain("Rechazado");
      expect(template.html).toContain("Juan Pérez");
      expect(template.html).toContain("Permiso de Circulación");
      expect(template.html).toContain(motivo);
      expect(template.html).toContain("rechazado");
      expect(template.text).toContain(motivo);
    });

    it("debería incluir instrucciones para resubir documento", () => {
      const template = getRechazoEmailTemplate(
        "Test User",
        "CERTIFICADO_ANTECEDENTES",
        "Documento vencido"
      );

      expect(template.html).toContain("nuevo documento");
      expect(template.html).toContain("perfil");
      expect(template.text).toContain("subir");
    });

    it("debería manejar motivos largos correctamente", () => {
      const motivoLargo =
        "El documento presentado no cumple con los requisitos establecidos en la normativa vigente. Se requiere que el documento contenga toda la información solicitada y esté debidamente firmado por la autoridad competente.";

      const template = getRechazoEmailTemplate("Test User", "RCA", motivoLargo);

      expect(template.html).toContain(motivoLargo);
      expect(template.text).toContain(motivoLargo);
    });
  });

  describe("getVencimiento30DiasEmailTemplate", () => {
    it("debería generar template de alerta de 30 días", () => {
      const fechaVencimiento = new Date("2025-12-31");
      const template = getVencimiento30DiasEmailTemplate(
        "Juan Pérez",
        "REVISION_TECNICA",
        fechaVencimiento
      );

      expect(template.subject).toContain("30 días");
      expect(template.subject).toContain("vencer");
      expect(template.html).toContain("Juan Pérez");
      expect(template.html).toContain("Revisión Técnica");
      expect(template.html).toContain("30 días");
      expect(template.html).toContain("31 de diciembre de 2025");
      expect(template.text).toContain("30 días");
    });

    it("debería formatear correctamente diferentes fechas", () => {
      const fecha = new Date("2025-06-15");
      const template = getVencimiento30DiasEmailTemplate(
        "Test User",
        "AUTORIZACION_SANITARIA_TRANSPORTE",
        fecha
      );

      expect(template.html).toContain("15 de junio de 2025");
    });

    it("debería incluir instrucciones para renovar documento", () => {
      const template = getVencimiento30DiasEmailTemplate(
        "Test User",
        "PERMISO_CIRCULACION",
        new Date("2025-12-31")
      );

      expect(template.html).toContain("renovar");
      expect(template.html).toContain("actualizar");
      expect(template.text).toContain("renovar");
    });
  });

  describe("getVencimiento15DiasEmailTemplate", () => {
    it("debería generar template de alerta crítica de 15 días", () => {
      const fechaVencimiento = new Date("2025-12-31");
      const template = getVencimiento15DiasEmailTemplate(
        "María González",
        "AUTORIZACION_SANITARIA_PLANTA",
        fechaVencimiento
      );

      expect(template.subject).toContain("URGENTE");
      expect(template.subject).toContain("15 días");
      expect(template.html).toContain("María González");
      expect(template.html).toContain("Autorización Sanitaria de Planta");
      expect(template.html).toContain("URGENTE");
      expect(template.html).toContain("15 días");
      expect(template.html).toContain("suspendida");
      expect(template.text).toContain("URGENTE");
    });

    it("debería incluir advertencia sobre suspensión", () => {
      const template = getVencimiento15DiasEmailTemplate(
        "Test User",
        "RCA",
        new Date("2025-12-31")
      );

      expect(template.html).toContain("suspendida");
      expect(template.html).toContain("inmediatamente");
      expect(template.text).toContain("suspendida");
    });
  });

  describe("getSuspensionEmailTemplate", () => {
    it("debería generar template de suspensión", () => {
      const template = getSuspensionEmailTemplate("Carlos López", "REVISION_TECNICA");

      expect(template.subject).toContain("Suspendida");
      expect(template.subject).toContain("Vencido");
      expect(template.html).toContain("Carlos López");
      expect(template.html).toContain("Revisión Técnica");
      expect(template.html).toContain("suspendida");
      expect(template.html).toContain("vencido");
      expect(template.text).toContain("suspendida");
    });

    it("debería incluir instrucciones para reactivar cuenta", () => {
      const template = getSuspensionEmailTemplate("Test User", "AUTORIZACION_SANITARIA_TRANSPORTE");

      expect(template.html).toContain("reactivar");
      expect(template.html).toContain("actualizado");
      expect(template.text).toContain("reactivar");
    });

    it("debería incluir información de contacto", () => {
      const template = getSuspensionEmailTemplate("Test User", "PERMISO_CIRCULACION");

      expect(template.html).toContain("soporte");
      expect(template.text).toContain("contacto");
    });
  });

  describe("Estructura de templates", () => {
    it("todos los templates deberían tener subject, html y text", () => {
      const templates = [
        getWelcomeEmailTemplate("Test", "Transportista"),
        getAprobacionEmailTemplate("Test", "RCA"),
        getRechazoEmailTemplate("Test", "RCA", "Motivo"),
        getVencimiento30DiasEmailTemplate("Test", "RCA", new Date()),
        getVencimiento15DiasEmailTemplate("Test", "RCA", new Date()),
        getSuspensionEmailTemplate("Test", "RCA"),
      ];

      templates.forEach((template) => {
        expect(template).toHaveProperty("subject");
        expect(template).toHaveProperty("html");
        expect(template).toHaveProperty("text");

        expect(typeof template.subject).toBe("string");
        expect(typeof template.html).toBe("string");
        expect(typeof template.text).toBe("string");

        expect(template.subject.length).toBeGreaterThan(0);
        expect(template.html.length).toBeGreaterThan(0);
        expect(template.text.length).toBeGreaterThan(0);
      });
    });

    it("templates HTML deberían contener estructura básica", () => {
      const template = getAprobacionEmailTemplate("Test", "RCA");

      expect(template.html).toContain("TrazAmbiental");
      expect(template.html).toContain("<!DOCTYPE");
      expect(template.html).toContain("<html");
      expect(template.html).toContain("</html>");
    });

    it("templates text deberían ser legibles sin HTML", () => {
      const template = getRechazoEmailTemplate("Test", "RCA", "Motivo");

      expect(template.text).not.toContain("<");
      expect(template.text).not.toContain(">");
      expect(template.text).toContain("TrazAmbiental");
    });
  });

  describe("Formateo de fechas en español", () => {
    const fechasPrueba = [
      [new Date("2025-01-15"), "enero"],
      [new Date("2025-02-28"), "febrero"],
      [new Date("2025-03-10"), "marzo"],
      [new Date("2025-04-05"), "abril"],
      [new Date("2025-05-20"), "mayo"],
      [new Date("2025-06-30"), "junio"],
      [new Date("2025-07-04"), "julio"],
      [new Date("2025-08-15"), "agosto"],
      [new Date("2025-09-22"), "septiembre"],
      [new Date("2025-10-31"), "octubre"],
      [new Date("2025-11-11"), "noviembre"],
      [new Date("2025-12-25"), "diciembre"],
    ];

    fechasPrueba.forEach(([fecha, mesEsperado]) => {
      it(`debería formatear correctamente ${mesEsperado}`, () => {
        const template = getVencimiento30DiasEmailTemplate("Test", "RCA", fecha as Date);

        expect(template.html).toContain(mesEsperado);
      });
    });
  });

  describe("Personalización por rol", () => {
    it("debería personalizar contenido para transportistas", () => {
      const template = getWelcomeEmailTemplate("Juan Transportista", "Transportista");

      expect(template.html).toContain("transporte");
      expect(template.html).toContain("vehículo");
    });

    it("debería personalizar contenido para gestores", () => {
      const template = getWelcomeEmailTemplate("María Gestora", "Gestor");

      expect(template.html).toContain("gestión");
      expect(template.html).toContain("planta");
    });
  });

  describe("Validación de caracteres especiales", () => {
    it("debería manejar nombres con caracteres especiales", () => {
      const nombreConAcentos = "José María Ñuñez";
      const template = getAprobacionEmailTemplate(nombreConAcentos, "RCA");

      expect(template.html).toContain(nombreConAcentos);
      expect(template.text).toContain(nombreConAcentos);
    });

    it("debería manejar motivos con caracteres especiales", () => {
      const motivoConAcentos = "Documentación incompleta según normativa vigente";
      const template = getRechazoEmailTemplate("Test", "RCA", motivoConAcentos);

      expect(template.html).toContain(motivoConAcentos);
      expect(template.text).toContain(motivoConAcentos);
    });
  });
});
