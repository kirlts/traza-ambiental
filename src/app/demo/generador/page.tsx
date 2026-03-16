"use client";

import { useState } from "react";
import { useDemo } from "../demo-context";
import { toast } from "sonner";
import {
  Factory,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  FileText,
  Truck,
  CheckCircle2,
  Download,
  Activity,
  LucideIcon,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GeneradorDashboard() {
  const { solicitudes, addSolicitud, isTourActive, tourStep, markTourStepCompleted } = useDemo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tonelaje, setTonelaje] = useState<number | "">("");

  const mySolicitudes = solicitudes.filter(
    (s) => s.generador.nombre === "Minera Demo S.A." || s.generador.nombre === "Minera Escondida"
  );

  const totalReciclado = mySolicitudes
    .filter((s) => s.status === "CERTIFICADA" || s.status === "TRATADA")
    .reduce((acc, curr) => acc + (curr.tonelajeReal || curr.tonelajeEstimado), 0);

  const metaAnual = 1500;
  const progress = Math.min((totalReciclado / metaAnual) * 100, 100);

  const isAddTarget = isTourActive && tourStep === 1;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tonelaje || isNaN(Number(tonelaje)) || Number(tonelaje) <= 0) {
      toast.error("Por favor ingrese un tonelaje válido", {
        description: "Debe ser un número mayor a 0.",
      });
      return;
    }

    addSolicitud(Number(tonelaje));
    setIsModalOpen(false);
    setTonelaje("");

    toast.success("Declaración de Residuos Exitosa", {
      description: `Solicitud de retiro por ${tonelaje} t creada y publicada.`,
      icon: <CheckCircle2 className="text-emerald-500" />,
    });

    if (isAddTarget) {
      markTourStepCompleted();
    }
  };

  const statusMap: Record<string, { label: string; color: string; icon: LucideIcon }> = {
    PENDIENTE: {
      label: "Borrador",
      color: "text-gray-600 bg-gray-100 ring-gray-200",
      icon: AlertCircle,
    },
    BUSCANDO_TRANSPORTISTA: {
      label: "Buscando Flota",
      color: "text-blue-700 bg-blue-100 ring-blue-200",
      icon: Activity,
    },
    ASIGNADA: {
      label: "Transportista Asignado",
      color: "text-indigo-700 bg-indigo-100 ring-indigo-200",
      icon: Truck,
    },
    EN_TRANSITO: {
      label: "En Tránsito a Planta",
      color: "text-purple-700 bg-purple-100 ring-purple-200",
      icon: Truck,
    },
    RECIBIDA_EN_PLANTA: {
      label: "Recibida en Planta",
      color: "text-amber-700 bg-amber-100 ring-amber-200",
      icon: Factory,
    },
    PESAJE_DISCREPANTE: {
      label: "Alerta de Pesaje",
      color: "text-red-700 bg-red-100 ring-red-200",
      icon: AlertCircle,
    },
    TRATADA: {
      label: "Valorización Completa",
      color: "text-emerald-700 bg-emerald-100 ring-emerald-200",
      icon: CheckCircle2,
    },
    CERTIFICADA: {
      label: "Certificado Emitido",
      color: "text-emerald-800 bg-emerald-100 ring-emerald-300",
      icon: FileText,
    },
  };

  return (
    <DashboardLayout
      title="Panel de Control: Generador"
      subtitle="Gestión de Retiros y Declaraciones de NFU"
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mr-2"
          >
            Volver al Simulador
          </Link>
          <Button
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm ${
              isAddTarget ? "ring-4 ring-emerald-500/50 animate-pulse" : ""
            }`}
            title="Cree una nueva solicitud para que un transportista asigne un vehículo al retiro"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Solicitud de Retiro
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Banner Explicativo */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          <div className="text-sm">
            <strong>Perfil Generador:</strong> Este módulo es utilizado por las empresas que generan Neumáticos Fuera de Uso (NFU).
            Aquí puede declarar los retiros de residuos necesarios en su instalación y monitorear el progreso hacia su meta anual de cumplimiento normativo (Ley REP).
          </div>
        </div>

        {/* Action Cards (like Production) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Nueva Solicitud */}
          <div
            onClick={() => setIsModalOpen(true)}
            className={`group relative bg-white border rounded-2xl p-6 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 cursor-pointer overflow-hidden ${
              isAddTarget ? "border-emerald-500 ring-2 ring-emerald-500 animate-pulse" : "border-emerald-200 hover:border-emerald-300"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500 text-white group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors">
                Nueva Solicitud de Retiro
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Crea una nueva solicitud para el retiro y valorización de neumáticos en tus instalaciones
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Disponible
                </span>
                <svg
                  className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Card: Inventario Digital */}
          <div
            className="group relative bg-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer hover:border-blue-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                Inventario Digital
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Gestiona digitalmente tu inventario de neumáticos con trazabilidad completa
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Disponible
                </span>
                <svg
                  className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* KPI 1: Progress */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Meta Ley REP (Anual)</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {totalReciclado.toLocaleString()}
                  <span className="text-sm text-gray-400 font-normal ml-1">/ {metaAnual} t</span>
                </h3>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {progress.toFixed(1)}% de la meta
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Active */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Solicitudes en Curso</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {
                    mySolicitudes.filter((s) => s.status !== "CERTIFICADA" && s.status !== "TRATADA")
                      .length
                  }
                </h3>
              </div>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6 font-medium">
              Pendientes de recolección o entrega
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Certs */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Certificados Emitidos</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {mySolicitudes.filter((s) => s.status === "CERTIFICADA").length}
                </h3>
              </div>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6 font-medium">Respaldos legales completados</p>
          </CardContent>
        </Card>
        </div>

        {/* Tracking Table */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Historial de Solicitudes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-semibold">ID Solicitud</th>
                <th className="px-6 py-3 font-semibold">Fecha</th>
                <th className="px-6 py-3 font-semibold">Volumen (t)</th>
                <th className="px-6 py-3 font-semibold">Estado de Trazabilidad</th>
                <th className="px-6 py-3 font-semibold text-right">Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {mySolicitudes.map((solicitud) => {
                const StatusIcon = statusMap[solicitud.status]?.icon || AlertCircle;

                return (
                  <tr key={solicitud.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{solicitud.id}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(solicitud.fechaCreacion), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1" title="El volumen final se ajusta en base al pesaje real en el Centro de Valorización">
                        <span className="font-semibold text-gray-800 cursor-help">
                          {solicitud.tonelajeReal || solicitud.tonelajeEstimado} t
                        </span>
                        {solicitud.tonelajeReal &&
                          solicitud.tonelajeEstimado !== solicitud.tonelajeReal && (
                            <span
                              className="text-[10px] text-gray-400 line-through"
                              title="Estimación original"
                            >
                              ({solicitud.tonelajeEstimado}t)
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${statusMap[solicitud.status]?.color || "text-gray-600 bg-gray-100 ring-gray-200"}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusMap[solicitud.status]?.label || solicitud.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {solicitud.status === "CERTIFICADA" ? (
                        <button
                          onClick={() =>
                            toast.info("Descargando Certificado...", {
                              description: `Certificado ${solicitud.certificadoId} listo.`,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 font-medium px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors"
                          title="Descargar documento legal en formato PDF"
                        >
                          <Download className="w-4 h-4" />
                          Certificado
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">En proceso...</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {mySolicitudes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Factory className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No hay solicitudes registradas.</p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 text-emerald-600 font-medium hover:underline"
                      >
                        Crear una solicitud de retiro
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 mb-5">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Declarar Retiro de NFU</h3>
              <p className="text-gray-500 text-sm mb-6">
                Ingrese el volumen estimado de Neumáticos Fuera de Uso que requiere recolección.
              </p>

              <form onSubmit={handleCreateRequest}>
                <div className="mb-6">
                  <label
                    htmlFor="tonelaje"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Volumen Estimado (t)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="tonelaje"
                      value={tonelaje}
                      onChange={(e) => setTonelaje(e.target.value ? Number(e.target.value) : "")}
                      className={`block w-full rounded-md border-gray-300 py-2.5 px-3 text-gray-900 bg-white border focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition-all ${
                        isAddTarget ? "ring-2 ring-emerald-500 animate-pulse" : ""
                      }`}
                      placeholder="Ej: 50"
                      min="1"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 sm:text-sm">Toneladas</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    El peso real será validado formalmente en la romana del Centro de Valorización.
                  </p>
                </div>

                <div className="flex gap-3 justify-end mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className={`bg-emerald-600 hover:bg-emerald-700 text-white ${
                      isAddTarget ? "ring-2 ring-emerald-500 animate-pulse" : ""
                    }`}
                  >
                    Publicar Solicitud
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
}
