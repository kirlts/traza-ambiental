"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Package,
  CheckCircle,
  AlertTriangle,
  Factory,
  FileText,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SinaderComplianceCard from "@/components/compliance/SinaderComplianceCard";

export default function DashboardGestor() {
  // Obtener recepciones pendientes para calcular estadísticas
  const { data: recepcionesData } = useQuery({
    queryKey: ["gestor-recepciones-pendientes"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/recepciones-pendientes");
      if (!response.ok) {
        throw new Error("Error cargando recepciones pendientes");
      }
      return response.json();
    },
  });

  // Obtener recepciones completadas para estadísticas
  const { data: completadasData } = useQuery({
    queryKey: ["gestor-recepciones-completadas-stats"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/recepciones-completadas");
      if (!response.ok) {
        throw new Error("Error cargando recepciones completadas");
      }
      return response.json();
    },
  });

  // Calcular estadísticas basadas en las recepciones pendientes y completadas
  const stats = {
    recepcionesPendientes: (recepcionesData?.total as number) || 0,
    recepcionesHoy:
      (recepcionesData?.recepciones as Array<{ fechaEntrega?: string }>)?.filter(
        (r: ReturnType<typeof JSON.parse>) => {
          if (!r?.fechaEntrega) return false;
          const fechaEntrega = new Date(r.fechaEntrega);
          const hoy = new Date();
          return (
            fechaEntrega.getFullYear() === hoy.getFullYear() &&
            fechaEntrega.getMonth() === hoy.getMonth() &&
            fechaEntrega.getDate() === hoy.getDate()
          );
        }
      ).length || 0,
    totalRecibidas: (completadasData?.total as number) || 0,
    alertasActivas: 0,
  };

  return (
    <DashboardLayout
      title="Bienvenido, Gestor REP"
      subtitle="Panel de Control para Gestores de Residuos - Sistema REP Chile"
    >
      <div className="w-full space-y-6">
        {/* HU-023: Semáforo de Cumplimiento SINADER */}
        <SinaderComplianceCard />

        {/* Estadísticas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Recepciones Pendientes */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                {stats?.recepcionesPendientes > 0 && (
                  <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold px-2 py-0.5">
                    {stats.recepcionesPendientes}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                  Recepciones Pendientes
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.recepcionesPendientes || 0}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Requieren validación
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recepciones Hoy */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <Truck className="h-5 w-5 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-600 text-white border-0 text-xs font-semibold px-2 py-0.5">
                  Hoy
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                  Recepciones Hoy
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.recepcionesHoy || 0}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Entregadas hoy
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recepciones Completadas */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-600 text-white border-0 text-xs font-semibold px-2 py-0.5">
                  <Award className="h-3 w-3" />
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                  Recepciones Completadas
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.totalRecibidas || 0}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Validadas correctamente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alertas Activas */}
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                {stats?.alertasActivas > 0 && (
                  <Badge className="bg-red-500 text-white border-0 text-xs font-semibold px-2 py-0.5">
                    ¡Atención!
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                  Alertas Activas
                </p>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.alertasActivas || 0}
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Requieren atención
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accesos Rápidos */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Acciones Rápidas</h2>
            <p className="text-sm text-gray-600">
              Accede a las funciones principales para gestionar recepciones y tratamientos
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Recepciones Pendientes */}
            <Link href="/dashboard/gestor/recepciones" className="group">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <Package className="h-6 w-6 text-emerald-600" />
                    </div>
                    {stats?.recepcionesPendientes > 0 && (
                      <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold px-2.5 py-1">
                        {stats.recepcionesPendientes} Nuevas
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Recepciones Pendientes
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Validar cargas entregadas por transportistas y confirmar recepciones
                  </p>
                  <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    <span>Acceder ahora</span>
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Asignación de Tratamientos */}
            <Link href="/dashboard/gestor/tratamientos" className="group">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <Factory className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Badge className="bg-emerald-600 text-white border-0 text-xs font-semibold px-2.5 py-1">
                      Activo
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Asignar Tratamientos
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Gestionar tratamientos de valorización para lotes validados
                  </p>
                  <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    <span>Gestionar tratamientos</span>
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Recepciones Completadas */}
            <Link href="/dashboard/gestor/recepciones/completadas" className="group">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Badge className="bg-gray-500 text-white border-0 text-xs font-semibold px-2.5 py-1">
                      Historial
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Recepciones Completadas
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Historial de cargas validadas y procesadas correctamente
                  </p>
                  <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    <span>Ver historial completo</span>
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Historial de Certificados */}
            <Link href="/dashboard/gestor/certificados" className="group">
              <Card className="border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <FileText className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Badge className="bg-emerald-600 text-white border-0 text-xs font-semibold px-2.5 py-1">
                      Digital
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Certificados Digitales
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Consultar y gestionar certificados digitales emitidos
                  </p>
                  <div className="flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                    <span>Ver certificados</span>
                    <svg
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
