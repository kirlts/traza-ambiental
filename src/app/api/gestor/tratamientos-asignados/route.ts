import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";

/**
 * GET /api/gestor/tratamientos-asignados
 *
 * Obtiene los tratamientos que han sido asignados por el gestor.
 * Extrae la información del tratamiento desde las notas del CambioEstado.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    if (!isGestor(session)) {
      return NextResponse.json({ error: "No autorizado - Requiere rol gestor" }, { status: 403 });
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Obtener solicitudes en estado TRATADA asignadas a este gestor
    const solicitudesTratadas = await prisma.solicitudRetiro.findMany({
      where: {
        estado: "TRATADA",
        gestorId: session.user.id,
      },
      include: {
        generador: {
          select: {
            name: true,
            email: true,
            rut: true,
          },
        },
        transportista: {
          select: {
            name: true,
            email: true,
          },
        },
        cambiosEstado: {
          where: {
            estadoNuevo: "TRATADA",
            realizadoPor: session.user.id,
          },
          orderBy: {
            fecha: "desc",
          },
          take: 1, // Solo el cambio de estado más reciente a TRATADA
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Contar total
    const total = await prisma.solicitudRetiro.count({
      where: {
        estado: "TRATADA",
        gestorId: session.user.id,
      },
    });

    // Extraer información del tratamiento desde las notas del CambioEstado
    const tratamientosAsignados = solicitudesTratadas.map(
      (solicitud: ReturnType<typeof JSON.parse>) => {
        const cambioEstado = solicitud.cambiosEstado[0]; // El cambio más reciente a TRATADA
        const notas = cambioEstado?.notas || "";

        // Parsear información del tratamiento desde las notas
        // Formato: "Tratamiento asignado: TIPO | Fecha inicio: ... | Fecha fin: ... | Ubicación: ... | Descripción: ... | Documentos subidos: N"
        let tipoTratamiento = "No especificado";
        let otroTratamiento: string | null = null;
        let fechaInicio: string | null = null;
        let fechaFin: string | null = null;
        let ubicacion: string | null = null;
        let descripcion: string | null = null;
        let cantidadDocumentos = 0;

        if (notas) {
          // Extraer tipo de tratamiento
          const tipoMatch = notas.match(/Tratamiento asignado:\s*([^|]+)/);
          if (tipoMatch) {
            tipoTratamiento = tipoMatch[1].trim();
          }

          // Extraer tipo específico (si es OTRO)
          const otroMatch = notas.match(/Tipo específico:\s*([^|]+)/);
          if (otroMatch) {
            otroTratamiento = otroMatch[1].trim();
          }

          // Extraer fecha inicio
          const fechaInicioMatch = notas.match(/Fecha inicio:\s*([^|]+)/);
          if (fechaInicioMatch) {
            fechaInicio = fechaInicioMatch[1].trim();
          }

          // Extraer fecha fin
          const fechaFinMatch = notas.match(/Fecha fin:\s*([^|]+)/);
          if (fechaFinMatch) {
            fechaFin = fechaFinMatch[1].trim();
          }

          // Extraer ubicación
          const ubicacionMatch = notas.match(/Ubicación:\s*([^|]+)/);
          if (ubicacionMatch) {
            ubicacion = ubicacionMatch[1].trim();
          }

          // Extraer descripción
          const descripcionMatch = notas.match(/Descripción:\s*([^|]+)/);
          if (descripcionMatch) {
            descripcion = descripcionMatch[1].trim();
          }

          // Extraer cantidad de documentos
          const documentosMatch = notas.match(/Documentos subidos:\s*(\d+)/);
          if (documentosMatch) {
            cantidadDocumentos = parseInt(documentosMatch[1], 10);
          }
        }

        return {
          id: solicitud.id,
          folio: solicitud.folio,
          fechaAsignacion: cambioEstado?.fecha || solicitud.updatedAt,
          generador: solicitud.generador,
          transportista: solicitud.transportista,
          pesoReal: solicitud.pesoReal,
          cantidadReal: solicitud.cantidadReal,
          categoriaA_cantidad: solicitud.categoriaA_cantidad,
          categoriaB_cantidad: solicitud.categoriaB_cantidad,
          tratamiento: {
            tipo: tipoTratamiento,
            otroTratamiento,
            fechaInicio,
            fechaFin,
            ubicacion,
            descripcion,
            cantidadDocumentos,
          },
        };
      }
    );

    return NextResponse.json({
      tratamientos: tratamientosAsignados,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    console.error("❌ Error obteniendo tratamientos asignados:", error);
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
