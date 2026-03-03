"use client";

import { useState } from "react";
import {
  representanteSchema,
  type RepresentanteFormData,
} from "@/lib/validations/registro-generador";
import { formatearRUT } from "@/lib/validations/rut";

interface RepresentanteFormProps {
  initialData?: Partial<RepresentanteFormData>;
  onNext: (data: ReturnType<typeof JSON.parse>) => void;
  onBack: () => void;
}

export default function RepresentanteForm({ initialData, onNext, onBack }: RepresentanteFormProps) {
  const [formData, setFormData] = useState<Partial<RepresentanteFormData>>(() => ({
    rutRepresentante: initialData?.rutRepresentante || "",
    nombresRepresentante: initialData?.nombresRepresentante || "",
    apellidosRepresentante: initialData?.apellidosRepresentante || "",
    cargoRepresentante: initialData?.cargoRepresentante || "",
    emailRepresentante: initialData?.emailRepresentante || "",
    telefonoRepresentante: initialData?.telefonoRepresentante || "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validandoRUT, setValidandoRUT] = useState(false);
  const [rutValido, setRutValido] = useState<boolean | null>(null);

  const handleChange = (e: ReturnType<typeof JSON.parse>) => {
    const { name, value } = (e as ReturnType<typeof JSON.parse>).target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRUTChange = (e: ReturnType<typeof JSON.parse>) => {
    const rut = (e as ReturnType<typeof JSON.parse>).target.value;
    setFormData((prev) => ({ ...prev, rutRepresentante: rut }));
    setRutValido(null);

    if (errors.rutRepresentante) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.rutRepresentante;
        return newErrors;
      });
    }
  };

  const validarRUTServidor = async (): Promise<boolean> => {
    if (!formData.rutRepresentante) {
      setErrors((prev) => ({ ...prev, rutRepresentante: "RUT del representante es requerido" }));
      return false;
    }

    setValidandoRUT(true);
    try {
      const response = await fetch("/api/auth/validate-rut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut: formData.rutRepresentante,
          tipo: "representante",
        }),
      });

      const data = await response.json();

      if (data.valid) {
        setRutValido(true);
        const rutFormateado = formatearRUT(formData.rutRepresentante);
        setFormData((prev) => ({ ...prev, rutRepresentante: rutFormateado }));
        return true;
      } else {
        setRutValido(false);
        setErrors((prev) => ({ ...prev, rutRepresentante: data.error }));
        return false;
      }
    } catch (error: unknown) {
      console.error("Error validando RUT:", error);
      setErrors((prev) => ({
        ...prev,
        rutRepresentante: "Error al validar RUT",
      }));
      return false;
    } finally {
      setValidandoRUT(false);
    }
  };

  const handleSubmit = async (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();

    const esRutValido = await validarRUTServidor();
    if (!esRutValido) {
      return;
    }

    // Validar con Zod
    const result = representanteSchema.safeParse(formData);

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

    onNext(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos del Representante Legal</h2>
        <p className="text-sm text-gray-600">
          Ingresa los datos del Representante Legal (nombre y RUN) para firmas electrónicas de
          declaraciones juradas
        </p>
      </div>

      {/* RUN Representante Legal */}
      <div>
        <label htmlFor="rutRepresentante" className="block text-sm font-medium text-gray-700">
          RUN Representante Legal *
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="rutRepresentante"
            name="rutRepresentante"
            value={formData.rutRepresentante || ""}
            onChange={handleRUTChange}
            onBlur={() => validarRUTServidor()}
            placeholder="12.345.678-9"
            className={`flex-1 appearance-none block px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
              errors.rutRepresentante ? "border-red-300" : "border-gray-300"
            }`}
          />
          {validandoRUT && <span className="text-gray-500 text-sm">Validando...</span>}
          {rutValido === true && <span className="text-green-600 text-2xl">✓</span>}
        </div>
        {errors.rutRepresentante && (
          <p className="mt-1 text-sm text-red-600">{errors.rutRepresentante}</p>
        )}
      </div>

      {/* Nombres */}
      <div>
        <label htmlFor="nombresRepresentante" className="block text-sm font-medium text-gray-700">
          Nombres *
        </label>
        <input
          type="text"
          id="nombresRepresentante"
          name="nombresRepresentante"
          value={formData.nombresRepresentante || ""}
          onChange={handleChange}
          placeholder="Juan Carlos"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.nombresRepresentante ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.nombresRepresentante && (
          <p className="mt-1 text-sm text-red-600">{errors.nombresRepresentante}</p>
        )}
      </div>

      {/* Apellidos */}
      <div>
        <label htmlFor="apellidosRepresentante" className="block text-sm font-medium text-gray-700">
          Apellidos *
        </label>
        <input
          type="text"
          id="apellidosRepresentante"
          name="apellidosRepresentante"
          value={formData.apellidosRepresentante || ""}
          onChange={handleChange}
          placeholder="González Pérez"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.apellidosRepresentante ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.apellidosRepresentante && (
          <p className="mt-1 text-sm text-red-600">{errors.apellidosRepresentante}</p>
        )}
      </div>

      {/* Cargo */}
      <div>
        <label htmlFor="cargoRepresentante" className="block text-sm font-medium text-gray-700">
          Cargo
        </label>
        <input
          type="text"
          id="cargoRepresentante"
          name="cargoRepresentante"
          value={formData.cargoRepresentante || ""}
          onChange={handleChange}
          placeholder="Gerente General"
          className="mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm"
        />
      </div>

      {/* Email Representante */}
      <div>
        <label htmlFor="emailRepresentante" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          type="email"
          id="emailRepresentante"
          name="emailRepresentante"
          value={formData.emailRepresentante || ""}
          onChange={handleChange}
          placeholder="representante@empresa.cl"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.emailRepresentante ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.emailRepresentante && (
          <p className="mt-1 text-sm text-red-600">{errors.emailRepresentante}</p>
        )}
      </div>

      {/* Teléfono Representante */}
      <div>
        <label htmlFor="telefonoRepresentante" className="block text-sm font-medium text-gray-700">
          Teléfono de Contacto
        </label>
        <input
          type="tel"
          id="telefonoRepresentante"
          name="telefonoRepresentante"
          value={formData.telefonoRepresentante || ""}
          onChange={handleChange}
          placeholder="+56912345678"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.telefonoRepresentante ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.telefonoRepresentante && (
          <p className="mt-1 text-sm text-red-600">{errors.telefonoRepresentante}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          ← Anterior
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Siguiente →
        </button>
      </div>
    </form>
  );
}
