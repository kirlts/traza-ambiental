import formData from "form-data";
import Mailgun from "mailgun.js";
import { EmailTemplate } from "./templates";

// Configuración de Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "dummy_key_para_build_next",
  url: process.env.MAILGUN_API_URL || "https://api.mailgun.net", // Para EU use: https://api.eu.mailgun.net
});

/**
 * Envía un email usando los templates predefinidos
 */
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  options: {
    from?: string;
    replyTo?: string;
  } = {}
): Promise<boolean> {
  try {
    const mailgunDomain = process.env.MAILGUN_DOMAIN || "";

    // Validación de configuración
    if (!mailgunDomain || !process.env.MAILGUN_API_KEY) {
      return false;
    }

    const fromName = process.env.FROM_NAME || "TrazAmbiental";
    const fromEmail = process.env.FROM_EMAIL || `noreply@${mailgunDomain}`;
    const from = options.from || `${fromName} <${fromEmail}>`;

    const messageData = {
      from,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
      ...(options.replyTo && { "h:Reply-To": options.replyTo }),
    };

    await mg.messages.create(mailgunDomain, messageData);

    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica la configuración del email (útil para debugging)
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const mailgunDomain = process.env.MAILGUN_DOMAIN || "";

    if (!mailgunDomain || !process.env.MAILGUN_API_KEY) {
      return false;
    }

    // Verificar que el dominio está configurado en Mailgun
    const domains = await mg.domains.list();
    const domainsList = domains as unknown as { items: { name: string }[] } | { name: string }[];
    const domainExists = Array.isArray(domainsList)
      ? domainsList.some((d: ReturnType<typeof JSON.parse>) => d.name === mailgunDomain)
      : domainsList.items?.some((d: ReturnType<typeof JSON.parse>) => d.name === mailgunDomain);

    if (!domainExists) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Envía email de confirmación de registro con todos los detalles
 */
export async function sendRegistrationConfirmationEmail(
  data: ReturnType<typeof JSON.parse>
): Promise<boolean> {
  const { getRegistrationConfirmationTemplate } = await import("./templates");
  const template = getRegistrationConfirmationTemplate(data);
  return sendEmail(data.email, template);
}

/**
 * Función auxiliar para enviar emails de bienvenida
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  role: string
): Promise<boolean> {
  const { getWelcomeEmailTemplate } = await import("./templates");
  const template = getWelcomeEmailTemplate(name, role);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar alertas de vencimiento (30 días) - Documento individual
 */
export async function sendVencimiento30DiasEmail(
  email: string,
  name: string,
  tipoDocumento: string,
  fechaVencimiento: Date
): Promise<boolean> {
  const { getVencimiento30DiasTemplate } = await import("./templates");
  const template = getVencimiento30DiasTemplate(name, [{ tipoDocumento, fechaVencimiento }]);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar alertas de vencimiento (30 días) - Múltiples documentos
 */
export async function sendVencimiento30DiasEmailMultiple(
  email: string,
  name: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>
): Promise<boolean> {
  const { getVencimiento30DiasTemplate } = await import("./templates");
  const template = getVencimiento30DiasTemplate(name, documentos);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar alertas críticas (15 días) - Documento individual
 */
export async function sendVencimiento15DiasEmail(
  email: string,
  name: string,
  tipoDocumento: string,
  fechaVencimiento: Date
): Promise<boolean> {
  const { getVencimiento15DiasTemplate } = await import("./templates");
  const template = getVencimiento15DiasTemplate(name, [{ tipoDocumento, fechaVencimiento }]);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar alertas críticas (15 días) - Múltiples documentos
 */
export async function sendVencimiento15DiasEmailMultiple(
  email: string,
  name: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>
): Promise<boolean> {
  const { getVencimiento15DiasTemplate } = await import("./templates");
  const template = getVencimiento15DiasTemplate(name, documentos);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar notificaciones de suspensión - Documento individual
 */
export async function sendSuspensionEmail(
  email: string,
  name: string,
  tipoDocumento: string
): Promise<boolean> {
  const { getSuspensionEmailTemplate } = await import("./templates");
  const template = getSuspensionEmailTemplate(name, tipoDocumento);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar notificaciones de suspensión - Múltiples documentos
 */
export async function sendSuspensionEmailMultiple(
  email: string,
  name: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>
): Promise<boolean> {
  const { getSuspensionTemplate } = await import("./templates");
  const template = getSuspensionTemplate(name, documentos);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar notificaciones de aprobación (múltiples documentos)
 */
export async function sendAprobacionMasivaEmail(
  email: string,
  name: string,
  documentosAprobados: number,
  verificadoPor: string
): Promise<boolean> {
  const { getAprobacionTemplate } = await import("./templates");
  const template = getAprobacionTemplate(name, documentosAprobados, verificadoPor);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar notificación de aprobación de documento individual
 */
export async function sendAprobacionEmail(
  email: string,
  name: string,
  tipoDocumento: string
): Promise<boolean> {
  const { getAprobacionEmailTemplate } = await import("./templates");
  const template = getAprobacionEmailTemplate(name, tipoDocumento);
  return sendEmail(email, template);
}

/**
 * Función auxiliar para enviar notificación de rechazo de documento
 */
export async function sendRechazoEmail(
  email: string,
  name: string,
  tipoDocumento: string,
  motivo: string
): Promise<boolean> {
  const { getRechazoEmailTemplate } = await import("./templates");
  const template = getRechazoEmailTemplate(name, tipoDocumento, motivo);
  return sendEmail(email, template);
}
/**
 * Función auxiliar para enviar notificación de rechazo de solicitud de retiro
 */
export async function sendSolicitudRechazadaEmail(
  data: ReturnType<typeof JSON.parse>
): Promise<boolean> {
  const { getSolicitudRechazadaTemplate } = await import("./templates");
  const template = getSolicitudRechazadaTemplate(
    data.generadorNombre,
    data.folio,
    data.motivo,
    data.detalles
  );
  return sendEmail(data.to, template);
}
