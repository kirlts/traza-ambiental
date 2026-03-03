"use client";

import { GaugeComponent } from "react-gauge-component";

interface VelocimetroMetaProps {
  porcentaje: number;
  titulo: string;
}

export function VelocimetroMeta({ porcentaje, titulo }: VelocimetroMetaProps) {
  const getColor = (value: number) => {
    if (value >= 100) return "#10B981"; // Verde
    if (value >= 90) return "#3B82F6"; // Azul
    if (value >= 75) return "#F59E0B"; // Amarillo
    if (value >= 50) return "#F97316"; // Naranja
    return "#EF4444"; // Rojo
  };

  const getStatusText = (value: number) => {
    if (value >= 100) return "Meta cumplida";
    if (value >= 90) return "Muy cerca";
    if (value >= 75) return "Buen progreso";
    if (value >= 50) return "En progreso";
    return "Requiere atención";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{titulo}</h3>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-xs mx-auto">
          <GaugeComponent
            value={porcentaje}
            minValue={0}
            maxValue={100}
            arc={{
              colorArray: ["#EF4444", "#F97316", "#F59E0B", "#3B82F6"],
              subArcs: [{ limit: 50 }, { limit: 75 }, { limit: 90 }, { limit: 100 }],
              padding: 0.02,
              width: 0.2,
            }}
            labels={{
              valueLabel: {
                formatTextValue: (value) => `${value.toFixed(1)}%`,
                style: {
                  fontSize: "24px",
                  fill: getColor(porcentaje),
                  fontWeight: "bold",
                },
              },
              tickLabels: {
                type: "outer",
                ticks: [{ value: 0 }, { value: 25 }, { value: 50 }, { value: 75 }, { value: 100 }],
              },
            }}
            pointer={{
              elastic: true,
              animationDelay: 0,
            }}
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Estado actual:</p>
          <p className={`text-lg font-semibold`} style={{ color: getColor(porcentaje) }}>
            {getStatusText(porcentaje)}
          </p>
        </div>

        {/* Barra de progreso adicional */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0%</span>
            <span>Meta: 100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, porcentaje)}%`,
                backgroundColor: getColor(porcentaje),
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
