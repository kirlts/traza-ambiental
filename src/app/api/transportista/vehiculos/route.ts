import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * GET /api/transportista/vehiculos
 * Obtiene vehículos del transportista con estadísticas
 */
export async function GET() {
  try {
    const session = await auth();

    // Debug: Log session info eliminado

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No hay sesión activa" }, { status: 401 });
    }

    if (!isTransportista(session)) {
      return NextResponse.json(
        { error: "No autorizado - Requiere rol Transportista" },
        { status: 403 }
      );
    }

    // Consulta simplificada primero
    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        transportistaId: session.user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    // Si no hay vehículos, devolver array vacío
    if (vehiculos.length === 0) {
      return NextResponse.json({ vehiculos: [] });
    }

    // Obtener estadísticas de solicitudes para cada vehículo
    const vehiculosConCapacidad = await Promise.all(
      vehiculos.map(async (vehiculo: ReturnType<typeof JSON.parse>) => {
        try {
          // Contar solicitudes activas
          const solicitudesActivas = await prisma.solicitudRetiro.count({
            where: {
              vehiculoId: vehiculo.id,
              estado: {
                in: ["ACEPTADA", "EN_CAMINO", "RECOLECTADA"],
              },
            },
          });

          // Obtener peso total usado
          const solicitudesConPeso = await prisma.solicitudRetiro.findMany({
            where: {
              vehiculoId: vehiculo.id,
              estado: {
                in: ["ACEPTADA", "EN_CAMINO", "RECOLECTADA"],
              },
            },
            select: {
              pesoReal: true,
              pesoTotalEstimado: true,
            },
          });

          const pesoUsado = solicitudesConPeso.reduce((sum, sol) => {
            return sum + (sol.pesoReal ?? sol.pesoTotalEstimado ?? 0);
          }, 0);

          return {
            id: vehiculo.id,
            patente: vehiculo.patente,
            tipo: vehiculo.tipo,
            capacidadKg: vehiculo.capacidadKg,
            estado: vehiculo.estado,
            createdAt: vehiculo.createdAt,
            updatedAt: vehiculo.updatedAt,
            solicitudesActivas,
            pesoUsadoKg: pesoUsado,
            capacidadDisponibleKg: vehiculo.capacidadKg - pesoUsado,
            porcentajeUso:
              vehiculo.capacidadKg > 0 ? Math.round((pesoUsado / vehiculo.capacidadKg) * 100) : 0,
          };
        } catch (vehiculoError: unknown) {
          console.error(`Error procesando vehículo ${vehiculo.id}:`, vehiculoError);
          // Devolver vehículo básico sin estadísticas en caso de error
          return {
            id: vehiculo.id,
            patente: vehiculo.patente,
            tipo: vehiculo.tipo,
            capacidadKg: vehiculo.capacidadKg,
            estado: vehiculo.estado,
            createdAt: vehiculo.createdAt,
            updatedAt: vehiculo.updatedAt,
            solicitudesActivas: 0,
            pesoUsadoKg: 0,
            capacidadDisponibleKg: vehiculo.capacidadKg,
            porcentajeUso: 0,
          };
        }
      })
    );

    return NextResponse.json({ vehiculos: vehiculosConCapacidad });
  } catch (error: unknown) {
    console.error("Error al obtener vehículos:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transportista/vehiculos
 * Crea un nuevo vehículo
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { patente, tipo, capacidadKg } = body;

    // Validaciones
    if (!patente || !tipo || !capacidadKg) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: patente, tipo, capacidadKg" },
        { status: 400 }
      );
    }

    // Validar formato de patente (formato chileno: ABCD-12 o AB-1234)
    const patenteRegex = /^[A-Z]{2,4}-\d{2,4}$/i;
    if (!patenteRegex.test(patente)) {
      return NextResponse.json(
        { error: "Formato de patente inválido. Use formato chileno: ABCD-12 o AB-1234" },
        { status: 400 }
      );
    }

    // Validar capacidad
    if (typeof capacidadKg !== "number" || capacidadKg <= 0) {
      return NextResponse.json(
        { error: "La capacidad debe ser un número mayor a 0" },
        { status: 400 }
      );
    }

    // Verificar que la patente no exista
    const patenteExistente = await prisma.vehiculo.findUnique({
      where: { patente: patente.toUpperCase() },
    });

    if (patenteExistente) {
      return NextResponse.json(
        { error: "Ya existe un vehículo con esta patente" },
        { status: 409 }
      );
    }

    // Crear vehículo
    const vehiculo = await prisma.vehiculo.create({
      data: {
        transportistaId: session.user.id,
        patente: patente.toUpperCase(),
        tipo,
        capacidadKg: Number(capacidadKg),
        estado: "activo",
      },
    });

    return NextResponse.json(
      {
        vehiculo,
        message: "Vehículo creado exitosamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error al crear vehículo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
