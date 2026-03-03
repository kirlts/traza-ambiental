/**
 * API Route: /api/inventario/productos
 * Gestión de productos para inventario digital
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * GET /api/inventario/productos
 * Obtiene todos los productos activos
 *
 * @param request Request con posibles filtros
 * @returns Response con lista de productos
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get("categoriaId");
    const search = searchParams.get("search");

    const where: import("@prisma/client").Prisma.ProductoWhereInput = {
      activo: true,
    };

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { marca: { contains: search, mode: "insensitive" } },
        { modelo: { contains: search, mode: "insensitive" } },
      ];
    }

    const productos = await prisma.producto.findMany({
      where,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
        _count: {
          select: {
            inventarios: true,
          },
        },
      },
      orderBy: [{ marca: "asc" }, { modelo: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: productos.map((producto: ReturnType<typeof JSON.parse>) => ({
        id: producto.id,
        nombre: producto.nombre,
        marca: producto.marca,
        modelo: producto.modelo,
        medidas: producto.medidas,
        categoria: producto.categoria,
        descripcion: producto.descripcion,
        fechaCreacion: producto.createdAt,
        totalInventarios: producto._count.inventarios,
      })),
    });
  } catch (error: unknown) {
    console.error("Error al obtener productos:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener los productos.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventario/productos
 * Crea un nuevo producto
 *
 * @param request Datos del nuevo producto
 * @returns Response con el producto creado
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para crear productos.",
        },
        { status: 401 }
      );
    }

    // Verificar permisos (ADMIN o GENERADOR)
    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.user.id },
      include: { role: true },
    });

    const isAdmin = userRoles.some((ur: ReturnType<typeof JSON.parse>) => ur.role.name === "ADMIN");
    const isGenerador = userRoles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "GENERADOR"
    );

    if (!isAdmin && !isGenerador) {
      return NextResponse.json(
        {
          error: "Permisos insuficientes",
          message: "Solo administradores y generadores pueden crear productos.",
        },
        { status: 403 }
      );
    }

    const { nombre, marca, modelo, medidas, categoriaId, descripcion } = await request.json();

    // Validaciones
    if (!nombre || !marca || !modelo || !medidas || !categoriaId) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: "Nombre, marca, modelo, medidas y categoría son obligatorios.",
        },
        { status: 400 }
      );
    }

    // Verificar que la categoría existe
    const categoria = await prisma.categoriaProducto.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria) {
      return NextResponse.json(
        {
          error: "Categoría no encontrada",
          message: "La categoría especificada no existe.",
        },
        { status: 400 }
      );
    }

    // Verificar que no exista un producto con la misma combinación marca+modelo+medidas
    const productoExistente = await prisma.producto.findFirst({
      where: {
        marca: marca.trim(),
        modelo: modelo.trim(),
        medidas: medidas.trim(),
      },
    });

    if (productoExistente) {
      return NextResponse.json(
        {
          error: "Producto duplicado",
          message: "Ya existe un producto con esta marca, modelo y medidas.",
        },
        { status: 400 }
      );
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre: nombre.trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        medidas: medidas.trim(),
        categoriaId,
        descripcion: descripcion?.trim(),
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    // Si el usuario es generador, agregar el producto a su inventario automáticamente
    if (isGenerador) {
      try {
        await prisma.inventario.create({
          data: {
            generadorId: session.user.id,
            productoId: nuevoProducto.id,
            stockActual: 0,
            stockMinimo: 5,
          },
        });
      } catch (invError: unknown) {
        console.error("Error creando inventario para generador:", invError);
        // No fallamos la request principal, pero logueamos el error
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: nuevoProducto.id,
        nombre: nuevoProducto.nombre,
        marca: nuevoProducto.marca,
        modelo: nuevoProducto.modelo,
        medidas: nuevoProducto.medidas,
        categoria: nuevoProducto.categoria,
        descripcion: nuevoProducto.descripcion,
        fechaCreacion: nuevoProducto.createdAt,
      },
      message: "Producto creado exitosamente.",
    });
  } catch (error: unknown) {
    console.error("Error al crear producto:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudo crear el producto.",
      },
      { status: 500 }
    );
  }
}
