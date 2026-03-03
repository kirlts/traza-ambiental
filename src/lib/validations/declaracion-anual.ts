import { z } from "zod";

/**
 * Schema de validación para una categoría de neumáticos declarada
 */
export const categoriaDeclaradaSchema = z.object({
  tipo: z.enum(["A", "B"], {
    message: "El tipo debe ser A (vehículos livianos) o B (vehículos pesados)",
  }),
  nombre: z.string().min(1, "El nombre de la categoría es requerido"),
  descripcion: z.string().optional(),
  cantidadUnidades: z
    .number({
      message: "La cantidad debe ser un número",
    })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser positiva"),
  pesoToneladas: z
    .number({
      message: "El peso debe ser un número",
    })
    .positive("El peso debe ser positivo"),
});

/**
 * Schema de validación para la declaración anual completa
 */
export const declaracionAnualSchema = z.object({
  anio: z
    .number()
    .int("El año debe ser un número entero")
    .min(2020, "El año no puede ser anterior a 2020")
    .max(2100, "El año no puede ser posterior a 2100"),
  categorias: z
    .array(categoriaDeclaradaSchema)
    .min(1, "Debe declarar al menos una categoría de neumáticos")
    .max(10, "No puede declarar más de 10 categorías"),
});

/**
 * Schema para actualización de borrador (campos opcionales)
 */
export const declaracionBorradorSchema = z.object({
  anio: z.number().int().min(2020).max(2100).optional(),
  categorias: z.array(categoriaDeclaradaSchema).optional(),
});

/**
 * Schema para observaciones de administrador
 */
export const observacionesSchema = z.object({
  observaciones: z
    .string()
    .min(10, "Las observaciones deben tener al menos 10 caracteres")
    .max(1000, "Las observaciones no pueden exceder 1000 caracteres"),
});

/**
 * Type exports para TypeScript
 */
export type DeclaracionAnualInput = z.infer<typeof declaracionAnualSchema>;
export type CategoriaDeclaradaInput = z.infer<typeof categoriaDeclaradaSchema>;
export type DeclaracionBorradorInput = z.infer<typeof declaracionBorradorSchema>;
export type ObservacionesInput = z.infer<typeof observacionesSchema>;

/**
 * Constantes para categorías de neumáticos según D.S. N°8
 */
export const CATEGORIAS_NEUMATICOS = {
  A: {
    codigo: "A",
    nombre: "Neumáticos de vehículos livianos",
    descripcion: "Incluye neumáticos para automóviles, camionetas y vehículos livianos",
  },
  B: {
    codigo: "B",
    nombre: "Neumáticos de vehículos pesados",
    descripcion: "Incluye neumáticos para camiones, buses y maquinaria pesada",
  },
} as const;

/**
 * Estados posibles de una declaración
 */
export const ESTADOS_DECLARACION = {
  BORRADOR: "borrador",
  ENVIADA: "enviada",
  APROBADA: "aprobada",
  RECHAZADA: "rechazada",
  ANULADA: "anulada",
} as const;

export type EstadoDeclaracion = (typeof ESTADOS_DECLARACION)[keyof typeof ESTADOS_DECLARACION];
