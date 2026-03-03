import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";

/**
 * GET /api/solicitudes/[id]/datos-transportista
 *
 * Obtiene los datos declarados por el transportista para comparación durante la validación.
 * Solo accesible para el gestor asignado a la solicitud.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    if (!isGestor(session)) {
      return NextResponse.json({ error: "No autorizado - Requiere rol gestor" }, { status: 403 });
    }

    // Obtener la solicitud con validación de permisos
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id },
      include: {
        generador: {
          select: {
            name: true,
            email: true,
          },
        },
        transportista: {
          select: {
            name: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            patente: true,
            tipo: true,
          },
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // Verificar que el gestor actual sea el asignado
    if (solicitud.gestorId !== session.user.id) {
      return NextResponse.json(
        { error: "No autorizado - No eres el gestor asignado a esta solicitud" },
        { status: 403 }
      );
    }

    // Verificar que la solicitud esté en estado correcto
    if (solicitud.estado !== "ENTREGADA_GESTOR") {
      return NextResponse.json(
        { error: "La solicitud no está en estado correcto para validación" },
        { status: 400 }
      );
    }

    // Formatear respuesta con datos del transportista
    const datosTransportista = {
      id: solicitud.id,
      folio: solicitud.folio,
      fechaEntrega: solicitud.fechaEntregaGestor,
      pesoDeclarado: solicitud.pesoReal,
      cantidadDeclarada: solicitud.cantidadReal,
      categoriaDeclarada: [
        ...(solicitud.categoriaA_cantidad > 0 ? ["A"] : []),
        ...(solicitud.categoriaB_cantidad > 0 ? ["B"] : []),
      ],
      fotosTransportista: solicitud.fotos || [],
      generador: solicitud.generador,
      transportista: solicitud.transportista,
      vehiculo: solicitud.vehiculo,
      instrucciones: solicitud.instrucciones,
    };

    return NextResponse.json(datosTransportista);
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
