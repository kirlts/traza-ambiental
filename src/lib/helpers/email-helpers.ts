/**
 * Helpers para Envío de Emails
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { sendEmail } from "@/lib/emails/send";
import {
  getConfirmacionSolicitudTemplate,
  getNuevaSolicitudAdminTemplate,
} from "@/lib/emails/solicitud-templates";
import { prisma } from "@/lib/prisma";

/**
 * Envía email de confirmación al generador cuando crea una solicitud
 */
export async function enviarEmailConfirmacionSolicitud(params: {
  email: string;
  nombreGenerador: string;
  folio: string;
  fechaPreferida: string | Date;
  direccionRetiro: string;
  cantidadTotal: number;
  pesoTotal: number;
  solicitudId?: string;
}): Promise<boolean> {
  const template = getConfirmacionSolicitudTemplate(
    params.nombreGenerador,
    params.folio,
    params.fechaPreferida,
    params.direccionRetiro,
    params.cantidadTotal,
    params.pesoTotal,
    params.solicitudId
  );

  return await sendEmail(params.email, template);
}

/**
 * Envía notificación a administradores sobre nueva solicitud
 */
export async function notificarAdministradoresNuevaSolicitud(params: {
  folio: string;
  generadorNombre: string;
  generadorEmail: string;
  cantidadTotal: number;
  fechaPreferida: string | Date;
}): Promise<boolean> {
  // Obtener emails de administradores desde la base de datos
  // Por ahora, hardcoded o variable de entorno, pero idealmente query a usuarios con rol ADMIN
  const adminEmail = process.env.ADMIN_EMAIL || "admin@trazambiental.com";

  // Si queremos notificar a múltiples admins, podríamos hacer una query:
  // const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  // const emails = admins.map(a => a.email);

  const template = getNuevaSolicitudAdminTemplate(
    params.folio,
    params.generadorNombre,
    params.generadorEmail,
    params.cantidadTotal,
    params.fechaPreferida
  );

  // Por ahora enviamos al email configurado como admin principal
  return await sendEmail(adminEmail, template);
}

/**
 * Registra la notificación en la base de datos
 */
export async function crearNotificacionEnBD(params: {
  userId: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  referencia?: string;
}): Promise<void> {
  try {
    await prisma.notificacion.create({
      data: {
        userId: params.userId,
        tipo: params.tipo,
        titulo: params.titulo,
        mensaje: params.mensaje,
        referencia: params.referencia,
        leida: false,
      },
    });
  } catch (error: unknown) {
    console.error("Error al crear notificación en BD:", error);
  }
}
