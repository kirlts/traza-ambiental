import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EstadoAutorizacion, TratamientoTipo } from "@prisma/client";
import { z } from "zod";

const autorizacionSchema = z.object({
  numeroResolucion: z.string().min(1),
  autoridadEmisora: z.string().min(1),
  fechaEmision: z.string(),
  fechaVencimiento: z.string(),
  tratamientosAutorizados: z.array(z.nativeEnum(TratamientoTipo)),
  capacidadAnualTn: z.number().positive(),
  categoriasResiduos: z.array(z.string()).min(1),
  observaciones: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id: gestorId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Permitir acceso al admin o al mismo gestor
    const isAdmin =
      session.user.roles?.includes("Administrador") || session.user.roles?.includes("ADMIN");
    const isOwner = session.user.id === gestorId;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Permisos insuficientes" }, { status: 403 });
    }

    const autorizaciones = await prisma.autorizacionSanitaria.findMany({
      where: { gestorId },
      orderBy: { fechaVencimiento: "desc" },
    });

    // Calcular capacidad utilizada
    const currentYear = new Date().getFullYear();
    const capacidadUtilizada = await prisma.capacidadUtilizada.findMany({
      where: { gestorId, anio: currentYear },
    });

    return NextResponse.json({
      autorizaciones,
      capacidadUtilizada,
    });
  } catch (error: unknown) {
    console.error("Error obteniendo autorizaciones:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id: gestorId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Solo admin puede crear autorizaciones
    const isAdmin =
      session.user.roles?.includes("Administrador") || session.user.roles?.includes("ADMIN");
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Solo administradores pueden gestionar autorizaciones" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validacion = autorizacionSchema.safeParse(body);

    if (!validacion.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validacion.error.issues },
        { status: 400 }
      );
    }

    const data = validacion.data;

    // Verificar si ya existe resolución con ese número
    const existing = await prisma.autorizacionSanitaria.findUnique({
      where: { numeroResolucion: data.numeroResolucion },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una resolución con este número" },
        { status: 400 }
      );
    }

    const nuevaAutorizacion = await prisma.autorizacionSanitaria.create({
      data: {
        gestorId,
        numeroResolucion: data.numeroResolucion,
        autoridadEmisora: data.autoridadEmisora,
        fechaEmision: new Date(data.fechaEmision),
        fechaVencimiento: new Date(data.fechaVencimiento),
        tratamientosAutorizados: data.tratamientosAutorizados,
        capacidadAnualTn: data.capacidadAnualTn,
        categoriasResiduos: data.categoriasResiduos,
        observaciones: data.observaciones,
        registradoPor: session.user.id,
        estado: EstadoAutorizacion.VIGENTE,
      },
    });

    return NextResponse.json(nuevaAutorizacion);
  } catch (error: unknown) {
    console.error("Error creando autorización:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
