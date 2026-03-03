import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const gestorId = session.user.id;

    // Obtener autorizaciones vigentes
    const autorizaciones = await prisma.autorizacionSanitaria.findMany({
      where: {
        gestorId,
        estado: "VIGENTE",
        fechaVencimiento: { gte: new Date() },
      },
    });

    // Obtener capacidad utilizada actual
    const currentYear = new Date().getFullYear();
    const capacidadUtilizada = await prisma.capacidadUtilizada.findMany({
      where: {
        gestorId,
        anio: currentYear,
      },
    });

    // Obtener perfil legal global (para fallback/compatibilidad)
    const perfilLegal = await prisma.managerLegalProfile.findUnique({
      where: { managerId: gestorId },
    });

    return NextResponse.json({
      autorizaciones,
      capacidadUtilizada,
      perfilLegal,
    });
  } catch (error: unknown) {
    console.error("Error obteniendo autorizaciones del gestor:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
