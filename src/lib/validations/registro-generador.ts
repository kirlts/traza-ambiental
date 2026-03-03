import { z } from "zod";
import { validarRUT } from "./rut";

/**
 * Esquema de validación para datos de la empresa
 */
export const empresaSchema = z.object({
  rutEmpresa: z
    .string()
    .min(1, "RUT de la empresa es requerido")
    .refine((rut) => validarRUT(rut), {
      message: "RUT de empresa inválido",
    }),
  razonSocial: z
    .string()
    .min(3, "Razón social debe tener al menos 3 caracteres")
    .max(200, "Razón social no puede exceder 200 caracteres"),
  direccion: z
    .string()
    .min(5, "Dirección Comercial debe tener al menos 5 caracteres")
    .max(300, "Dirección Comercial no puede exceder 300 caracteres"),
  direccionCasaMatriz: z
    .string()
    .max(300, "Dirección Casa Matriz no puede exceder 300 caracteres")
    .optional()
    .transform((val) => (val === "" || val === undefined ? undefined : val)),
  comuna: z
    .string()
    .optional()
    .transform((val) => (val === "" || val === undefined ? undefined : val)),
  region: z
    .string()
    .optional()
    .transform((val) => (val === "" || val === undefined ? undefined : val)),
  telefono: z
    .string()
    .optional()
    .transform((val) => {
      // Si está vacío o undefined, devolver undefined
      if (val === "" || val === undefined) return undefined;
      // Si tiene valor, validar formato
      if (!/^(\+?56)?[2-9]\d{8}$/.test(val)) {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Teléfono inválido (formato: +56912345678 o 912345678)",
            path: ["telefono"],
          },
        ]);
      }
      return val;
    }),
  idRETC: z
    .string()
    .min(1, "ID RETC (Ventanilla Única) es requerido")
    .regex(/^[A-Z0-9-]+$/, "ID RETC debe contener solo letras mayúsculas, números y guiones")
    .max(50, "ID RETC no puede exceder 50 caracteres"),
  tipoProductorREP: z
    .string()
    .min(1, "Tipo de Productor REP es requerido")
    .refine(
      (val) =>
        [
          "Fabricante",
          "Importador",
          "Envasador/Envasador por Cuenta de Terceros",
          "Comercializador Bajo Marca Propia",
        ].includes(val),
      { message: "Tipo de Productor REP inválido" }
    ),
  tiposResiduos: z
    .array(
      z.enum([
        "Neumáticos",
        "Baterías",
        "Aceites Lubricantes",
        "Aparatos Eléctricos y Electrónicos (AEE)",
        "Envases",
        "Embalajes",
      ])
    )
    .min(1, "Debe seleccionar al menos un tipo de residuo")
    .default([]),
});

/**
 * Esquema de validación para datos del representante legal
 */
export const representanteSchema = z.object({
  rutRepresentante: z
    .string()
    .min(1, "RUT del representante es requerido")
    .refine((rut) => validarRUT(rut), {
      message: "RUT del representante inválido",
    }),
  nombresRepresentante: z
    .string()
    .min(2, "Nombres deben tener al menos 2 caracteres")
    .max(100, "Nombres no pueden exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Nombres solo pueden contener letras"),
  apellidosRepresentante: z
    .string()
    .min(2, "Apellidos deben tener al menos 2 caracteres")
    .max(100, "Apellidos no pueden exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Apellidos solo pueden contener letras"),
  cargoRepresentante: z
    .string()
    .max(100, "Cargo no puede exceder 100 caracteres")
    .optional()
    .transform((val) => (val === "" || val === undefined ? undefined : val)),
  emailRepresentante: z.string().email("Email del representante inválido").toLowerCase(),
  telefonoRepresentante: z
    .string()
    .optional()
    .transform((val) => {
      // Si está vacío o undefined, devolver undefined
      if (val === "" || val === undefined) return undefined;
      // Si tiene valor, validar formato
      if (!/^(\+?56)?[2-9]\d{8}$/.test(val)) {
        throw new z.ZodError([
          {
            code: "custom",
            message: "Teléfono inválido (formato: +56912345678 o 912345678)",
            path: ["telefonoRepresentante"],
          },
        ]);
      }
      return val;
    }),
});

/**
 * Esquema de validación para credenciales de acceso
 */
export const credencialesSchema = z
  .object({
    email: z.string().min(1, "Email es requerido").email("Email inválido").toLowerCase(),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirmar contraseña es requerido"),
    aceptaTerminos: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos y condiciones",
    }),
    aceptaPrivacidad: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar la política de privacidad",
    }),
    recaptchaToken: z.string().optional(), // Opcional para permitir desarrollo sin reCAPTCHA
  })
  .refine((data: ReturnType<typeof JSON.parse>) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

/**
 * Esquema de validación para el formulario completo de registro
 */
export const registroCompletoSchema = empresaSchema
  .merge(representanteSchema)
  .merge(credencialesSchema);

/**
 * Tipos TypeScript derivados de los esquemas
 */
export type EmpresaFormData = z.infer<typeof empresaSchema>;
export type RepresentanteFormData = z.infer<typeof representanteSchema>;
export type CredencialesFormData = z.infer<typeof credencialesSchema>;
export type RegistroCompletoFormData = z.infer<typeof registroCompletoSchema>;

/**
 * Validación individual de requisitos de contraseña
 */
export function validarRequisitosPassword(password: string) {
  return {
    longitudMinima: password.length >= 8,
    tieneMayuscula: /[A-Z]/.test(password),
    tieneNumero: /[0-9]/.test(password),
  };
}

/**
 * Calcula el nivel de fortaleza de una contraseña (0-100)
 */
export function calcularFortalezaPassword(password: string): number {
  let fortaleza = 0;

  // Longitud
  if (password.length >= 8) fortaleza += 25;
  if (password.length >= 12) fortaleza += 10;
  if (password.length >= 16) fortaleza += 10;

  // Mayúsculas
  if (/[A-Z]/.test(password)) fortaleza += 15;

  // Minúsculas
  if (/[a-z]/.test(password)) fortaleza += 10;

  // Números
  if (/[0-9]/.test(password)) fortaleza += 15;

  // Caracteres especiales
  if (/[^A-Za-z0-9]/.test(password)) fortaleza += 15;

  return Math.min(100, fortaleza);
}

/**
 * Obtiene el nivel y color de fortaleza de contraseña
 */
export function getNivelFortaleza(fortaleza: number): {
  nivel: string;
  color: string;
} {
  if (fortaleza < 40) {
    return { nivel: "Débil", color: "red" };
  } else if (fortaleza < 70) {
    return { nivel: "Media", color: "yellow" };
  } else {
    return { nivel: "Fuerte", color: "green" };
  }
}
