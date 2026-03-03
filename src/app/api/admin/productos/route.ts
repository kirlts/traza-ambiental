import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const isAdmin =
      session?.user?.roles?.includes("Administrador") || session?.user?.roles?.includes("ADMIN");
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoria = searchParams.get("categoria") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: Prisma.ProductoWhereInput = {
      OR: search
        ? [
            { nombre: { contains: search, mode: "insensitive" } },
            { marca: { contains: search, mode: "insensitive" } },
            { modelo: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
      categoriaId: categoria ? categoria : undefined,
    };

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: "asc" },
        include: {
          _count: {
            select: { inventarios: true },
          },
        },
      }),
      prisma.producto.count({ where }),
    ]);

    return NextResponse.json({
      productos,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    console.error("Error listando productos:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const isAdmin =
      session?.user?.roles?.includes("Administrador") || session?.user?.roles?.includes("ADMIN");
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const producto = await prisma.producto.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(producto);
  } catch (error: unknown) {
    console.error("Error actualizando producto:", error);
    return NextResponse.json({ error: "Error actualizando producto" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    const isAdmin =
      session?.user?.roles?.includes("Administrador") || session?.user?.roles?.includes("ADMIN");
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    // Verificar dependencias antes de borrar
    const dependencias = await prisma.inventario.count({
      where: { productoId: id },
    });

    if (dependencias > 0) {
      return NextResponse.json(
        {
          error: `No se puede eliminar: El producto está en uso en ${dependencias} inventario(s).`,
        },
        { status: 409 }
      );
    }

    await prisma.producto.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error eliminando producto:", error);
    return NextResponse.json({ error: "Error eliminando producto" }, { status: 500 });
  }
}
