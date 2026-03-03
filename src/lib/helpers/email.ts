import Mailgun from "mailgun.js";
import FormData from "form-data";

/**
 * Configuración del cliente de Mailgun
 */
function createMailgunClient() {
  // Configuración para Mailgun
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    const mailgun = new Mailgun(FormData);
    return mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });
  }

  // Para desarrollo: modo de prueba
  return null;
}

/**
 * Plantilla HTML base para emails
 */
function getEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #059669;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #059669;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
        .success-icon {
          font-size: 48px;
          text-align: center;
          margin: 20px 0;
        }
        .info-box {
          background-color: #e0f2fe;
          border-left: 4px solid #0284c7;
          padding: 15px;
          margin: 20px 0;
        }
        .warning-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TrazAmbiental</h1>
        <p>Plataforma de Gestión REP</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>Este es un email automático, por favor no responder.</p>
        <p>&copy; ${new Date().getFullYear()} TrazAmbiental. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía email de confirmación de registro
 */
export async function enviarEmailConfirmacionRegistro(
  email: string,
  razonSocial: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailgun = createMailgunClient();

    if (!mailgun) {
      return { success: true };
    }

    const content = `
      <div class="success-icon">✅</div>
      <h2>¡Solicitud de Registro Recibida!</h2>
      <p>Estimado/a representante de <strong>${razonSocial}</strong>,</p>
      <p>Hemos recibido tu solicitud de registro como <strong>Generador</strong> en la plataforma TrazAmbiental.</p>
      
      <div class="info-box">
        <h3>📋 Próximos pasos:</h3>
        <ol>
          <li>Nuestro equipo revisará tu solicitud</li>
          <li>Validaremos la información proporcionada</li>
          <li>Recibirás un email de confirmación cuando tu cuenta sea aprobada</li>
        </ol>
      </div>
      
      <p>El proceso de revisión puede tomar entre <strong>24 a 48 horas hábiles</strong>.</p>
      
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      
      <p>Saludos cordiales,<br>
      <strong>Equipo TrazAmbiental</strong></p>
    `;

    await mailgun.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.EMAIL_FROM || "noreply@trazambiental.com",
      to: [email],
      subject: "✅ Solicitud de Registro Recibida - TrazAmbiental",
      html: getEmailTemplate(content),
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error enviando email de confirmación:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido",
    };
  }
}

/**
 * Envía email de aprobación de registro
 */
export async function enviarEmailAprobacion(
  email: string,
  nombre: string,
  razonSocial: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailgun = createMailgunClient();

    if (!mailgun) {
      return { success: true };
    }

    const loginUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const content = `
      <div class="success-icon">🎉</div>
      <h2>¡Tu Cuenta ha sido Aprobada!</h2>
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Nos complace informarte que tu solicitud de registro para <strong>${razonSocial}</strong> ha sido <strong>aprobada</strong>.</p>
      
      <div class="info-box">
        <h3>🚀 Ya puedes acceder a la plataforma</h3>
        <p>Usa el email con el que te registraste para iniciar sesión:</p>
        <p><strong>Email:</strong> ${email}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${loginUrl}/login" class="button">Iniciar Sesión</a>
      </div>
      
      <h3>¿Qué puedes hacer ahora?</h3>
      <ul>
        <li>Gestionar tu inventario de neumáticos</li>
        <li>Declarar volúmenes de importación/producción</li>
        <li>Monitorear el cumplimiento de metas REP</li>
        <li>Generar reportes y certificados</li>
      </ul>
      
      <p>Si tienes alguna pregunta sobre cómo usar la plataforma, consulta nuestra <a href="${loginUrl}/docs">documentación</a>.</p>
      
      <p>¡Bienvenido/a a TrazAmbiental!</p>
      
      <p>Saludos cordiales,<br>
      <strong>Equipo TrazAmbiental</strong></p>
    `;

    await mailgun.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.EMAIL_FROM || "noreply@trazambiental.com",
      to: [email],
      subject: "🎉 ¡Cuenta Aprobada! - TrazAmbiental",
      html: getEmailTemplate(content),
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error enviando email de aprobación:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido",
    };
  }
}

/**
 * Envía email de rechazo de registro
 */
export async function enviarEmailRechazo(
  email: string,
  razonSocial: string,
  motivo: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailgun = createMailgunClient();

    if (!mailgun) {
      return { success: true };
    }

    const content = `
      <div class="success-icon">ℹ️</div>
      <h2>Sobre tu Solicitud de Registro</h2>
      <p>Estimado/a representante de <strong>${razonSocial}</strong>,</p>
      <p>Lamentamos informarte que tu solicitud de registro en TrazAmbiental no ha sido aprobada en esta oportunidad.</p>
      
      <div class="warning-box">
        <h3>📌 Motivo:</h3>
        <p>${motivo}</p>
      </div>
      
      <h3>¿Qué puedes hacer?</h3>
      <ul>
        <li>Revisa la información proporcionada</li>
        <li>Asegúrate de contar con toda la documentación requerida</li>
        <li>Puedes volver a registrarte una vez solucionado el problema</li>
      </ul>
      
      <p>Si tienes dudas o necesitas más información, no dudes en contactarnos.</p>
      
      <p>Saludos cordiales,<br>
      <strong>Equipo TrazAmbiental</strong></p>
    `;

    await mailgun.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.EMAIL_FROM || "noreply@trazambiental.com",
      to: [email],
      subject: "Sobre tu Solicitud de Registro - TrazAmbiental",
      html: getEmailTemplate(content),
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Error enviando email de rechazo:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido",
    };
  }
}

/**
 * Función de prueba para verificar configuración de email
 */
export async function verificarConfiguracionEmail(): Promise<boolean> {
  try {
    const mailgun = createMailgunClient();
    if (!mailgun) {
      return true; // En desarrollo, consideramos esto válido
    }

    // Verificar que el dominio esté configurado correctamente
    const domain = process.env.MAILGUN_DOMAIN;
    if (!domain) {
      console.error("❌ MAILGUN_DOMAIN no está configurado");
      return false;
    }

    return true;
  } catch (error: unknown) {
    console.error("❌ Error en configuración de Mailgun:", error);
    return false;
  }
}
