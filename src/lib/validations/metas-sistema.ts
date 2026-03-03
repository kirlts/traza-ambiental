import { z } from "zod";

/**
 * Validaciones para metas del Sistema de Gestión
 */

// Schema para crear o actualizar una meta
export const metaSistemaSchema = z.object({
  anio: z.number().int().min(2020).max(2100, "Año inválido"),
  tipo: z.enum(["recoleccion", "valorizacion"], {
    message: "Tipo debe ser recoleccion o valorizacion",
  }),
  metaToneladas: z
    .number()
    .positive("La meta debe ser un número positivo")
    .max(1000000, "La meta no puede superar 1,000,000 toneladas"),
  justificacion: z.string().optional(),
});

// Schema para actualizar una meta existente
export const actualizarMetaSchema = z.object({
  metaToneladas: z
    .number()
    .positive("La meta debe ser un número positivo")
    .max(1000000, "La meta no puede superar 1,000,000 toneladas"),
  justificacion: z
    .string()
    .min(10, "La justificación debe tener al menos 10 caracteres")
    .optional(),
});

// Schema para desglose de meta
export const desgloseMetaSchema = z.object({
  criterio: z.enum(["categoria", "tratamiento", "region"], {
    message: "Criterio debe ser categoria, tratamiento o region",
  }),
  valor: z.string().min(1, "El valor del desglose es requerido"),
  metaToneladas: z.number().positive("La meta del desglose debe ser positiva"),
});

// Schema para crear meta con desgloses
export const metaConDesglosesSchema = metaSistemaSchema.extend({
  desgloses: z.array(desgloseMetaSchema).optional(),
});

// Schema para importar desde declaración
export const importarDeclaracionSchema = z.object({
  anio: z.number().int().min(2020).max(2100),
  declaracionId: z.string().cuid("ID de declaración inválido"),
});

// Schema para query params de consulta
export const consultaMetasSchema = z.object({
  anio: z.number().int().optional(),
  tipo: z.enum(["recoleccion", "valorizacion"]).optional(),
});

/**
 * Validaciones de negocio adicionales
 */

// Verifica que la meta de valorización no sea mayor que la de recolección
export function validarRelacionMetas(
  metaRecoleccion: number,
  metaValorizacion: number
): { valido: boolean; mensaje?: string } {
  if (metaValorizacion > metaRecoleccion) {
    return {
      valido: false,
      mensaje: "La meta de valorización no puede ser mayor que la de recolección",
    };
  }
  return { valido: true };
}

// Verifica si un cambio de meta es significativo (>10%)
export function esModificacionSignificativa(metaAnterior: number, metaNueva: number): boolean {
  const diferencia = Math.abs(metaNueva - metaAnterior);
  const porcentajeCambio = (diferencia / metaAnterior) * 100;
  return porcentajeCambio > 10;
}

// Valida que la suma de desgloses no supere la meta total
export function validarSumaDesgloses(
  metaTotal: number,
  desgloses: { metaToneladas: number }[]
): { valido: boolean; mensaje?: string } {
  const sumaDesgloses = desgloses.reduce(
    (sum, d: ReturnType<typeof JSON.parse>) => sum + d.metaToneladas,
    0
  );

  if (sumaDesgloses > metaTotal) {
    return {
      valido: false,
      mensaje: `La suma de desgloses (${sumaDesgloses} ton) no puede superar la meta total (${metaTotal} ton)`,
    };
  }

  return { valido: true };
}

// Tipo TypeScript inferido del schema
export type MetaSistema = z.infer<typeof metaSistemaSchema>;
export type ActualizarMeta = z.infer<typeof actualizarMetaSchema>;
export type DesgloseMeta = z.infer<typeof desgloseMetaSchema>;
export type MetaConDesgloses = z.infer<typeof metaConDesglosesSchema>;
export type ImportarDeclaracion = z.infer<typeof importarDeclaracionSchema>;
export type ConsultaMetas = z.infer<typeof consultaMetasSchema>;
