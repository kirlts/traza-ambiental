import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validarRUT, limpiarRUT } from "@/lib/validations/rut";

// Rate limiting simple en memoria (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minuto
    return true;
  }

  if (limit.count >= 10) {
    // Máximo 10 validaciones por minuto
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
        { error: "Demasiadas solicitudes. Por favor, espera un momento." },
        { status: 429 }
      );
    }

    const { rut, tipo } = await request.json();

    if (!rut) {
      return NextResponse.json({ error: "RUT es requerido" }, { status: 400 });
    }

    // Validar formato del RUT
    const esValido = validarRUT(rut);
    if (!esValido) {
      return NextResponse.json(
        {
          valid: false,
          error: "RUT inválido. Verifica el dígito verificador.",
        },
        { status: 200 }
      );
    }

    // Verificar si el RUT ya existe en el sistema
    const rutLimpio = limpiarRUT(rut);

    // 1. Buscar en la tabla de usuarios
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { rut: rutLimpio }, // Asumiendo que hay un campo 'rut' en el modelo User
          { name: rutLimpio }, // Fallback por si el RUT se guarda en 'name'
        ],
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          valid: false,
          error: "El RUT ya está registrado en el sistema.",
          existe: true,
        },
        { status: 200 }
      );
    }

    // 2. Buscar en solicitudes de registro pendientes
    const solicitudExistente = await prisma.solicitudRegistroGenerador.findFirst({
      where: {
        OR: [{ rutEmpresa: rutLimpio }, { rutRepresentante: rutLimpio }],
      },
    });

    if (solicitudExistente) {
      const mensaje =
        tipo === "empresa"
          ? "Esta empresa ya tiene una solicitud de registro pendiente."
          : "Este representante ya está asociado a una solicitud de registro pendiente.";

      return NextResponse.json(
        {
          valid: false,
          error: mensaje,
          existe: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        message: "RUT válido",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API validate-rut: Error interno:", error); // DEBUG
    console.error("Error validando RUT:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
