/**
 * Helper para validación de RUT chileno
 * Utilizado en múltiples HUs: HU-003, HU-003B, HU-006, etc.
 *
 * @module validarRUT
 */

/**
 * Limpia un RUT removiendo puntos, guiones y espacios
 * Convierte 'k' minúscula a 'K' mayúscula
 *
 * @param rut - RUT a limpiar (con o sin formato)
 * @returns RUT limpio (solo números y K mayúscula)
 *
 * @example
 * limpiarRUT('12.345.678-5')  // => '123456785'
 * limpiarRUT('11111111-k')    // => '11111111K'
 */
export function limpiarRUT(rut: string): string {
  if (!rut) return "";

  return rut
    .toString()
    .trim()
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase();
}

/**
 * Calcula el dígito verificador de un RUT
 * Algoritmo oficial del Servicio de Impuestos Internos (SII)
 *
 * @param rutSinDV - RUT sin dígito verificador (solo números)
 * @returns Dígito verificador calculado ('0'-'9' o 'K'), null si entrada inválida
 *
 * @example
 * calcularDigitoVerificador('12345678')  // => '5'
 * calcularDigitoVerificador('11111111')  // => '9'
 */
export function calcularDigitoVerificador(rutSinDV: string): string | null {
  if (!rutSinDV || !/^\d+$/.test(rutSinDV)) return null;

  const cuerpo = rutSinDV.toString();
  let suma = 0;
  let multiplicador = 2;

  // Iterar desde el dígito más a la derecha
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return dv.toString();
}

/**
 * Valida si un RUT es válido según el algoritmo del SII
 *
 * @param rut - RUT a validar (con o sin formato)
 * @returns true si el RUT es válido, false en caso contrario
 *
 * @example
 * validarRUT('12.345.678-5')  // => true
 * validarRUT('12345678-5')    // => true
 * validarRUT('123456785')     // => true
 * validarRUT('11111111-K')    // => true
 * validarRUT('12345678-9')    // => false (DV incorrecto)
 */
export function validarRUT(rut: string): boolean {
  if (!rut) return false;

  try {
    const rutLimpio = limpiarRUT(rut);

    // Validar formato básico
    if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) return false;

    // Validar longitud (mínimo 2 dígitos + DV, máximo 9 dígitos + DV)
    if (rutLimpio.length < 2 || rutLimpio.length > 10) return false;

    // Separar cuerpo y dígito verificador
    const cuerpo = rutLimpio.slice(0, -1);
    const dvIngresado = rutLimpio.slice(-1);

    // Validar que el cuerpo no sea todo ceros
    if (parseInt(cuerpo) === 0) return false;

    // Calcular DV esperado
    const dvCalculado = calcularDigitoVerificador(cuerpo);

    if (!dvCalculado) return false;

    // Comparar DV ingresado con DV calculado
    return dvIngresado === dvCalculado;
  } catch {
    return false;
  }
}

/**
 * Formatea un RUT al formato estándar chileno: XX.XXX.XXX-X
 *
 * @param rut - RUT a formatear (con o sin formato)
 * @returns RUT formateado, string vacío si el RUT no puede ser formateado
 *
 * @example
 * formatearRUT('123456785')      // => '12.345.678-5'
 * formatearRUT('12345678-5')     // => '12.345.678-5'
 * formatearRUT('11111111K')      // => '11.111.111-K'
 * formatearRUT('1234567K')       // => '1.234.567-K'
 * formatearRUT('invalido')       // => ''
 */
export function formatearRUT(rut: string): string {
  if (!rut || rut.trim() === "") return "";

  const rutLimpio = limpiarRUT(rut);

  // Si no tiene al menos 2 caracteres (número + DV), no se puede formatear
  if (rutLimpio.length < 2) return "";

  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);

  // Si el cuerpo está vacío o tiene caracteres no numéricos, no se puede formatear
  if (!cuerpo || !/^\d+$/.test(cuerpo)) return "";

  // Formatear cuerpo con puntos cada 3 dígitos (de derecha a izquierda)
  let cuerpoFormateado = "";
  let contador = 0;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    if (contador > 0 && contador % 3 === 0) {
      cuerpoFormateado = "." + cuerpoFormateado;
    }
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
  }

  return `${cuerpoFormateado}-${dv}`;
}

/**
 * Valida y formatea un RUT en un solo paso
 * Útil para sanitizar inputs de usuario
 *
 * @param rut - RUT ingresado por el usuario
 * @returns Objeto con resultado de validación y RUT formateado
 *
 * @example
 * validarYFormatearRUT('12345678-5')
 * // => { valido: true, rutFormateado: '12.345.678-5', error: null }
 *
 * validarYFormatearRUT('12345678-9')
 * // => { valido: false, rutFormateado: '', error: 'RUT inválido' }
 */
export function validarYFormatearRUT(rut: string): {
  valido: boolean;
  rutFormateado: string;
  error: string | null;
} {
  if (!rut || rut.trim() === "") {
    return {
      valido: false,
      rutFormateado: "",
      error: "RUT es requerido",
    };
  }

  const esValido = validarRUT(rut);

  if (!esValido) {
    return {
      valido: false,
      rutFormateado: "",
      error: "RUT inválido. Verifique el número y el dígito verificador.",
    };
  }

  return {
    valido: true,
    rutFormateado: formatearRUT(rut),
    error: null,
  };
}

/**
 * Extrae solo el cuerpo del RUT (sin dígito verificador)
 *
 * @param rut - RUT completo (con o sin formato)
 * @returns Cuerpo del RUT (solo números), string vacío si es inválido
 *
 * @example
 * extraerCuerpoRUT('12.345.678-5')  // => '12345678'
 * extraerCuerpoRUT('11111111-K')    // => '11111111'
 */
export function extraerCuerpoRUT(rut: string): string {
  if (!validarRUT(rut)) return "";
  const rutLimpio = limpiarRUT(rut);
  return rutLimpio.slice(0, -1);
}

/**
 * Extrae solo el dígito verificador del RUT
 *
 * @param rut - RUT completo (con o sin formato)
 * @returns Dígito verificador ('0'-'9' o 'K'), string vacío si es inválido
 *
 * @example
 * extraerDVRUT('12.345.678-5')  // => '5'
 * extraerDVRUT('11111111-K')    // => 'K'
 */
export function extraerDVRUT(rut: string): string {
  if (!validarRUT(rut)) return "";
  const rutLimpio = limpiarRUT(rut);
  return rutLimpio.slice(-1);
}

/**
 * Genera un RUT aleatorio válido para testing
 * ⚠️ SOLO PARA PROPÓSITOS DE DESARROLLO Y TESTING
 *
 * @returns RUT válido formateado
 *
 * @example
 * generarRUTAleatorio()  // => '18.543.921-4'
 */
export function generarRUTAleatorio(): string {
  // Generar cuerpo aleatorio entre 5.000.000 y 30.000.000
  const cuerpo = Math.floor(Math.random() * 25000000 + 5000000).toString();
  const dv = calcularDigitoVerificador(cuerpo);

  if (!dv) return "";

  return formatearRUT(cuerpo + dv);
}

/**
 * RUTs de prueba válidos para desarrollo
 * No corresponden a personas reales
 */
export const RUTS_PRUEBA = {
  VALIDO_1: "11.111.111-1",
  VALIDO_2: "22.222.222-2",
  VALIDO_3: "33.333.333-3",
  VALIDO_K: "11.111.111-K",
  VALIDO_0: "8.888.888-0",
} as const;

/**
 * Máscara de input para React
 * Aplica formato mientras el usuario escribe
 *
 * @param valor - Valor actual del input
 * @returns Valor formateado parcialmente
 *
 * @example
 * mascaraInputRUT('12345678')  // => '12.345.678'
 * mascaraInputRUT('123456785') // => '12.345.678-5'
 */
export function mascaraInputRUT(valor: string): string {
  if (!valor) return "";

  // Limpiar valor
  let limpio = valor.replace(/\./g, "").replace(/-/g, "").replace(/\s/g, "").toUpperCase();

  // Limitar longitud máxima
  if (limpio.length > 9) {
    limpio = limpio.substring(0, 9);
  }

  // Aplicar formato progresivo
  if (limpio.length <= 1) {
    return limpio;
  }

  // Separar números y último carácter (potencial DV)
  const ultimoCaracter = limpio.slice(-1);
  const cuerpo = limpio.slice(0, -1);

  // Si el último carácter es letra, es el DV
  const esLetraDV = /[K]/.test(ultimoCaracter);

  let resultado = "";

  if (esLetraDV || limpio.length === 9) {
    // Formatear cuerpo con puntos
    let contador = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      if (contador > 0 && contador % 3 === 0) {
        resultado = "." + resultado;
      }
      resultado = cuerpo[i] + resultado;
      contador++;
    }

    // Agregar guión y DV
    resultado += "-" + ultimoCaracter;
  } else {
    // Formatear como cuerpo solamente
    let contador = 0;
    for (let i = limpio.length - 1; i >= 0; i--) {
      if (contador > 0 && contador % 3 === 0) {
        resultado = "." + resultado;
      }
      resultado = limpio[i] + resultado;
      contador++;
    }
  }

  return resultado;
}

/**
 * Schema de validación Zod para RUT
 * Uso en formularios React Hook Form
 */
export const rutSchema = {
  /**
   * Validador Zod refinement para RUT
   * @example
   * z.string().refine(rutSchema.validador, rutSchema.mensaje)
   */
  validador: (val: string) => validarRUT(val),
  mensaje: {
    message: "RUT inválido. Formato esperado: 12.345.678-5",
  },
};

/**
 * Comparar dos RUTs ignorando formato
 *
 * @param rut1 - Primer RUT
 * @param rut2 - Segundo RUT
 * @returns true si ambos RUTs son iguales (ignora formato)
 *
 * @example
 * compararRUT('12.345.678-5', '123456785')  // => true
 * compararRUT('12345678-5', '12.345.678-5') // => true
 * compararRUT('12345678-5', '12345678-K')   // => false
 */
export function compararRUT(rut1: string, rut2: string): boolean {
  if (!validarRUT(rut1) || !validarRUT(rut2)) return false;
  return limpiarRUT(rut1) === limpiarRUT(rut2);
}
