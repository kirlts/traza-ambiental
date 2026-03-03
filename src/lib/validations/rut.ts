/**
 * Utilidades para validación y formateo de RUT chileno
 */

/**
 * Limpia un RUT eliminando puntos, guiones y espacios
 * @param rut - RUT a limpiar
 * @returns RUT limpio (solo números y dígito verificador)
 */
export function limpiarRUT(rut: string): string {
  return rut.replace(/[.\-\s]/g, "").toUpperCase();
}

/**
 * Formatea un RUT al formato estándar chileno (XX.XXX.XXX-X)
 * @param rut - RUT a formatear
 * @returns RUT formateado
 */
export function formatearRUT(rut: string): string {
  const rutLimpio = limpiarRUT(rut);

  if (rutLimpio.length < 2) return rutLimpio;

  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // Agregar puntos de miles
  const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${numeroFormateado}-${dv}`;
}

/**
 * Calcula el dígito verificador de un RUT
 * @param rut - RUT sin dígito verificador
 * @returns Dígito verificador (puede ser número o 'K')
 */
export function calcularDV(rut: string): string {
  const rutLimpio = limpiarRUT(rut);
  const numero = rutLimpio.replace(/[^0-9]/g, "");

  let suma = 0;
  let multiplicador = 2;

  // Recorrer el RUT de derecha a izquierda
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return dv.toString();
}

/**
 * Valida si un RUT chileno es válido
 * @param rut - RUT a validar (puede incluir puntos y guión)
 * @returns true si el RUT es válido, false en caso contrario
 */
export function validarRUT(rut: string): boolean {
  if (!rut || typeof rut !== "string") return false;

  const rutLimpio = limpiarRUT(rut);

  // Verificar formato básico (mínimo 2 caracteres: número + DV)
  if (rutLimpio.length < 2) return false;

  // Verificar que tenga el formato correcto (números + K o dígito)
  if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) return false;

  // Separar número y dígito verificador
  const dv = rutLimpio.slice(-1);
  const numero = rutLimpio.slice(0, -1);

  // Verificar que el número tenga al menos 1 dígito
  if (numero.length === 0) return false;

  // Verificar que el número no sea 0
  if (parseInt(numero) === 0) return false;

  // Calcular y comparar dígito verificador
  const dvCalculado = calcularDV(numero);

  return dv === dvCalculado;
}

/**
 * Extrae solo el número del RUT (sin dígito verificador)
 * @param rut - RUT completo
 * @returns Número del RUT
 */
export function obtenerNumeroRUT(rut: string): string {
  const rutLimpio = limpiarRUT(rut);
  return rutLimpio.slice(0, -1);
}

/**
 * Extrae solo el dígito verificador del RUT
 * @param rut - RUT completo
 * @returns Dígito verificador
 */
export function obtenerDV(rut: string): string {
  const rutLimpio = limpiarRUT(rut);
  return rutLimpio.slice(-1);
}

/**
 * Valida y formatea un RUT en un solo paso
 * @param rut - RUT a validar y formatear
 * @returns Objeto con validez y RUT formateado
 */
export function validarYFormatearRUT(rut: string): {
  valido: boolean;
  rutFormateado: string;
  mensaje?: string;
} {
  if (!rut) {
    return {
      valido: false,
      rutFormateado: "",
      mensaje: "RUT es requerido",
    };
  }

  const esValido = validarRUT(rut);

  if (!esValido) {
    return {
      valido: false,
      rutFormateado: rut,
      mensaje: "RUT inválido. Verifica el dígito verificador.",
    };
  }

  return {
    valido: true,
    rutFormateado: formatearRUT(rut),
  };
}
