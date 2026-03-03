import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    const userRoles = session?.user?.roles || [];
    if (!session || (!userRoles.includes("ADMINISTRADOR") && !userRoles.includes("ADMIN"))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    // ...

    const total = await prisma.retcEstablecimiento.count();
    const ultimos = await prisma.retcEstablecimiento.findMany({
      take: 10,
      orderBy: { fechaImportacion: "desc" },
    });

    // Obtener fecha de la última importación
    const ultimaImportacion = await prisma.retcEstablecimiento.findFirst({
      orderBy: { fechaImportacion: "desc" },
      select: { fechaImportacion: true },
    });

    return NextResponse.json({
      total,
      ultimos,
      ultimaActualizacion: ultimaImportacion?.fechaImportacion,
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}
