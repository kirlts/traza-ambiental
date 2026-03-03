import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatearRUT } from "@/lib/validations/rut";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        { error: "No tienes permisos para acceder a esta información" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Obtener solicitud
    const solicitud = await prisma.solicitudRegistroGenerador.findUnique({
      where: { id },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // Formatear datos para la respuesta
    const solicitudFormateada = {
      ...solicitud,
      rutEmpresa: formatearRUT(solicitud.rutEmpresa),
      rutRepresentante: formatearRUT(solicitud.rutRepresentante),
      // No enviar password al cliente
      password: undefined,
    };

    return NextResponse.json(solicitudFormateada, { status: 200 });
  } catch (error: unknown) {
    console.error("Error obteniendo solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
