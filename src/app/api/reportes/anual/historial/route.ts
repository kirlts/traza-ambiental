import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role: string) =>
      ["Sistema de Gestión", "Productor"].includes(role)
    );
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    // Determinar sistemaGestionId según el rol
    let sistemaGestionId: string;
    if (userRoles.includes("Sistema de Gestión")) {
      sistemaGestionId = session.user.id;
    } else if (userRoles.includes("Productor")) {
      // Para productores, usar su propio ID como sistemaGestionId
      sistemaGestionId = session.user.id;
    } else {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    // Obtener reportes del usuario/sistema

    try {
      const reportes = await prisma.reporteAnual.findMany({
        where: {
          sistemaGestionId,
        },
        include: {
          usuario: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Formatear respuesta
      const reportesFormateados = reportes.map((reporte: ReturnType<typeof JSON.parse>) => ({
        id: reporte.id,
        folio: reporte.folio,
        anio: reporte.anio,
        estado: reporte.estado,
        fechaGeneracion: reporte.createdAt,
        fechaEnvio: null,
        fechaAprobacion: null,
        generadoPor: reporte.usuario
          ? {
              id: reporte.usuario.id,
              name: reporte.usuario.name,
              email: reporte.usuario.email,
            }
          : null,
        sistemaGestion: reporte.usuario
          ? {
              id: reporte.usuario.id,
              name: reporte.usuario.name,
              email: reporte.usuario.email,
            }
          : null,
        tienePdf: false,
        tieneCsv: false,
        tieneExcel: false,
        tieneJson: false,
        codigoVerificacion: reporte.codigoVerificacion,
      }));

      return NextResponse.json({
        reportes: reportesFormateados,
      });
    } catch (dbError: unknown) {
      console.error("❌ Error en query de Prisma:", dbError);
      throw dbError;
    }
  } catch (error: unknown) {
    console.error("Error en /api/reportes/anual/historial:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido",
        details:
          process.env.NODE_ENV === "development"
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
