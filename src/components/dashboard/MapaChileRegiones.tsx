"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Filtros {
  anio: number;
  periodo: string;
  region: string;
  tratamiento: string;
  gestor: string;
}

interface MapaChileRegionesProps {
  filtros: Filtros;
  enabled?: boolean;
}

// Datos de las regiones de Chile con posiciones corregidas para el SVG oficial (alineadas a la derecha)
const REGIONES_CHILE = [
  { id: "arica", codigo: "15", nombre: "Arica y Parinacota", position: { x: 75, y: 6 } },
  { id: "tarapaca", codigo: "1", nombre: "Tarapacá", position: { x: 76, y: 11 } },
  { id: "antofagasta", codigo: "2", nombre: "Antofagasta", position: { x: 78, y: 19 } },
  { id: "atacama", codigo: "3", nombre: "Atacama", position: { x: 75, y: 29 } },
  { id: "coquimbo", codigo: "4", nombre: "Coquimbo", position: { x: 73, y: 36 } },
  { id: "valparaiso", codigo: "5", nombre: "Valparaíso", position: { x: 71, y: 42 } },
  {
    id: "metropolitana",
    codigo: "13",
    nombre: "Metropolitana de Santiago",
    position: { x: 73, y: 44 },
  },
  {
    id: "ohiggins",
    codigo: "6",
    nombre: "Libertador General Bernardo O'Higgins",
    position: { x: 71, y: 47 },
  },
  { id: "maule", codigo: "7", nombre: "Maule", position: { x: 70, y: 51 } },
  { id: "nuble", codigo: "16", nombre: "Ñuble", position: { x: 69, y: 55 } },
  { id: "biobio", codigo: "8", nombre: "Bío-Bío", position: { x: 68, y: 58 } },
  { id: "araucania", codigo: "9", nombre: "La Araucanía", position: { x: 68, y: 62 } },
  { id: "rios", codigo: "14", nombre: "Los Ríos", position: { x: 67, y: 66 } },
  { id: "lagos", codigo: "10", nombre: "Los Lagos", position: { x: 66, y: 71 } },
  {
    id: "aisen",
    codigo: "11",
    nombre: "Aysén del General Carlos Ibáñez del Campo",
    position: { x: 65, y: 79 },
  },
  {
    id: "magallanes",
    codigo: "12",
    nombre: "Magallanes y de la Antártica Chilena",
    position: { x: 67, y: 91 },
  },
];

// Mapeo de códigos numéricos a IDs del mapa
const _MAPEO_CODIGOS: { [key: string]: string } = {
  "1": "tarapaca",
  "2": "antofagasta",
  "3": "atacama",
  "4": "coquimbo",
  "5": "valparaiso",
  "6": "ohiggins",
  "7": "maule",
  "8": "biobio",
  "9": "araucania",
  "10": "lagos",
  "11": "aisen",
  "12": "magallanes",
  "13": "metropolitana",
  "14": "rios",
  "15": "arica",
  "16": "nuble",
};

export function MapaChileRegiones({ filtros, enabled = true }: MapaChileRegionesProps) {
  const { status } = useSession();
  const [data, setData] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [_hoveredRegion, _setHoveredRegion] = useState<string | null>(null);

  useEffect(() => {
    // Solo hacer llamadas si el usuario está autenticado y el componente está habilitado
    if (status !== "authenticated" || !enabled) {
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          anio: filtros.anio.toString(),
          periodo: filtros.periodo,
          region: filtros.region,
          tratamiento: filtros.tratamiento,
          gestor: filtros.gestor,
        });

        const response = await fetch(`/api/dashboard/mapa-regiones?${params}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `Error ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();
        setData(result.regiones || []);
        setError(null);
      } catch (err: unknown) {
        console.error("Error cargando mapa:", err);
        const errorMessage =
          err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : "Error al cargar datos del mapa";
        setError(errorMessage);
        // Usar datos de ejemplo consistentes
        setData([]); // Dejar vacío para que use los datos de ejemplo del render
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [filtros, enabled, status]);

  const _getRegionData = (regionId: string) => {
    // Buscar por ID del mapa
    const regionMapa = REGIONES_CHILE.find((r: ReturnType<typeof JSON.parse>) => r.id === regionId);
    if (!regionMapa) return null;

    // Buscar en los datos del API por código numérico
    const regionData = data.find(
      (region: ReturnType<typeof JSON.parse>) => region.codigo === regionMapa.codigo
    );
    return regionData || null;
  };

  const _getRegionDataByCodigo = (codigo: string) => {
    return data.find((region: ReturnType<typeof JSON.parse>) => region.codigo === codigo);
  };

  const _getColorByIntensity = (intensity: number) => {
    if (intensity >= 80) return "#1F2937"; // Muy alto - Gris oscuro
    if (intensity >= 60) return "#374151"; // Alto - Gris
    if (intensity >= 40) return "#6B7280"; // Medio - Gris claro
    if (intensity >= 20) return "#9CA3AF"; // Bajo - Gris muy claro
    return "#D1D5DB"; // Muy bajo - Gris casi blanco
  };

  const handleRegionClick = (regionId: string) => {
    // Aquí se podría implementar navegación a detalles de la región
    setSelectedRegion(selectedRegion === regionId ? null : regionId);
  };

  if (!enabled) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <p className="text-sm">Verificando permisos de acceso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Forzar uso de datos de ejemplo para debugging
  const datosParaMostrar = [
    { codigo: "15", nombre: "Arica y Parinacota", toneladas: 18, intensidad: 12 },
    { codigo: "1", nombre: "Tarapacá", toneladas: 15, intensidad: 10 },
    { codigo: "2", nombre: "Antofagasta", toneladas: 30, intensidad: 25 },
    { codigo: "3", nombre: "Atacama", toneladas: 12, intensidad: 8 },
    { codigo: "4", nombre: "Coquimbo", toneladas: 20, intensidad: 15 },
    { codigo: "5", nombre: "Valparaíso", toneladas: 120, intensidad: 75 },
    { codigo: "13", nombre: "Metropolitana de Santiago", toneladas: 250, intensidad: 100 },
    { codigo: "6", nombre: "Libertador General Bernardo O'Higgins", toneladas: 10, intensidad: 6 },
    { codigo: "7", nombre: "Maule", toneladas: 45, intensidad: 40 },
    { codigo: "16", nombre: "Ñuble", toneladas: 8, intensidad: 5 },
    { codigo: "8", nombre: "Bío-Bío", toneladas: 85, intensidad: 60 },
    { codigo: "9", nombre: "La Araucanía", toneladas: 6, intensidad: 4 },
    { codigo: "14", nombre: "Los Ríos", toneladas: 4, intensidad: 2 },
    { codigo: "10", nombre: "Los Lagos", toneladas: 3, intensidad: 2 },
    {
      codigo: "11",
      nombre: "Aysén del General Carlos Ibáñez del Campo",
      toneladas: 2,
      intensidad: 1,
    },
    { codigo: "12", nombre: "Magallanes y de la Antártica Chilena", toneladas: 1, intensidad: 1 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recolección por Región - Ranking</h3>
        {data.length === 0 && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            Datos de ejemplo
          </span>
        )}
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
        {datosParaMostrar
          .sort(
            (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) =>
              b.intensidad - a.intensidad
          )
          .map((region: ReturnType<typeof JSON.parse>, index) => (
            <div
              key={region.codigo}
              className="group p-4 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer"
              onClick={() => handleRegionClick(region.codigo)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                      index < 3
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 ring-2 ring-emerald-100"
                        : "bg-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{region.nombre}</h4>
                    <span className="text-xs text-gray-500">Región {region.codigo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-700 text-lg">
                    {region.toneladas.toLocaleString("es-CL")}{" "}
                    <span className="text-xs font-normal text-gray-500">ton</span>
                  </p>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-emerald-600">
                      {region.intensidad}% Intensidad
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100">
                  <div
                    style={{ width: `${region.intensidad}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      region.intensidad > 75
                        ? "bg-emerald-600"
                        : region.intensidad > 50
                          ? "bg-emerald-500"
                          : region.intensidad > 25
                            ? "bg-emerald-400"
                            : "bg-emerald-300"
                    }`}
                  ></div>
                </div>
              </div>

              {selectedRegion === region.codigo && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="text-gray-500 text-xs">Tendencia</p>
                    <p className="font-semibold text-emerald-600 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      +12%
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded border border-gray-100">
                    <p className="text-gray-500 text-xs">Puntos Activos</p>
                    <p className="font-semibold text-gray-700">8 Plantas</p>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <p className="flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            El ranking muestra las regiones ordenadas por intensidad de recolección. Haz clic en una
            tarjeta para ver detalles adicionales.
          </span>
        </p>
      </div>
    </div>
  );
}
