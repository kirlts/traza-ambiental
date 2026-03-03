/**
 * API Route: /api/solicitudes
 * Gestión de Solicitudes de Retiro de NFU
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { solicitudCompletaSchema, borradorSchema } from "@/lib/validations/solicitud-retiro";
import {
  generarFolio,
  calcularTotales,
  crearCambioEstado,
  puedeCrearSolicitud,
  formatearSolicitudParaResponse,
} from "@/lib/helpers/solicitud-helpers";
import { EstadoSolicitud, Prisma } from "@prisma/client";

/**
 * POST /api/solicitudes
 * Crea una nueva solicitud de retiro de NFU
 *
 * @param request Request con datos de la solicitud
 * @returns Response con la solicitud creada o error
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Verificar que el usuario sea generador con cuenta aprobada
    const puedeCrear = await puedeCrearSolicitud(session.user.id);

    if (!puedeCrear) {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Solo generadores con cuenta aprobada pueden crear solicitudes",
        },
        { status: 403 }
      );
    }

    // 3. Parsear y validar datos
    const body = await request.json();
    const esBorrador = body.esBorrador === true;

    // Usar schema apropiado según si es borrador o no
    const schema = esBorrador ? borradorSchema : solicitudCompletaSchema;
    const validacion = schema.safeParse(body);

    if (!validacion.success) {
      const firstError = validacion.error.issues[0];
      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: firstError
            ? `${firstError.path.join(".")}: ${firstError.message}`
            : "Datos inválidos",
          details: validacion.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validacion.data;

    // 4. Calcular totales
    const totales = calcularTotales({
      categoriaA_cantidad: data.categoriaA_cantidad || 0,
      categoriaA_pesoEst: data.categoriaA_pesoEst || 0,
      categoriaB_cantidad: data.categoriaB_cantidad || 0,
      categoriaB_pesoEst: data.categoriaB_pesoEst || 0,
    });

    // 5. Generar folio único
    const folio = await generarFolio();

    // 6. Crear solicitud en la base de datos
    const solicitud = await prisma.solicitudRetiro.create({
      data: {
        folio,
        generadorId: session.user.id,

        // Paso 1
        direccionRetiro: data.direccionRetiro || "",
        region: data.region || "",
        comuna: data.comuna || "",
        fechaPreferida: data.fechaPreferida ? new Date(data.fechaPreferida) : new Date(),
        horarioPreferido: data.horarioPreferido || "manana",

        // Paso 2
        categoriaA_cantidad: data.categoriaA_cantidad || 0,
        categoriaA_pesoEst: data.categoriaA_pesoEst || 0,
        categoriaB_cantidad: data.categoriaB_cantidad || 0,
        categoriaB_pesoEst: data.categoriaB_pesoEst || 0,
        cantidadTotal: totales.cantidadTotal,
        pesoTotalEstimado: totales.pesoTotalEstimado,

        // Paso 3
        nombreContacto: data.nombreContacto || "",
        telefonoContacto: data.telefonoContacto || "",
        instrucciones: data.instrucciones,
        fotos: data.fotos || [],

        // Estado
        estado: EstadoSolicitud.PENDIENTE,
        esBorrador,
      },
      include: {
        generador: {
          select: {
            id: true,
            name: true,
            email: true,
            rut: true,
          },
        },
      },
    });

    // 7. Registrar cambio de estado inicial
    await crearCambioEstado({
      solicitudId: solicitud.id,
      estadoAnterior: null,
      estadoNuevo: EstadoSolicitud.PENDIENTE,
      realizadoPor: session.user.id,
      notas: esBorrador ? "Solicitud guardada como borrador" : "Solicitud creada y enviada",
    });

    // 8. Enviar notificaciones (no bloquear respuesta)
    if (!esBorrador) {
      // Importar helpers de email de forma asíncrona
      import("@/lib/helpers/email-helpers").then(
        async ({
          enviarEmailConfirmacionSolicitud,
          notificarAdministradoresNuevaSolicitud,
          crearNotificacionEnBD,
        }) => {
          try {
            // Obtener email del representante si existe
            const generadorInfo = await prisma.user.findUnique({
              where: { id: session.user.id },
              include: {
                solicitudesRegistro: {
                  select: {
                    emailRepresentante: true,
                  },
                },
              },
            });

            const emailUsuario = session.user.email || "";
            const emailRepresentante = generadorInfo?.solicitudesRegistro?.emailRepresentante;

            // Construir lista de emails (usuario actual + representante si es diferente)
            const emailsDestino = [emailUsuario];
            if (emailRepresentante && emailRepresentante !== emailUsuario) {
              emailsDestino.push(emailRepresentante);
            }

            // Email de confirmación al generador (y representante)
            await enviarEmailConfirmacionSolicitud({
              email: emailsDestino.join(","), // Enviar a todos los destinatarios
              nombreGenerador: session.user.name || "Generador",
              folio,
              fechaPreferida: data.fechaPreferida || "",
              direccionRetiro: data.direccionRetiro || "",
              cantidadTotal: totales.cantidadTotal,
              pesoTotal: totales.pesoTotalEstimado,
              solicitudId: solicitud.id,
            });

            // Notificación a administradores
            await notificarAdministradoresNuevaSolicitud({
              folio,
              generadorNombre: session.user.name || "Generador",
              generadorEmail: session.user.email || "",
              cantidadTotal: totales.cantidadTotal,
              fechaPreferida: data.fechaPreferida || "",
            });

            // Crear notificación en BD para el generador
            await crearNotificacionEnBD({
              userId: session.user.id,
              tipo: "solicitud_creada",
              titulo: "Solicitud Creada",
              mensaje: `Su solicitud ${folio} ha sido creada exitosamente`,
              referencia: solicitud.id,
            });
          } catch (error: unknown) {
            console.error("Error al enviar notificaciones:", error);
            // No fallar la solicitud si las notificaciones fallan
          }
        }
      );
    }

    // 9. Retornar respuesta exitosa
    const solicitudFormateada = formatearSolicitudParaResponse(solicitud);

    return NextResponse.json(
      {
        success: true,
        message: esBorrador ? "Borrador guardado exitosamente" : "Solicitud creada exitosamente",
        data: solicitudFormateada,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error al crear solicitud:", error);

    const errorMessage =
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido";

    if (errorMessage === "Usuario no encontrado") {
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Su sesión es inválida. Por favor, cierre sesión e ingrese nuevamente.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: errorMessage,
        details:
          error instanceof Error ? (error as ReturnType<typeof JSON.parse>).stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/solicitudes
 * Obtiene las solicitudes del generador autenticado
 *
 * Query params:
 * - estado: filtrar por estado
 * - page: número de página (default: 1)
 * - limit: solicitudes por página (default: 10)
 *
 * @param request Request con query params
 * @returns Response con lista de solicitudes
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 2. Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado") as EstadoSolicitud | null;
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // 3. Construir filtros
    const where: Prisma.SolicitudRetiroWhereInput = {
      generadorId: session.user.id,
    };

    if (estado) {
      where.estado = estado;
    }

    if (search) {
      where.OR = [
        { folio: { contains: search, mode: "insensitive" } },
        { direccionRetiro: { contains: search, mode: "insensitive" } },
      ];
    }

    // 4. Obtener solicitudes con paginación
    const [solicitudes, total] = await Promise.all([
      prisma.solicitudRetiro.findMany({
        where,
        include: {
          generador: {
            select: {
              id: true,
              name: true,
              email: true,
              rut: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.solicitudRetiro.count({ where }),
    ]);

    // 5. Formatear solicitudes
    const solicitudesFormateadas = solicitudes.map(formatearSolicitudParaResponse);

    // 6. Retornar respuesta con paginación
    return NextResponse.json({
      success: true,
      data: solicitudesFormateadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Error al obtener solicitudes:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "No se pudieron obtener las solicitudes.",
      },
      { status: 500 }
    );
  }
}
