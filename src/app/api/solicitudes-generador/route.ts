import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatearRUT } from "@/lib/validations/rut";

export async function GET(request: NextRequest) {
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

    // Obtener parámetros de filtro
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado") || "pendiente";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Construir filtros
    const where: { estado?: string } = {};
    if (estado && estado !== "todas") {
      where.estado = estado;
    }

    // Obtener solicitudes
    const [solicitudes, total] = await Promise.all([
      prisma.solicitudRegistroGenerador.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.solicitudRegistroGenerador.count({ where }),
    ]);

    // Formatear datos para la respuesta
    const solicitudesFormateadas = solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => ({
      ...solicitud,
      rutEmpresa: formatearRUT(solicitud.rutEmpresa),
      rutRepresentante: formatearRUT(solicitud.rutRepresentante),
      // No enviar password al cliente
      password: undefined,
    }));

    return NextResponse.json(
      {
        solicitudes: solicitudesFormateadas,
        total,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error obteniendo solicitudes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
