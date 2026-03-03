import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth-helpers";

/**
 * GET: Obtener lista de transportistas con perfiles legales para validación
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    // Solo admin puede ver esta lista
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const profiles = await prisma.carrierLegalProfile.findMany({
      include: {
        carrier: {
          select: {
            name: true,
            email: true,
            rut: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(profiles);
  } catch (error: unknown) {
    console.error("Error listando perfiles legales:", error);
    return NextResponse.json({ error: "Error interno al obtener perfiles" }, { status: 500 });
  }
}

/**
 * PATCH: Validar o Rechazar un documento o el perfil completo
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!isAdmin(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id, action, type, reason } = await request.json();
    // id: carrierLegalProfileId
    // action: 'APPROVE' | 'REJECT'
    // type: 'retc' | 'resolucion' | 'sinader' | 'global'

    const updateData: import("@prisma/client").Prisma.CarrierLegalProfileUpdateInput = {};

    if (action === "APPROVE") {
      if (type === "retc") updateData.isRetcVerified = true;
      if (type === "resolucion") updateData.isResolutionVerified = true;
      if (type === "sinader") updateData.isSinaderVerified = true;
    } else if (action === "REJECT") {
      if (type === "retc") updateData.isRetcVerified = false;
      if (type === "resolucion") updateData.isResolutionVerified = false;
      if (type === "sinader") updateData.isSinaderVerified = false;
    }

    // Verificar si podemos aprobar globalmente
    // Primero aplicamos el cambio parcial
    await prisma.carrierLegalProfile.update({
      where: { id },
      data: updateData,
    });

    // Luego leemos el estado completo para decidir el status global
    const profile = await prisma.carrierLegalProfile.findUnique({ where: { id } });

    let newGlobalStatus = profile?.status;

    if (type === "global") {
      if (action === "APPROVE") {
        // Solo aprobar globalmente si todos los checks están true
        if (
          profile?.isRetcVerified &&
          profile?.isResolutionVerified &&
          profile?.isSinaderVerified
        ) {
          newGlobalStatus = "VERIFICADO";
          updateData.rejectionReason = null;
          updateData.verifiedBy = session?.user?.id;
          updateData.verifiedAt = new Date();
        } else {
          return NextResponse.json(
            { error: "No se puede aprobar globalmente si faltan verificaciones individuales" },
            { status: 400 }
          );
        }
      } else {
        newGlobalStatus = "RECHAZADO";
        updateData.rejectionReason = reason;
      }
    } else {
      // Auto-update global status logic?
      // Si todos están verificados -> Podríamos pasar a EN_REVISION o dejarlo manual.
      // Dejemos que el botón "Aprobar Global" sea explícito.
      // Pero si rechazan uno, el global debería volver a PENDIENTE o RECHAZADO?
      if (action === "REJECT") {
        newGlobalStatus = "RECHAZADO"; // Si un doc falla, todo falla
        updateData.rejectionReason = `Documento ${type} rechazado`;
      }
    }

    if (newGlobalStatus !== profile?.status) {
      updateData.status = newGlobalStatus;
    }

    const finalProfile = await prisma.carrierLegalProfile.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, profile: finalProfile });
  } catch (error: unknown) {
    console.error("Error actualizando validación:", error);
    return NextResponse.json({ error: "Error interno al actualizar validación" }, { status: 500 });
  }
}
