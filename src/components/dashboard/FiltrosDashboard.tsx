"use client";

import { Calendar, MapPin, Wrench, User } from "lucide-react";

interface Filtros {
  anio: number;
  periodo: string;
  region: string;
  tratamiento: string;
  gestor: string;
}

interface FiltrosDashboardProps {
  filtros: Filtros;
  onChange: (filtros: Partial<Filtros>) => void;
}

export function FiltrosDashboard({ filtros, onChange }: FiltrosDashboardProps) {
  const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const periodos = [
    { value: "anio", label: "Todo el año" },
    { value: "trimestre", label: "Último trimestre" },
    { value: "mes", label: "Último mes" },
  ];
  const regiones = [
    { value: "todas", label: "Todas las regiones" },
    { value: "metropolitana", label: "Región Metropolitana" },
    { value: "valparaiso", label: "Región de Valparaíso" },
    { value: "biobio", label: "Región del Bío-Bío" },
    { value: "arica", label: "Región de Arica y Parinacota" },
    { value: "tarapaca", label: "Región de Tarapacá" },
    { value: "antofagasta", label: "Región de Antofagasta" },
    { value: "atacama", label: "Región de Atacama" },
    { value: "coquimbo", label: "Región de Coquimbo" },
    { value: "ohiggins", label: "Región del Libertador General Bernardo O'Higgins" },
    { value: "maule", label: "Región del Maule" },
    { value: "nuble", label: "Región de Ñuble" },
    { value: "araucania", label: "Región de La Araucanía" },
    { value: "rios", label: "Región de Los Ríos" },
    { value: "lagos", label: "Región de Los Lagos" },
    { value: "aisen", label: "Región de Aysén del General Carlos Ibáñez del Campo" },
    { value: "magallanes", label: "Región de Magallanes y de la Antártica Chilena" },
  ];
  const tratamientos = [
    { value: "todos", label: "Todos los tratamientos" },
    { value: "reciclaje", label: "Reciclaje" },
    { value: "recauchaje", label: "Recauchaje" },
    { value: "coprocesamiento", label: "Co-procesamiento" },
    { value: "valorizacion_energetica", label: "Valorización Energética" },
  ];
  const gestores = [
    { value: "todos", label: "Todos los gestores" },
    { value: "gestor1", label: "EcoNeum S.A." },
    { value: "gestor2", label: "Gestión NFU SpA" },
    { value: "gestor3", label: "ReciclaChile Ltda." },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            Año
          </label>
          <select
            value={filtros.anio}
            onChange={(e: ReturnType<typeof JSON.parse>) => {
              const anio = parseInt((e as ReturnType<typeof JSON.parse>).target.value, 10);
              if (!isNaN(anio)) {
                onChange({ anio });
              }
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {anios.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>
        </div>

        {/* Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <select
            value={filtros.periodo}
            onChange={(e: ReturnType<typeof JSON.parse>) =>
              onChange({ periodo: (e as ReturnType<typeof JSON.parse>).target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {periodos.map((periodo: ReturnType<typeof JSON.parse>) => (
              <option key={periodo.value} value={periodo.value}>
                {periodo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Región */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline h-4 w-4 mr-1" />
            Región
          </label>
          <select
            value={filtros.region}
            onChange={(e: ReturnType<typeof JSON.parse>) =>
              onChange({ region: (e as ReturnType<typeof JSON.parse>).target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {regiones.map((region: ReturnType<typeof JSON.parse>) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tratamiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Wrench className="inline h-4 w-4 mr-1" />
            Tratamiento
          </label>
          <select
            value={filtros.tratamiento}
            onChange={(e: ReturnType<typeof JSON.parse>) =>
              onChange({ tratamiento: (e as ReturnType<typeof JSON.parse>).target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {tratamientos.map((tratamiento: ReturnType<typeof JSON.parse>) => (
              <option key={tratamiento.value} value={tratamiento.value}>
                {tratamiento.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gestor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline h-4 w-4 mr-1" />
            Gestor
          </label>
          <select
            value={filtros.gestor}
            onChange={(e: ReturnType<typeof JSON.parse>) =>
              onChange({ gestor: (e as ReturnType<typeof JSON.parse>).target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {gestores.map((gestor) => (
              <option key={gestor.value} value={gestor.value}>
                {gestor.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
