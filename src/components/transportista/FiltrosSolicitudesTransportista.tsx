"use client";

import { useState } from "react";
import { Filter, MapPin, Weight, Calendar, X } from "lucide-react";

interface FiltrosTransportistaProps {
  onFiltrosChange: (filtros: {
    region?: string;
    comuna?: string;
    pesoMin?: number;
    pesoMax?: number;
    orderBy?: "fecha" | "peso";
  }) => void;
  regiones: Array<{ codigo: string; nombre: string }>;
}

export default function FiltrosSolicitudesTransportista({
  onFiltrosChange,
  regiones,
}: FiltrosTransportistaProps) {
  const [region, setRegion] = useState("");
  const [pesoMin, setPesoMin] = useState("");
  const [pesoMax, setPesoMax] = useState("");
  const [orderBy, setOrderBy] = useState<"fecha" | "peso">("fecha");

  const handleAplicar = () => {
    onFiltrosChange({
      region: region || undefined,
      pesoMin: pesoMin ? parseFloat(pesoMin) : undefined,
      pesoMax: pesoMax ? parseFloat(pesoMax) : undefined,
      orderBy,
    });
  };

  const handleLimpiar = () => {
    setRegion("");
    setPesoMin("");
    setPesoMax("");
    setOrderBy("fecha");
    onFiltrosChange({});
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-[#f6fcf3] border-2 border-[#459e60]/20 rounded-xl shadow-sm mb-6">
      {/* Decoración */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#459e60]/10 to-transparent rounded-full -mr-16 -mt-16"></div>

      {/* Header */}
      <div className="relative p-4 pb-3 border-b border-[#459e60]/10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#459e60] rounded-lg">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-[#2b3b4c]">Filtros de Búsqueda</h3>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Región */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2b3b4c] mb-2">
              <MapPin className="h-4 w-4 text-[#459e60]" />
              Región
            </label>
            <select
              value={region}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setRegion((e as ReturnType<typeof JSON.parse>).target.value)
              }
              className="w-full px-3 py-2.5 border-2 border-[#459e60]/20 rounded-lg focus:border-[#459e60] focus:ring-2 focus:ring-[#459e60]/20 outline-none transition-all bg-white text-[#2b3b4c]"
            >
              <option value="">Todas</option>
              {regiones.map((r: ReturnType<typeof JSON.parse>) => (
                <option key={r.codigo} value={r.nombre}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Peso Min */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2b3b4c] mb-2">
              <Weight className="h-4 w-4 text-[#459e60]" />
              Peso Mínimo
            </label>
            <input
              type="number"
              value={pesoMin}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setPesoMin((e as ReturnType<typeof JSON.parse>).target.value)
              }
              placeholder="0"
              className="w-full px-3 py-2.5 border-2 border-[#459e60]/20 rounded-lg focus:border-[#459e60] focus:ring-2 focus:ring-[#459e60]/20 outline-none transition-all bg-white text-[#2b3b4c]"
            />
          </div>

          {/* Peso Max */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2b3b4c] mb-2">
              <Weight className="h-4 w-4 text-[#459e60]" />
              Peso Máximo
            </label>
            <input
              type="number"
              value={pesoMax}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setPesoMax((e as ReturnType<typeof JSON.parse>).target.value)
              }
              placeholder="Sin límite"
              className="w-full px-3 py-2.5 border-2 border-[#459e60]/20 rounded-lg focus:border-[#459e60] focus:ring-2 focus:ring-[#459e60]/20 outline-none transition-all bg-white text-[#2b3b4c]"
            />
          </div>

          {/* Ordenar */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2b3b4c] mb-2">
              <Calendar className="h-4 w-4 text-[#459e60]" />
              Ordenar por
            </label>
            <select
              value={orderBy}
              onChange={(e: ReturnType<typeof JSON.parse>) =>
                setOrderBy((e as ReturnType<typeof JSON.parse>).target.value as "fecha" | "peso")
              }
              className="w-full px-3 py-2.5 border-2 border-[#459e60]/20 rounded-lg focus:border-[#459e60] focus:ring-2 focus:ring-[#459e60]/20 outline-none transition-all bg-white text-[#2b3b4c]"
            >
              <option value="fecha">Fecha preferida</option>
              <option value="peso">Peso</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAplicar}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
          >
            <Filter className="h-4 w-4" />
            Aplicar Filtros
          </button>
          <button
            onClick={handleLimpiar}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-[#2b3b4c]/20 text-[#2b3b4c] font-semibold rounded-lg hover:bg-[#2b3b4c]/5 hover:border-[#2b3b4c]/40 transition-all"
          >
            <X className="h-4 w-4" />
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
