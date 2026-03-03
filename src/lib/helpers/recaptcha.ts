/**
 * Verifica un token de reCAPTCHA con la API de Google
 * @param token - Token recibido del cliente
 * @returns Promise<boolean> - true si el token es válido
 */
export async function verificarRecaptcha(token: string): Promise<boolean> {
  // Si no hay secret key configurada, permitir en desarrollo
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return true;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Error en verificación de reCAPTCHA:", data["error-codes"]);
      return false;
    }

    // Verificar score si es reCAPTCHA v3 (opcional)
    // Para v2, solo verificamos success
    return data.success === true;
  } catch (error: unknown) {
    console.error("Error al verificar reCAPTCHA:", error);
    return false;
  }
}

/**
 * Middleware para validar reCAPTCHA en requests
 * Útil para agregar a rutas de API que requieran protección
 */
export async function validarRecaptchaMiddleware(
  token: string | undefined
): Promise<{ valido: boolean; error?: string }> {
  if (!token) {
    return {
      valido: false,
      error: "Token de reCAPTCHA no proporcionado",
    };
  }

  const esValido = await verificarRecaptcha(token);

  if (!esValido) {
    return {
      valido: false,
      error: "Verificación de reCAPTCHA falló. Por favor, inténtalo de nuevo.",
    };
  }

  return { valido: true };
}
