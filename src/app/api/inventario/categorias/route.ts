/**
 * API Route: /api/inventario/categorias
 * Gestión de categorías de productos para inventario digital
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/**
 * GET /api/inventario/categorias
 * Obtiene todas las categorías de productos activas
 *
 * @returns Response con lista de categorías
 */
export async function GET() {
  try {
    const categorias = await prisma.categoriaProducto.findMany({
      where: {
        activa: true,
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        createdAt: true,
        _count: {
          select: {
            productos: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categorias.map((categoria) => ({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        fechaCreacion: categoria.createdAt,
        totalProductos: categoria._count.productos,
      })),
    });
  } catch (error: unknown) {
    console.error("Error al obtener categorías:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener las categorías de productos.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventario/categorias
 * Crea una nueva categoría de producto
 *
 * @param request Datos de la nueva categoría
 * @returns Response con la categoría creada
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes estar autenticado para crear categorías.",
        },
        { status: 401 }
      );
    }

    // Verificar permisos (solo administradores pueden crear categorías)
    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.user.id },
      include: { role: true },
    });

    const isAdmin = userRoles.some((ur: ReturnType<typeof JSON.parse>) => ur.role.name === "ADMIN");
    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Permisos insuficientes",
          message: "Solo los administradores pueden crear categorías de productos.",
        },
        { status: 403 }
      );
    }

    const { nombre, descripcion } = await request.json();

    if (!nombre || nombre.trim() === "") {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: "El nombre de la categoría es obligatorio.",
        },
        { status: 400 }
      );
    }

    // Verificar que no exista una categoría con el mismo nombre
    const categoriaExistente = await prisma.categoriaProducto.findFirst({
      where: {
        nombre: nombre.trim(),
      },
    });

    if (categoriaExistente) {
      return NextResponse.json(
        {
          error: "Categoría duplicada",
          message: "Ya existe una categoría con este nombre.",
        },
        { status: 400 }
      );
    }

    const nuevaCategoria = await prisma.categoriaProducto.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim(),
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: nuevaCategoria.id,
        nombre: nuevaCategoria.nombre,
        descripcion: nuevaCategoria.descripcion,
        fechaCreacion: nuevaCategoria.createdAt,
      },
      message: "Categoría creada exitosamente.",
    });
  } catch (error: unknown) {
    console.error("Error al crear categoría:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudo crear la categoría.",
      },
      { status: 500 }
    );
  }
}
