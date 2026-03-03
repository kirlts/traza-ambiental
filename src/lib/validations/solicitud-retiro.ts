/**
 * Validaciones Zod para Solicitudes de Retiro de NFU
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { z } from "zod";

// ============================================
// Validaciones por Paso del Formulario
// ============================================

/**
 * Paso 1: Información del Retiro
 */
export const paso1Schema = z.object({
  direccionRetiro: z
    .string()
    .min(10, "La dirección debe tener al menos 10 caracteres")
    .max(200, "La dirección no puede exceder 200 caracteres"),

  region: z.string().min(1, "Debe seleccionar una región"),

  comuna: z.string().min(1, "Debe seleccionar una comuna"),

  fechaPreferida: z
    .string()
    .min(1, "La fecha preferida es obligatoria")

    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La fecha no puede ser anterior a hoy")
    .refine((date) => {
      const selectedDate = new Date(date);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      return selectedDate <= maxDate;
    }, "La fecha no puede ser más de 30 días en el futuro"),

  horarioPreferido: z.enum(["manana", "tarde"]),

  usarDireccionRegistrada: z.boolean().optional(),
});

export type Paso1Data = z.infer<typeof paso1Schema>;

/**
 * Paso 2: Detalles de los NFU
 */
export const paso2Schema = z
  .object({
    categoriaA_cantidad: z
      .number()
      .int("La cantidad debe ser un número entero")
      .min(0, "La cantidad no puede ser negativa")
      .optional()
      .default(0),

    categoriaA_pesoEst: z
      .number()
      .min(0, "El peso no puede ser negativo")
      .max(100000, "El peso parece ser demasiado alto")
      .optional()
      .default(0),

    categoriaB_cantidad: z
      .number()
      .int("La cantidad debe ser un número entero")
      .min(0, "La cantidad no puede ser negativa")
      .optional()
      .default(0),

    categoriaB_pesoEst: z
      .number()
      .min(0, "El peso no puede ser negativo")
      .max(100000, "El peso parece ser demasiado alto")
      .optional()
      .default(0),
  })
  .refine(
    (data: ReturnType<typeof JSON.parse>) => {
      // Al menos una categoría debe tener cantidad mayor a 0
      return data.categoriaA_cantidad > 0 || data.categoriaB_cantidad > 0;
    },
    {
      message: "Debe ingresar al menos una categoría con cantidad mayor a 0",
      path: ["categoriaA_cantidad"],
    }
  )
  .refine(
    (data: ReturnType<typeof JSON.parse>) => {
      // Si hay cantidad, debe haber peso
      if (data.categoriaA_cantidad > 0 && data.categoriaA_pesoEst === 0) {
        return false;
      }
      if (data.categoriaB_cantidad > 0 && data.categoriaB_pesoEst === 0) {
        return false;
      }
      return true;
    },
    {
      message: "Si ingresa cantidad, debe ingresar el peso estimado",
      path: ["categoriaA_pesoEst"],
    }
  )
  .refine(
    (data: ReturnType<typeof JSON.parse>) => {
      // Validar peso razonable por unidad (máximo 100kg por neumático)
      if (data.categoriaA_cantidad > 0) {
        const pesoPorUnidad = data.categoriaA_pesoEst / data.categoriaA_cantidad;
        if (pesoPorUnidad > 100) {
          return false;
        }
      }
      if (data.categoriaB_cantidad > 0) {
        const pesoPorUnidad = data.categoriaB_pesoEst / data.categoriaB_cantidad;
        if (pesoPorUnidad > 100) {
          return false;
        }
      }
      return true;
    },
    {
      message: "El peso por unidad parece ser demasiado alto (máx. 100kg por neumático)",
      path: ["categoriaA_pesoEst"],
    }
  );

export type Paso2Data = z.infer<typeof paso2Schema>;

/**
 * Paso 3: Contacto e Instrucciones
 */
export const paso3Schema = z.object({
  nombreContacto: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

  telefonoContacto: z
    .string()
    .min(1, "El teléfono de contacto es obligatorio")
    .regex(
      /^\+56\s?[2-9]\d{8}$|^[2-9]\d{8}$/,
      "Formato inválido. Ejemplo: +56912345678 o 912345678"
    ),

  instrucciones: z
    .string()
    .max(500, "Las instrucciones no pueden exceder 500 caracteres")
    .optional(),

  fotos: z
    .array(z.string().url("Cada foto debe ser una URL válida"))
    .max(5, "Máximo 5 fotos permitidas")
    .optional()
    .default([]),
});

export type Paso3Data = z.infer<typeof paso3Schema>;

// ============================================
// Validación Completa de la Solicitud
// ============================================

/**
 * Schema completo de la solicitud (todos los pasos juntos)
 */
export const solicitudCompletaSchema = z.object({
  // Paso 1
  direccionRetiro: paso1Schema.shape.direccionRetiro,
  region: paso1Schema.shape.region,
  comuna: paso1Schema.shape.comuna,
  fechaPreferida: paso1Schema.shape.fechaPreferida,
  horarioPreferido: paso1Schema.shape.horarioPreferido,

  // Paso 2
  categoriaA_cantidad: paso2Schema.shape.categoriaA_cantidad,
  categoriaA_pesoEst: paso2Schema.shape.categoriaA_pesoEst,
  categoriaB_cantidad: paso2Schema.shape.categoriaB_cantidad,
  categoriaB_pesoEst: paso2Schema.shape.categoriaB_pesoEst,

  // Paso 3
  nombreContacto: paso3Schema.shape.nombreContacto,
  telefonoContacto: paso3Schema.shape.telefonoContacto,
  instrucciones: paso3Schema.shape.instrucciones,
  fotos: paso3Schema.shape.fotos,

  // Metadata
  esBorrador: z.boolean().default(false),
});

export type SolicitudCompletaData = z.infer<typeof solicitudCompletaSchema>;

// ============================================
// Validación para Guardar Borrador
// ============================================

/**
 * Schema para guardar como borrador (campos opcionales)
 */
export const borradorSchema = z.object({
  // Paso 1 (todo opcional en borrador)
  direccionRetiro: z.string().optional(),
  region: z.string().optional(),
  comuna: z.string().optional(),
  fechaPreferida: z.string().optional(),
  horarioPreferido: z.enum(["manana", "tarde"]).optional(),

  // Paso 2 (todo opcional en borrador)
  categoriaA_cantidad: z.number().int().min(0).optional().default(0),
  categoriaA_pesoEst: z.number().min(0).optional().default(0),
  categoriaB_cantidad: z.number().int().min(0).optional().default(0),
  categoriaB_pesoEst: z.number().min(0).optional().default(0),

  // Paso 3 (todo opcional en borrador)
  nombreContacto: z.string().optional(),
  telefonoContacto: z.string().optional(),
  instrucciones: z.string().max(500).optional(),
  fotos: z.array(z.string().url()).max(5).optional().default([]),

  // Metadata
  esBorrador: z.literal(true),
});

export type BorradorData = z.infer<typeof borradorSchema>;

// ============================================
// Validación para Actualizar Estado
// ============================================

/**
 * Schema para actualizar el estado de una solicitud
 */
export const actualizarEstadoSchema = z.object({
  nuevoEstado: z.enum([
    "PENDIENTE",
    "ACEPTADA",
    "EN_CAMINO",
    "RECOLECTADA",
    "ENTREGADA_GESTOR",
    "RECIBIDA_PLANTA",
    "TRATADA",
    "RECHAZADA",
    "CANCELADA",
  ]),
  notas: z.string().max(500).optional(),
});

export type ActualizarEstadoData = z.infer<typeof actualizarEstadoSchema>;

// ============================================
// Validación para Subir Fotos
// ============================================

/**
 * Schema para validar archivo de foto
 */
export const fotoSchema = z.object({
  filename: z.string(),
  mimetype: z
    .string()
    .refine((type) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(type), {
      message: "Solo se permiten archivos JPEG, PNG o WebP",
    }),
  size: z.number().max(5 * 1024 * 1024, "El archivo no puede exceder 5MB"),
});

export type FotoData = z.infer<typeof fotoSchema>;
