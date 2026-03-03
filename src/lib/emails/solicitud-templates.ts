import { EmailTemplate, formatFechaEspanol } from "./templates";

/**
 * Template para confirmación de solicitud de retiro (Generador)
 */
export function getConfirmacionSolicitudTemplate(
  nombreGenerador: string,
  folio: string,
  fechaPreferida: string | Date,
  direccionRetiro: string,
  cantidadTotal: number,
  pesoTotal: number,
  solicitudId?: string
): EmailTemplate {
  const subject = `Confirmación de Solicitud - Folio ${folio}`;

  const fecha = typeof fechaPreferida === "string" ? new Date(fechaPreferida) : fechaPreferida;

  const fechaFormateada = formatFechaEspanol(fecha);

  const linkSolicitud = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/generador/solicitudes/${solicitudId || folio}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirmación de Solicitud</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
        .folio-box { background-color: #ecfdf5; border: 2px solid #059669; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .folio { font-size: 32px; font-weight: bold; color: #059669; letter-spacing: 2px; }
        .info-row { margin: 15px 0; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #059669; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .label { font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .value { color: #111827; font-size: 16px; margin-top: 4px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .steps { margin-top: 30px; background-color: white; padding: 20px; border-radius: 6px; border: 1px solid #e5e7eb; }
        .steps h3 { margin-top: 0; color: #059669; }
        .steps li { margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Solicitud Creada Exitosamente</h1>
        </div>
        
        <div class="content">
          <p>Estimado/a <strong>${nombreGenerador}</strong>,</p>
          
          <p>Su solicitud de retiro de Neumáticos Fuera de Uso (NFU) ha sido registrada exitosamente en TrazAmbiental.</p>
          
          <div class="folio-box">
            <div style="color: #065f46; font-size: 14px; margin-bottom: 5px; text-transform: uppercase;">Número de Folio</div>
            <div class="folio">${folio}</div>
          </div>
          
          <p style="text-align: center; color: #6b7280; font-size: 14px; font-style: italic;">
            Guarde este número de folio para futuras consultas
          </p>
          
          <h3 style="color: #111827; margin-top: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 Resumen de la Solicitud</h3>
          
          <div class="info-row">
            <div class="label">Dirección de retiro</div>
            <div class="value">${direccionRetiro}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Fecha preferida</div>
            <div class="value">${fechaFormateada}</div>
          </div>
          
          <div class="info-row">
            <div class="label">Total a retirar</div>
            <div class="value"><strong>${cantidadTotal}</strong> unidades <span style="color: #6b7280;">(${pesoTotal.toFixed(1)} kg estimados)</span></div>
          </div>
          
          <div class="steps">
            <h3>🚀 Próximos Pasos</h3>
            <ol style="padding-left: 20px; margin-bottom: 0;">
              <li>Un transportista será asignado dentro de las próximas 24-48 horas.</li>
              <li>Recibirá una notificación por email cuando se acepte la solicitud.</li>
              <li>El transportista se comunicará con el contacto indicado para coordinar.</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${linkSolicitud}" class="button">
              Ver Detalles de la Solicitud
            </a>
          </div>
          
          <p style="text-align: center; color: #6b7280; margin-top: 20px;">
            También puede hacer seguimiento en tiempo real desde su <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" style="color: #059669; text-decoration: none;">Dashboard</a>.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>TrazAmbiental</strong> - Sistema de Gestión REP de Neumáticos</p>
          <p>¿Necesita ayuda? Contacte a: <a href="mailto:soporte@trazambiental.com" style="color: #059669;">soporte@trazambiental.com</a></p>
          <p>Este es un correo automático, por favor no responda directamente a esta dirección.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
CONFIRMACIÓN DE SOLICITUD - FOLIO ${folio}

Estimado/a ${nombreGenerador},

Su solicitud de retiro de Neumáticos Fuera de Uso (NFU) ha sido registrada exitosamente.

NÚMERO DE FOLIO: ${folio}
(Guarde este número para futuras consultas)

RESUMEN DE LA SOLICITUD:
------------------------------------------------
Dirección de retiro: ${direccionRetiro}
Fecha preferida: ${fechaFormateada}
Cantidad total: ${cantidadTotal} unidades (${pesoTotal.toFixed(1)} kg estimados)

PRÓXIMOS PASOS:
1. Un transportista será asignado dentro de 24-48 horas.
2. Recibirá una notificación cuando se acepte la solicitud.
3. El transportista se comunicará para coordinar.

Puede revisar el estado de su solicitud en el siguiente enlace:
${linkSolicitud}

¿Necesita ayuda? Escriba a soporte@trazambiental.com

TrazAmbiental - Sistema de Gestión REP de Neumáticos
  `;

  return { subject, html, text };
}

/**
 * Template para notificación de nueva solicitud a administradores
 */
export function getNuevaSolicitudAdminTemplate(
  folio: string,
  generadorNombre: string,
  generadorEmail: string,
  cantidadTotal: number,
  fechaPreferida: string | Date
): EmailTemplate {
  const subject = `🔔 Nueva Solicitud de Retiro - ${folio}`;

  const fecha = typeof fechaPreferida === "string" ? new Date(fechaPreferida) : fechaPreferida;

  const fechaFormateada = formatFechaEspanol(fecha);

  const linkAdmin = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/admin/solicitudes/${folio}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nueva Solicitud de Retiro</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
        .info-row { margin: 10px 0; padding: 15px; background-color: white; border-left: 4px solid #2563eb; border-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .label { font-weight: bold; color: #6b7280; display: block; font-size: 12px; text-transform: uppercase; }
        .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .alert { background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 6px; color: #1e40af; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 Nueva Solicitud de Retiro</h1>
        </div>
        
        <div class="content">
          <div class="alert">
            <strong>Atención:</strong> Se ha creado una nueva solicitud que requiere asignación de transportista.
          </div>
          
          <div class="info-row">
            <span class="label">Folio</span>
            <span style="font-size: 18px; font-weight: bold;">${folio}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Generador</span>
            ${generadorNombre}<br>
            <span style="color: #6b7280;">${generadorEmail}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Cantidad a Retirar</span>
            ${cantidadTotal} unidades
          </div>
          
          <div class="info-row">
            <span class="label">Fecha Preferida</span>
            ${fechaFormateada}
          </div>
          
          <div style="text-align: center;">
            <a href="${linkAdmin}" class="button">
              Ver y Gestionar Solicitud
            </a>
          </div>
          
          <p style="margin-top: 20px; color: #6b7280; font-size: 14px; text-align: center;">
            Por favor, asigne un transportista a esta solicitud lo antes posible para cumplir con los plazos de servicio.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
NUEVA SOLICITUD DE RETIRO - FOLIO ${folio}

Se ha creado una nueva solicitud que requiere asignación de transportista.

DETALLES:
------------------------------------------------
Folio: ${folio}
Generador: ${generadorNombre} (${generadorEmail})
Cantidad: ${cantidadTotal} unidades
Fecha preferida: ${fechaFormateada}

ACCIÓN REQUERIDA:
Asigne un transportista a esta solicitud lo antes posible.

Ver solicitud: ${linkAdmin}

TrazAmbiental - Sistema de Gestión REP
  `;

  return { subject, html, text };
}
