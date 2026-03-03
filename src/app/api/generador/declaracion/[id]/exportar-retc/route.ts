import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: declaracionId } = await params;
    const session = await auth();

    // Validar autenticación
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener la declaración con sus detalles
    const declaracion = await prisma.declaracionAnual.findUnique({
      where: { id: declaracionId },
      include: {
        productor: true,
        categorias: true,
      },
    });

    if (!declaracion) {
      return NextResponse.json({ error: "Declaración no encontrada" }, { status: 404 });
    }

    // Validar propiedad (solo el productor dueño puede descargar)
    if (declaracion.productorId !== session.user.id) {
      return NextResponse.json({ error: "Acceso denegado a esta declaración" }, { status: 403 });
    }

    // Crear Workbook de Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TrazaAmbiental";
    workbook.created = new Date();

    // --- HOJA 1: RESUMEN GENERAL (Estilo RETC / SINADER) ---
    const worksheet = workbook.addWorksheet("Carga Masiva RETC");

    // Definir columnas (Formato Estandarizado Propuesto)
    worksheet.columns = [
      { header: "RUT Generador", key: "rut", width: 15 },
      { header: "Razón Social", key: "razonSocial", width: 30 },
      { header: "ID RETC (VU)", key: "idRetc", width: 15 },
      { header: "Año Declaración", key: "anio", width: 15 },
      { header: "Categoría REP", key: "categoria", width: 15 },
      { header: "Descripción Residuo", key: "descripcion", width: 40 },
      { header: "Cantidad Unidades", key: "unidades", width: 20 },
      { header: "Peso (Toneladas)", key: "peso", width: 20 },
      { header: "Tipo Tratamiento", key: "tratamiento", width: 20 }, // Campo vacío para llenar manual
      { header: "RUT Gestor", key: "rutGestor", width: 15 }, // Campo vacío para llenar manual
    ];

    // Estilo de Cabecera
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2E7D32" }, // Verde corporativo
    };

    // Agregar filas por cada categoría declarada
    declaracion.categorias.forEach((cat: ReturnType<typeof JSON.parse>) => {
      // Solo agregar si tiene valores
      if (cat.cantidadUnidades > 0 || cat.pesoToneladas > 0) {
        worksheet.addRow({
          rut: declaracion.productor.rut || "",
          razonSocial: declaracion.productor.name || "",
          idRetc: declaracion.productor.idRETC || "",
          anio: declaracion.anio,
          categoria: `Categoría ${cat.tipo}`,
          descripcion: cat.nombre,
          unidades: cat.cantidadUnidades,
          peso: cat.pesoToneladas,
          tratamiento: "", // Dejar vacío para completado manual si es necesario
          rutGestor: "", // Dejar vacío
        });
      }
    });

    // Generar Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Retornar respuesta con archivo adjunto
    const headers = new Headers();
    headers.append(
      "Content-Disposition",
      `attachment; filename="Declaracion_RETC_${declaracion.anio}_${declaracion.productor.rut || "sin_rut"}.xlsx"`
    );
    headers.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error("Error generando Excel:", error);
    return NextResponse.json({ error: "Error interno generando el archivo" }, { status: 500 });
  }
}
