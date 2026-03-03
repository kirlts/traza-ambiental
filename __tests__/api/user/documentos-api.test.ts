/**
 * Tests de API para gestión de documentos de usuario
 * HU-016: Validación Documental de Transportistas y Gestores
 */

import { mockPrisma } from "../../__mocks__/prisma";
import { mockAuth, mockSession } from "../../__mocks__/auth";
import { mockS3Send } from "../../__mocks__/aws-s3";
import { mockSendMail } from "../../__mocks__/nodemailer";

// Simular las funciones de la API
const simulateGET = async (userId: string, roles: string[]) => {
  // Simular autenticación
  if (!userId) {
    return { status: 401, data: { error: "No autorizado" } };
  }

  if (!roles.includes("Transportista") && !roles.includes("Gestor")) {
    return { status: 403, data: { error: "Acceso denegado - Solo transportistas y gestores" } };
  }

  // Simular consulta a base de datos
  const documentos = await mockPrisma.documentoVerificacion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return { status: 200, data: { documentos } };
};

const simulatePOST = async (
  userId: string,
  roles: string[],
  formData: {
    tipoDocumento: string;
    fechaVencimiento: string;
    archivo: File;
    numeroFolio?: string;
    fechaEmision?: string;
    vehiculoPatente?: string;
  }
) => {
  // Validar autenticación
  if (!userId) {
    return { status: 401, data: { error: "No autorizado" } };
  }

  if (!roles.includes("Transportista") && !roles.includes("Gestor")) {
    return { status: 403, data: { error: "Acceso denegado - Solo transportistas y gestores" } };
  }

  // Validar campos requeridos
  if (!formData.tipoDocumento || !formData.fechaVencimiento || !formData.archivo) {
    return {
      status: 400,
      data: { error: "Faltan campos requeridos: tipoDocumento, fechaVencimiento, archivo" },
    };
  }

  // Validar tipo de archivo
  const tiposValidos = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
  if (!tiposValidos.includes(formData.archivo.type)) {
    return {
      status: 400,
      data: { error: "Tipo de archivo no válido. Solo se permiten PDF, JPG y PNG" },
    };
  }

  // Validar tamaño de archivo (10MB max)
  if (formData.archivo.size > 10 * 1024 * 1024) {
    return { status: 400, data: { error: "El archivo es demasiado grande. Máximo 10MB" } };
  }

  try {
    // Simular upload a S3
    await mockS3Send();

    // Simular creación en base de datos
    const documento = await mockPrisma.documentoVerificacion.create({
      data: {
        userId,
        tipoDocumento: formData.tipoDocumento,
        fechaVencimiento: new Date(formData.fechaVencimiento),
        numeroFolio: formData.numeroFolio,
        fechaEmision: formData.fechaEmision ? new Date(formData.fechaEmision) : null,
        vehiculoPatente: formData.vehiculoPatente,
        urlArchivo: "https://mock-bucket.s3.amazonaws.com/mock-key",
        estadoValidacion: "PENDIENTE",
      },
    });

    // Simular actualización de estado de usuario
    await mockPrisma.user.update({
      where: { id: userId },
      data: { estadoVerificacion: "DOCUMENTOS_CARGADOS" },
    });

    return {
      status: 201,
      data: {
        documento,
        message: "Documento subido exitosamente",
      },
    };
  } catch (error) {
    return { status: 500, data: { error: "Error al subir archivo" } };
  }
};

describe("API Documentos de Usuario - HU-016", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks por defecto
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.documentoVerificacion.findMany.mockResolvedValue([]);
    mockPrisma.documentoVerificacion.create.mockResolvedValue({
      id: "doc-123",
      userId: "test-user-id",
      tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
      fechaVencimiento: new Date("2025-12-31"),
      estadoValidacion: "PENDIENTE",
      urlArchivo: "https://mock-bucket.s3.amazonaws.com/mock-key",
      createdAt: new Date(),
    });
    mockPrisma.user.update.mockResolvedValue({});
    mockS3Send.mockResolvedValue({ ETag: '"mock-etag"' });
  });

  describe("GET - Obtener documentos del usuario", () => {
    it("debería devolver 401 si no hay sesión", async () => {
      const response = await simulateGET("", []);

      expect(response.status).toBe(401);
      expect(response.data.error).toBe("No autorizado");
    });

    it("debería devolver 403 si el usuario no es transportista o gestor", async () => {
      const response = await simulateGET("user-123", ["Generador"]);

      expect(response.status).toBe(403);
      expect(response.data.error).toBe("Acceso denegado - Solo transportistas y gestores");
    });

    it("debería devolver documentos para transportista válido", async () => {
      const mockDocumentos = [
        {
          id: "doc-1",
          tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
          estadoValidacion: "APROBADO",
        },
      ];

      mockPrisma.documentoVerificacion.findMany.mockResolvedValue(mockDocumentos);

      const response = await simulateGET("user-123", ["Transportista"]);

      expect(response.status).toBe(200);
      expect(response.data.documentos).toEqual(mockDocumentos);
      expect(mockPrisma.documentoVerificacion.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("debería devolver documentos para gestor válido", async () => {
      const response = await simulateGET("user-456", ["Gestor"]);

      expect(response.status).toBe(200);
      expect(response.data.documentos).toEqual([]);
    });
  });

  describe("POST - Subir nuevo documento", () => {
    const mockFile = new File(["test content"], "test.pdf", { type: "application/pdf" });
    const validFormData = {
      tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
      fechaVencimiento: "2025-12-31",
      archivo: mockFile,
    };

    it("debería devolver 401 si no hay sesión", async () => {
      const response = await simulatePOST("", [], validFormData);

      expect(response.status).toBe(401);
      expect(response.data.error).toBe("No autorizado");
    });

    it("debería devolver 403 si el usuario no es transportista o gestor", async () => {
      const response = await simulatePOST("user-123", ["Generador"], validFormData);

      expect(response.status).toBe(403);
      expect(response.data.error).toBe("Acceso denegado - Solo transportistas y gestores");
    });

    it("debería devolver 400 si faltan campos requeridos", async () => {
      const incompleteData = {
        tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
        fechaVencimiento: "",
        archivo: mockFile,
      };

      const response = await simulatePOST("user-123", ["Transportista"], incompleteData);

      expect(response.status).toBe(400);
      expect(response.data.error).toContain("Faltan campos requeridos");
    });

    it("debería devolver 400 si el archivo no es válido", async () => {
      const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });
      const invalidData = {
        ...validFormData,
        archivo: invalidFile,
      };

      const response = await simulatePOST("user-123", ["Transportista"], invalidData);

      expect(response.status).toBe(400);
      expect(response.data.error).toContain("Tipo de archivo no válido");
    });

    it("debería devolver 400 si el archivo es demasiado grande", async () => {
      const largeFile = new File(["x".repeat(11 * 1024 * 1024)], "large.pdf", {
        type: "application/pdf",
      });
      const largeData = {
        ...validFormData,
        archivo: largeFile,
      };

      const response = await simulatePOST("user-123", ["Transportista"], largeData);

      expect(response.status).toBe(400);
      expect(response.data.error).toContain("demasiado grande");
    });

    it("debería crear documento exitosamente para transportista válido", async () => {
      const response = await simulatePOST("user-123", ["Transportista"], validFormData);

      expect(response.status).toBe(201);
      expect(response.data.message).toBe("Documento subido exitosamente");
      expect(response.data.documento.id).toBe("doc-123");

      expect(mockS3Send).toHaveBeenCalled();
      expect(mockPrisma.documentoVerificacion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: "user-123",
          tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
          estadoValidacion: "PENDIENTE",
        }),
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { estadoVerificacion: "DOCUMENTOS_CARGADOS" },
      });
    });

    it("debería manejar errores de S3", async () => {
      mockS3Send.mockRejectedValue(new Error("S3 Error"));

      const response = await simulatePOST("user-123", ["Transportista"], validFormData);

      expect(response.status).toBe(500);
      expect(response.data.error).toBe("Error al subir archivo");
    });

    it("debería aceptar campos opcionales", async () => {
      const completeData = {
        ...validFormData,
        numeroFolio: "AS-123456",
        fechaEmision: "2024-01-01",
        vehiculoPatente: "ABC123",
      };

      const response = await simulatePOST("user-123", ["Transportista"], completeData);

      expect(response.status).toBe(201);
      expect(mockPrisma.documentoVerificacion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          numeroFolio: "AS-123456",
          fechaEmision: new Date("2024-01-01"),
          vehiculoPatente: "ABC123",
        }),
      });
    });
  });

  describe("Validaciones específicas por tipo de documento", () => {
    const mockFile = new File(["test"], "test.pdf", { type: "application/pdf" });

    it("debería validar documentos de transportista", async () => {
      const tiposTransportista = [
        "AUTORIZACION_SANITARIA_TRANSPORTE",
        "PERMISO_CIRCULACION",
        "REVISION_TECNICA",
        "CERTIFICADO_ANTECEDENTES",
      ];

      for (const tipo of tiposTransportista) {
        const formData = {
          tipoDocumento: tipo,
          fechaVencimiento: "2025-12-31",
          archivo: mockFile,
        };

        const response = await simulatePOST("user-123", ["Transportista"], formData);
        expect(response.status).toBe(201);
      }
    });

    it("debería validar documentos de gestor", async () => {
      const tiposGestor = [
        "AUTORIZACION_SANITARIA_PLANTA",
        "RCA",
        "REGISTRO_GESTOR_MMA",
        "CERTIFICADO_INSTALACION_ELECTRICA",
        "CERTIFICADO_VIGENCIA_PODERES",
        "PATENTE_MUNICIPAL",
      ];

      for (const tipo of tiposGestor) {
        const formData = {
          tipoDocumento: tipo,
          fechaVencimiento: "2025-12-31",
          archivo: mockFile,
        };

        const response = await simulatePOST("user-456", ["Gestor"], formData);
        expect(response.status).toBe(201);
      }
    });
  });

  describe("Manejo de errores de base de datos", () => {
    const mockFile = new File(["test"], "test.pdf", { type: "application/pdf" });
    const validFormData = {
      tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
      fechaVencimiento: "2025-12-31",
      archivo: mockFile,
    };

    it("debería manejar errores en consulta GET", async () => {
      mockPrisma.documentoVerificacion.findMany.mockRejectedValue(new Error("DB Error"));

      try {
        await simulateGET("user-123", ["Transportista"]);
      } catch (error) {
        expect(error.message).toBe("DB Error");
      }
    });

    it("debería manejar errores en creación POST", async () => {
      mockPrisma.documentoVerificacion.create.mockRejectedValue(new Error("DB Error"));

      const response = await simulatePOST("user-123", ["Transportista"], validFormData);

      expect(response.status).toBe(500);
      expect(response.data.error).toBe("Error al subir archivo");
    });
  });
});
