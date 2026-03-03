import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/solicitudes/[id]
 *
 * Obtiene los detalles completos de una solicitud específica.
 * Solo accesible para el gestor propietario de la solicitud.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    const { id: solicitudId } = await params;

    // Construir condiciones de acceso
    // Administradores pueden ver todas las solicitudes
    const whereClause: import("@prisma/client").Prisma.SolicitudRetiroWhereInput = {
      id: solicitudId,
    };

    // Si no es admin, agregar restricción de propiedad
    const isAdmin =
      session.user.roles?.includes("Administrador") || session.user.roles?.includes("ADMIN");
    if (!isAdmin) {
      whereClause.OR = [{ gestorId: session.user.id }, { generadorId: session.user.id }];
    }

    const solicitud = await prisma.solicitudRetiro.findFirst({
      where: whereClause,
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
        cambiosEstado: {
          include: {
            usuario: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            fecha: "desc",
          },
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json(
        { error: "Solicitud no encontrada o no tienes permisos para verla" },
        { status: 404 }
      );
    }

    // Formatear respuesta
    const data = {
      id: solicitud.id,
      folio: solicitud.folio,
      estado: solicitud.estado,
      fechaRecepcionPlanta: solicitud.fechaRecepcionPlanta,
      createdAt: solicitud.createdAt,

      // Campos requeridos por Generador (Confirmación)
      fechaPreferida: solicitud.fechaPreferida,
      horarioPreferido: solicitud.horarioPreferido,
      direccionRetiro: solicitud.direccionRetiro,
      comuna: solicitud.comuna,
      region: solicitud.region,

      // Totales y Detalle Carga
      cantidadTotal: solicitud.cantidadTotal,
      pesoTotalEstimado: solicitud.pesoTotalEstimado,
      categoriaA_cantidad: solicitud.categoriaA_cantidad,
      categoriaA_pesoEst: solicitud.categoriaA_pesoEst,
      categoriaB_cantidad: solicitud.categoriaB_cantidad,
      categoriaB_pesoEst: solicitud.categoriaB_pesoEst,

      // Contacto e Instrucciones
      nombreContacto: solicitud.nombreContacto,
      telefonoContacto: solicitud.telefonoContacto,
      instrucciones: solicitud.instrucciones,
      fotos: solicitud.fotos,

      // Totales (Legacy/Compatibilidad si es necesario, pero preferimos root level)
      totales: {
        cantidad: solicitud.cantidadTotal,
        pesoEstimado: solicitud.pesoTotalEstimado,
      },

      // Información del generador
      generador: solicitud.generador,

      // Información del transportista
      transportista: solicitud.transportista,
      vehiculo: null,

      // Datos de validación (después de recepción en planta)
      pesoReal: solicitud.pesoReal,
      cantidadReal: solicitud.cantidadReal,
      // Construir array de categorías validadas desde categoriaA_cantidad y categoriaB_cantidad
      categoriaVerificada: [
        ...(solicitud.categoriaA_cantidad > 0 ? ["A"] : []),
        ...(solicitud.categoriaB_cantidad > 0 ? ["B"] : []),
      ],
      // Alias para compatibilidad con el frontend
      pesoRomana: solicitud.pesoReal,
      cantidadVerificada: solicitud.cantidadReal,

      // Datos de tratamiento (si ya existen)
      tipoTratamiento: null, // solicitud.tipoTratamiento,
      fechaInicioTratamiento: null, // solicitud.fechaInicioTratamiento,
      fechaFinTratamiento: null, // solicitud.fechaFinTratamiento,
      descripcionTratamiento: null, // solicitud.descripcionTratamiento,
      ubicacionTratamiento: null, // solicitud.ubicacionTratamiento,
      documentosTratamiento: null, // solicitud.documentosTratamiento,
      asignadoPor: null, // solicitud.asignadoPor,

      // Historial de cambios
      historialEstados: solicitud.cambiosEstado.map((cambio) => ({
        id: cambio.id,
        estadoAnterior: cambio.estadoAnterior,
        estadoNuevo: cambio.estadoNuevo,
        fecha: cambio.fecha,
        usuario: cambio.usuario,
      })),
    };

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("❌ Error obteniendo detalles de solicitud:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/solicitudes/[id]
 *
 * Actualiza una solicitud existente.
 * Solo permitido para el generador propietario y si la solicitud está en estado PENDIENTE o RECHAZADA.
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: solicitudId } = await params;
    const body = await request.json();

    // 1. Buscar la solicitud
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // 2. Verificar permisos (Solo el creador puede editar)
    if (solicitud.generadorId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos para editar esta solicitud" },
        { status: 403 }
      );
    }

    // 3. Verificar estado editable (CAC-1, CAC-5)
    if (solicitud.estado !== "PENDIENTE" && solicitud.estado !== "RECHAZADA") {
      return NextResponse.json(
        {
          error: `No se puede editar una solicitud en estado ${solicitud.estado}. Solo solicitudes PENDIENTE o RECHAZADA son editables.`,
        },
        { status: 400 }
      );
    }

    // 4. Validar fecha futura (CAC-6)
    if (body.fechaPreferida) {
      const fechaNueva = new Date(body.fechaPreferida);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaNueva < hoy) {
        return NextResponse.json(
          { error: "La fecha preferida debe ser futura o el día de hoy." },
          { status: 400 }
        );
      }
    }

    // 5. Preparar datos de actualización
    const updateData: import("@prisma/client").Prisma.SolicitudRetiroUpdateInput = {
      direccionRetiro: body.direccionRetiro,
      region: body.region,
      comuna: body.comuna,
      fechaPreferida: new Date(body.fechaPreferida),
      horarioPreferido: body.horarioPreferido,
      nombreContacto: body.nombreContacto,
      telefonoContacto: body.telefonoContacto,
      instrucciones: body.instrucciones,
      categoriaA_cantidad: body.categoriaA_cantidad,
      categoriaA_pesoEst: body.categoriaA_pesoEst,
      categoriaB_cantidad: body.categoriaB_cantidad,
      categoriaB_pesoEst: body.categoriaB_pesoEst,
      pesoTotalEstimado: body.pesoTotalEstimado,
      cantidadTotal: body.cantidadTotal,
      fotos: body.fotos,
    };

    // 6. Lógica de cambio de estado (CAC-3)
    let nuevoEstado = solicitud.estado;
    if (solicitud.estado === "RECHAZADA") {
      nuevoEstado = "PENDIENTE";
      updateData.estado = "PENDIENTE";
      updateData.motivoRechazo = null; // Limpiar motivo rechazo al reenviar
      updateData.detallesRechazo = null;
    }

    // 7. Ejecutar transacción
    const updatedSolicitud = await prisma.$transaction(async (tx) => {
      // Actualizar registro
      const updated = await tx.solicitudRetiro.update({
        where: { id: solicitudId },
        data: updateData,
      });

      // Registrar historial
      // Si cambió de estado (Rechazada -> Pendiente)
      if (solicitud.estado !== nuevoEstado) {
        await tx.cambioEstado.create({
          data: {
            solicitudId,
            estadoAnterior: solicitud.estado,
            estadoNuevo: nuevoEstado,
            realizadoPor: session.user.id,
            notas: "Solicitud editada y re-enviada por el generador.",
          },
        });
      } else {
        // Si se mantuvo en Pendiente, registramos la edición para trazabilidad
        await tx.cambioEstado.create({
          data: {
            solicitudId,
            estadoAnterior: solicitud.estado,
            estadoNuevo: solicitud.estado, // Mismo estado
            realizadoPor: session.user.id,
            notas: "Solicitud editada por el generador.",
          },
        });
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Solicitud actualizada correctamente",
      data: updatedSolicitud,
    });
  } catch (error: unknown) {
    console.error("❌ Error actualizando solicitud:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
