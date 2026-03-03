import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generarCertificadoPDF } from "@/lib/pdf/generar-certificado";

export const runtime = "nodejs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Verificar que el usuario sea Gestor o Administrador
    const userRoles = session.user.roles || [];
    const isAuthorized = userRoles.includes("Gestor") || userRoles.includes("Administrador");

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "No autorizado. Solo gestores pueden generar certificados." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const certificadoId = resolvedParams.id;

    // Importar prisma dinámicamente
    const { prisma: prismaClient } = await import("@/lib/prisma");

    // Buscar el certificado en la base de datos
    const certificado = await prismaClient.certificado.findUnique({
      where: { id: certificadoId },
      include: {
        solicitud: {
          include: {
            generador: true,
            transportista: true,
          },
        },
        gestor: true,
      },
    });

    if (!certificado) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 });
    }

    // Parsear tratamientos desde JSON
    let tratamientos: unknown[] = [];
    try {
      if (typeof certificado.tratamientos === "string") {
        tratamientos = JSON.parse(certificado.tratamientos);
      } else if (Array.isArray(certificado.tratamientos)) {
        tratamientos = certificado.tratamientos;
      } else if (certificado.tratamientos && typeof certificado.tratamientos === "object") {
        tratamientos = [certificado.tratamientos];
      }
    } catch (error: unknown) {
      console.error("[PDF] Error parsing tratamientos:", error);
      tratamientos = [];
    }

    // Preparar datos para el PDF
    const pdfData = {
      folio: certificado.folio,
      fechaEmision: certificado.fechaEmision,
      pesoValorizado: certificado.pesoValorizado || 0,
      cantidadUnidades: certificado.cantidadUnidades || 0,
      categorias: certificado.categorias || [],
      tratamientos: tratamientos.map((tDoc: ReturnType<typeof JSON.parse>) => {
        const t = (tDoc as Record<string, string>) || {};
        return {
          tipo: t.tipo || t.nombre || "Tratamiento",
          descripcion: t.descripcion || undefined,
          porcentaje: t.porcentaje ? Number(t.porcentaje) : undefined,
        };
      }),
      generador: {
        name: certificado.solicitud.generador.name || "No especificado",
        rut: certificado.solicitud.generador.rut || "No especificado",
        direccion: certificado.solicitud.direccionRetiro || undefined,
      },
      gestor: certificado.gestor
        ? {
            name: certificado.gestor.name || "Gestor REP",
            rut: certificado.gestor.rut || "N/A",
            autorizacion: "Autorización REP",
          }
        : undefined,
    };

    // Log de datos de PDF eliminado

    // Generar el PDF
    const pdfBuffer = await generarCertificadoPDF(pdfData);

    // Devolver el PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="certificado-${certificado.folio}.pdf"`,
        "Cache-Control": "public, max-age=3600", // Cache por 1 hora
      },
    });
  } catch (error: unknown) {
    console.error("Error generando certificado PDF:", error);
    return NextResponse.json(
      {
        error: "Error al generar certificado PDF",
        message:
          (error instanceof Error
            ? error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error)
            : String(error)) || String(error),
      },
      { status: 500 }
    );
  }
}
