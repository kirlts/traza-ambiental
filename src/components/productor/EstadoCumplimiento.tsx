interface EstadoCumplimientoProps {
  porcentaje: number;
  titulo: string;
  meta: number;
  avance: number;
  unidad?: string;
}

export default function EstadoCumplimiento({
  porcentaje,
  titulo,
  meta,
  avance,
  unidad = "ton",
}: EstadoCumplimientoProps) {
  const getColorPorcentaje = (p: number) => {
    if (p >= 100) return "bg-green-500";
    if (p >= 75) return "bg-blue-500";
    if (p >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextoEstado = (p: number) => {
    if (p >= 100) return { texto: "Cumplida", color: "text-green-700 bg-green-50" };
    if (p >= 75) return { texto: "En buen avance", color: "text-blue-700 bg-blue-50" };
    if (p >= 50) return { texto: "En progreso", color: "text-yellow-700 bg-yellow-50" };
    return { texto: "En riesgo", color: "text-red-700 bg-red-50" };
  };

  const estado = getTextoEstado(porcentaje);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{titulo}</h3>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${estado.color}`}
        >
          {estado.texto}
        </span>
      </div>

      <div className="space-y-3">
        {/* Barra de progreso */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Avance</span>
            <span className="font-semibold">{porcentaje.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getColorPorcentaje(porcentaje)}`}
              style={{ width: `${Math.min(porcentaje, 100)}%` }}
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Meta</p>
            <p className="text-lg font-semibold text-gray-900">
              {meta.toLocaleString("es-CL")}{" "}
              <span className="text-sm font-normal text-gray-600">{unidad}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avance</p>
            <p className="text-lg font-semibold text-gray-900">
              {avance.toLocaleString("es-CL")}{" "}
              <span className="text-sm font-normal text-gray-600">{unidad}</span>
            </p>
          </div>
        </div>

        {/* Restante */}
        <div className="pt-2">
          <p className="text-xs text-gray-500 mb-1">Restante para cumplir</p>
          <p className="text-base font-medium text-gray-900">
            {Math.max(0, meta - avance).toLocaleString("es-CL")}{" "}
            <span className="text-sm font-normal text-gray-600">{unidad}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
