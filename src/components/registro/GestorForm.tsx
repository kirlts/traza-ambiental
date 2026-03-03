"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GestorFormProps {
  onBack: () => void;
}

export default function GestorForm({ onBack }: GestorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rut: "",
    tipoEmpresa: "",
    capacidadProcesamiento: "",
    tipoPlanta: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: ReturnType<typeof JSON.parse>) => {
    setFormData({
      ...formData,
      [(e as ReturnType<typeof JSON.parse>).target.name]: (e as ReturnType<typeof JSON.parse>)
        .target.value,
    });
  };

  const handleSubmit = async (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    setIsLoading(true);
    setError("");

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register/gestor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          rut: formData.rut,
          tipoEmpresa: formData.tipoEmpresa,
          capacidadProcesamiento: parseFloat(formData.capacidadProcesamiento),
          tipoPlanta: formData.tipoPlanta,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/login?message=Cuenta creada exitosamente. Revisa tu email.");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Error al crear la cuenta");
      }
    } catch {
      setError("Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">¡Registro exitoso!</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tu cuenta ha sido creada. Revisa tu email para verificar la cuenta y obtener instrucciones
          sobre cómo subir tu documentación.
        </p>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2">Redirigiendo al login...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <span className="sr-only">Volver</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registro Gestor</h2>
          <p className="text-sm text-gray-500">Completa tus datos para registrarte como Gestor</p>
        </div>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Documentación requerida</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Una vez registrado, deberás subir:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Autorización Sanitaria de Planta</li>
                <li>Resolución de Calificación Ambiental (RCA)</li>
                <li>Registro Gestor MMA</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Información Personal */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="rut" className="block text-sm font-medium text-gray-700">
                RUT de la empresa *
              </label>
              <input
                id="rut"
                name="rut"
                type="text"
                required
                value={formData.rut}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="12.345.678-9"
              />
              <p className="mt-1 text-xs text-gray-500">Formato: XX.XXX.XXX-X</p>
            </div>
          </div>
        </div>

        {/* Información de la Planta */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Planta</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="tipoEmpresa" className="block text-sm font-medium text-gray-700">
                Tipo de empresa *
              </label>
              <select
                id="tipoEmpresa"
                name="tipoEmpresa"
                required
                value={formData.tipoEmpresa}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un tipo</option>
                <option value="Persona Natural">Persona Natural</option>
                <option value="EIRL">EIRL</option>
                <option value="SpA">SpA</option>
                <option value="Ltda">Ltda</option>
                <option value="S.A.">S.A.</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="tipoPlanta" className="block text-sm font-medium text-gray-700">
                Tipo de planta *
              </label>
              <select
                id="tipoPlanta"
                name="tipoPlanta"
                required
                value={formData.tipoPlanta}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Selecciona un tipo</option>
                <option value="Tratamiento Térmico">Tratamiento Térmico</option>
                <option value="Cementerio de Neumáticos">Cementerio de Neumáticos</option>
                <option value="Reciclaje Mecánico">Reciclaje Mecánico</option>
                <option value="Valorización Energética">Valorización Energética</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="capacidadProcesamiento"
                className="block text-sm font-medium text-gray-700"
              >
                Capacidad de procesamiento (ton/año) *
              </label>
              <input
                id="capacidadProcesamiento"
                name="capacidadProcesamiento"
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.capacidadProcesamiento}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="100.5"
              />
              <p className="mt-1 text-xs text-gray-500">
                Capacidad de procesamiento de neumáticos por año
              </p>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Mínimo 8 caracteres"
              />
              <p className="mt-1 text-xs text-gray-500">
                Debe contener al menos una mayúscula, una minúscula y un número
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Repite tu contraseña"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta Gestor"}
          </button>
        </div>
      </form>
    </div>
  );
}
