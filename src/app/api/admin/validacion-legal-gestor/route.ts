import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Listar gestores y su estado de validación legal
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Bypass temporal para desarrollo - Permitir si hay sesión válida
    // const userRole = session.user.role || session.user.roles?.[0];
    // if (userRole !== "ADMIN") { ... }

    const profiles = await prisma.managerLegalProfile.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            rut: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(profiles);
  } catch (error: unknown) {
    console.error("Error fetching manager profiles:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PATCH: Aprobar o Rechazar validaciones (Nivel 1, 2, 3)
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Bypass temporal
    // if (session.user.role !== "ADMIN") ...

    const body = await req.json();
    const { profileId, action, field, rejectionReason, authorizedCapacity } = body;

    if (!profileId || !action) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const updateData: import("@prisma/client").Prisma.ManagerLegalProfileUpdateInput = {
      verifiedBy: session.user.id,
      verifiedAt: new Date(),
    };

    if (action === "APPROVE") {
      if (field === "RETC") {
        updateData.isRetcVerified = true;
      } else if (field === "RESOLUTION") {
        updateData.isResolutionVerified = true;
        // HU-029B: Al aprobar resolución, se debe guardar la capacidad autorizada
        if (authorizedCapacity) {
          updateData.authorizedCapacity = parseFloat(authorizedCapacity);
        }
      }
    } else if (action === "REJECT") {
      if (field === "RETC") {
        updateData.isRetcVerified = false;
        // updateData.retcFileUrl = null; // Opcional: mantener archivo para referencia
      } else if (field === "RESOLUTION") {
        updateData.isResolutionVerified = false;
        // updateData.resolutionFileUrl = null;
      }
      updateData.status = "RECHAZADO";
      updateData.rejectionReason =
        rejectionReason || "Documentación rechazada por el administrador.";
    }

    // Verificar si cumple todo para pasar a VERIFICADO globalmente
    const currentProfile = await prisma.managerLegalProfile.findUnique({
      where: { id: profileId },
    });

    // Determinar el nuevo estado de cada flag
    const newIsRetcOk = field === "RETC" ? action === "APPROVE" : currentProfile?.isRetcVerified;
    const newIsResOk =
      field === "RESOLUTION" ? action === "APPROVE" : currentProfile?.isResolutionVerified;

    if (newIsRetcOk && newIsResOk) {
      updateData.status = "VERIFICADO";
      updateData.rejectionReason = null; // Limpiar motivo de rechazo si todo está OK
    } else if (action === "APPROVE" && updateData.status !== "RECHAZADO") {
      // Si aprobamos algo pero falta lo otro, sigue en revisión (si no estaba rechazado antes)
      updateData.status = "EN_REVISION";
    }

    const updatedProfile = await prisma.managerLegalProfile.update({
      where: { id: profileId },
      data: updateData,
    });

    return NextResponse.json(updatedProfile);
  } catch (error: unknown) {
    console.error("Error updating manager profile:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
