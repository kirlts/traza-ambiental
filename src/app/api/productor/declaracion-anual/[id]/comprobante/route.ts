import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isProductor } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { calcularMetasREP } from "@/lib/helpers/declaracion-helpers";
import { generarComprobantePDF } from "@/lib/pdf/generar-comprobante";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isProductor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;

    // Buscar la declaración con todas sus relaciones
    const declaracion = await prisma.declaracionAnual.findUnique({
      where: { id },
      include: {
        categorias: true,
        productor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!declaracion) {
      return NextResponse.json({ error: "Declaración no encontrada" }, { status: 404 });
    }

    // Verificar que es del productor actual
    if (declaracion.productorId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado para esta declaración" }, { status: 403 });
    }

    // Verificar que la declaración esté enviada (tiene folio)
    if (declaracion.estado === "borrador" || !declaracion.folio) {
      return NextResponse.json(
        { error: "Solo se pueden generar comprobantes de declaraciones enviadas" },
        { status: 400 }
      );
    }

    // Calcular metas para incluir en el PDF
    const metasCalculadas = await calcularMetasREP(declaracion.anio, declaracion.totalToneladas);
    const metas = {
      ...metasCalculadas,
      porcentajeRecoleccion: 0, // Se calculará en el PDF
      porcentajeValorizacion: 0, // Se calculará en el PDF
    };

    // Preparar datos para el PDF
    const pdfData = {
      folio: declaracion.folio,
      anio: declaracion.anio,
      fechaDeclaracion: declaracion.fechaDeclaracion || new Date(),
      totalUnidades: declaracion.totalUnidades,
      totalToneladas: declaracion.totalToneladas,
      categorias: declaracion.categorias,
      productor: {
        ...declaracion.productor,
        name: declaracion.productor.name || "Productor",
      },
      metas,
    };

    // Generar el PDF usando función helper
    const buffer = await generarComprobantePDF(pdfData);

    // Retornar el PDF como descarga
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Comprobante_${declaracion.folio}_${declaracion.anio}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error al generar comprobante PDF:", error);
    return NextResponse.json({ error: "Error al generar el comprobante PDF" }, { status: 500 });
  }
}
