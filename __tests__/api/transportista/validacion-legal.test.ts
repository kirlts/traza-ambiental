import { createMocks } from "node-mocks-http";
import { POST, GET } from "@/app/api/transportista/validacion-legal/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Mocks
jest.mock("next-auth");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    carrierLegalProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/storage", () => ({
  uploadFile: jest.fn().mockResolvedValue("https://fake-s3-url.com/file.pdf"),
  validateImageFile: jest.fn(),
}));

describe("/api/transportista/validacion-legal", () => {
  const mockSession = {
    user: { id: "user-123", email: "test@test.com" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("POST", () => {
    it("debe rechazar si no hay archivo", async () => {
      const formData = new FormData();
      formData.append("tipo", "retc");
      // Sin file

      const { req } = createMocks({
        method: "POST",
      });
      req.formData = () => Promise.resolve(formData);

      const res = await POST(req as any);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Faltan datos");
    });

    it("debe subir archivo y crear perfil si no existe", async () => {
      const formData = new FormData();
      formData.append("tipo", "retc");
      formData.append("file", new Blob(["test"], { type: "application/pdf" }));
      formData.append("metadata", JSON.stringify({ retcId: "123456" }));

      const { req } = createMocks({
        method: "POST",
      });
      req.formData = () => Promise.resolve(formData);

      // Mock findUnique -> null (no existe perfil)
      (prisma.carrierLegalProfile.findUnique as jest.Mock).mockResolvedValue(null);
      // Mock create -> new profile
      (prisma.carrierLegalProfile.create as jest.Mock).mockResolvedValue({
        id: "profile-1",
        carrierId: "user-123",
        status: "PENDIENTE",
      });
      // Mock update -> updated profile
      (prisma.carrierLegalProfile.update as jest.Mock).mockResolvedValue({
        id: "profile-1",
        retcFileUrl: "https://fake-s3-url.com/file.pdf",
        retcId: "123456",
        status: "PENDIENTE",
      });

      const res = await POST(req as any);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(prisma.carrierLegalProfile.create).toHaveBeenCalled();
      expect(prisma.carrierLegalProfile.update).toHaveBeenCalledWith({
        where: { id: "profile-1" },
        data: expect.objectContaining({
          retcId: "123456",
          isRetcVerified: false,
        }),
      });
    });
  });
});
