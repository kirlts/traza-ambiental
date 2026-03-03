/**
 * Templates de emails para HU-016 - Validación Documental
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface RegistrationData {
  role: "Generador" | "Transportista" | "Gestor";
  name: string; // Name of user or representative
  email: string;
  rut: string; // User RUT or Company RUT depending on context
  // Optional fields depending on role
  companyName?: string; // For Generador (razonSocial)
  address?: string;
  phone?: string;
  representativeName?: string;
  representativeRut?: string;
  representativeEmail?: string;
  vehiclePlate?: string; // For Transportista
  plantType?: string; // For Gestor
  processingCapacity?: string; // For Gestor/Transportista
  region?: string;
  comuna?: string;
}

// Mapeo de tipos de documento a nombres legibles
export function formatTipoDocumento(tipo: string): string {
  const mapping: Record<string, string> = {
    AUTORIZACION_SANITARIA_TRANSPORTE: "Autorización Sanitaria de Transporte",
    PERMISO_CIRCULACION: "Permiso de Circulación",
    REVISION_TECNICA: "Revisión Técnica",
    CERTIFICADO_ANTECEDENTES: "Certificado de Antecedentes",
    AUTORIZACION_SANITARIA_PLANTA: "Autorización Sanitaria de Planta",
    RCA: "Resolución de Calificación Ambiental (RCA)",
    REGISTRO_GESTOR_MMA: "Registro de Gestor MMA",
    CERTIFICADO_INSTALACION_ELECTRICA: "Certificado de Instalación Eléctrica",
    CERTIFICADO_VIGENCIA_PODERES: "Certificado de Vigencia de Poderes",
    PATENTE_MUNICIPAL: "Patente Municipal",
  };

  return mapping[tipo] || tipo;
}

// Función helper para formatear fechas en español sin problemas de zona horaria
export function formatFechaEspanol(fecha: ReturnType<typeof JSON.parse>): string {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Usar UTC para evitar problemas de zona horaria
  const dia = fecha.getUTCDate();
  const mes = meses[fecha.getUTCMonth()];
  const año = fecha.getUTCFullYear();

  return `${dia} de ${mes} de ${año}`;
}

// Template de bienvenida para nuevos usuarios (genérico)
export function getWelcomeEmailTemplate(name: string, role: string): EmailTemplate {
  const subject = `¡Bienvenido a TrazAmbiental! - Registro como ${role}`;

  // Personalización por rol
  const rolInfo =
    role === "Transportista"
      ? "Como transportista, podrás gestionar el transporte de neumáticos, tus vehículos y rutas de manera eficiente."
      : role === "Gestor"
        ? "Como gestor, podrás administrar tu planta de gestión de residuos y coordinar recepciones de neumáticos."
        : "Podrás gestionar todas las funcionalidades de la plataforma según tu rol.";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bienvenido a Traza Ambiental</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #459e60, #2d5a3d); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #459e60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .highlight { background: #e8f5e8; padding: 15px; border-left: 4px solid #459e60; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌱 ¡Bienvenido a Traza Ambiental!</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <p>¡Gracias por registrarte como <strong>${role}</strong> en nuestra plataforma!</p>
        
        <p>${rolInfo}</p>

        <div class="highlight">
          <h3>📋 Próximos pasos:</h3>
          <ol>
            <li><strong>Verifica tu email:</strong> Haz clic en el enlace de verificación que te enviamos</li>
            <li><strong>Inicia sesión</strong> en la plataforma</li>
            <li><strong>Sube tus documentos:</strong> Completa todos los documentos requeridos</li>
            <li><strong>Espera aprobación</strong> del administrador</li>
          </ol>
        </div>

        <p>Una vez verificados tus documentos, tendrás acceso completo a todas las funcionalidades de la plataforma.</p>

        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signin" class="button">
          🚀 Iniciar Sesión
        </a>

        <p>Si tienes alguna duda, no dudes en contactarnos.</p>

        <p>¡Esperamos trabajar contigo para hacer del reciclaje de neumáticos una actividad más eficiente y sostenible!</p>
      </div>

      <div class="footer">
        <p><strong>Traza Ambiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    ¡Bienvenido a Traza Ambiental!

    Hola ${name},

    Gracias por registrarte como ${role} en nuestra plataforma.

    Próximos pasos:
    1. Verifica tu email haciendo clic en el enlace enviado
    2. Inicia sesión en la plataforma
    3. Sube tu documentación requerida (todos los documentos necesarios)
    4. Espera aprobación del administrador

    Una vez verificada tu documentación, tendrás acceso completo a todas las funcionalidades.

    Inicia sesión: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signin

    ¡Esperamos trabajar contigo!

    Traza Ambiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Template detallado de confirmación de registro
export function getRegistrationConfirmationTemplate(
  data: ReturnType<typeof JSON.parse>
): EmailTemplate {
  const subject = `✅ Solicitud de Registro Recibida - ${data.role} - TrazAmbiental`;

  const detailRows = [
    ["Rol", data.role],
    ["Nombre/Razón Social", data.companyName || data.name],
    ["RUT", data.rut],
    ["Email de Contacto", data.email],
    data.address ? ["Dirección", data.address] : null,
    data.region && data.comuna ? ["Ubicación", `${data.comuna}, ${data.region}`] : null,
    data.phone ? ["Teléfono", data.phone] : null,
    data.vehiclePlate ? ["Patente Vehículo", data.vehiclePlate] : null,
    data.plantType ? ["Tipo de Planta", data.plantType] : null,
    data.processingCapacity ? ["Capacidad Procesamiento", data.processingCapacity] : null,
    data.representativeName ? ["Representante Legal", data.representativeName] : null,
    data.representativeRut ? ["RUT Representante", data.representativeRut] : null,
  ].filter((row) => row !== null) as [string, string][];

  const detailsHtml = detailRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${label}:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td></tr>`
    )
    .join("");

  const detailsText = detailRows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Solicitud de Registro Recibida</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #459e60, #2d5a3d); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .info-box { background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Solicitud Recibida</h1>
      </div>

      <div class="content">
        <h2>Estimado/a ${data.name},</h2>

        <p>Hemos recibido tu solicitud de registro como <strong>${data.role}</strong> en la plataforma TrazAmbiental.</p>
        
        <div class="details">
          <h3>📝 Detalles del Registro:</h3>
          <table>
            ${detailsHtml}
          </table>
        </div>

        <div class="info-box">
          <h3>📋 Próximos pasos:</h3>
          <ol>
            <li>Nuestro equipo revisará tu solicitud y los antecedentes proporcionados.</li>
            <li>Validaremos que la información cumpla con los requisitos de la normativa REP.</li>
            <li>Recibirás un email de confirmación cuando tu cuenta sea aprobada.</li>
          </ol>
        </div>
        
        <p>El proceso de revisión puede tomar entre <strong>24 a 48 horas hábiles</strong>.</p>
        <p>Si tienes alguna pregunta o necesitas corregir algún dato, no dudes en responder a este correo.</p>

        <p>Saludos cordiales,<br>
        <strong>Equipo TrazAmbiental</strong></p>
      </div>

      <div class="footer">
        <p><strong>Traza Ambiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    ✅ Solicitud de Registro Recibida - TrazAmbiental

    Estimado/a ${data.name},

    Hemos recibido tu solicitud de registro como ${data.role} en la plataforma TrazAmbiental.

    Detalles del Registro:
    ${detailsText}

    Próximos pasos:
    1. Nuestro equipo revisará tu solicitud y los antecedentes proporcionados.
    2. Validaremos que la información cumpla con los requisitos de la normativa REP.
    3. Recibirás un email de confirmación cuando tu cuenta sea aprobada.

    El proceso de revisión puede tomar entre 24 a 48 horas hábiles.

    Si tienes alguna pregunta o necesitas corregir algún dato, no dudes en responder a este correo.

    Saludos cordiales,
    Equipo TrazAmbiental
  `;

  return { subject, html, text };
}

// Template de alerta de vencimiento (30 días)
export function getVencimiento30DiasTemplate(
  name: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>
): EmailTemplate {
  const subject = `🚨 Alerta: Documentación próxima a vencer (30 días) - Traza Ambiental`;

  const documentosList = documentos
    .map(
      (doc: ReturnType<typeof JSON.parse>) =>
        `• ${formatTipoDocumento(doc.tipoDocumento)} - Vence el ${formatFechaEspanol(doc.fechaVencimiento)}`
    )
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alerta de Vencimiento</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #ff9800, #f57c00); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #ff9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .documents { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚨 Alerta de Vencimiento - 30 días</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <div class="warning">
          <strong>⚠️ Tu documentación está próxima a vencer (menos de 30 días).</strong>
        </div>

        <p>Para mantener tu cuenta activa en Traza Ambiental, necesitas renovar y actualizar los siguientes documentos. Es importante que los renueves antes de su vencimiento:</p>

        <div class="documents">
          <h3>📄 Documentos próximos a vencer:</h3>
          ${documentos
            .map(
              (doc: ReturnType<typeof JSON.parse>) => `
            <p><strong>${formatTipoDocumento(doc.tipoDocumento)}</strong> - Vence el ${formatFechaEspanol(doc.fechaVencimiento)}</p>
          `
            )
            .join("")}
        </div>

        <p><strong>¿Qué hacer ahora?</strong></p>
        <ol>
          <li>Prepara los documentos actualizados</li>
          <li>Inicia sesión en la plataforma</li>
          <li>Ve a tu perfil y sube la documentación renovada y actualizada</li>
          <li>Espera la aprobación del administrador</li>
        </ol>

        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/perfil" class="button">
          📤 Subir Documentación
        </a>

        <p><em>Si no renuevas tu documentación antes de la fecha de vencimiento, tu cuenta será suspendida automáticamente.</em></p>
      </div>

      <div class="footer">
        <p><strong>Traza Ambiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    🚨 ALERTA DE VENCIMIENTO - Traza Ambiental

    Hola ${name},

    Tu documentación está próxima a vencer (menos de 30 días).

    Documentos próximos a vencer:
    ${documentosList}

    Para mantener tu cuenta activa, debes renovar estos documentos:
    1. Prepara los documentos actualizados
    2. Inicia sesión en la plataforma
    3. Ve a tu perfil y sube la documentación renovada
    4. Espera la aprobación del administrador

    Si no renuevas tu documentación antes de la fecha de vencimiento, tu cuenta será suspendida automáticamente.

    Subir documentación: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/perfil

    Traza Ambiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Template de alerta crítica (15 días)
export function getVencimiento15DiasTemplate(
  name: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>
): EmailTemplate {
  const subject = `🚨 ¡URGENTE! ⚠️ Documentación vence en menos de 15 días - Traza Ambiental`;

  const documentosList = documentos
    .map(
      (doc: ReturnType<typeof JSON.parse>) =>
        `• ${formatTipoDocumento(doc.tipoDocumento)} - Vence el ${formatFechaEspanol(doc.fechaVencimiento)}`
    )
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Alerta Crítica de Vencimiento</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f44336, #d32f2f); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .urgent { background: #ffebee; border: 2px solid #f44336; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .documents { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚨 ¡ALERTA CRÍTICA! (15 días)</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <div class="urgent">
          <h3 style="color: #d32f2f; margin-top: 0;">⚠️ ¡ACCIÓN INMEDIATA REQUERIDA! URGENTE</h3>
          <p><strong>Tu documentación vence en menos de 15 días.</strong></p>
        </div>

        <p>Si no renuevas tu documentación inmediatamente, tu cuenta será suspendida automáticamente:</p>

        <div class="documents">
          <h3>📄 Documentos críticos:</h3>
          ${documentos
            .map(
              (doc: ReturnType<typeof JSON.parse>) => `
            <p><strong>${formatTipoDocumento(doc.tipoDocumento)}</strong> - Vence el ${formatFechaEspanol(doc.fechaVencimiento)}</p>
          `
            )
            .join("")}
        </div>

        <p><strong>¿Qué hacer AHORA?</strong></p>
        <ol>
          <li><strong>Detén todas tus actividades</strong> y prepara la documentación</li>
          <li><strong>Inicia sesión inmediatamente</strong> en la plataforma</li>
          <li><strong>Sube la documentación renovada</strong> lo antes posible</li>
          <li><strong>Contacta al administrador</strong> si tienes problemas</li>
        </ol>

        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/perfil" class="button">
          🚨 ¡SUBIR DOCUMENTACIÓN AHORA!
        </a>

        <p><em>Esta es tu última oportunidad. Si no actúas inmediatamente, perderás el acceso a la plataforma.</em></p>
      </div>

      <div class="footer">
        <p><strong>Traza Ambiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    🚨 ALERTA CRÍTICA URGENTE - Traza Ambiental

    ¡ACCIÓN INMEDIATA REQUERIDA! URGENTE

    Hola ${name},

    Tu documentación vence en menos de 15 días.

    Documentos críticos:
    ${documentosList}

    Si no renuevas tu documentación inmediatamente, tu cuenta será suspendida automáticamente.

    Qué hacer AHORA:
    1. Detén todas tus actividades y prepara la documentación
    2. Inicia sesión inmediatamente en la plataforma
    3. Sube la documentación renovada lo antes posible
    4. Contacta al administrador si tienes problemas

    Subir documentación: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/perfil

    Esta es tu última oportunidad. Si no actúas inmediatamente, perderás el acceso a la plataforma.

    Traza Ambiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Template de suspensión por vencimiento
export function getSuspensionTemplate(
  name: string,
  documentos: Array<{ tipoDocumento: string; fechaVencimiento: Date }>
): EmailTemplate {
  const subject = `🚫 Cuenta Suspendida - Documentación Vencida - Traza Ambiental`;

  const documentosList = documentos
    .map(
      (doc: ReturnType<typeof JSON.parse>) =>
        `• ${formatTipoDocumento(doc.tipoDocumento)} - Venció el ${formatFechaEspanol(doc.fechaVencimiento)}`
    )
    .join("\n");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cuenta Suspendida</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #616161, #424242); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .suspended { background: #ffebee; border: 2px solid #f44336; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .documents { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .contact { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚫 Cuenta Suspendida</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <div class="suspended">
          <h3 style="color: #d32f2f; margin-top: 0;">Tu cuenta ha sido suspendida automáticamente</h3>
          <p>La siguiente documentación ha vencido y no fue renovada:</p>
        </div>

        <div class="documents">
          <h3>📄 Documentos vencidos:</h3>
          ${documentos
            .map(
              (doc: ReturnType<typeof JSON.parse>) => `
            <p><strong>${formatTipoDocumento(doc.tipoDocumento)}</strong> - Venció el ${formatFechaEspanol(doc.fechaVencimiento)}</p>
          `
            )
            .join("")}
        </div>

        <div class="contact">
          <h3>🔄 ¿Cómo reactivar tu cuenta?</h3>
          <ol>
            <li><strong>Renueva tu documentación</strong> vencida</li>
            <li><strong>Contacta al administrador</strong> de la plataforma para coordinar la actualización</li>
            <li><strong>Sube la documentación actualizada</strong> para revisión y validación</li>
            <li><strong>Espera aprobación</strong> para reactivación</li>
          </ol>
        </div>

        <p><strong>Importante:</strong> Mientras tu cuenta esté suspendida, no podrás:</p>
        <ul>
          <li>Crear nuevas solicitudes de retiro</li>
          <li>Confirmar entregas</li>
          <li>Acceder a funcionalidades de tu rol</li>
        </ul>

        <p>Contacta al administrador para coordinar la reactivación de tu cuenta actualizado. Nuestro equipo de soporte está disponible para ayudarte en este proceso.</p>
      </div>

      <div class="footer">
        <p><strong>Traza Ambiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    🚫 CUENTA SUSPENDIDA - Traza Ambiental

    Hola ${name},

    Tu cuenta ha sido suspendida automáticamente.

    Documentos vencidos:
    ${documentosList}

    Cómo reactivar tu cuenta:
    1. Renueva tu documentación vencida
    2. Contacta al administrador de la plataforma
    3. Sube la documentación actualizada para revisión y validación
    4. Espera aprobación para reactivación

    Importante: Mientras tu cuenta esté suspendida, no podrás:
    - Crear nuevas solicitudes de retiro
    - Confirmar entregas
    - Acceder a funcionalidades de tu rol

    Contacta al administrador para coordinar la reactivación. Nuestro equipo de soporte está disponible para ayudarte.

    Traza Ambiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Template de aprobación de documentación
export function getAprobacionTemplate(
  name: string,
  documentosAprobados: number,
  verificadoPor: string
): EmailTemplate {
  const subject = `✅ ¡Documentación Aprobada! - Traza Ambiental`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Documentación Aprobada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #4caf50, #388e3c); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .approved { background: #e8f5e8; border: 2px solid #4caf50; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ ¡Documentación Aprobada!</h1>
      </div>

      <div class="content">
        <h2>¡Felicitaciones ${name}!</h2>

        <div class="approved">
          <h3 style="color: #2e7d32; margin-top: 0;">🎉 Tu documentación ha sido aprobada</h3>
          <p><strong>${documentosAprobados}</strong> documento(s) han sido verificados y aprobados.</p>
        </div>

        <p><strong>Verificado por:</strong> ${verificadoPor}</p>

        <p>Ahora tienes acceso completo a todas las funcionalidades de tu rol en la plataforma.</p>

        <h3>🚀 ¿Qué puedes hacer ahora?</h3>
        <ul>
          <li>Crear y gestionar solicitudes de retiro</li>
          <li>Confirmar entregas y recepciones</li>
          <li>Acceder a reportes y estadísticas</li>
          <li>Planificar rutas de transporte</li>
        </ul>

        <p>¡Bienvenido oficialmente a la comunidad de Traza Ambiental!</p>
      </div>

      <div class="footer">
        <p><strong>Traza Ambiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    ✅ DOCUMENTACIÓN APROBADA - Traza Ambiental

    ¡Felicitaciones ${name}!

    Tu documentación ha sido aprobada.
    ${documentosAprobados} documento(s) han sido verificados y aprobados.

    Verificado por: ${verificadoPor}

    Ahora tienes acceso completo a todas las funcionalidades de tu rol en la plataforma.

    ¿Qué puedes hacer ahora?
    - Crear y gestionar solicitudes de retiro
    - Confirmar entregas y recepciones
    - Acceder a reportes y estadísticas
    - Planificar rutas de transporte

    ¡Bienvenido oficialmente a la comunidad de Traza Ambiental!

    Traza Ambiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Template de aprobación de documento individual
export function getAprobacionEmailTemplate(name: string, tipoDocumento: string): EmailTemplate {
  const nombreDocumento = formatTipoDocumento(tipoDocumento);
  const subject = `✅ Documento Aprobado - ${nombreDocumento} - TrazAmbiental`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Documento Aprobado</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #4caf50, #388e3c); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .approved { background: #e8f5e8; border: 2px solid #4caf50; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ ¡Documento Aprobado!</h1>
      </div>

      <div class="content">
        <h2>¡Felicitaciones ${name}!</h2>

        <div class="approved">
          <h3 style="color: #2e7d32; margin-top: 0;">🎉 Tu documento ha sido aprobado</h3>
          <p>El documento <strong>${nombreDocumento}</strong> ha sido verificado y aprobado exitosamente.</p>
        </div>

        <p>Ahora tienes acceso completo a todas las funcionalidades de tu rol en la plataforma.</p>

        <h3>🚀 ¿Qué puedes hacer ahora?</h3>
        <ul>
          <li>Crear y gestionar solicitudes de retiro</li>
          <li>Confirmar entregas y recepciones</li>
          <li>Acceder a reportes y estadísticas</li>
          <li>Planificar rutas de transporte</li>
        </ul>

        <p>¡Bienvenido oficialmente a la comunidad de TrazAmbiental!</p>
      </div>

      <div class="footer">
        <p><strong>TrazAmbiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    ✅ DOCUMENTO APROBADO - TrazAmbiental

    ¡Felicitaciones ${name}!

    Tu documento ${nombreDocumento} ha sido verificado y aprobado exitosamente.

    Ahora tienes acceso completo a todas las funcionalidades de tu rol en la plataforma.

    ¿Qué puedes hacer ahora?
    - Crear y gestionar solicitudes de retiro
    - Confirmar entregas y recepciones
    - Acceder a reportes y estadísticas
    - Planificar rutas de transporte

    ¡Bienvenido oficialmente a la comunidad de TrazAmbiental!

    TrazAmbiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Template de rechazo de documento
export function getRechazoEmailTemplate(
  name: string,
  tipoDocumento: string,
  motivo: string
): EmailTemplate {
  const nombreDocumento = formatTipoDocumento(tipoDocumento);
  const subject = `❌ Documento Rechazado - ${nombreDocumento} - TrazAmbiental`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Documento Rechazado</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f44336, #d32f2f); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .button { background: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .rejected { background: #ffebee; border: 2px solid #f44336; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>❌ Documento Rechazado</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <div class="rejected">
          <h3 style="color: #d32f2f; margin-top: 0;">Tu documento ha sido rechazado</h3>
          <p><strong>Documento:</strong> ${nombreDocumento}</p>
          <p><strong>Motivo del rechazo:</strong></p>
          <p>${motivo}</p>
        </div>

        <h3>📋 ¿Qué hacer ahora?</h3>
        <ol>
          <li>Revisa el motivo del rechazo cuidadosamente</li>
          <li>Corrige los problemas identificados</li>
          <li>Prepara un nuevo documento con las correcciones necesarias</li>
          <li>Vuelve a subir el documento actualizado</li>
        </ol>

        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/perfil" class="button">
          📤 Resubir Documento
        </a>

        <p>Si tienes dudas sobre el rechazo, contacta al administrador de la plataforma.</p>
      </div>

      <div class="footer">
        <p><strong>TrazAmbiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    ❌ DOCUMENTO RECHAZADO - TrazAmbiental

    Hola ${name},

    Tu documento ${nombreDocumento} ha sido rechazado.

    Motivo del rechazo:
    ${motivo}

    ¿Qué hacer ahora?
    1. Revisa el motivo del rechazo cuidadosamente
    2. Corrige los problemas identificados
    3. Prepara una nueva versión del documento
    4. Vuelve a subir el documento actualizado

    Resubir documento: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/perfil

    Si tienes dudas sobre el rechazo, contacta al administrador de la plataforma.

    TrazAmbiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

// Alias para compatibilidad con los tests que esperan estos nombres
export function getVencimiento30DiasEmailTemplate(
  name: string,
  tipoDocumento: string,
  fechaVencimiento: Date
): EmailTemplate {
  return getVencimiento30DiasTemplate(name, [{ tipoDocumento, fechaVencimiento }]);
}

export function getVencimiento15DiasEmailTemplate(
  name: string,
  tipoDocumento: string,
  fechaVencimiento: Date
): EmailTemplate {
  return getVencimiento15DiasTemplate(name, [{ tipoDocumento, fechaVencimiento }]);
}

export function getSuspensionEmailTemplate(name: string, tipoDocumento: string): EmailTemplate {
  const nombreDocumento = formatTipoDocumento(tipoDocumento);
  const subject = `🚫 Cuenta Suspendida - ${nombreDocumento} Vencido - TrazAmbiental`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cuenta Suspendida</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #616161, #424242); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .suspended { background: #ffebee; border: 2px solid #f44336; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .contact { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚫 Cuenta Suspendida</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <div class="suspended">
          <h3 style="color: #d32f2f; margin-top: 0;">Tu cuenta ha sido suspendida automáticamente</h3>
          <p>El documento <strong>${nombreDocumento}</strong> ha vencido y no fue renovado.</p>
        </div>

        <div class="contact">
          <h3>🔄 ¿Cómo reactivar tu cuenta?</h3>
          <ol>
            <li><strong>Renueva tu documentación</strong> vencida</li>
            <li><strong>Contacta al administrador</strong> de la plataforma</li>
            <li><strong>Sube la documentación</strong> actualizado para revisión</li>
            <li><strong>Espera aprobación</strong> para reactivación</li>
          </ol>
        </div>

        <p><strong>Importante:</strong> Mientras tu cuenta esté suspendida, no podrás:</p>
        <ul>
          <li>Crear nuevas solicitudes de retiro</li>
          <li>Confirmar entregas</li>
          <li>Acceder a funcionalidades de tu rol</li>
        </ul>

        <p>Contacta al administrador para coordinar la reactivación de tu cuenta. Nuestro equipo de soporte está disponible para ayudarte.</p>
      </div>

      <div class="footer">
        <p><strong>TrazAmbiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    🚫 CUENTA SUSPENDIDA - TrazAmbiental

    Hola ${name},

    Tu cuenta ha sido suspendida automáticamente.

    El documento ${nombreDocumento} ha vencido y no fue renovado.

    Cómo reactivar tu cuenta:
    1. Renueva tu documentación vencida
    2. Contacta al administrador de la plataforma
    3. Sube la documentación actualizado para revisión
    4. Espera aprobación para reactivación

    Importante: Mientras tu cuenta esté suspendida, no podrás:
    - Crear nuevas solicitudes de retiro
    - Confirmar entregas
    - Acceder a funcionalidades de tu rol

    Ponte en contacto al administrador para coordinar la reactivación.

    TrazAmbiental - Sistema de Gestión de Residuos
  `;

  return { subject, html, text };
}

/**
 * Template para notificación de solicitud de retiro rechazada
 */
export function getSolicitudRechazadaTemplate(
  name: string,
  folio: string,
  motivo: string,
  detalles?: string
): EmailTemplate {
  const subject = `❌ Solicitud de Retiro Rechazada - ${folio} - TrazAmbiental`;

  const motivoTexto: Record<string, string> = {
    FUERA_DE_ZONA: "Fuera de zona de cobertura",
    CARGA_NO_COMPATIBLE: "Carga no compatible",
    CAPACIDAD_EXCEDIDA: "Capacidad excedida",
    HORARIO_NO_DISPONIBLE: "Horario no disponible",
    OTRO: "Otro motivo",
  };

  const razonRechazo = motivoTexto[motivo] || motivo;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Solicitud Rechazada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f44336, #d32f2f); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .rejected-box { background: #fff5f5; border-left: 4px solid #f44336; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>❌ Solicitud Rechazada</h1>
      </div>

      <div class="content">
        <h2>Hola ${name},</h2>

        <p>Te informamos que tu solicitud de retiro con folio <strong>${folio}</strong> ha sido rechazada por el transportista.</p>
        
        <div class="rejected-box">
          <h3 style="color: #d32f2f; margin-top: 0;">Motivo del Rechazo:</h3>
          <p><strong>${razonRechazo}</strong></p>
          ${detalles ? `<p><strong>Detalles adicionales:</strong> ${detalles}</p>` : ""}
        </div>

        <p>Puedes revisar los detalles de esta solicitud e intentar generar una nueva si fuera necesario desde el panel de solicitudes.</p>

        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/solicitudes" class="button">
          Ir a mis solicitudes
        </a>

        <p>Si tienes alguna consulta, por favor contáctanos.</p>
      </div>

      <div class="footer">
        <p><strong>TrazAmbiental</strong> - Sistema de Gestión de Residuos</p>
        <p>Este es un email automático, por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Solicitud de Retiro Rechazada - TrazAmbiental

    Hola ${name},

    Te informamos que tu solicitud de retiro con folio ${folio} ha sido rechazada.

    Motivo del Rechazo: ${razonRechazo}
    ${detalles ? `Detalles adicionales: ${detalles}` : ""}

    Puedes revisar los detalles en: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/solicitudes

    Atentamente,
    Equipo TrazAmbiental
  `;

  return { subject, html, text };
}
