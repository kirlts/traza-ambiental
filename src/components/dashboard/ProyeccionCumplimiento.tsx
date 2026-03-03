"use client";

import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface ProyeccionCumplimientoProps {
  proyeccion: {
    cumpliraAtiempo: boolean;
    fechaEstimada: string;
    toneladasMensualNecesarias: number;
    deficit: number;
  };
  comparacion: {
    periodoActual: { toneladas: number; porcentaje: number };
    periodoAnterior: { toneladas: number; porcentaje: number };
    variacion: number;
    mejora: boolean;
  };
}

export function ProyeccionCumplimiento({ proyeccion, comparacion }: ProyeccionCumplimientoProps) {
  const getProyeccionColor = () => {
    if (proyeccion.cumpliraAtiempo) {
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      };
    }
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    };
  };

  const getComparacionIcon = () => {
    if (comparacion.mejora) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getComparacionColor = () => {
    return comparacion.mejora ? "text-green-600" : "text-red-600";
  };

  const proyeccionStyle = getProyeccionColor();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Proyección de Cumplimiento</h3>

      <div className="space-y-4">
        {/* Proyección principal */}
        <div className={`${proyeccionStyle.bg} ${proyeccionStyle.border} border rounded-lg p-4`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">{proyeccionStyle.icon}</div>
            <div className="ml-3 flex-1">
              <h4 className={`text-sm font-semibold ${proyeccionStyle.text}`}>
                {proyeccion.cumpliraAtiempo ? "Meta en buen camino" : "Atención requerida"}
              </h4>
              <div className="mt-1 text-sm">
                {proyeccion.cumpliraAtiempo ? (
                  <p>
                    Al ritmo actual, alcanzarás la meta antes del final del año.
                    {proyeccion.fechaEstimada && (
                      <span className="font-semibold">
                        {" "}
                        Fecha estimada:{" "}
                        {new Date(proyeccion.fechaEstimada).toLocaleDateString("es-CL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </p>
                ) : (
                  <div>
                    <p className="mb-2 text-yellow-900">
                      Al ritmo actual, no alcanzarás la meta anual. Necesitas aumentar la producción
                      mensual.
                    </p>
                    <div className="bg-white rounded p-3 border border-yellow-300 shadow-sm">
                      <p className="font-semibold text-gray-900">
                        Toneladas mensuales necesarias:{" "}
                        <span className="text-yellow-700">
                          {proyeccion.toneladasMensualNecesarias.toFixed(1)} ton/mes
                        </span>
                      </p>
                      <p className="text-sm mt-1 text-gray-700">
                        Déficit acumulado:{" "}
                        <span className="font-semibold text-yellow-800">
                          {proyeccion.deficit.toFixed(1)} toneladas
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparación con período anterior */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Comparación con período anterior
              </h4>
              <div className="mt-1 flex items-center">
                {getComparacionIcon()}
                <span className={`ml-1 text-sm font-medium ${getComparacionColor()}`}>
                  {comparacion.mejora ? "+" : ""}
                  {comparacion.variacion.toFixed(1)}%
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  vs mismo período{" "}
                  {comparacion.periodoActual.toneladas > comparacion.periodoAnterior.toneladas
                    ? "mayor"
                    : "menor"}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {comparacion.periodoActual.toneladas.toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">toneladas este período</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Este período:</span>
              <span className="ml-2 font-semibold">
                {comparacion.periodoActual.toneladas.toFixed(1)} ton
              </span>
            </div>
            <div>
              <span className="text-gray-600">Período anterior:</span>
              <span className="ml-2 font-semibold">
                {comparacion.periodoAnterior.toneladas.toFixed(1)} ton
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progreso visual */}
        {!proyeccion.cumpliraAtiempo && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Plan de recuperación</h4>
            <div className="space-y-2 text-sm text-red-800">
              <div className="flex justify-between">
                <span>Progreso actual:</span>
                <span className="font-semibold">
                  {comparacion.periodoActual.porcentaje.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Necesario para recuperar:</span>
                <span className="font-semibold">100%</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, comparacion.periodoActual.porcentaje)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
