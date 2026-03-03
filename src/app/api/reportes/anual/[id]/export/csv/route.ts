import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReporteAnualData, ReporteResumenEjecutivo } from "@/types/api";

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
    const { searchParams } = new URL(request.url);
    const separador = searchParams.get("separador") || ",";

    // Obtener reporte
    const reporte = await prisma.reporteAnual.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
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

    // Obtener datos del reporte
    const datosReporte = reporte.datosReporte as unknown as ReporteAnualData;
    const desgloseTratamiento = datosReporte?.desgloseTratamiento || [];
    const resumenEjecutivo = datosReporte?.resumenEjecutivo || ({} as ReporteResumenEjecutivo);

    // Generar CSV formato SINADER
    // Estructura: Periodo,TipoNeumatico,PesoRecolectado,PesoValorizado,TipoTratamiento,PorcentajeTotal,EstadoCumplimiento

    const headers = [
      "Periodo",
      "TipoNeumatico",
      "PesoRecolectado",
      "PesoValorizado",
      "TipoTratamiento",
      "PorcentajeTotal",
      "EstadoCumplimiento",
    ];

    const rows: string[] = [];

    // Para cada tratamiento, crear una fila
    // Por simplicidad, usamos "Categoría Mixta" como tipo de neumático
    // En una implementación completa, esto se desglosaría por categoría
    desgloseTratamiento.forEach((tratamiento: ReturnType<typeof JSON.parse>) => {
      const pesoRecolectado = (tratamiento.peso * 1000).toFixed(2); // Convertir a kg
      const pesoValorizado = (tratamiento.peso * 1000).toFixed(2);
      const estadoCumplimiento = resumenEjecutivo.cumplido ? "Cumplido" : "No Cumplido";

      rows.push(
        [
          reporte.anio.toString(),
          "Categoría Mixta", // En el futuro, esto debería desglosarse por categoría
          pesoRecolectado,
          pesoValorizado,
          tratamiento.tipo,
          tratamiento.porcentaje.toFixed(2),
          estadoCumplimiento,
        ].join(separador)
      );
    });

    // Si no hay tratamientos, crear una fila con totales
    if (rows.length === 0 && datosReporte.totalToneladas > 0) {
      const totalKg = (datosReporte.totalToneladas * 1000).toFixed(2);
      rows.push(
        [
          reporte.anio.toString(),
          "Categoría Mixta",
          totalKg,
          totalKg,
          "Sin especificar",
          "100.00",
          resumenEjecutivo.cumplido ? "Cumplido" : "No Cumplido",
        ].join(separador)
      );
    }

    const csvContent = [headers.join(separador), ...rows].join("\n");

    // Agregar BOM para UTF-8 (importante para Excel)
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reporte-anual-${reporte.anio}-${reporte.folio}.csv"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error en /api/reportes/anual/[id]/export/csv:", error);
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
