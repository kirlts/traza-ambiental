import { prisma } from "@/lib/prisma";

/**
 * Genera un folio secuencial para reportes anuales
 * Formato: REPORTE-YYYY-XXXX
 *
 * Nota: Usa una tabla separada o incrementa el contador de certificados
 * Por simplicidad, usaremos un contador basado en reportes existentes
 */
export async function generarFolioReporte(anio: number): Promise<string> {
  // Contar reportes existentes para este año
  const reportesExistentes = await prisma.reporteAnual.count({
    where: {
      anio,
    },
  });

  const siguienteNumero = reportesExistentes + 1;
  const numeroFormateado = siguienteNumero.toString().padStart(4, "0");
  return `REPORTE-${anio}-${numeroFormateado}`;
}

/**
 * Genera un código de verificación único para un reporte.
 * ADVERTENCIA: Esta función es impura y NO debe usarse dentro del ciclo de renderizado de React.
 * Solo debe llamarse en Server Components, API Routes o Server Actions.
 */
export function generarCodigoVerificacion(): string {
  // En entorno Node, podemos usar crypto para mayor seguridad si fuera necesario,
  // pero mantendremos la lógica de negocio con una advertencia de pureza.
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `VRF-${timestamp}-${random}`.toUpperCase();
}
