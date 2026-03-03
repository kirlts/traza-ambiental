"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ComparacionAnualProps {
  anioActual: number;
}

interface ComparacionItem {
  anio: number;
  toneladas: number;
  metaValorizacion: number;
  porcentajeCumplimiento: number;
  variacion?: number;
  variacionPorcentaje?: number;
}

export function ComparacionAnual({ anioActual }: ComparacionAnualProps) {
  const { status } = useSession();
  const [comparacion, setComparacion] = useState<ComparacionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarComparacion = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reportes/anual/comparacion?anioActual=${anioActual}`);

      if (!response.ok) {
        throw new Error("Error al cargar comparación");
      }

      const data = await response.json();
      setComparacion(data.comparacion || []);
    } catch (err: unknown) {
      console.error("Error cargando comparación:", err);
    } finally {
      setLoading(false);
    }
  }, [anioActual]);

  useEffect(() => {
    if (status === "authenticated") {
      cargarComparacion();
    }
  }, [status, cargarComparacion]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando comparación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (comparacion.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparación con Años Anteriores</h2>

      <div className="space-y-4">
        {comparacion.map((item, index) => {
          const esActual = index === 0;
          const tieneVariacion = index > 0 && item.variacion !== undefined;
          const esMejora = tieneVariacion && (item.variacion || 0) > 0;

          return (
            <div
              key={item.anio}
              className={`border rounded-lg p-4 ${
                esActual ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-md font-semibold text-gray-900">
                    {item.anio} {esActual && "(Actual)"}
                  </h3>
                  {tieneVariacion && (
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                        esMejora ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {esMejora ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {(item.variacion || 0) > 0 ? "+" : ""}
                      {(item.variacion || 0).toFixed(2)} ton (
                      {(item.variacionPorcentaje || 0) > 0 ? "+" : ""}
                      {(item.variacionPorcentaje || 0).toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Toneladas</p>
                  <p className="text-lg font-bold text-gray-900">{item.toneladas.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Meta</p>
                  <p className="text-lg font-bold text-gray-900">
                    {item.metaValorizacion.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Cumplimiento</p>
                  <p className="text-lg font-bold text-gray-900">
                    {item.porcentajeCumplimiento.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.porcentajeCumplimiento >= 100 ? "bg-green-600" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(100, item.porcentajeCumplimiento)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
