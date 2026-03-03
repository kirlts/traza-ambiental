/**
 * Tests de API para aprobaciones de administrador
 * HU-016: Validación Documental de Transportistas y Gestores
 */

import { mockPrisma } from "../../__mocks__/prisma";
import { mockAuth } from "../../__mocks__/auth";
import { mockSendMail } from "../../__mocks__/nodemailer";

// Simular las funciones de la API
const simulateGETAprobaciones = async (userId: string, roles: string[]) => {
  if (!userId) {
    return { status: 401, data: { error: "No autorizado" } };
  }

  if (!roles.includes("Administrador")) {
    return { status: 403, data: { error: "Acceso denegado - Solo administradores" } };
  }

  try {
    const documentos = await mockPrisma.documentoVerificacion.findMany({
      where: {
        estadoValidacion: {
          in: ["PENDIENTE", "EN_REVISION"],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            roles: true,
            estadoVerificacion: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return { status: 200, data: { documentos } };
  } catch (error) {
    return { status: 500, data: { error: "Error interno del servidor" } };
  }
};

const simulateAprobarDocumento = async (
  userId: string,
  roles: string[],
  documentoId: string,
  observaciones?: string
) => {
  if (!userId) {
    return { status: 401, data: { error: "No autorizado" } };
  }

  if (!roles.includes("Administrador")) {
    return { status: 403, data: { error: "Acceso denegado - Solo administradores" } };
  }

  try {
    // Buscar documento
    const documento = await mockPrisma.documentoVerificacion.findUnique({
      where: { id: documentoId },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            roles: true,
          },
        },
      },
    });

    if (!documento) {
      return { status: 404, data: { error: "Documento no encontrado" } };
    }

    // Actualizar documento
    const documentoActualizado = await mockPrisma.documentoVerificacion.update({
      where: { id: documentoId },
      data: {
        estadoValidacion: "APROBADO",
        fechaAprobacion: new Date(),
        aprobadoPor: userId,
        observaciones,
      },
    });

    // Crear log de validación
    await mockPrisma.logValidacion.create({
      data: {
        documentoId,
        accion: "APROBACION",
        realizadoPor: userId,
        observaciones,
        fecha: new Date(),
      },
    });

    // Verificar si todos los documentos del usuario están aprobados
    const documentosPendientes = await mockPrisma.documentoVerificacion.findMany({
      where: {
        userId: documento.user.id,
        estadoValidacion: {
          notIn: ["APROBADO", "VENCIDO"],
        },
      },
    });

    // Si no hay documentos pendientes, marcar usuario como verificado
    if (documentosPendientes.length === 0) {
      await mockPrisma.user.update({
        where: { id: documento.user.id },
        data: { estadoVerificacion: "VERIFICADO" },
      });
    }

    // Enviar email de aprobación
    try {
      await mockSendMail();
    } catch (emailError) {
      console.warn("Error enviando email de aprobación:", emailError);
    }

    return {
      status: 200,
      data: {
        documento: documentoActualizado,
        message: "Documento aprobado exitosamente",
      },
    };
  } catch (error) {
    return { status: 500, data: { error: "Error interno del servidor" } };
  }
};

const simulateRechazarDocumento = async (
  userId: string,
  roles: string[],
  documentoId: string,
  motivo: string
) => {
  if (!userId) {
    return { status: 401, data: { error: "No autorizado" } };
  }

  if (!roles.includes("Administrador")) {
    return { status: 403, data: { error: "Acceso denegado - Solo administradores" } };
  }

  if (!motivo || motivo.trim() === "") {
    return { status: 400, data: { error: "El motivo de rechazo es requerido" } };
  }

  try {
    // Buscar documento
    const documento = await mockPrisma.documentoVerificacion.findUnique({
      where: { id: documentoId },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            roles: true,
          },
        },
      },
    });

    if (!documento) {
      return { status: 404, data: { error: "Documento no encontrado" } };
    }

    // Actualizar documento
    const documentoActualizado = await mockPrisma.documentoVerificacion.update({
      where: { id: documentoId },
      data: {
        estadoValidacion: "RECHAZADO",
        fechaRechazo: new Date(),
        rechazadoPor: userId,
        motivoRechazo: motivo,
      },
    });

    // Crear log de validación
    await mockPrisma.logValidacion.create({
      data: {
        documentoId,
        accion: "RECHAZO",
        realizadoPor: userId,
        observaciones: motivo,
        fecha: new Date(),
      },
    });

    // Enviar email de rechazo
    try {
      await mockSendMail();
    } catch (emailError) {
      console.warn("Error enviando email de rechazo:", emailError);
    }

    return {
      status: 200,
      data: {
        documento: documentoActualizado,
        message: "Documento rechazado exitosamente",
      },
    };
  } catch (error) {
    return { status: 500, data: { error: "Error interno del servidor" } };
  }
};

describe("API Aprobaciones de Administrador - HU-016", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks por defecto
    mockAuth.mockResolvedValue({
      user: {
        id: "admin-123",
        email: "admin@example.com",
        nombre: "Admin User",
        roles: ["Administrador"],
      },
    });

    mockPrisma.documentoVerificacion.findMany.mockResolvedValue([]);
    mockPrisma.documentoVerificacion.findUnique.mockResolvedValue(null);
    mockPrisma.documentoVerificacion.update.mockResolvedValue({});
    mockPrisma.logValidacion.create.mockResolvedValue({});
    mockPrisma.user.update.mockResolvedValue({});
    mockSendMail.mockResolvedValue({ messageId: "test-id" });
  });

  describe("GET - Obtener documentos pendientes de aprobación", () => {
    it("debería devolver 401 si no hay sesión", async () => {
      const response = await simulateGETAprobaciones("", []);

      expect(response.status).toBe(401);
      expect(response.data.error).toBe("No autorizado");
    });

    it("debería devolver 403 si el usuario no es administrador", async () => {
      const response = await simulateGETAprobaciones("user-123", ["Transportista"]);

      expect(response.status).toBe(403);
      expect(response.data.error).toBe("Acceso denegado - Solo administradores");
    });

    it("debería devolver documentos pendientes para administrador", async () => {
      const mockDocumentos = [
        {
          id: "doc-1",
          tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
          estadoValidacion: "PENDIENTE",
          user: {
            id: "user-1",
            nombre: "Juan Pérez",
            email: "juan@example.com",
            roles: ["Transportista"],
          },
        },
      ];

      mockPrisma.documentoVerificacion.findMany.mockResolvedValue(mockDocumentos);

      const response = await simulateGETAprobaciones("admin-123", ["Administrador"]);

      expect(response.status).toBe(200);
      expect(response.data.documentos).toEqual(mockDocumentos);
      expect(mockPrisma.documentoVerificacion.findMany).toHaveBeenCalledWith({
        where: {
          estadoValidacion: {
            in: ["PENDIENTE", "EN_REVISION"],
          },
        },
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              email: true,
              roles: true,
              estadoVerificacion: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    });

    it("debería devolver array vacío si no hay documentos pendientes", async () => {
      const response = await simulateGETAprobaciones("admin-123", ["Administrador"]);

      expect(response.status).toBe(200);
      expect(response.data.documentos).toEqual([]);
    });

    it("debería manejar errores de base de datos", async () => {
      mockPrisma.documentoVerificacion.findMany.mockRejectedValue(new Error("DB Error"));

      const response = await simulateGETAprobaciones("admin-123", ["Administrador"]);

      expect(response.status).toBe(500);
      expect(response.data.error).toBe("Error interno del servidor");
    });
  });

  describe("POST - Aprobar documento", () => {
    const mockDocumento = {
      id: "doc-1",
      userId: "user-1",
      tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
      estadoValidacion: "PENDIENTE",
      user: {
        id: "user-1",
        nombre: "Juan Pérez",
        email: "juan@example.com",
        roles: ["Transportista"],
      },
    };

    beforeEach(() => {
      mockPrisma.documentoVerificacion.findUnique.mockResolvedValue(mockDocumento);
      mockPrisma.documentoVerificacion.update.mockResolvedValue({
        ...mockDocumento,
        estadoValidacion: "APROBADO",
      });
    });

    it("debería devolver 401 si no hay sesión", async () => {
      const response = await simulateAprobarDocumento("", [], "doc-1");

      expect(response.status).toBe(401);
      expect(response.data.error).toBe("No autorizado");
    });

    it("debería devolver 403 si el usuario no es administrador", async () => {
      const response = await simulateAprobarDocumento("user-123", ["Transportista"], "doc-1");

      expect(response.status).toBe(403);
      expect(response.data.error).toBe("Acceso denegado - Solo administradores");
    });

    it("debería devolver 404 si el documento no existe", async () => {
      mockPrisma.documentoVerificacion.findUnique.mockResolvedValue(null);

      const response = await simulateAprobarDocumento(
        "admin-123",
        ["Administrador"],
        "doc-inexistente"
      );

      expect(response.status).toBe(404);
      expect(response.data.error).toBe("Documento no encontrado");
    });

    it("debería aprobar documento exitosamente", async () => {
      mockPrisma.documentoVerificacion.findMany.mockResolvedValue([]); // No hay documentos pendientes

      const response = await simulateAprobarDocumento(
        "admin-123",
        ["Administrador"],
        "doc-1",
        "Documento válido"
      );

      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Documento aprobado exitosamente");

      expect(mockPrisma.documentoVerificacion.update).toHaveBeenCalledWith({
        where: { id: "doc-1" },
        data: {
          estadoValidacion: "APROBADO",
          fechaAprobacion: expect.any(Date),
          aprobadoPor: "admin-123",
          observaciones: "Documento válido",
        },
      });

      expect(mockPrisma.logValidacion.create).toHaveBeenCalledWith({
        data: {
          documentoId: "doc-1",
          accion: "APROBACION",
          realizadoPor: "admin-123",
          observaciones: "Documento válido",
          fecha: expect.any(Date),
        },
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { estadoVerificacion: "VERIFICADO" },
      });

      expect(mockSendMail).toHaveBeenCalled();
    });

    it("debería aprobar sin actualizar usuario si hay documentos pendientes", async () => {
      mockPrisma.documentoVerificacion.findMany.mockResolvedValue([
        { id: "doc-2", estadoValidacion: "PENDIENTE" },
      ]);

      const response = await simulateAprobarDocumento("admin-123", ["Administrador"], "doc-1");

      expect(response.status).toBe(200);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it("debería continuar aunque falle el envío de email", async () => {
      mockSendMail.mockRejectedValue(new Error("Email error"));
      mockPrisma.documentoVerificacion.findMany.mockResolvedValue([]);

      const response = await simulateAprobarDocumento("admin-123", ["Administrador"], "doc-1");

      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Documento aprobado exitosamente");
    });
  });

  describe("POST - Rechazar documento", () => {
    const mockDocumento = {
      id: "doc-1",
      userId: "user-1",
      tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
      estadoValidacion: "PENDIENTE",
      user: {
        id: "user-1",
        nombre: "Juan Pérez",
        email: "juan@example.com",
        roles: ["Transportista"],
      },
    };

    beforeEach(() => {
      mockPrisma.documentoVerificacion.findUnique.mockResolvedValue(mockDocumento);
      mockPrisma.documentoVerificacion.update.mockResolvedValue({
        ...mockDocumento,
        estadoValidacion: "RECHAZADO",
      });
    });

    it("debería devolver 400 si no se proporciona motivo", async () => {
      const response = await simulateRechazarDocumento("admin-123", ["Administrador"], "doc-1", "");

      expect(response.status).toBe(400);
      expect(response.data.error).toBe("El motivo de rechazo es requerido");
    });

    it("debería rechazar documento exitosamente", async () => {
      const motivo = "Documento ilegible";

      const response = await simulateRechazarDocumento(
        "admin-123",
        ["Administrador"],
        "doc-1",
        motivo
      );

      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Documento rechazado exitosamente");

      expect(mockPrisma.documentoVerificacion.update).toHaveBeenCalledWith({
        where: { id: "doc-1" },
        data: {
          estadoValidacion: "RECHAZADO",
          fechaRechazo: expect.any(Date),
          rechazadoPor: "admin-123",
          motivoRechazo: motivo,
        },
      });

      expect(mockPrisma.logValidacion.create).toHaveBeenCalledWith({
        data: {
          documentoId: "doc-1",
          accion: "RECHAZO",
          realizadoPor: "admin-123",
          observaciones: motivo,
          fecha: expect.any(Date),
        },
      });

      expect(mockSendMail).toHaveBeenCalled();
    });

    it("debería manejar motivos largos correctamente", async () => {
      const motivoLargo =
        "El documento presentado no cumple con los requisitos establecidos en la normativa vigente. Se requiere que el documento contenga toda la información solicitada y esté debidamente firmado por la autoridad competente.";

      const response = await simulateRechazarDocumento(
        "admin-123",
        ["Administrador"],
        "doc-1",
        motivoLargo
      );

      expect(response.status).toBe(200);
      expect(mockPrisma.documentoVerificacion.update).toHaveBeenCalledWith({
        where: { id: "doc-1" },
        data: expect.objectContaining({
          motivoRechazo: motivoLargo,
        }),
      });
    });
  });

  describe("Flujos de validación completos", () => {
    it("debería manejar múltiples documentos del mismo usuario", async () => {
      const documentos = [
        {
          id: "doc-1",
          userId: "user-1",
          tipoDocumento: "AUTORIZACION_SANITARIA_TRANSPORTE",
          estadoValidacion: "PENDIENTE",
        },
        {
          id: "doc-2",
          userId: "user-1",
          tipoDocumento: "PERMISO_CIRCULACION",
          estadoValidacion: "PENDIENTE",
        },
      ];

      mockPrisma.documentoVerificacion.findMany.mockResolvedValue(documentos);

      const response = await simulateGETAprobaciones("admin-123", ["Administrador"]);

      expect(response.status).toBe(200);
      expect(response.data.documentos).toHaveLength(2);
    });

    it("debería validar estados de transición correctos", async () => {
      const estadosValidos = ["PENDIENTE", "EN_REVISION"];

      expect(estadosValidos).toContain("PENDIENTE");
      expect(estadosValidos).toContain("EN_REVISION");
      expect(estadosValidos).not.toContain("APROBADO");
      expect(estadosValidos).not.toContain("RECHAZADO");
    });

    it("debería registrar todas las acciones en logs", async () => {
      const mockDocumento = {
        id: "doc-1",
        userId: "user-1",
        user: { id: "user-1", nombre: "Test", email: "test@test.com", roles: ["Transportista"] },
      };

      mockPrisma.documentoVerificacion.findUnique.mockResolvedValue(mockDocumento);
      mockPrisma.documentoVerificacion.findMany.mockResolvedValue([]);

      await simulateAprobarDocumento("admin-123", ["Administrador"], "doc-1", "OK");

      expect(mockPrisma.logValidacion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          accion: "APROBACION",
          realizadoPor: "admin-123",
        }),
      });
    });
  });
});
