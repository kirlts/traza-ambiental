import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import { ReporteAnualData, ReporteGestor, ReporteCategoria, ReporteRegion } from "@/types/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos
    const userRoles = (session.user.roles || []) as string[];
    const hasAccess = userRoles.some((role: string) =>
      ["Sistema de Gestión", "Productor"].includes(role)
    );
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

    const datosReporte = reporte.datosReporte as unknown as ReporteAnualData;

    // Crear libro de Excel con ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = reporte.usuario.name || "TrazAmbiental";
    workbook.created = new Date();

    // Hoja 1: Resumen Ejecutivo
    const wsResumen = workbook.addWorksheet("Resumen");
    wsResumen.addRow(["REPORTE ANUAL DE CUMPLIMIENTO - Sistema REP Chile"]);
    wsResumen.addRow(["Folio:", reporte.folio]);
    wsResumen.addRow(["Año:", reporte.anio]);
    wsResumen.addRow(["Fecha de generación:", reporte.createdAt.toLocaleString("es-CL")]);
    wsResumen.addRow(["Generado por:", reporte.usuario.name || "N/A"]);
    wsResumen.addRow(["Estado:", reporte.estado]);
    wsResumen.addRow(["Código de verificación:", reporte.codigoVerificacion]);
    wsResumen.addRow([]);
    wsResumen.addRow(["RESUMEN EJECUTIVO"]);
    wsResumen.addRow([
      "Meta Recolección (ton):",
      datosReporte.resumenEjecutivo?.metaRecoleccion || 0,
    ]);
    wsResumen.addRow([
      "Peso Recolectado (ton):",
      datosReporte.resumenEjecutivo?.pesoRecolectado || 0,
    ]);
    wsResumen.addRow([
      "Porcentaje Recolección:",
      `${(datosReporte.resumenEjecutivo?.porcentajeRecoleccion || 0).toFixed(2)}%`,
    ]);
    wsResumen.addRow([
      "Meta Valorización (ton):",
      datosReporte.resumenEjecutivo?.metaValorizacion || 0,
    ]);
    wsResumen.addRow([
      "Peso Valorizado (ton):",
      datosReporte.resumenEjecutivo?.pesoValorizado || 0,
    ]);
    wsResumen.addRow([
      "Porcentaje Valorización:",
      `${(datosReporte.resumenEjecutivo?.porcentajeValorizacion || 0).toFixed(2)}%`,
    ]);
    wsResumen.addRow([
      "Estado Cumplimiento:",
      datosReporte.resumenEjecutivo?.cumplido ? "Cumplido" : "No Cumplido",
    ]);
    wsResumen.addRow(["Total Certificados:", datosReporte.totalCertificados || 0]);
    wsResumen.addRow(["Total Toneladas:", datosReporte.totalToneladas || 0]);

    if (reporte.observaciones) {
      wsResumen.addRow([]);
      wsResumen.addRow(["Observaciones:", reporte.observaciones]);
    }

    // Ajustar anchos de columna
    wsResumen.getColumn(1).width = 30;
    wsResumen.getColumn(2).width = 40;

    // Hoja 2: Desglose por Tratamiento
    if (datosReporte.desgloseTratamiento && datosReporte.desgloseTratamiento.length > 0) {
      const wsTratamiento = workbook.addWorksheet("Tratamientos");
      wsTratamiento.addRow(["Tipo", "Cantidad (unidades)", "Peso (toneladas)", "Porcentaje (%)"]);

      datosReporte.desgloseTratamiento.forEach((trat: ReturnType<typeof JSON.parse>) => {
        wsTratamiento.addRow([
          trat.tipo,
          trat.cantidad || 0,
          trat.peso || 0,
          `${(trat.porcentaje || 0).toFixed(2)}%`,
        ]);
      });

      wsTratamiento.getRow(1).font = { bold: true };
    }

    // Hoja 3: Desglose por Categoría
    if (datosReporte.desgloseCategoria && datosReporte.desgloseCategoria.length > 0) {
      const wsCategoria = workbook.addWorksheet("Categorías");
      wsCategoria.addRow(["Categoría", "Cantidad (unidades)", "Peso (toneladas)"]);

      datosReporte.desgloseCategoria.forEach((cat: ReporteCategoria) => {
        wsCategoria.addRow([cat.tipo, cat.cantidad || 0, cat.peso || 0]);
      });

      wsCategoria.getRow(1).font = { bold: true };
    }

    // Hoja 4: Desglose por Región
    if (datosReporte.desgloseRegion && datosReporte.desgloseRegion.length > 0) {
      const wsRegion = workbook.addWorksheet("Regiones");
      wsRegion.addRow(["Región", "Cantidad (unidades)", "Peso (toneladas)"]);

      datosReporte.desgloseRegion.forEach((reg: ReporteRegion) => {
        wsRegion.addRow([reg.region, reg.cantidad || 0, reg.peso || 0]);
      });

      wsRegion.getRow(1).font = { bold: true };
    }

    // Hoja 5: Gestores Participantes
    if (datosReporte.gestores && datosReporte.gestores.length > 0) {
      const wsGestores = workbook.addWorksheet("Gestores");
      wsGestores.addRow(["RUT", "Razón Social", "Certificados", "Toneladas"]);

      datosReporte.gestores.forEach((gestor: ReporteGestor) => {
        wsGestores.addRow([
          gestor.rut || "",
          gestor.nombre || "",
          gestor.certificados || 0,
          gestor.toneladas || 0,
        ]);
      });

      wsGestores.getRow(1).font = { bold: true };
    }

    // Hoja 6: Tabla SINADER (formato requerido)
    const wsSinader = workbook.addWorksheet("Formato SINADER");
    wsSinader.addRow([
      "Periodo",
      "TipoNeumatico",
      "PesoRecolectado",
      "PesoValorizado",
      "TipoTratamiento",
      "PorcentajeTotal",
      "EstadoCumplimiento",
    ]);

    if (datosReporte.desgloseTratamiento && datosReporte.desgloseTratamiento.length > 0) {
      datosReporte.desgloseTratamiento.forEach((trat: ReturnType<typeof JSON.parse>) => {
        const pesoKg = (trat.peso * 1000).toFixed(2);
        wsSinader.addRow([
          reporte.anio.toString(),
          "Categoría Mixta",
          pesoKg,
          pesoKg,
          trat.tipo,
          `${(trat.porcentaje || 0).toFixed(2)}`,
          datosReporte.resumenEjecutivo?.cumplido ? "Cumplido" : "No Cumplido",
        ]);
      });
    }

    wsSinader.getRow(1).font = { bold: true };

    // Generar buffer del archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="reporte-anual-${reporte.anio}-${reporte.folio}.xlsx"`,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error)
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
