import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isTransportista } from "@/lib/auth-helpers";

/**
 * PATCH /api/transportista/vehiculos/[id]
 * Actualiza un vehículo existente
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: vehiculoId } = await params;
    const body = await request.json();
    const { patente, tipo, capacidadKg, estado } = body;

    // Verificar que el vehículo existe y pertenece al transportista
    const vehiculoExistente = await prisma.vehiculo.findFirst({
      where: {
        id: vehiculoId,
        transportistaId: session.user.id,
      },
    });

    if (!vehiculoExistente) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    // Construir datos a actualizar
    const dataToUpdate: {
      patente?: string;
      tipo?: string;
      capacidadKg?: number;
      estado?: string;
    } = {};

    // Validar y agregar patente si se proporciona
    if (patente !== undefined) {
      const patenteRegex = /^[A-Z]{2,4}-\d{2,4}$/i;
      if (!patenteRegex.test(patente)) {
        return NextResponse.json(
          { error: "Formato de patente inválido. Use formato chileno: ABCD-12 o AB-1234" },
          { status: 400 }
        );
      }

      // Verificar que la nueva patente no esté en uso por otro vehículo
      const patenteEnUso = await prisma.vehiculo.findFirst({
        where: {
          patente: patente.toUpperCase(),
          id: { not: vehiculoId },
        },
      });

      if (patenteEnUso) {
        return NextResponse.json(
          { error: "Ya existe otro vehículo con esta patente" },
          { status: 409 }
        );
      }

      dataToUpdate.patente = patente.toUpperCase();
    }

    // Validar y agregar tipo si se proporciona
    if (tipo !== undefined) {
      if (!tipo || typeof tipo !== "string") {
        return NextResponse.json({ error: "El tipo de vehículo es inválido" }, { status: 400 });
      }
      dataToUpdate.tipo = tipo;
    }

    // Validar y agregar capacidad si se proporciona
    if (capacidadKg !== undefined) {
      if (typeof capacidadKg !== "number" || capacidadKg <= 0) {
        return NextResponse.json(
          { error: "La capacidad debe ser un número mayor a 0" },
          { status: 400 }
        );
      }
      dataToUpdate.capacidadKg = Number(capacidadKg);
    }

    // Validar y agregar estado si se proporciona
    if (estado !== undefined) {
      const estadosValidos = ["activo", "mantenimiento", "inactivo"];
      if (!estadosValidos.includes(estado)) {
        return NextResponse.json(
          { error: `Estado inválido. Use: ${estadosValidos.join(", ")}` },
          { status: 400 }
        );
      }
      dataToUpdate.estado = estado;
    }

    // Si no hay nada que actualizar
    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    // Actualizar vehículo
    const vehiculoActualizado = await prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      vehiculo: vehiculoActualizado,
      message: "Vehículo actualizado exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error al actualizar vehículo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/**
 * DELETE /api/transportista/vehiculos/[id]
 * Elimina un vehículo (con validaciones de seguridad)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !isTransportista(session)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id: vehiculoId } = await params;

    // Verificar que el vehículo existe y pertenece al transportista
    const vehiculo = await prisma.vehiculo.findFirst({
      where: {
        id: vehiculoId,
        transportistaId: session.user.id,
      },
      include: {
        _count: {
          select: {
            solicitudes: {
              where: {
                estado: {
                  in: ["ACEPTADA", "EN_CAMINO", "RECOLECTADA"],
                },
              },
            },
          },
        },
      },
    });

    if (!vehiculo) {
      return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
    }

    // Validación de seguridad: no permitir eliminar vehículos con solicitudes activas
    if (vehiculo._count.solicitudes > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar el vehículo",
          details: `El vehículo tiene ${vehiculo._count.solicitudes} solicitud(es) activa(s). Complete o cancele las solicitudes antes de eliminar el vehículo.`,
        },
        { status: 409 }
      );
    }

    // Eliminar vehículo
    await prisma.vehiculo.delete({
      where: { id: vehiculoId },
    });

    return NextResponse.json({
      message: "Vehículo eliminado exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error al eliminar vehículo:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
