"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface HistoricalData {
  usuariosRegistrados: Array<{
    fecha: string;
    usuarios: number;
    activos: number;
  }>;
  actividadSistema: Array<{
    fecha: string;
    actividades: number;
    logins: number;
    acciones: number;
  }>;
}

interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
  porRol: Array<{
    roleId: string;
    roleName: string;
    count: number;
  }>;
}

interface DashboardChartsProps {
  historico: HistoricalData;
  usuarios: UserStats;
  loading?: boolean;
}

export default function DashboardCharts({
  historico,
  usuarios,
  loading = false,
}: DashboardChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Configuración común para gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  // Datos para gráfico de líneas - Evolución de usuarios
  const lineChartData = {
    labels: historico.usuariosRegistrados.map((item: ReturnType<typeof JSON.parse>) => {
      const date = new Date(item.fecha);
      return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Usuarios Registrados",
        data: historico.usuariosRegistrados.map(
          (item: ReturnType<typeof JSON.parse>) => item.usuarios
        ),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Usuarios Activos",
        data: historico.usuariosRegistrados.map(
          (item: ReturnType<typeof JSON.parse>) => item.activos
        ),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Datos para gráfico de dona - Distribución por roles
  const doughnutData = {
    labels: usuarios.porRol.map((rol) => rol.roleName),
    datasets: [
      {
        data: usuarios.porRol.map((rol) => rol.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 69, 19, 0.8)",
          "rgba(147, 51, 234, 0.8)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
          "rgb(139, 69, 19)",
          "rgb(147, 51, 234)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfico de barras - Actividad del sistema
  const barChartData = {
    labels: historico.actividadSistema.map((item: ReturnType<typeof JSON.parse>) => {
      const date = new Date(item.fecha);
      return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Actividades Totales",
        data: historico.actividadSistema.map(
          (item: ReturnType<typeof JSON.parse>) => item.actividades
        ),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
      {
        label: "Logins",
        data: historico.actividadSistema.map((item: ReturnType<typeof JSON.parse>) => item.logins),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Acciones",
        data: historico.actividadSistema.map(
          (item: ReturnType<typeof JSON.parse>) => item.acciones
        ),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderColor: "rgb(251, 191, 36)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Gráfico de líneas - Evolución de usuarios */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">📈 Evolución de Usuarios</h3>
          <span className="text-sm text-gray-500">Últimos 7 días</span>
        </div>
        <div className="h-64">
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>

      {/* Gráfico de dona - Distribución por roles */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">🍩 Distribución por Roles</h3>
          <span className="text-sm text-gray-500">Total: {usuarios.total}</span>
        </div>
        <div className="h-64">
          <Doughnut data={doughnutData} options={chartOptions} />
        </div>
      </div>

      {/* Gráfico de barras - Actividad del sistema */}
      <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">📊 Actividad del Sistema</h3>
          <span className="text-sm text-gray-500">Últimos 7 días</span>
        </div>
        <div className="h-64">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
