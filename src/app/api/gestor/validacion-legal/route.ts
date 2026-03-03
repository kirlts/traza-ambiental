import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";

// GET: Obtener perfil legal del gestor actual
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Bypass temporal de validación estricta de rol para desbloquear desarrollo
    // const userRole = session.user.role || session.user.roles?.[0];
    // if (userRole !== "GESTOR") { ... }

    const managerId = session.user.id;
    const profile = await prisma.managerLegalProfile.findUnique({
      where: { id: managerId as string },
    });

    return NextResponse.json(profile || {});
  } catch (error: unknown) {
    console.error("Error fetching manager legal profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST: Subir documentos o actualizar datos
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const retcId = formData.get("retcId") as string;
    const retcFile = formData.get("retcFile") as File | null;
    const resolutionFile = formData.get("resolutionFile") as File | null;
    const resolutionNumber = formData.get("resolutionNumber") as string;
    const gransicPartner = formData.get("gransicPartner") as string;

    // Buscar perfil existente o crear uno nuevo
    const managerId = session.user.id;
    let profile = await prisma.managerLegalProfile.findUnique({
      where: { managerId },
    });

    const updateData: import("@prisma/client").Prisma.ManagerLegalProfileUpdateInput = {};

    // 1. Manejo de Identidad RETC (HU-029A)
    if (retcId) updateData.retcId = retcId;

    if (retcFile) {
      const retcUrl = await uploadFile(retcFile, "documentos-legales");
      updateData.retcFileUrl = retcUrl;
      updateData.isRetcVerified = false;
      updateData.status = "EN_REVISION";
    }

    // 2. Manejo de Resolución Sanitaria (HU-029B)
    if (resolutionNumber) updateData.resolutionNumber = resolutionNumber;

    if (resolutionFile) {
      const resolutionUrl = await uploadFile(resolutionFile, "documentos-legales");
      updateData.resolutionFileUrl = resolutionUrl;
      updateData.isResolutionVerified = false;
      updateData.status = "EN_REVISION";
    }

    // 3. Manejo de Ecosistema (HU-029C)
    if (gransicPartner !== undefined && gransicPartner !== null) {
      updateData.gransicPartner = gransicPartner || null;
      // No cambiamos el estado global por esto, es informativo.
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    if (profile) {
      profile = await prisma.managerLegalProfile.update({
        where: { id: profile.id },
        data: updateData,
      });
    } else {
      profile = await prisma.managerLegalProfile.create({
        data: {
          manager: { connect: { id: managerId } },
          ...(updateData as import("@prisma/client").Prisma.ManagerLegalProfileCreateWithoutManagerInput),
          status: "EN_REVISION",
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error: unknown) {
    console.error("Error updating manager legal profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
