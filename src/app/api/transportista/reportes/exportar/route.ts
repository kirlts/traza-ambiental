import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Prisma, EstadoSolicitud } from "@prisma/client";

type SolicitudRetiroWithRelations = Prisma.SolicitudRetiroGetPayload<{
  include: {
    generador: { select: { name: true; rut: true } };
    vehiculo: { select: { patente: true; tipo: true } };
    gestor: { select: { name: true } };
  };
}>;

/**
 * GET /api/transportista/reportes/exportar
 * Exporta el historial de solicitudes a CSV (compatible con Excel)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    // Filtros opcionales
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");
    const estado = searchParams.get("estado");
    const region = searchParams.get("region");

    // Construir where
    const where: import("@prisma/client").Prisma.SolicitudRetiroWhereInput = {
      transportistaId: session.user.id,
    };

    if (fechaDesde || fechaHasta) {
      where.fechaAceptacion = {};
      if (fechaDesde) where.fechaAceptacion.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaAceptacion.lte = new Date(fechaHasta);
    }

    if (estado) where.estado = estado as EstadoSolicitud;
    if (region) where.region = region;

    // Obtener solicitudes
    const solicitudes = await prisma.solicitudRetiro.findMany({
      where,
      include: {
        generador: {
          select: {
            name: true,
            rut: true,
          },
        },
        gestor: {
          select: {
            name: true,
          },
        },
        vehiculo: {
          select: {
            patente: true,
            tipo: true,
          },
        },
      },
      orderBy: {
        fechaAceptacion: "desc",
      },
    });

    // Generar CSV
    const headers = [
      "Folio",
      "Estado",
      "Fecha Aceptación",
      "Fecha Recolección",
      "Fecha Entrega",
      "Generador",
      "RUT Generador",
      "Dirección",
      "Región",
      "Comuna",
      "Peso Estimado (kg)",
      "Peso Real (kg)",
      "Cantidad",
      "Vehículo",
      "Tipo Vehículo",
      "Gestor",
      "Observaciones",
    ];

    const rows = solicitudes.map((s: SolicitudRetiroWithRelations) => [
      s.folio,
      s.estado,
      s.fechaAceptacion
        ? format(new Date(s.fechaAceptacion), "dd/MM/yyyy HH:mm", { locale: es })
        : "",
      s.fechaRecoleccion
        ? format(new Date(s.fechaRecoleccion), "dd/MM/yyyy HH:mm", { locale: es })
        : "",
      s.fechaEntregaGestor
        ? format(new Date(s.fechaEntregaGestor), "dd/MM/yyyy HH:mm", { locale: es })
        : "",
      s.generador.name,
      s.generador.rut || "",
      s.direccionRetiro,
      s.region,
      s.comuna,
      s.pesoTotalEstimado.toString(),
      s.pesoReal?.toString() || "",
      s.cantidadTotal.toString(),
      s.vehiculo?.patente || "",
      s.vehiculo?.tipo || "",
      s.gestor?.name || "",
      s.instrucciones || "",
    ]);

    // Construir CSV
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escapar comillas y encerrar en comillas si contiene comas, saltos de línea o comillas
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    // Agregar BOM para UTF-8 (para que Excel lo detecte correctamente)
    const bom = "\uFEFF";
    const csvWithBom = bom + csvContent;

    // Nombre del archivo con fecha
    const nombreArchivo = `historial_transportista_${format(new Date(), "yyyy-MM-dd_HHmm")}.csv`;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      },
    });
  } catch (error: unknown) {
    console.error("[API Exportar] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
