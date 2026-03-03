"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSolicitudMultiStep } from "@/hooks/useSolicitudMultiStep";
import { useRegionesYComunas } from "@/hooks/useRegionesyComunas";
import { CargadorFotos } from "@/components/solicitud/CargadorFotos";
import { paso1Schema, paso2Schema, paso3Schema } from "@/lib/validations/solicitud-retiro";

import { SolicitudCompletaData } from "@/lib/validations/solicitud-retiro";

interface FormularioSolicitudProps {
  initialData?: Partial<SolicitudCompletaData>;
  onSubmit?: (data: ReturnType<typeof JSON.parse>) => Promise<void>;
  isEditing?: boolean;
}

export function FormularioSolicitud({
  initialData,
  onSubmit,
  isEditing = false,
}: FormularioSolicitudProps) {
  const router = useRouter();

  const {
    pasoActual,
    formData,
    isSubmitting: isHookSubmitting,
    error,
    siguientePaso,
    pasoAnterior,
    actualizarDatos,
    guardarBorrador,
    enviarSolicitud,
    esPrimerPaso,
    esUltimoPaso,
    progresoPercentaje,
  } = useSolicitudMultiStep(initialData);

  const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);
  const isSubmitting = isHookSubmitting || isLocalSubmitting;

  const { regiones, comunas, cargarComunas, regionesLoading } = useRegionesYComunas();

  // Estado para campos "tocados" (blur)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Errores de validación
  const [erroresPaso, setErroresPaso] = useState<Record<string, string>>({});

  // Cargar comunas si hay una región inicial
  useEffect(() => {
    if (initialData?.region) {
      cargarComunas(initialData.region);
    }
  }, [initialData?.region, cargarComunas]);

  // Marcar campo como tocado
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validar datos en tiempo real
  const validarDatos = useCallback(() => {
    let schema;
    switch (pasoActual) {
      case 1:
        schema = paso1Schema;
        break;
      case 2:
        schema = paso2Schema;
        break;
      case 3:
        schema = paso3Schema;
        break;
      default:
        return {};
    }

    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString();
        if (fieldName) {
          newErrors[fieldName] = issue.message;
        }
      });
      setErroresPaso(newErrors);
      return newErrors;
    } else {
      setErroresPaso({});
      return {};
    }
  }, [formData, pasoActual]);

  // Ejecutar validación cuando cambian los datos
  useEffect(() => {
    validarDatos();
  }, [validarDatos]);

  const validarYProceder = () => {
    // Marcar todos los campos del paso actual como tocados
    const camposPaso: string[] = [];
    if (pasoActual === 1)
      camposPaso.push("direccionRetiro", "region", "comuna", "fechaPreferida", "horarioPreferido");
    if (pasoActual === 2)
      camposPaso.push(
        "categoriaA_cantidad",
        "categoriaA_pesoEst",
        "categoriaB_cantidad",
        "categoriaB_pesoEst"
      );
    if (pasoActual === 3) camposPaso.push("nombreContacto", "telefonoContacto", "instrucciones");

    const newTouched = { ...touched };
    camposPaso.forEach((campo) => {
      newTouched[campo] = true;
    });
    setTouched(newTouched);

    const errores = validarDatos();
    return Object.keys(errores).length === 0;
  };

  const handleSiguiente = () => {
    if (validarYProceder()) {
      siguientePaso();
      setTouched({}); // Resetear touched para el siguiente paso
    }
  };

  const handleEnviar = async () => {
    if (validarYProceder()) {
      if (onSubmit) {
        setIsLocalSubmitting(true);
        try {
          await onSubmit(formData as SolicitudCompletaData);
        } catch (error: unknown) {
          console.error(error);
        } finally {
          setIsLocalSubmitting(false);
        }
      } else {
        await enviarSolicitud();
      }
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 transition-all duration-200 shadow-sm";
  const labelClasses = "block text-sm font-semibold text-gray-900 mb-3";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Indicador de progreso */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                Progreso del formulario
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Paso actual: {pasoActual} de 3
              </h3>
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full">
              {progresoPercentaje.toFixed(0)}% completado
            </span>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-4">
              {[1, 2, 3].map((paso) => (
                <div key={paso} className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      paso < pasoActual
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                        : paso === pasoActual
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-lg"
                          : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    {paso < pasoActual ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      paso
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        paso < pasoActual
                          ? "text-emerald-700"
                          : paso === pasoActual
                            ? "text-emerald-900"
                            : "text-slate-500"
                      }`}
                    >
                      {paso === 1 && "Información del Retiro"}
                      {paso === 2 && "Detalles de NFU"}
                      {paso === 3 && "Contacto y Fotos"}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        paso < pasoActual
                          ? "text-emerald-600"
                          : paso === pasoActual
                            ? "text-emerald-500"
                            : "text-slate-400"
                      }`}
                    >
                      {paso === 1 && "Dirección, fecha y horario"}
                      {paso === 2 && "Categorías y cantidades"}
                      {paso === 3 && "Datos de contacto y evidencias"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-56 bg-emerald-50/60 rounded-2xl border border-emerald-100 p-5 space-y-4">
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
                Recomendaciones
              </p>
              <ul className="space-y-3 text-sm text-emerald-900">
                <li>• Prepare fotos claras de los NFU y el punto de retiro.</li>
                <li>• Verifique que la dirección tenga acceso para el transportista.</li>
                <li>• Mantenga actualizados los datos de contacto.</li>
              </ul>
            </div>
          </div>

          <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progresoPercentaje}%` }}
            />
          </div>
        </div>

        {/* Tarjeta lateral */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl text-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide font-semibold text-white/80">
                Recordatorio
              </p>
              <h4 className="text-lg font-bold">Documentos obligatorios</h4>
            </div>
          </div>
          <p className="text-sm text-white/90 leading-relaxed">
            Asegúrate de tener tus antecedentes de generador al día y contar con fotografías
            actualizadas del estado de los neumáticos. Esto agiliza la validación por parte del
            transportista.
          </p>
          <button
            onClick={() => router.push("/dashboard/generador/inventario")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            Revisar inventario digital
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenedor del formulario */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 border border-slate-200">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Paso 1: Información del Retiro */}
        {pasoActual === 1 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Información del Retiro</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Proporcione los detalles de ubicación y fecha para el retiro
                </p>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Dirección de Retiro *</label>
              <input
                type="text"
                value={formData.direccionRetiro || ""}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  actualizarDatos({
                    direccionRetiro: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                onBlur={() => handleBlur("direccionRetiro")}
                className={`${inputClasses} ${touched.direccionRetiro && erroresPaso.direccionRetiro ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                placeholder="Ej: Av. Providencia 123, Oficina 45"
              />
              {touched.direccionRetiro && erroresPaso.direccionRetiro && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {erroresPaso.direccionRetiro}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Región *</label>
                <select
                  value={formData.region || ""}
                  onChange={(e: ReturnType<typeof JSON.parse>) => {
                    actualizarDatos({
                      region: (e as ReturnType<typeof JSON.parse>).target.value,
                      comuna: "",
                    });
                    cargarComunas((e as ReturnType<typeof JSON.parse>).target.value);
                  }}
                  onBlur={() => handleBlur("region")}
                  className={`${inputClasses} ${touched.region && erroresPaso.region ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                  disabled={regionesLoading}
                >
                  <option value="">Seleccione una región</option>
                  {regiones.map((region: ReturnType<typeof JSON.parse>) => (
                    <option key={region.id} value={region.id}>
                      {region.nombre}
                    </option>
                  ))}
                </select>
                {touched.region && erroresPaso.region && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {erroresPaso.region}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClasses}>Comuna *</label>
                <select
                  value={formData.comuna || ""}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    actualizarDatos({ comuna: (e as ReturnType<typeof JSON.parse>).target.value })
                  }
                  onBlur={() => handleBlur("comuna")}
                  className={`${inputClasses} ${touched.comuna && erroresPaso.comuna ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                  disabled={!formData.region || comunas.length === 0}
                >
                  <option value="">Seleccione una comuna</option>
                  {comunas.map((comuna) => (
                    <option key={comuna.id} value={comuna.nombre}>
                      {comuna.nombre}
                    </option>
                  ))}
                </select>
                {touched.comuna && erroresPaso.comuna && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {erroresPaso.comuna}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Fecha Preferida *</label>
                <input
                  type="date"
                  value={
                    formData.fechaPreferida
                      ? typeof formData.fechaPreferida === "string"
                        ? formData.fechaPreferida.split("T")[0]
                        : formData.fechaPreferida
                      : ""
                  }
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    actualizarDatos({
                      fechaPreferida: (e as ReturnType<typeof JSON.parse>).target.value,
                    })
                  }
                  onBlur={() => handleBlur("fechaPreferida")}
                  min={new Date().toISOString().split("T")[0]}
                  className={`${inputClasses} ${touched.fechaPreferida && erroresPaso.fechaPreferida ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                />
                {touched.fechaPreferida && erroresPaso.fechaPreferida && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {erroresPaso.fechaPreferida}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClasses}>Horario Preferido *</label>
                <select
                  value={formData.horarioPreferido || ""}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    actualizarDatos({
                      horarioPreferido: (e as ReturnType<typeof JSON.parse>).target.value as
                        | "manana"
                        | "tarde",
                    })
                  }
                  onBlur={() => handleBlur("horarioPreferido")}
                  className={`${inputClasses} ${touched.horarioPreferido && erroresPaso.horarioPreferido ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                >
                  <option value="">Seleccione horario</option>
                  <option value="manana">Mañana (8:00 - 12:00)</option>
                  <option value="tarde">Tarde (14:00 - 18:00)</option>
                </select>
                {touched.horarioPreferido && erroresPaso.horarioPreferido && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {erroresPaso.horarioPreferido}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Detalles de NFU */}
        {pasoActual === 2 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Detalles de los Neumáticos</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Especifique las cantidades y pesos de los neumáticos por categoría
                </p>
              </div>
            </div>

            {/* Error de categorías (cross-field validation) */}
            {erroresPaso.categoriaA_cantidad && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">
                    {erroresPaso.categoriaA_cantidad}
                  </p>
                </div>
              </div>
            )}

            {erroresPaso.categoriaA_pesoEst && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">
                    {erroresPaso.categoriaA_pesoEst}
                  </p>
                </div>
              </div>
            )}

            {/* Categoría A */}
            <div className="border border-emerald-200 rounded-2xl p-6 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">
                    Categoría A - Vehículos Livianos
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Neumáticos de automóviles, camionetas y vehículos livianos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Cantidad (unidades)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.categoriaA_cantidad || ""}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      actualizarDatos({
                        categoriaA_cantidad:
                          parseInt((e as ReturnType<typeof JSON.parse>).target.value) || 0,
                      })
                    }
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Peso Estimado (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.categoriaA_pesoEst || ""}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      actualizarDatos({
                        categoriaA_pesoEst:
                          parseFloat((e as ReturnType<typeof JSON.parse>).target.value) || 0,
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Categoría B */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-br from-slate-50/50 to-white shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Categoría B - Vehículos Pesados
                  </h3>
                  <p className="text-sm text-slate-700">
                    Neumáticos de camiones, buses y maquinaria pesada
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClasses}>Cantidad (unidades)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.categoriaB_cantidad || ""}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      actualizarDatos({
                        categoriaB_cantidad:
                          parseInt((e as ReturnType<typeof JSON.parse>).target.value) || 0,
                      })
                    }
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Peso Estimado (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.categoriaB_pesoEst || ""}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      actualizarDatos({
                        categoriaB_pesoEst:
                          parseFloat((e as ReturnType<typeof JSON.parse>).target.value) || 0,
                      })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Totales */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Resumen de Solicitud</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-700 mb-2">Cantidad Total</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {(formData.categoriaA_cantidad || 0) + (formData.categoriaB_cantidad || 0)}
                    <span className="text-lg font-normal text-emerald-600 ml-1">unidades</span>
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-700 mb-2">Peso Total Estimado</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {(formData.categoriaA_pesoEst || 0) + (formData.categoriaB_pesoEst || 0)}
                    <span className="text-lg font-normal text-emerald-600 ml-1">kg</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Contacto e Instrucciones */}
        {pasoActual === 3 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Contacto e Instrucciones</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Proporcione información de contacto y detalles adicionales para el retiro
                </p>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Nombre del Contacto en Sitio *</label>
              <input
                type="text"
                value={formData.nombreContacto || ""}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  actualizarDatos({
                    nombreContacto: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                onBlur={() => handleBlur("nombreContacto")}
                className={`${inputClasses} ${touched.nombreContacto && erroresPaso.nombreContacto ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                placeholder="Juan Pérez"
              />
              {touched.nombreContacto && erroresPaso.nombreContacto && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {erroresPaso.nombreContacto}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Teléfono de Contacto *</label>
              <input
                type="tel"
                value={formData.telefonoContacto || ""}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  actualizarDatos({
                    telefonoContacto: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                onBlur={() => handleBlur("telefonoContacto")}
                className={`${inputClasses} ${touched.telefonoContacto && erroresPaso.telefonoContacto ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                placeholder="+56912345678"
              />
              {touched.telefonoContacto && erroresPaso.telefonoContacto && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {erroresPaso.telefonoContacto}
                </p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Instrucciones Adicionales</label>
              <textarea
                value={formData.instrucciones || ""}
                onChange={(e: ReturnType<typeof JSON.parse>) =>
                  actualizarDatos({
                    instrucciones: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
                onBlur={() => handleBlur("instrucciones")}
                rows={4}
                maxLength={500}
                className={`${inputClasses} resize-none ${touched.instrucciones && erroresPaso.instrucciones ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                placeholder="Ej: Acceso por portón trasero, solicitar a portería..."
              />
              {touched.instrucciones && erroresPaso.instrucciones && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {erroresPaso.instrucciones}
                </p>
              )}
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {(formData.instrucciones || "").length}/500 caracteres
              </p>
            </div>

            {/* Carga de fotos */}
            <div>
              <label className={labelClasses}>Fotos de los NFU (opcional)</label>
              <p className="text-xs text-[var(--muted-foreground)] mb-2">
                Puedes adjuntar hasta 5 fotos (máx. 5MB cada una)
              </p>
              <CargadorFotos
                fotos={formData.fotos || []}
                onChange={(fotos) => actualizarDatos({ fotos })}
                maxFotos={5}
                maxSize={5 * 1024 * 1024}
              />
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="mt-10 flex justify-between items-center pt-8 border-t border-slate-200">
          <div>
            {!esPrimerPaso && (
              <button
                type="button"
                onClick={pasoAnterior}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Anterior
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {!isEditing && (
              <button
                type="button"
                onClick={guardarBorrador}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {isSubmitting ? "Guardando..." : "Guardar Borrador"}
              </button>
            )}

            {!esUltimoPaso ? (
              <button
                type="button"
                onClick={handleSiguiente}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    Siguiente
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEnviar}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-lg transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {isEditing ? "Guardando..." : "Enviando..."}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {isEditing ? "Guardar Cambios" : "Enviar Solicitud"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
