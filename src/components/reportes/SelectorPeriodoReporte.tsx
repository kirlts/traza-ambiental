"use client";

import { Calendar } from "lucide-react";

interface SelectorPeriodoReporteProps {
  anio: number;
  onAnioChange: (anio: number) => void;
  loading?: boolean;
}

export function SelectorPeriodoReporte({
  anio,
  onAnioChange,
  loading,
}: SelectorPeriodoReporteProps) {
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 5 }, (_, i) => anioActual - i);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline h-4 w-4 mr-1" />
          Año del Reporte
        </label>
        <select
          value={anio}
          onChange={(e: ReturnType<typeof JSON.parse>) => {
            const nuevoAnio = parseInt((e as ReturnType<typeof JSON.parse>).target.value, 10);
            if (!isNaN(nuevoAnio)) {
              onAnioChange(nuevoAnio);
            }
          }}
          disabled={loading}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {anios.map((anioOption) => (
            <option key={anioOption} value={anioOption}>
              {anioOption}
            </option>
          ))}
        </select>
      </div>

      {/* Información de validación */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              {anio > anioActual
                ? "⚠️ No se pueden generar reportes para años futuros"
                : anio === anioActual
                  ? "ℹ️ Puede generar reporte del año en curso. Los datos se actualizarán hasta la fecha actual."
                  : "✅ Este año puede ser reportado. Los datos están completos para todo el período."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
