/**
 * API Route: /api/inventario/movimientos
 * Gestión de movimientos de inventario (entradas/salidas)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * GET /api/inventario/movimientos
 * Obtiene los movimientos de inventario del generador autenticado
 *
 * @param request Request con posibles filtros
 * @returns Response con lista de movimientos
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para acceder a los movimientos.",
        },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea un generador
    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.user.id },
      include: { role: true },
    });

    const isGenerador = userRoles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Generador"
    );
    if (!isGenerador) {
      return NextResponse.json(
        {
          error: "Acceso denegado",
          message: "Solo los generadores pueden acceder a los movimientos de inventario.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productoId = searchParams.get("productoId");
    const tipo = searchParams.get("tipo");
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: import("@prisma/client").Prisma.MovimientoInventarioWhereInput = {
      inventario: {
        generadorId: session.user.id,
      },
    };

    if (productoId) {
      where.inventario = {
        ...(where.inventario as Record<string, unknown>),
        productoId: productoId,
      };
    }

    if (tipo && ["ENTRADA", "SALIDA"].includes(tipo)) {
      where.tipo = tipo;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaMovimiento = {};
      if (fechaDesde) {
        where.fechaMovimiento.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        where.fechaMovimiento.lte = new Date(fechaHasta);
      }
    }

    const [movimientos, total] = await Promise.all([
      prisma.movimientoInventario.findMany({
        where,
        include: {
          inventario: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  marca: true,
                  modelo: true,
                  medidas: true,
                },
              },
            },
          },
        },
        orderBy: {
          fechaMovimiento: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.movimientoInventario.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        movimientos: movimientos.map((movimiento) => ({
          id: movimiento.id,
          producto: movimiento.inventario.producto,
          tipo: movimiento.tipo,
          cantidad: movimiento.cantidad,
          cantidadPrevia: movimiento.cantidadPrevia,
          cantidadNueva: movimiento.cantidadNueva,
          motivo: movimiento.motivo,
          referencia: movimiento.referencia,
          notas: movimiento.notas,
          fechaMovimiento: movimiento.fechaMovimiento,
          usuarioId: movimiento.usuarioId,
        })),
        paginacion: {
          pagina: page,
          limite: limit,
          total,
          totalPaginas: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener movimientos:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener los movimientos.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventario/movimientos
 * Registra un nuevo movimiento de inventario
 *
 * @param request Datos del movimiento
 * @returns Response con el movimiento registrado
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para registrar movimientos.",
        },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea un generador
    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.user.id },
      include: { role: true },
    });

    const isGenerador = userRoles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Generador"
    );
    if (!isGenerador) {
      return NextResponse.json(
        {
          error: "Acceso denegado",
          message: "Solo los generadores pueden registrar movimientos de inventario.",
        },
        { status: 403 }
      );
    }

    const { inventarioId, tipo, cantidad, motivo, referencia, notas } = await request.json();

    // Validaciones
    if (!inventarioId || !tipo || cantidad === undefined || !motivo) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: "Inventario, tipo, cantidad y motivo son obligatorios.",
        },
        { status: 400 }
      );
    }

    if (!["ENTRADA", "SALIDA"].includes(tipo)) {
      return NextResponse.json(
        {
          error: "Tipo inválido",
          message: "El tipo debe ser ENTRADA o SALIDA.",
        },
        { status: 400 }
      );
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        {
          error: "Cantidad inválida",
          message: "La cantidad debe ser mayor a 0.",
        },
        { status: 400 }
      );
    }

    // Verificar que el inventario pertenece al generador
    const inventario = await prisma.inventario.findFirst({
      where: {
        id: inventarioId,
        generadorId: session.user.id,
      },
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            marca: true,
            modelo: true,
            medidas: true,
          },
        },
      },
    });

    if (!inventario) {
      return NextResponse.json(
        {
          error: "Inventario no encontrado",
          message: "No se encontró el inventario especificado o no tienes acceso a él.",
        },
        { status: 404 }
      );
    }

    // Calcular nueva cantidad
    const cantidadAjuste = tipo === "ENTRADA" ? cantidad : -cantidad;
    const nuevaCantidad = inventario.stockActual + cantidadAjuste;

    if (tipo === "SALIDA" && nuevaCantidad < 0) {
      return NextResponse.json(
        {
          error: "Stock insuficiente",
          message: `No hay suficiente stock. Stock actual: ${inventario.stockActual}, solicitado: ${cantidad}.`,
        },
        { status: 400 }
      );
    }

    // Registrar movimiento y actualizar stock en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar stock del inventario
      const inventarioActualizado = await tx.inventario.update({
        where: { id: inventarioId },
        data: {
          stockActual: nuevaCantidad,
        },
      });

      // Registrar movimiento
      const movimiento = await tx.movimientoInventario.create({
        data: {
          inventarioId,
          tipo,
          cantidad: cantidadAjuste,
          cantidadPrevia: inventario.stockActual,
          cantidadNueva: nuevaCantidad,
          motivo: motivo.trim(),
          referencia: referencia?.trim(),
          notas: notas?.trim(),
          usuarioId: session.user.id,
        },
      });

      return { inventarioActualizado, movimiento };
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.movimiento.id,
        producto: inventario.producto,
        tipo: result.movimiento.tipo,
        cantidad: Math.abs(result.movimiento.cantidad),
        cantidadPrevia: result.movimiento.cantidadPrevia,
        cantidadNueva: result.movimiento.cantidadNueva,
        motivo: result.movimiento.motivo,
        referencia: result.movimiento.referencia,
        notas: result.movimiento.notas,
        fechaMovimiento: result.movimiento.fechaMovimiento,
        usuarioId: result.movimiento.usuarioId,
        stockActual: result.inventarioActualizado.stockActual,
      },
      message: `Movimiento de ${tipo.toLowerCase()} registrado exitosamente.`,
    });
  } catch (error: unknown) {
    console.error("Error al registrar movimiento:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudo registrar el movimiento.",
      },
      { status: 500 }
    );
  }
}
