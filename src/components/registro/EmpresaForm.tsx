"use client";

import { useState } from "react";

import { empresaSchema, type EmpresaFormData } from "@/lib/validations/registro-generador";
import { formatearRUT } from "@/lib/validations/rut";

interface EmpresaFormProps {
  initialData?: Partial<EmpresaFormData>;
  onNext: (data: ReturnType<typeof JSON.parse>) => void;
}

const REGIONES_CHILE = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén",
  "Región de Magallanes y la Antártica Chilena",
];

export default function EmpresaForm({ initialData, onNext }: EmpresaFormProps) {
  const [formData, setFormData] = useState<Partial<EmpresaFormData>>(() => ({
    rutEmpresa: initialData?.rutEmpresa || "",
    razonSocial: initialData?.razonSocial || "",
    direccion: initialData?.direccion || "",
    direccionCasaMatriz: initialData?.direccionCasaMatriz || "",
    comuna: initialData?.comuna || "",
    region: initialData?.region || "",
    telefono: initialData?.telefono || "",
    idRETC: initialData?.idRETC || "",
    tipoProductorREP: initialData?.tipoProductorREP || "",
    tiposResiduos: initialData?.tiposResiduos || [],
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validandoRUT, setValidandoRUT] = useState(false);
  const [rutValido, setRutValido] = useState<boolean | null>(null);

  const handleChange = (e: ReturnType<typeof JSON.parse>) => {
    const target = (e as ReturnType<typeof JSON.parse>).target as
      | HTMLInputElement
      | HTMLSelectElement;
    const fieldName = target.getAttribute("data-field") || target.name;
    const value = target.value;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // Limpiar error del campo
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (residuo: string, checked: boolean) => {
    setFormData((prev) => {
      const currentResiduos = (prev.tiposResiduos || []) as EmpresaFormData["tiposResiduos"];
      if (checked) {
        return {
          ...prev,
          tiposResiduos: [...currentResiduos, residuo as EmpresaFormData["tiposResiduos"][number]],
        };
      } else {
        return {
          ...prev,
          tiposResiduos: currentResiduos.filter(
            (r: ReturnType<typeof JSON.parse>) => r !== residuo
          ),
        };
      }
    });
    // Limpiar error
    if (errors.tiposResiduos) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.tiposResiduos;
        return newErrors;
      });
    }
  };

  const handleRUTChange = (e: ReturnType<typeof JSON.parse>) => {
    const rut = (e as ReturnType<typeof JSON.parse>).target.value;
    setFormData((prev) => ({ ...prev, rutEmpresa: rut }));
    setRutValido(null);

    if (errors.rutEmpresa) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.rutEmpresa;
        return newErrors;
      });
    }
  };

  const validarRUTServidor = async (): Promise<boolean> => {
    if (!formData.rutEmpresa) {
      setErrors((prev) => ({ ...prev, rutEmpresa: "RUT de la empresa es requerido" }));
      return false;
    }

    setValidandoRUT(true);
    try {
      const response = await fetch("/api/auth/validate-rut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut: formData.rutEmpresa, tipo: "empresa" }),
      });

      const data = await response.json();

      if (data.valid) {
        setRutValido(true);
        const rutFormateado = formatearRUT(formData.rutEmpresa);
        setFormData((prev) => ({ ...prev, rutEmpresa: rutFormateado }));
        return true;
      } else {
        setRutValido(false);
        setErrors((prev) => ({ ...prev, rutEmpresa: data.error }));
        return false;
      }
    } catch (error: unknown) {
      console.error("Error validando RUT:", error);
      setErrors((prev) => ({ ...prev, rutEmpresa: "Error al validar RUT" }));
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

    const result = empresaSchema.safeParse(formData);

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos de la Empresa</h2>
        <p className="text-sm text-gray-600">Ingresa la información de la empresa generadora</p>
      </div>

      {/* Mensaje de error general */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
        >
          <p className="text-sm font-medium">Por favor corrige los siguientes errores:</p>
          <ul className="mt-2 text-sm list-disc list-inside">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* RUT Empresa */}
      <div>
        <label htmlFor="empresa.rut" className="block text-sm font-medium text-gray-700">
          RUT Empresa *
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="empresa.rut"
            name="empresa.rut"
            data-field="rutEmpresa"
            value={formData.rutEmpresa || ""}
            onChange={handleRUTChange}
            onBlur={() => validarRUTServidor()}
            placeholder="12.345.678-9"
            className={`flex-1 appearance-none block px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
              errors.rutEmpresa ? "border-red-300" : "border-gray-300"
            }`}
          />
          {validandoRUT && <span className="text-gray-500 text-sm">Validando...</span>}
          {rutValido === true && <span className="text-green-600 text-2xl">✓</span>}
        </div>
        {errors.rutEmpresa && <p className="mt-1 text-sm text-red-600">{errors.rutEmpresa}</p>}
      </div>

      {/* Razón Social */}
      <div>
        <label htmlFor="empresa.razonSocial" className="block text-sm font-medium text-gray-700">
          Razón Social *
        </label>
        <input
          type="text"
          id="empresa.razonSocial"
          name="empresa.razonSocial"
          data-field="razonSocial"
          value={formData.razonSocial || ""}
          onChange={handleChange}
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.razonSocial ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.razonSocial && <p className="mt-1 text-sm text-red-600">{errors.razonSocial}</p>}
      </div>

      {/* Dirección Comercial */}
      <div>
        <label htmlFor="empresa.direccion" className="block text-sm font-medium text-gray-700">
          Dirección Comercial *
        </label>
        <input
          type="text"
          id="empresa.direccion"
          name="empresa.direccion"
          data-field="direccion"
          value={formData.direccion || ""}
          onChange={handleChange}
          placeholder="Av. Principal 123, Piso 4"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.direccion ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Dirección donde opera comercialmente la empresa
        </p>
      </div>

      {/* Dirección Casa Matriz */}
      <div>
        <label
          htmlFor="empresa.direccionCasaMatriz"
          className="block text-sm font-medium text-gray-700"
        >
          Dirección Casa Matriz
        </label>
        <input
          type="text"
          id="empresa.direccionCasaMatriz"
          name="empresa.direccionCasaMatriz"
          data-field="direccionCasaMatriz"
          value={formData.direccionCasaMatriz || ""}
          onChange={handleChange}
          placeholder="Av. Casa Matriz 456"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.direccionCasaMatriz ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.direccionCasaMatriz && (
          <p className="mt-1 text-sm text-red-600">{errors.direccionCasaMatriz}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Complete solo si es diferente a la dirección comercial
        </p>
      </div>

      {/* Región */}
      <div>
        <label htmlFor="empresa.region" className="block text-sm font-medium text-gray-700">
          Región
        </label>
        <select
          id="empresa.region"
          name="empresa.region"
          data-field="region"
          value={formData.region || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm"
        >
          <option value="">Seleccionar región</option>
          {REGIONES_CHILE.map((region: ReturnType<typeof JSON.parse>) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Comuna */}
      <div>
        <label htmlFor="empresa.comuna" className="block text-sm font-medium text-gray-700">
          Comuna
        </label>
        <input
          type="text"
          id="empresa.comuna"
          name="empresa.comuna"
          data-field="comuna"
          value={formData.comuna || ""}
          onChange={handleChange}
          placeholder="Santiago"
          className="mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="empresa.telefono" className="block text-sm font-medium text-gray-700">
          Teléfono
        </label>
        <input
          type="tel"
          id="empresa.telefono"
          name="empresa.telefono"
          data-field="telefono"
          value={formData.telefono || ""}
          onChange={handleChange}
          placeholder="+56912345678"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm ${
            errors.telefono ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
      </div>

      {/* ID RETC (Ventanilla Única) */}
      <div>
        <label htmlFor="empresa.idRETC" className="block text-sm font-medium text-gray-700">
          ID RETC (Ventanilla Única) *
        </label>
        <input
          type="text"
          id="empresa.idRETC"
          name="empresa.idRETC"
          data-field="idRETC"
          value={formData.idRETC || ""}
          onChange={handleChange}
          placeholder="EJ-RETC-12345"
          className={`mt-1 appearance-none block w-full px-3 py-2 bg-gray-50 text-gray-900 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm uppercase ${
            errors.idRETC ? "border-red-300" : "border-gray-300"
          }`}
          style={{ textTransform: "uppercase" }}
        />
        {errors.idRETC && <p className="mt-1 text-sm text-red-600">{errors.idRETC}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Código de establecimiento en el Registro de Emisiones y Transferencias de Contaminantes
          (RETC). Es obligatorio que estén inscritos en la Ventanilla Única.
        </p>
      </div>

      {/* Tipo de Productor REP */}
      <div>
        <label
          htmlFor="empresa.tipoProductorREP"
          className="block text-sm font-medium text-gray-700"
        >
          Tipo de Productor REP *
        </label>
        <select
          id="empresa.tipoProductorREP"
          name="empresa.tipoProductorREP"
          data-field="tipoProductorREP"
          value={formData.tipoProductorREP || ""}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 focus:bg-white sm:text-sm bg-gray-50 text-gray-900 ${
            errors.tipoProductorREP ? "border-red-300" : "border-gray-300"
          }`}
        >
          <option value="">Seleccione el tipo de Productor REP</option>
          <option value="Fabricante">Fabricante</option>
          <option value="Importador">Importador</option>
          <option value="Envasador/Envasador por Cuenta de Terceros">
            Envasador/Envasador por Cuenta de Terceros
          </option>
          <option value="Comercializador Bajo Marca Propia">
            Comercializador Bajo Marca Propia
          </option>
        </select>
        {errors.tipoProductorREP && (
          <p className="mt-1 text-sm text-red-600">{errors.tipoProductorREP}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Seleccione el tipo de productor según la Ley REP
        </p>
      </div>

      {/* Tipos de Residuos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipos de Residuos que Aplican *{" "}
          <span className="text-gray-500 font-normal text-xs">(Seleccione al menos uno)</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {[
            "Neumáticos",
            "Baterías",
            "Aceites Lubricantes",
            "Aparatos Eléctricos y Electrónicos (AEE)",
            "Envases",
            "Embalajes",
          ].map((residuo) => (
            <label
              key={residuo}
              className="flex items-center space-x-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={(formData.tiposResiduos || []).includes(
                  residuo as EmpresaFormData["tiposResiduos"][number]
                )}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  handleCheckboxChange(residuo, (e as ReturnType<typeof JSON.parse>).target.checked)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-900">{residuo}</span>
            </label>
          ))}
        </div>
        {errors.tiposResiduos && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errors.tiposResiduos}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Seleccione todos los tipos de residuos que su empresa gestiona bajo la Ley REP
        </p>
      </div>

      {/* Botones */}
      <div className="flex justify-end">
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
