import crypto from "crypto";

export interface GuiaDespachoData {
  folio: string;
  fechaEmision: Date;
  rutGenerador: string;
  rutTransportista: string;
  rutGestor: string;
  patente: string;
  pesoKg: number;
}

/**
 * Genera un hash SHA-256 para asegurar la integridad de la Guía de Despacho
 */
export function generarHashGuia(data: ReturnType<typeof JSON.parse>): string {
  // Construir string canónico (orden estricto)
  // Formato: FOLIO|ISO_DATE|RUT_GEN|RUT_TRANS|RUT_GES|PATENTE|PESO
  const cadenaOriginal = [
    data.folio,
    data.fechaEmision.toISOString(),
    data.rutGenerador,
    data.rutTransportista,
    data.rutGestor,
    data.patente,
    data.pesoKg.toString(),
  ].join("|");

  return crypto.createHash("sha256").update(cadenaOriginal).digest("hex");
}

/**
 * Verifica si un hash corresponde a los datos proporcionados
 */
export function verificarHashGuia(
  data: ReturnType<typeof JSON.parse>,
  hashAlmacenado: string
): boolean {
  const hashCalculado = generarHashGuia(data);
  return hashCalculado === hashAlmacenado;
}
