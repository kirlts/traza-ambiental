/**
 * API Route: /api/inventario/stock
 * Gestión del inventario/stock para generadores
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * GET /api/inventario/stock
 * Obtiene el inventario del generador autenticado
 *
 * @returns Response con inventario del generador
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para acceder al inventario.",
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
          message: "Solo los generadores pueden acceder al inventario.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productoId = searchParams.get("productoId");

    const where: import("@prisma/client").Prisma.InventarioWhereInput = {
      generadorId: session.user.id,
    };

    if (productoId) {
      where.productoId = productoId;
    }

    const inventarios = await prisma.inventario.findMany({
      where,
      include: {
        producto: {
          include: {
            categoria: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        movimientos: {
          orderBy: {
            fechaMovimiento: "desc",
          },
          take: 5, // Últimos 5 movimientos
          select: {
            id: true,
            tipo: true,
            cantidad: true,
            motivo: true,
            fechaMovimiento: true,
          },
        },
        _count: {
          select: {
            movimientos: true,
          },
        },
      },
      orderBy: [{ producto: { marca: "asc" } }, { producto: { modelo: "asc" } }],
    });

    const resumen = {
      totalProductos: inventarios.length,
      totalUnidades: inventarios.reduce((sum, inv) => sum + inv.stockActual, 0),
      productosBajoStock: inventarios.filter((inv) => inv.stockActual <= inv.stockMinimo).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        resumen,
        inventarios: inventarios.map((inventario) => ({
          id: inventario.id,
          producto: {
            id: inventario.producto.id,
            nombre: inventario.producto.nombre,
            marca: inventario.producto.marca,
            modelo: inventario.producto.modelo,
            medidas: inventario.producto.medidas,
            categoria: inventario.producto.categoria,
          },
          stockActual: inventario.stockActual,
          stockMinimo: inventario.stockMinimo,
          ubicacion: inventario.ubicacion,
          fechaActualizacion: inventario.updatedAt,
          ultimosMovimientos: inventario.movimientos,
          totalMovimientos: inventario._count.movimientos,
        })),
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener inventario:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudo obtener el inventario.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventario/stock
 * Agrega o actualiza un producto en el inventario del generador
 *
 * @param request Datos del producto a agregar/actualizar
 * @returns Response con el inventario actualizado
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para modificar el inventario.",
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
          message: "Solo los generadores pueden modificar el inventario.",
        },
        { status: 403 }
      );
    }

    const { productoId, cantidadInicial, stockMinimo, ubicacion } = await request.json();

    if (!productoId || cantidadInicial === undefined) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: "Producto y cantidad inicial son obligatorios.",
        },
        { status: 400 }
      );
    }

    if (cantidadInicial < 0) {
      return NextResponse.json(
        {
          error: "Cantidad inválida",
          message: "La cantidad inicial no puede ser negativa.",
        },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const producto = await prisma.producto.findUnique({
      where: { id: productoId },
    });

    if (!producto) {
      return NextResponse.json(
        {
          error: "Producto no encontrado",
          message: "El producto especificado no existe.",
        },
        { status: 400 }
      );
    }

    // Verificar si ya existe inventario para este producto y generador
    const inventarioExistente = await prisma.inventario.findUnique({
      where: {
        generadorId_productoId: {
          generadorId: session.user.id,
          productoId,
        },
      },
    });

    let inventario;
    const result = await prisma.$transaction(async (tx) => {
      if (inventarioExistente) {
        // Actualizar inventario existente
        inventario = await tx.inventario.update({
          where: { id: inventarioExistente.id },
          data: {
            stockActual: cantidadInicial,
            stockMinimo: stockMinimo || 0,
            ubicacion: ubicacion?.trim(),
          },
        });

        // Registrar movimiento de ajuste
        await tx.movimientoInventario.create({
          data: {
            inventarioId: inventario.id,
            tipo: "ENTRADA",
            cantidad: cantidadInicial - inventarioExistente.stockActual,
            cantidadPrevia: inventarioExistente.stockActual,
            cantidadNueva: cantidadInicial,
            motivo: "Ajuste de inventario inicial",
            usuarioId: session.user.id,
          },
        });
      } else {
        // Crear nuevo inventario
        inventario = await tx.inventario.create({
          data: {
            generadorId: session.user.id,
            productoId,
            stockActual: cantidadInicial,
            stockMinimo: stockMinimo || 0,
            ubicacion: ubicacion?.trim(),
          },
        });

        // Registrar movimiento inicial
        await tx.movimientoInventario.create({
          data: {
            inventarioId: inventario.id,
            tipo: "ENTRADA",
            cantidad: cantidadInicial,
            cantidadPrevia: 0,
            cantidadNueva: cantidadInicial,
            motivo: "Inventario inicial",
            usuarioId: session.user.id,
          },
        });
      }

      return inventario;
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          marca: producto.marca,
          modelo: producto.modelo,
          medidas: producto.medidas,
        },
        stockActual: result.stockActual,
        stockMinimo: result.stockMinimo,
        ubicacion: result.ubicacion,
        fechaActualizacion: result.updatedAt,
      },
      message: inventarioExistente
        ? "Inventario actualizado exitosamente."
        : "Producto agregado al inventario exitosamente.",
    });
  } catch (error: unknown) {
    console.error("Error al actualizar inventario:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudo actualizar el inventario.",
      },
      { status: 500 }
    );
  }
}
