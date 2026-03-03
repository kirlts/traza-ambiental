"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

interface Filtros {
  anio: number;
  periodo: string;
  region: string;
  tratamiento: string;
  gestor: string;
}

interface GraficoBarrasMesesProps {
  filtros: Filtros;
  enabled?: boolean;
}

export function GraficoBarrasMeses({ filtros, enabled = true }: GraficoBarrasMesesProps) {
  const { status } = useSession();
  const [data, setData] = useState<ReturnType<typeof JSON.parse>[]>([]);
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

        const response = await fetch(`/api/dashboard/toneladas-por-mes?${params}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `Error ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();
        setData(result.meses || []);
        setError(null);
      } catch (err: unknown) {
        console.error("Error cargando gráfico de barras:", err);
        const errorMessage =
          err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : "Error al cargar datos del gráfico";
        setError(errorMessage);
        // Datos de ejemplo mientras se implementa la API
        setData([
          {
            mes: "Ene",
            reciclaje: 45,
            recauchaje: 30,
            coprocesamiento: 15,
            valorizacion_energetica: 5,
            total: 95,
            meta: 80,
          },
          {
            mes: "Feb",
            reciclaje: 52,
            recauchaje: 28,
            coprocesamiento: 18,
            valorizacion_energetica: 7,
            total: 105,
            meta: 80,
          },
          {
            mes: "Mar",
            reciclaje: 48,
            recauchaje: 35,
            coprocesamiento: 12,
            valorizacion_energetica: 3,
            total: 98,
            meta: 80,
          },
          {
            mes: "Abr",
            reciclaje: 61,
            recauchaje: 32,
            coprocesamiento: 20,
            valorizacion_energetica: 8,
            total: 121,
            meta: 80,
          },
          {
            mes: "May",
            reciclaje: 55,
            recauchaje: 38,
            coprocesamiento: 16,
            valorizacion_energetica: 6,
            total: 115,
            meta: 80,
          },
          {
            mes: "Jun",
            reciclaje: 67,
            recauchaje: 41,
            coprocesamiento: 22,
            valorizacion_energetica: 9,
            total: 139,
            meta: 80,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [filtros, enabled, status]);

  const CustomTooltip = ({ active, payload, label }: ReturnType<typeof JSON.parse>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Mes: ${label}`}</p>
          {payload.map((entry: ReturnType<typeof JSON.parse>, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value} ton`}
            </p>
          ))}
          <p className="text-sm text-gray-600 border-t pt-1 mt-1">
            {`Total: ${payload.reduce((sum: number, entry: ReturnType<typeof JSON.parse>) => sum + entry.value, 0)} ton`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!enabled) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Toneladas Valorizadas por Mes</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} tickLine={{ stroke: "#9CA3AF" }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#9CA3AF" }}
              label={{ value: "Toneladas", angle: -90, position: "insideLeft" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Barras apiladas por tratamiento */}
            <Bar dataKey="reciclaje" stackId="a" fill="#3B82F6" name="Reciclaje" />
            <Bar dataKey="recauchaje" stackId="a" fill="#10B981" name="Recauchaje" />
            <Bar dataKey="coprocesamiento" stackId="a" fill="#F59E0B" name="Co-procesamiento" />
            <Bar
              dataKey="valorizacion_energetica"
              stackId="a"
              fill="#EF4444"
              name="Valorización Energética"
            />

            {/* Línea de meta mensual */}
            <Line
              type="monotone"
              dataKey="meta"
              stroke="#6B7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Meta Mensual"
              dot={{ fill: "#6B7280", strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Las barras muestran el total mensual desglosado por tipo de tratamiento. La línea punteada
          representa la meta mensual objetivo.
        </p>
      </div>
    </div>
  );
}
