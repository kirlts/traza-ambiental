"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  credencialesSchema,
  type CredencialesFormData,
  validarRequisitosPassword,
  calcularFortalezaPassword,
  getNivelFortaleza,
} from "@/lib/validations/registro-generador";

interface CredencialesFormProps {
  initialData?: Partial<CredencialesFormData>;
  onSubmit: (data: ReturnType<typeof JSON.parse>) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function CredencialesForm({
  initialData,
  onSubmit,
  onBack,
  isLoading,
}: CredencialesFormProps) {
  const [formData, setFormData] = useState<Partial<CredencialesFormData>>(() => ({
    email: initialData?.email || "",
    password: initialData?.password || "",
    confirmPassword: initialData?.confirmPassword || "",
    aceptaTerminos: initialData?.aceptaTerminos || false,
    aceptaPrivacidad: initialData?.aceptaPrivacidad || false,
    recaptchaToken: initialData?.recaptchaToken,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  // Derivar análisis de contraseña
  const requisitosPassword = formData.password
    ? validarRequisitosPassword(formData.password)
    : { longitudMinima: false, tieneMayuscula: false, tieneNumero: false };
  const fortalezaPassword = formData.password ? calcularFortalezaPassword(formData.password) : 0;

  const handleChange = (e: ReturnType<typeof JSON.parse>) => {
    const { name, value, type, checked } = (e as ReturnType<typeof JSON.parse>).target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setFormData((prev) => ({ ...prev, recaptchaToken: token || undefined }));
    if (errors.recaptchaToken) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.recaptchaToken;
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();

    // Si no hay siteKey configurado, permitir registro sin reCAPTCHA
    const dataToValidate = {
      ...formData,
      recaptchaToken: siteKey ? formData.recaptchaToken : undefined,
    };

    // Validar con Zod
    const result = credencialesSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      const fieldErrors = result.error.flatten().fieldErrors;
      Object.keys(fieldErrors).forEach((key) => {
        const errorArray = fieldErrors[key as keyof typeof fieldErrors];
        if (errorArray && errorArray.length > 0) {
          newErrors[key] = errorArray[0];
        }
      });
      setErrors(newErrors);
      return;
    }

    onSubmit(result.data);
  };

  const { nivel, color } = getNivelFortaleza(fortalezaPassword);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Credenciales de Acceso</h2>
        <p className="text-sm text-gray-600">
          Configura el email y contraseña para acceder a la plataforma
        </p>
      </div>

      {/* Email de Usuario */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email de Usuario *
        </label>
        <p className="text-xs text-gray-500 mb-1">Se usará para iniciar sesión</p>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="usuario@empresa.cl"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.email ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña *
        </label>
        <div className="mt-1 relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 pr-10 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
              errors.password ? "border-red-300" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {mostrarPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Requisitos de contraseña */}
        {formData.password && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">Requisitos:</p>
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  requisitosPassword.longitudMinima
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {requisitosPassword.longitudMinima ? "✓" : "○"} 8 caracteres
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  requisitosPassword.tieneMayuscula
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {requisitosPassword.tieneMayuscula ? "✓" : "○"} 1 mayúscula
              </span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  requisitosPassword.tieneNumero
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {requisitosPassword.tieneNumero ? "✓" : "○"} 1 número
              </span>
            </div>

            {/* Barra de fortaleza */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      color === "red"
                        ? "bg-red-500"
                        : color === "yellow"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${fortalezaPassword}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{nivel}</span>
              </div>
            </div>
          </div>
        )}

        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar Contraseña *
        </label>
        <div className="mt-1 relative">
          <input
            type={mostrarConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 pr-10 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
              errors.confirmPassword ? "border-red-300" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {mostrarConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Términos y Condiciones */}
      <div className="space-y-2">
        <div className="flex items-start">
          <input
            id="aceptaTerminos"
            name="aceptaTerminos"
            type="checkbox"
            checked={formData.aceptaTerminos || false}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="aceptaTerminos" className="ml-2 block text-sm text-gray-900">
            Acepto los{" "}
            <a href="/terminos" target="_blank" className="text-green-600 hover:text-green-500">
              términos y condiciones
            </a>{" "}
            *
          </label>
        </div>
        {errors.aceptaTerminos && (
          <p className="text-sm text-red-600 ml-6">{errors.aceptaTerminos}</p>
        )}

        <div className="flex items-start">
          <input
            id="aceptaPrivacidad"
            name="aceptaPrivacidad"
            type="checkbox"
            checked={formData.aceptaPrivacidad || false}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="aceptaPrivacidad" className="ml-2 block text-sm text-gray-900">
            Acepto la{" "}
            <a href="/privacidad" target="_blank" className="text-green-600 hover:text-green-500">
              política de privacidad
            </a>{" "}
            *
          </label>
        </div>
        {errors.aceptaPrivacidad && (
          <p className="text-sm text-red-600 ml-6">{errors.aceptaPrivacidad}</p>
        )}
      </div>

      {/* reCAPTCHA */}
      {siteKey ? (
        <div>
          <ReCAPTCHA sitekey={siteKey} onChange={handleRecaptchaChange} />
          {errors.recaptchaToken && (
            <p className="mt-1 text-sm text-red-600">{errors.recaptchaToken}</p>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Modo desarrollo:</strong> reCAPTCHA no configurado. La verificación se
            omitirá.
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? "Registrando..." : "Registrarme"}
        </button>
      </div>
    </form>
  );
}
