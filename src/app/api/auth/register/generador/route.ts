import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registroCompletoSchema } from "@/lib/validations/registro-generador";
import { limpiarRUT, formatearRUT } from "@/lib/validations/rut";
import { verificarRecaptcha } from "@/lib/helpers/recaptcha";
import { sendRegistrationConfirmationEmail } from "@/lib/emails/send";
import bcrypt from "bcryptjs";

// Rate limiting simple en memoria
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 600000 }); // 10 minutos
    return true;
  }

  if (limit.count >= 3) {
    // Máximo 3 registros por 10 minutos
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos de registro. Por favor, espera 10 minutos." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validar datos con Zod
    const validacion = registroCompletoSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          detalles: validacion.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const datos = validacion.data;

    // Verificar reCAPTCHA solo si se proporcionó un token
    if (datos.recaptchaToken) {
      const recaptchaValido = await verificarRecaptcha(datos.recaptchaToken);
      if (!recaptchaValido) {
        return NextResponse.json(
          { error: "Verificación de reCAPTCHA falló. Por favor, inténtalo de nuevo." },
          { status: 400 }
        );
      }
    } else {
      console.warn("⚠️  Registro sin reCAPTCHA (modo desarrollo)");
    }

    // Limpiar RUTs
    const rutEmpresaLimpio = limpiarRUT(datos.rutEmpresa);
    const rutRepresentanteLimpio = limpiarRUT(datos.rutRepresentante);

    // Verificar que no exista solicitud con el mismo RUT de empresa
    const solicitudExistente = await prisma.solicitudRegistroGenerador.findFirst({
      where: {
        rutEmpresa: rutEmpresaLimpio,
      },
    });

    if (solicitudExistente) {
      return NextResponse.json(
        { error: "Ya existe una solicitud de registro para esta empresa" },
        { status: 400 }
      );
    }

    // Verificar que no exista usuario con el mismo email
    const emailExistente = await prisma.user.findUnique({
      where: { email: datos.email },
    });

    if (emailExistente) {
      return NextResponse.json(
        { error: "El email ya está registrado en el sistema" },
        { status: 400 }
      );
    }

    // Verificar que no exista solicitud con el mismo email
    const solicitudEmailExistente = await prisma.solicitudRegistroGenerador.findUnique({
      where: { email: datos.email },
    });

    if (solicitudEmailExistente) {
      return NextResponse.json(
        { error: "Ya existe una solicitud de registro con este email" },
        { status: 400 }
      );
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(datos.password, 12);

    // Crear solicitud de registro
    const solicitud = await prisma.solicitudRegistroGenerador.create({
      data: {
        // Datos de la empresa
        rutEmpresa: rutEmpresaLimpio,
        razonSocial: datos.razonSocial,
        direccion: datos.direccion,
        direccionCasaMatriz: datos.direccionCasaMatriz || null,
        comuna: datos.comuna || null,
        region: datos.region || null,
        telefono: datos.telefono || null,
        idRETC: datos.idRETC || null,

        // Tipo de Productor REP y Residuos
        tipoProductorREP: datos.tipoProductorREP || null,
        tiposResiduos: datos.tiposResiduos || [],

        // Datos del representante legal
        rutRepresentante: rutRepresentanteLimpio,
        nombresRepresentante: datos.nombresRepresentante,
        apellidosRepresentante: datos.apellidosRepresentante,
        cargoRepresentante: datos.cargoRepresentante || null,
        emailRepresentante: datos.emailRepresentante,
        telefonoRepresentante: datos.telefonoRepresentante || null,

        // Credenciales
        email: datos.email,
        password: passwordHash,

        // Estado por defecto
        estado: "pendiente",
      },
    });

    // Enviar email de confirmación (no bloquear si falla)
    sendRegistrationConfirmationEmail({
      role: "Generador",
      name: datos.nombresRepresentante + " " + datos.apellidosRepresentante,
      email: datos.email,
      rut: formatearRUT(rutEmpresaLimpio),
      companyName: datos.razonSocial,
      address: datos.direccion,
      comuna: datos.comuna,
      region: datos.region,
      phone: datos.telefono,
      representativeName: datos.nombresRepresentante + " " + datos.apellidosRepresentante,
      representativeRut: formatearRUT(rutRepresentanteLimpio),
      representativeEmail: datos.emailRepresentante,
    }).catch((error: unknown) => {
      console.error("Error enviando email de confirmación:", error);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Solicitud de registro creada exitosamente",
        solicitudId: solicitud.id,
        data: {
          razonSocial: datos.razonSocial,
          email: datos.email,
          rutEmpresa: formatearRUT(rutEmpresaLimpio),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error en registro de generador:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
