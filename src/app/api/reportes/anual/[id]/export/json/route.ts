import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role) => ["Sistema de Gestión", "Productor"].includes(role));
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Obtener reporte
    const reporte = await prisma.reporteAnual.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!reporte) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    }

    // Verificar permisos de acceso al reporte
    if (userRoles.includes("Sistema de Gestión")) {
      if (reporte.sistemaGestionId !== session.user.id) {
        return NextResponse.json({ error: "No tiene acceso a este reporte" }, { status: 403 });
      }
    }

    // Formatear respuesta JSON completa
    const jsonData = {
      metadata: {
        id: reporte.id,
        folio: reporte.folio,
        anio: reporte.anio,
        estado: reporte.estado,
        fechaGeneracion: reporte.createdAt,
        fechaEnvio: null,
        fechaAprobacion: null,
        codigoVerificacion: reporte.codigoVerificacion,
        generadoPor: {
          id: reporte.usuario.id,
          name: reporte.usuario.name,
          email: reporte.usuario.email,
        },
        sistemaGestion: reporte.usuario
          ? {
              id: reporte.usuario.id,
              name: reporte.usuario.name,
              email: reporte.usuario.email,
            }
          : null,
        observaciones: reporte.observaciones,
        documentosAdjuntos: reporte.documentosAdjuntos,
      },
      datos: reporte.datosReporte,
      archivos: {
        pdf: null,
        csv: null,
        excel: null,
        json: null,
      },
    };

    return new NextResponse(JSON.stringify(jsonData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="reporte-anual-${reporte.anio}-${reporte.folio}.json"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error en /api/reportes/anual/[id]/export/json:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
