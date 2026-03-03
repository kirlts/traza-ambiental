import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());
    const periodo = searchParams.get("periodo") || "anio";
    const _region = searchParams.get("region") || "todas";
    const _tratamiento = searchParams.get("tratamiento") || "todos";
    const gestor = searchParams.get("gestor") || "todos";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

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

    // Calcular paginación
    const skip = (page - 1) * limit;

    // Obtener certificados con paginación
    const [certificados, total] = await Promise.all([
      prisma.certificado.findMany({
        where: whereClause,
        include: {
          solicitud: {
            include: {
              gestor: {
                select: {
                  name: true,
                },
              },
            },
          },
          gestor: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          fechaEmision: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.certificado.count({
        where: whereClause,
      }),
    ]);

    // Formatear respuesta
    const certificadosFormateados = certificados.map((cert: ReturnType<typeof JSON.parse>) => {
      // Extraer el primer tratamiento del array JSON
      const tratamientos = Array.isArray(cert.tratamientos) ? cert.tratamientos : [];
      const primerTratamiento =
        tratamientos.length > 0 ? (tratamientos[0] as Record<string, unknown>) : null;
      const tipoTratamiento =
        primerTratamiento?.tipo || primerTratamiento?.tipoTratamiento || "Sin especificar";

      // Normalizar nombre del tratamiento
      const tratamientoNombres: { [key: string]: string } = {
        RECICLAJE_MATERIAL: "Reciclaje",
        RECAUCHAJE: "Recauchaje",
        COPROCESAMIENTO: "Co-procesamiento",
        VALORIZACION_ENERGETICA: "Valorización Energética",
      };

      return {
        id: cert.id,
        folio: cert.folio,
        fechaEmision: cert.fechaEmision,
        gestor: cert.gestor || cert.solicitud?.gestor || { name: "Sin asignar" },
        pesoValorizado: cert.pesoValorizado,
        tipoTratamiento:
          tratamientoNombres[tipoTratamiento as keyof typeof tratamientoNombres] || tipoTratamiento,
      };
    });

    return NextResponse.json({
      certificados: certificadosFormateados,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    console.error("Error en /api/dashboard/ultimos-certificados:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
