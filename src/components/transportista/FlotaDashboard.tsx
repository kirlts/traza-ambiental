"use client";

import { useState, useEffect } from "react";

interface FlotaDashboardProps {
  _onRefetch?: () => void;
}

export default function FlotaDashboard({ _onRefetch }: FlotaDashboardProps = {}) {
  const [vehiculos, setVehiculos] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarFlota();
  }, []);

  const cargarFlota = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transportista/vehiculos");
      if (response.ok) {
        const { vehiculos: vehiculosData } = await response.json();

        // Cargar capacidad de cada vehículo
        const vehiculosConCapacidad = await Promise.all(
          vehiculosData.map(async (vehiculo: ReturnType<typeof JSON.parse>) => {
            if (vehiculo.estado === "activo") {
              try {
                const capResponse = await fetch(
                  `/api/transportista/vehiculos/${vehiculo.id}/capacidad`
                );
                if (capResponse.ok) {
                  const capData = await capResponse.json();
                  return {
                    ...vehiculo,
                    capacidadUsada: capData.capacidadUsada,
                    capacidadDisponible: capData.capacidadDisponible,
                    solicitudesActivas: capData.solicitudesActivas,
                  };
                }
              } catch (error: unknown) {
                console.error(`Error al obtener capacidad del vehículo ${vehiculo.id}:`, error);
              }
            }
            return vehiculo;
          })
        );

        setVehiculos(vehiculosConCapacidad);
      }
    } catch (error: unknown) {
      console.error("Error al cargar flota:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getEstadoBadge = (vehiculo: ReturnType<typeof JSON.parse>) => {
    switch (vehiculo.estado) {
      case "activo":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activo</span>
        );
      case "mantenimiento":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Mantenimiento
          </span>
        );
      case "inactivo":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactivo</span>
        );
      default:
        return null;
    }
  };

  const getColorPorcentaje = (porcentaje: number) => {
    if (porcentaje < 50) return "bg-green-500";
    if (porcentaje < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">🚛 Gestión de Flota</h3>
        <button
          onClick={cargarFlota}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          🔄 Actualizar
        </button>
      </div>

      {vehiculos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No hay vehículos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehiculos.map((vehiculo: ReturnType<typeof JSON.parse>) => {
            const porcentaje =
              vehiculo.capacidadDisponible !== undefined && vehiculo.capacidadKg > 0
                ? ((vehiculo.capacidadKg - vehiculo.capacidadDisponible) / vehiculo.capacidadKg) *
                  100
                : 0;

            return (
              <div
                key={vehiculo.id}
                className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${
                  vehiculo.estado === "activo"
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{vehiculo.tipo}</h4>
                    <p className="text-sm text-gray-600">{vehiculo.patente}</p>
                  </div>
                  {getEstadoBadge(vehiculo)}
                </div>

                {/* Capacidad */}
                {vehiculo.estado === "activo" && vehiculo.capacidadDisponible !== undefined && (
                  <>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span className="font-medium">
                          {vehiculo.capacidadUsada || 0} kg usados
                        </span>
                        <span className="font-medium text-blue-600">
                          {vehiculo.capacidadDisponible} kg libres
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`${getColorPorcentaje(porcentaje)} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(porcentaje, 100)}%` }}
                        ></div>
                      </div>

                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>{porcentaje.toFixed(1)}% ocupado</span>
                        <span>{vehiculo.capacidadKg} kg total</span>
                      </div>
                    </div>

                    {/* Solicitudes activas */}
                    {vehiculo.solicitudesActivas !== undefined &&
                      vehiculo.solicitudesActivas > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">📦</span>
                            <span className="font-medium">
                              {vehiculo.solicitudesActivas} solicitud
                              {vehiculo.solicitudesActivas !== 1 ? "es" : ""} activa
                              {vehiculo.solicitudesActivas !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      )}
                  </>
                )}

                {/* Mensaje para vehículos inactivos */}
                {vehiculo.estado !== "activo" && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    Vehículo fuera de servicio
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
