import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  comuna: z.string().optional(),
  region: z.string().optional(),
  idRETC: z.string().optional(),
  direccionComercial: z.string().optional(),
  direccionCasaMatriz: z.string().optional(),
  tipoProductorREP: z.string().optional(),
  tiposResiduos: z.array(z.string()).optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      telefono,
      direccion,
      comuna,
      region,
      idRETC,
      direccionComercial,
      direccionCasaMatriz,
      tipoProductorREP,
      tiposResiduos,
    } = result.data;

    // Actualizar usuario base
    const updateData: import("@prisma/client").Prisma.UserUpdateInput = {
      name,
      updatedAt: new Date(),
    };

    // Agregar campos generales opcionales
    if (telefono !== undefined) updateData.telefono = telefono || null;
    if (direccion !== undefined) updateData.direccion = direccion || null;
    if (comuna !== undefined) updateData.comuna = comuna || null;
    if (region !== undefined) updateData.region = region || null;

    // Agregar campos específicos de Productor/Generador si se proporcionan
    if (idRETC !== undefined) updateData.idRETC = idRETC || null;
    if (direccionComercial !== undefined)
      updateData.direccionComercial = direccionComercial || null;
    if (direccionCasaMatriz !== undefined)
      updateData.direccionCasaMatriz = direccionCasaMatriz || null;
    if (tipoProductorREP !== undefined) updateData.tipoProductorREP = tipoProductorREP || null;
    if (tiposResiduos !== undefined) updateData.tiposResiduos = tiposResiduos || [];

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        idRETC: updatedUser.idRETC,
        direccionComercial: updatedUser.direccionComercial,
        direccionCasaMatriz: updatedUser.direccionCasaMatriz,
        tipoProductorREP: updatedUser.tipoProductorREP,
        tiposResiduos: updatedUser.tiposResiduos,
      },
    });
  } catch (error: unknown) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(_req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        rut: true,
        image: true,
        telefono: true,
        direccion: true,
        comuna: true,
        region: true,
        tipoEmpresa: true,
        idRETC: true,
        direccionComercial: true,
        direccionCasaMatriz: true,
        tipoProductorREP: true,
        tiposResiduos: true,
        // Aquí se podrían incluir relaciones si existieran perfiles extendidos
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("[PROFILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
