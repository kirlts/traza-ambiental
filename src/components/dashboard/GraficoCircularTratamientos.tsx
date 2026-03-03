"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Filtros {
  anio: number;
  periodo: string;
  region: string;
  tratamiento: string;
  gestor: string;
}

interface TratamientoData {
  tipo: string;
  toneladas: number;
  porcentaje: number;
  color: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface GraficoCircularTratamientosProps {
  filtros: Filtros;
  enabled?: boolean;
}

const COLORES = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export function GraficoCircularTratamientos({
  filtros,
  enabled = true,
}: GraficoCircularTratamientosProps) {
  const { status } = useSession();
  const [data, setData] = useState<TratamientoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const response = await fetch(`/api/dashboard/distribucion-tratamientos?${params}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `Error ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();
        const tratamientos = result.tratamientos || [];

        // Asegurar que cada tratamiento tenga porcentaje calculado
        const totalToneladas = (tratamientos as Array<{ toneladas?: number }>).reduce(
          (sum: number, t) => sum + (t.toneladas || 0),
          0
        );
        const tratamientosConPorcentaje = (tratamientos as Array<Record<string, unknown>>).map(
          (t, idx) => ({
            ...t,
            porcentaje:
              totalToneladas > 0 ? (((t.toneladas as number) || 0) / totalToneladas) * 100 : 0,
            color: (t.color as string) || COLORES[idx % COLORES.length],
          })
        );

        setData(tratamientosConPorcentaje as TratamientoData[]);
        setError(null);
      } catch (err: unknown) {
        console.error("Error cargando gráfico circular:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos del gráfico");
        // Datos de ejemplo mientras se implementa la API
        setData([
          { tipo: "Reciclaje", toneladas: 285, porcentaje: 45, color: "#3B82F6" },
          { tipo: "Recauchaje", toneladas: 204, porcentaje: 32, color: "#10B981" },
          { tipo: "Co-procesamiento", toneladas: 83, porcentaje: 13, color: "#F59E0B" },
          { tipo: "Valorización Energética", toneladas: 58, porcentaje: 9, color: "#EF4444" },
          { tipo: "Otro", toneladas: 10, porcentaje: 1, color: "#8B5CF6" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [filtros, enabled, status]);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: TratamientoData }>;
  }) => {
    if (active && payload && payload.length) {
      const dataT = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="font-bold text-slate-800 dark:text-gray-100">{dataT.tipo}</p>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            {dataT.toneladas} toneladas ({dataT.porcentaje.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
    payload,
  }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    payload?: TratamientoData;
  }) => {
    const percentage = payload?.porcentaje || percent * 100;
    if (percentage < 5) {
      return null;
    } // No mostrar labels para porcentajes menores al 5%

    const RADIAN = Math.PI / 180;
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > Number(cx) ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
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
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Cargando gráfico...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Si no hay datos, mostrar datos de ejemplo
  const datosParaMostrar =
    data.length > 0
      ? data
      : [
          { tipo: "Reciclaje", toneladas: 285, porcentaje: 45, color: "#3B82F6" },
          { tipo: "Recauchaje", toneladas: 204, porcentaje: 32, color: "#10B981" },
          { tipo: "Co-procesamiento", toneladas: 83, porcentaje: 13, color: "#F59E0B" },
          { tipo: "Valorización Energética", toneladas: 58, porcentaje: 9, color: "#EF4444" },
        ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Distribución por Tipo de Tratamiento
        </h3>
        {data.length === 0 && (
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            Datos de ejemplo
          </span>
        )}
      </div>

      <div className="h-80 min-h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
          <PieChart>
            <Pie
              data={datosParaMostrar}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="toneladas"
            >
              {datosParaMostrar.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORES[index % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda personalizada */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.map((entry) => (
          <div key={`legend-${entry.tipo}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-slate-600 dark:text-gray-400 flex-1 truncate">
              {entry.tipo}
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-gray-200">
              {entry.porcentaje.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Distribución porcentual de las toneladas valorizadas según el tipo de tratamiento
          aplicado.
        </p>
      </div>
    </div>
  );
}
