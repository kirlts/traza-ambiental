import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { uploadFile } from "@/lib/storage";

// Validar mes y año
const _querySchema = z.object({
  anio: z.coerce.number().int().min(2020).max(2100).default(new Date().getFullYear()),
});

// Schema para POST
const postSchema = z.object({
  mes: z.coerce.number().int().min(1).max(12),
  anio: z.coerce.number().int().min(2020).max(2100),
  folioSinader: z.string().optional(),
});

/**
 * GET /api/gestor/cumplimiento-sinader?anio=YYYY
 * Obtiene el estado de cumplimiento (declaraciones) para todos los meses del año indicado.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const anio = Number(searchParams.get("anio")) || new Date().getFullYear();

    // Verificar permisos: Gestor ve lo suyo, Admin ve todo (aunque este endpoint es gestor-centric,
    // si un admin quiere ver, probablemente use otro endpoint o pase gestorId como param si ampliamos)
    // Por ahora asumimos contexto de "Mi Cumplimiento" para el gestor logueado.

    const declaraciones = await prisma.declaracionSinader.findMany({
      where: {
        gestorId: session.user.id,
        anio: anio,
      },
    });

    return NextResponse.json({
      declaraciones,
      anio,
    });
  } catch (error: unknown) {
    console.error("Error obteniendo cumplimiento SINADER:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

/**
 * POST /api/gestor/cumplimiento-sinader
 * Sube una declaración para un mes específico.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const archivo = formData.get("archivo") as File;
    const mes = Number(formData.get("mes"));
    const anio = Number(formData.get("anio"));
    const folioSinader = formData.get("folioSinader") as string;

    if (!archivo) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    // Validar datos básicos
    const validation = postSchema.safeParse({ mes, anio, folioSinader });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validation.error },
        { status: 400 }
      );
    }

    // Subir archivo
    const fileUrl = await uploadFile(archivo, "declaraciones-sinader");

    // Guardar en BD (Upsert para permitir correcciones/actualizaciones del mismo mes)
    const declaracion = await prisma.declaracionSinader.upsert({
      where: {
        gestorId_anio_mes: {
          gestorId: session.user.id,
          anio,
          mes,
        },
      },
      update: {
        archivoUrl: fileUrl,
        folioSinader: folioSinader || null,
        fechaCarga: new Date(),
        updatedAt: new Date(),
      },
      create: {
        gestorId: session.user.id,
        anio,
        mes,
        archivoUrl: fileUrl,
        folioSinader: folioSinader || null,
      },
    });

    return NextResponse.json(declaracion);
  } catch (error: unknown) {
    console.error("Error subiendo declaración SINADER:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
