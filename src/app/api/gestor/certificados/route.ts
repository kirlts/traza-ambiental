import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que el usuario sea gestor usando el helper
    if (!isGestor(session)) {
      return NextResponse.json(
        { error: "Solo gestores pueden acceder a certificados" },
        { status: 403 }
      );
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");
    const generadorRut = searchParams.get("generadorRut");
    const tratamiento = searchParams.get("tratamiento");
    const solicitudId = searchParams.get("solicitudId");

    // Construir filtros
    const where: import("@prisma/client").Prisma.CertificadoWhereInput = {
      gestorId: session.user.id,
    };

    // Filtrar por solicitudId si se proporciona
    if (solicitudId) {
      where.solicitudId = solicitudId;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaEmision = {};
      if (fechaDesde) {
        where.fechaEmision.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        where.fechaEmision.lte = new Date(fechaHasta);
      }
    }

    if (generadorRut) {
      where.solicitud = {
        generador: {
          rut: {
            contains: generadorRut,
            mode: "insensitive",
          },
        },
      };
    }

    if (tratamiento) {
      where.tratamientos = {
        path: ["$"],
        array_contains: [{ tipo: tratamiento }],
      } as import("@prisma/client").Prisma.JsonFilter;
    }

    // Obtener certificados con paginación
    const skipPagination = solicitudId ? 0 : (page - 1) * limit;
    const takePagination = solicitudId ? 1 : limit;

    const [certificados, total] = await Promise.all([
      prisma.certificado.findMany({
        where,
        include: {
          solicitud: {
            include: {
              generador: {
                select: { name: true, rut: true },
              },
              transportista: {
                select: { name: true, rut: true },
              },
            },
          },
        },
        orderBy: { fechaEmision: "desc" },
        skip: skipPagination,
        take: takePagination,
      }),
      prisma.certificado.count({ where }),
    ]);

    // Calcular estadísticas
    const estadisticas = await calcularEstadisticasCertificados(session.user.id);

    return NextResponse.json({
      certificados,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      estadisticas,
    });
  } catch (error: unknown) {
    console.error("❌ Error obteniendo certificados:", error);
    let errorStack = undefined;
    if (error instanceof Error) {
      console.error("   Stack:", (error as ReturnType<typeof JSON.parse>).stack);
      errorStack = (error as ReturnType<typeof JSON.parse>).stack;
    }
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
        details: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

async function calcularEstadisticasCertificados(gestorId: string) {
  if (!prisma.certificado) {
    return {
      totalCertificados: 0,
      totalPesoValorizado: 0,
      porTratamiento: {},
      porMes: {},
    };
  }

  try {
    const certificados = await prisma.certificado.findMany({
      where: { gestorId },
      select: {
        pesoValorizado: true,
        tratamientos: true,
        fechaEmision: true,
      },
    });

    const totalCertificados = certificados.length;
    const totalPeso = certificados.reduce(
      (sum: number, cert: ReturnType<typeof JSON.parse>) => sum + (cert.pesoValorizado || 0),
      0
    );

    // Agrupar por tratamiento
    const porTratamiento: { [key: string]: number } = {};
    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      if (Array.isArray(cert.tratamientos)) {
        cert.tratamientos.forEach((tDoc: ReturnType<typeof JSON.parse>) => {
          const t = tDoc as { tipo?: string; peso?: number };
          if (t?.tipo) {
            porTratamiento[t.tipo] = (porTratamiento[t.tipo] || 0) + (t.peso || 0);
          }
        });
      }
    });

    // Agrupar por mes
    const porMes: { [key: string]: number } = {};
    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      if (cert?.fechaEmision) {
        const fecha = new Date(cert.fechaEmision);
        const mes = fecha.toISOString().substring(0, 7); // YYYY-MM
        porMes[mes] = (porMes[mes] || 0) + 1;
      }
    });

    return {
      totalCertificados,
      totalPesoValorizado: totalPeso,
      porTratamiento,
      porMes,
    };
  } catch {
    return {
      totalCertificados: 0,
      totalPesoValorizado: 0,
      porTratamiento: {},
      porMes: {},
    };
  }
}
