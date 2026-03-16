import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import { POST } from "@/app/api/gestor/validacion-legal/route";

// Mocks
jest.mock("next-auth");
jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    managerLegalProfile: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));
jest.mock("@/lib/storage");

// Mock completo de NextResponse para evitar dependencias de Next.js
const mockJson = jest.fn((body, init) => ({
  status: init?.status || 200,
  body,
  json: () => Promise.resolve(body),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init: any) => mockJson(body, init),
  },
  NextRequest: class {
    constructor(
      public url: string,
      public init?: any
    ) {}
    formData() {
      return Promise.resolve(this.init?.formData);
    }
  },
}));

describe("/api/gestor/validacion-legal POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper para crear request
  const createMockRequest = (formData: FormData) => {
    // Usamos any para bypassear tipos estrictos de NextRequest en test
    return {
      formData: () => Promise.resolve(formData),
      url: "http://localhost:3000/api/gestor/validacion-legal",
    } as any;
  };

  it("debe rechazar acceso si no es GESTOR", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { role: "TRANSPORTISTA" },
    });

    const formData = new FormData();
    const req = createMockRequest(formData);

    const res: any = await POST(req);
    expect(res.status).toBe(401);
  });

  it("debe crear perfil legal si no existe al subir RETC", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { role: "GESTOR", id: "gestor-123" },
    });
    (prisma.managerLegalProfile.findUnique as jest.Mock).mockResolvedValue(null);
    (uploadFile as jest.Mock).mockResolvedValue("https://fake-url.com/file.pdf");
    (prisma.managerLegalProfile.create as jest.Mock).mockResolvedValue({
      id: "profile-1",
      retcId: "123456",
      retcFileUrl: "https://fake-url.com/file.pdf",
    });

    const formData = new FormData();
    formData.append("retcId", "123456");
    formData.append("retcFile", new Blob(["fake content"]), "doc.pdf");

    const req = createMockRequest(formData);

    const res: any = await POST(req);

    expect(res.status).toBe(200);
    expect(prisma.managerLegalProfile.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        manager: { connect: { id: "gestor-123" } },
        retcId: "123456",
        retcFileUrl: "https://fake-url.com/file.pdf",
        status: "EN_REVISION",
        isRetcVerified: false,
      }),
    });
  });

  it("debe actualizar perfil existente y resetear verificación si sube nuevo archivo", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { role: "GESTOR", id: "gestor-123" },
    });

    // Perfil existente validado
    (prisma.managerLegalProfile.findUnique as jest.Mock).mockResolvedValue({
      id: "profile-1",
      isRetcVerified: true,
      status: "VERIFICADO",
    });

    (uploadFile as jest.Mock).mockResolvedValue("https://new-url.com/file.pdf");
    (prisma.managerLegalProfile.update as jest.Mock).mockResolvedValue({});

    const formData = new FormData();
    formData.append("retcId", "654321");
    formData.append("retcFile", new Blob(["new content"]), "new.pdf");

    const req = createMockRequest(formData);

    await POST(req);

    expect(prisma.managerLegalProfile.update).toHaveBeenCalledWith({
      where: { id: "profile-1" },
      data: expect.objectContaining({
        retcId: "654321",
        retcFileUrl: "https://new-url.com/file.pdf",
        isRetcVerified: false, // Reset verificación
        status: "EN_REVISION",
      }),
    });
  });
});
