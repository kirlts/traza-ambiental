"use client";

import { useCapacidadVehiculo } from "@/hooks/useCapacidadVehiculo";

export default function CapacidadTransportista() {
  const { capacidadTotal, capacidadUsada, capacidadDisponible, isLoading } = useCapacidadVehiculo();

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const porcentaje = capacidadTotal > 0 ? (capacidadUsada / capacidadTotal) * 100 : 0;

  const colorBarra =
    porcentaje < 50 ? "bg-green-500" : porcentaje < 80 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Capacidad de Carga</h3>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{capacidadUsada} kg usados</span>
          <span>{capacidadDisponible} kg disponibles</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`${colorBarra} h-4 rounded-full transition-all`}
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Capacidad total: <span className="font-medium">{capacidadTotal} kg</span>
      </p>
    </div>
  );
}
