import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { enviarEmailRechazo } from "@/lib/helpers/email";
import { z } from "zod";

const rechazarSchema = z.object({
  motivo: z.string().min(10, "El motivo debe tener al menos 10 caracteres"),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que sea Administrador o Especialista
    const roles = session.user.roles || [];
    const esAdminOEspecialista =
      roles.includes("Administrador") || roles.includes("Especialista Sistema Gestión");

    if (!esAdminOEspecialista) {
      return NextResponse.json(
        { error: "No tienes permisos para realizar esta acción" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validar motivo de rechazo
    const validacion = rechazarSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        {
          error: "Motivo de rechazo inválido",
          detalles: validacion.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { motivo } = validacion.data;

    // Obtener solicitud
    const solicitud = await prisma.solicitudRegistroGenerador.findUnique({
      where: { id },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    if (solicitud.estado !== "pendiente") {
      return NextResponse.json(
        { error: `Esta solicitud ya fue ${solicitud.estado}` },
        { status: 400 }
      );
    }

    // Actualizar solicitud
    const solicitudActualizada = await prisma.solicitudRegistroGenerador.update({
      where: { id },
      data: {
        estado: "rechazada",
        motivoRechazo: motivo,
        fechaRevision: new Date(),
        revisadoPor: session.user.id,
      },
    });

    // Enviar email de rechazo (no bloquear si falla)
    enviarEmailRechazo(solicitud.email, solicitud.razonSocial, motivo).catch((error: unknown) => {
      console.error("Error enviando email de rechazo:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Solicitud rechazada",
        solicitud: {
          id: solicitudActualizada.id,
          estado: solicitudActualizada.estado,
          motivoRechazo: solicitudActualizada.motivoRechazo,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error rechazando solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
