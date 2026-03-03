import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

interface CertificadoExport {
  folio: string;
  fechaEmision: Date;
  pesoValorizado: number | null;
  tratamientos: unknown;
  categorias: unknown;
  estado: string;
  gestorId: string | null;
  solicitud: {
    region: string;
    generador: {
      id: string;
      name: string | null;
    } | null;
  } | null;
  gestor: {
    name: string | null;
  } | null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());
    const periodo = searchParams.get("periodo") || "anio";
    const region = searchParams.get("region") || "todas";
    const gestor = searchParams.get("gestor") || "todos";

    // Verificar permisos
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role) => ["Sistema de Gestión", "Productor"].includes(role));
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    // Construir filtros de fecha
    const fechaInicio = new Date(anio, 0, 1);
    const fechaFin =
      periodo === "trimestre"
        ? new Date(anio, 2, 31)
        : periodo === "mes"
          ? new Date(anio, new Date().getMonth(), 31)
          : new Date(anio, 11, 31);

    // Construir where clause
    const whereClause: import("@prisma/client").Prisma.CertificadoWhereInput = {
      estado: "emitido",
      fechaEmision: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    if (gestor !== "todos") {
      whereClause.gestorId = gestor;
    }

    // Filtrar por región si se especifica
    if (region !== "todas") {
      whereClause.solicitud = {
        region: {
          contains: region,
          mode: "insensitive",
        },
      };
    }

    // Obtener certificados
    const certificados = (await prisma.certificado.findMany({
      where: whereClause,
      include: {
        solicitud: {
          include: {
            generador: { select: { id: true, name: true } },
          },
        },
        gestor: { select: { name: true } },
      },
      orderBy: { fechaEmision: "desc" },
    })) as unknown as CertificadoExport[];

    // Crear libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Certificados");

    worksheet.columns = [
      { header: "Folio", key: "folio", width: 15 },
      { header: "Fecha Emisión", key: "fecha", width: 15 },
      { header: "Generador", key: "generador", width: 30 },
      { header: "Gestor", key: "gestor", width: 30 },
      { header: "Región", key: "region", width: 20 },
      { header: "Peso (kg)", key: "peso", width: 12 },
      { header: "Estado", key: "estado", width: 15 },
    ];

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      worksheet.addRow({
        folio: cert.folio,
        fecha: cert.fechaEmision.toLocaleDateString("es-CL"),
        generador: cert.solicitud?.generador?.name || "N/A",
        gestor: cert.gestor?.name || "N/A",
        region: cert.solicitud?.region || "N/A",
        peso: cert.pesoValorizado,
        estado: cert.estado,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="reporte-certificados-${anio}.xlsx"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error exportando a Excel:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
