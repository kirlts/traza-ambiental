import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { EstadoVerificacionUsuario } from "@prisma/client";

// Schema de validación para registro de gestor
const gestorRegisterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
    ),
  rut: z
    .string()
    .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, "RUT inválido (formato: XX.XXX.XXX-X)")
    .refine(async (rut) => {
      // Validación básica del dígito verificador
      const rutLimpio = rut.replace(/\./g, "").replace("-", "");
      const rutNumeros = rutLimpio.slice(0, -1);
      const dv = rutLimpio.slice(-1).toUpperCase();

      let suma = 0;
      let multiplicador = 2;

      for (let i = rutNumeros.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumeros[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
      }

      const resto = suma % 11;
      const dvCalculado = resto === 0 ? "0" : resto === 1 ? "K" : (11 - resto).toString();

      return dv === dvCalculado;
    }, "RUT inválido"),
  tipoEmpresa: z.string().min(1, "Tipo de empresa requerido"),
  capacidadProcesamiento: z.number().positive("Capacidad debe ser mayor a 0"),
  tipoPlanta: z.string().min(1, "Tipo de planta requerido"),
});

/**
 * POST /api/auth/register/gestor
 *
 * Registra un nuevo usuario con rol Gestor.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = gestorRegisterSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password, rut, tipoEmpresa, capacidadProcesamiento, tipoPlanta } =
      validationResult.data;

    // Verificar que el email no esté registrado
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { rut }],
      },
    });

    if (existingUser) {
      const campoDuplicado = existingUser.email === email ? "email" : "RUT";
      return NextResponse.json(
        { error: `Ya existe un usuario registrado con este ${campoDuplicado}` },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rut,
        roles: {
          create: {
            role: {
              connectOrCreate: {
                where: { name: "Gestor" },
                create: { name: "Gestor", description: "Gestor de Residuos" },
              },
            },
          },
        },
        estadoVerificacion: EstadoVerificacionUsuario.PENDIENTE_VERIFICACION,
        tipoEmpresa,
        capacidadProcesamiento,
        tipoPlanta,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roles: {
          include: {
            role: true,
          },
        },
        estadoVerificacion: true,
        createdAt: true,
      },
    });

    // Enviar email de confirmación
    try {
      const { sendRegistrationConfirmationEmail } = await import("@/lib/emails/send");
      await sendRegistrationConfirmationEmail({
        role: "Gestor",
        name: user.name || "Usuario",
        email: user.email,
        rut: rut,
        plantType: tipoPlanta,
        processingCapacity: `${capacidadProcesamiento} tons/mes`,
        companyName: tipoEmpresa === "juridica" ? user.name || undefined : undefined,
      });
    } catch (error: unknown) {
      console.error("Error enviando email de confirmación:", error);
      // No fallar el registro por error de email
    }

    return NextResponse.json({
      user,
      message: "Usuario gestor registrado exitosamente. Revisa tu email para verificar la cuenta.",
      nextSteps: [
        "Verifica tu email haciendo clic en el enlace enviado",
        "Inicia sesión en la plataforma",
        "Sube tu documentación requerida (Autorización Sanitaria de Planta, RCA, etc.)",
        "Espera la aprobación del administrador",
      ],
    });
  } catch (error: unknown) {
    console.error("Error registrando gestor:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
