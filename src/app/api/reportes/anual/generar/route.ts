import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generarFolioReporte, generarCodigoVerificacion } from "@/lib/utils/reporte-folio";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { anio, observaciones, documentosAdjuntos } = body;

    // Validar año
    if (!anio || isNaN(anio) || anio < 2000 || anio > 2100) {
      return NextResponse.json({ error: "Año inválido" }, { status: 400 });
    }

    // Validar que el año esté finalizado (opcional: permitir año actual)
    const anioActual = new Date().getFullYear();
    if (anio > anioActual) {
      return NextResponse.json(
        {
          error: "No se pueden generar reportes para años futuros",
        },
        { status: 400 }
      );
    }

    // Determinar sistemaGestionId según el rol
    let sistemaGestionId: string;
    if (userRoles.includes("Sistema de Gestión")) {
      sistemaGestionId = session.user.id;
    } else if (userRoles.includes("Productor")) {
      // Para productores, usar su propio ID como sistemaGestionId
      // En el futuro, esto podría requerir una relación productor -> sistema_gestion
      sistemaGestionId = session.user.id;
    } else {
      return NextResponse.json(
        {
          error: "Rol no autorizado para generar reportes",
        },
        { status: 403 }
      );
    }

    // Verificar si ya existe un reporte para este año y sistema
    const reporteExistente = await prisma.reporteAnual.findFirst({
      where: {
        sistemaGestionId,
        anio,
      },
    });

    if (reporteExistente) {
      return NextResponse.json(
        {
          error: "Ya existe un reporte para este año",
          reporteId: reporteExistente.id,
          puedeRegenerar: true,
        },
        { status: 409 }
      );
    }

    // Obtener datos del reporte usando el endpoint de datos
    const fechaInicio = new Date(anio, 0, 1);
    const fechaFin = new Date(anio, 11, 31, 23, 59, 59);

    // Buscar certificados para este sistema de gestión
    // Si no hay certificados directamente asignados, buscar certificados sin asignación específica
    let certificados = await prisma.certificado.findMany({
      where: {
        estado: "emitido",
        fechaEmision: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        sistemaGestionId,
      },
      include: {
        solicitud: {
          include: {
            generador: true,
            gestor: true,
          },
        },
        gestor: true,
      },
    });

    // Si no hay certificados directamente asignados, buscar certificados sin sistemaGestionId
    if (certificados.length === 0) {
      // Log de búsqueda alternativa eliminado
      certificados = await prisma.certificado.findMany({
        where: {
          estado: "emitido",
          fechaEmision: {
            gte: fechaInicio,
            lte: fechaFin,
          },
          OR: [{ sistemaGestionId: null }, { sistemaGestionId: "" }],
        },
        include: {
          solicitud: {
            include: {
              generador: true,
              gestor: true,
            },
          },
          gestor: true,
        },
      });
    } else {
    }

    // Verificar que haya certificados
    if (certificados.length === 0) {
      return NextResponse.json(
        {
          error: "No hay certificados emitidos para este período",
        },
        { status: 400 }
      );
    }

    // Obtener metas
    // Las metas pueden tener sistemaGestionId o productorId
    const metas = await prisma.meta.findMany({
      where: {
        anio,
        OR: [{ sistemaGestionId }, { productorId: sistemaGestionId }],
      },
    });

    if (metas.length === 0) {
      return NextResponse.json(
        {
          error: "No hay metas configuradas para este año",
        },
        { status: 400 }
      );
    }

    // Calcular datos del reporte (similar a /datos)
    const totalToneladas = certificados.reduce((sum, cert: ReturnType<typeof JSON.parse>) => {
      return sum + cert.pesoValorizado / 1000;
    }, 0);

    const metaRecoleccion =
      metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "recoleccion")?.metaToneladas ||
      0;
    const metaValorizacion =
      metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "valorizacion")?.metaToneladas ||
      0;

    // Compilar datos del reporte (snapshot)
    const datosReporte = {
      resumenEjecutivo: {
        metaRecoleccion,
        pesoRecolectado: totalToneladas,
        porcentajeRecoleccion: metaRecoleccion > 0 ? (totalToneladas / metaRecoleccion) * 100 : 0,
        metaValorizacion,
        pesoValorizado: totalToneladas,
        porcentajeValorizacion:
          metaValorizacion > 0 ? (totalToneladas / metaValorizacion) * 100 : 0,
        cumplido: totalToneladas >= metaValorizacion,
      },
      totalCertificados: certificados.length,
      totalToneladas,
      fechaGeneracion: new Date().toISOString(),
    };

    // Generar folio y código de verificación
    const folio = await generarFolioReporte(anio);
    const codigoVerificacion = generarCodigoVerificacion();

    // Crear reporte en la base de datos
    const reporte = await prisma.reporteAnual.create({
      data: {
        sistemaGestionId,
        anio,
        folio,
        datosReporte: datosReporte,
        observaciones: observaciones || null,
        documentosAdjuntos: documentosAdjuntos || [],
        generadoPorId: session.user.id,
        codigoVerificacion,
        estado: "generado",
      },
    });

    return NextResponse.json({
      reporteId: reporte.id,
      folio: reporte.folio,
      mensaje: "Reporte generado exitosamente",
      codigoVerificacion: reporte.codigoVerificacion,
    });
  } catch (error: unknown) {
    console.error("Error en /api/reportes/anual/generar:", error);
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
