import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isProductor } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { generarFolioDeclaracion, calcularMetasREP } from "@/lib/helpers/declaracion-helpers";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!isProductor(session)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { id } = await params;

    // Buscar la declaración
    const declaracion = await prisma.declaracionAnual.findUnique({
      where: { id },
      include: { categorias: true },
    });

    if (!declaracion) {
      return NextResponse.json({ error: "Declaración no encontrada" }, { status: 404 });
    }

    // Verificar que es del productor actual
    if (declaracion.productorId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado para esta declaración" }, { status: 403 });
    }

    // Verificar que está en estado borrador
    if (declaracion.estado !== "borrador") {
      return NextResponse.json(
        { error: "Solo se pueden enviar declaraciones en estado borrador" },
        { status: 400 }
      );
    }

    // Verificar que tiene al menos una categoría
    if (declaracion.categorias.length === 0) {
      return NextResponse.json(
        { error: "La declaración debe tener al menos una categoría con datos" },
        { status: 400 }
      );
    }

    // Generar folio único
    const folio = await generarFolioDeclaracion(declaracion.anio);

    // Calcular metas REP
    const metas = await calcularMetasREP(declaracion.anio, declaracion.totalToneladas);

    // Actualizar declaración y crear metas en una transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Actualizar declaración
      const declaracionActualizada = await tx.declaracionAnual.update({
        where: { id },
        data: {
          estado: "enviada",
          folio,
          fechaDeclaracion: new Date(),
        },
        include: {
          categorias: true,
        },
      });

      // Crear meta de recolección
      const metaRecoleccion = await tx.meta.create({
        data: {
          declaracionId: id,
          productorId: session.user.id!,
          anio: metas.anioMeta,
          tipo: "recoleccion",
          metaToneladas: metas.metaRecoleccion,
          avanceToneladas: 0,
          porcentajeAvance: 0,
          estado: "activa",
        },
      });

      // Crear meta de valorización
      const metaValorizacion = await tx.meta.create({
        data: {
          declaracionId: id,
          productorId: session.user.id!,
          anio: metas.anioMeta,
          tipo: "valorizacion",
          metaToneladas: metas.metaValorizacion,
          avanceToneladas: 0,
          porcentajeAvance: 0,
          estado: "activa",
        },
      });

      // Crear notificación
      await tx.notificacion.create({
        data: {
          userId: session.user.id!,
          tipo: "declaracion_aprobada",
          titulo: "Declaración Enviada Exitosamente",
          mensaje: `Tu declaración para el año ${declaracion.anio} ha sido enviada con folio ${folio}. Se han generado tus metas para el año ${metas.anioMeta}.`,
          referencia: id,
          leida: false,
        },
      });

      return {
        declaracion: declaracionActualizada,
        metas: {
          recoleccion: metaRecoleccion,
          valorizacion: metaValorizacion,
        },
      };
    });

    return NextResponse.json({
      ...resultado,
      mensaje: `Declaración enviada exitosamente con folio ${folio}`,
      folio,
    });
  } catch (error: unknown) {
    console.error("Error al enviar declaración:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
