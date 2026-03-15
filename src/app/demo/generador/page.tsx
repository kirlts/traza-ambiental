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
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function GeneradorDashboard() {
  const { solicitudes, addSolicitud, isTourActive, tourStep } = useDemo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tonelaje, setTonelaje] = useState<number | "">("");

  // Only show requests from our dummy generator "Minera Demo S.A." or all for demo purposes
  const mySolicitudes = solicitudes.filter(
    (s) => s.generador.nombre === "Minera Demo S.A." || s.generador.nombre === "Minera Escondida"
  );

  const totalReciclado = mySolicitudes
    .filter((s) => s.status === "CERTIFICADA" || s.status === "TRATADA")
    .reduce((acc, curr) => acc + (curr.tonelajeReal || curr.tonelajeEstimado), 0);

  const metaAnual = 1500; // Tons for this specific generator
  const progress = Math.min((totalReciclado / metaAnual) * 100, 100);

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

    toast.success("Declaración Automática (SINADER)", {
      description: `Borrador de ${tonelaje} tons. sincronizado con Ventanilla Única y publicado en la Bolsa de Cargas.`,
      icon: <CheckCircle2 className="text-emerald-500" />,
    });

    if (isTourActive && tourStep === 1) {
      toast.info("¡Acción completada!", {
        description: "Avanza al siguiente perfil usando el panel flotante.",
      });
    }
  };

  const statusMap: Record<string, { label: string; color: string; icon: LucideIcon }> = {
    PENDIENTE: {
      label: "Borrador",
      color: "text-slate-500 bg-slate-100 ring-slate-200",
      icon: AlertCircle,
    },
    BUSCANDO_TRANSPORTISTA: {
      label: "Buscando Flota",
      color: "text-orange-700 bg-orange-100 ring-orange-200",
      icon: Activity,
    },
    ASIGNADA: {
      label: "Transportista Asignado",
      color: "text-blue-700 bg-blue-100 ring-blue-200",
      icon: Truck,
    },
    EN_TRANSITO: {
      label: "En Tránsito a Planta",
      color: "text-indigo-700 bg-indigo-100 ring-indigo-200",
      icon: Truck,
    },
    RECIBIDA_EN_PLANTA: {
      label: "Recibida en Planta",
      color: "text-cyan-700 bg-cyan-100 ring-cyan-200",
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
      color: "text-emerald-800 bg-emerald-100 ring-emerald-300 shadow-sm",
      icon: FileText,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <Factory className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Perfil Generador
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Minero</h1>
          <p className="text-slate-500 mt-1">
            Gestión de Neumáticos Fuera de Uso (NFU - Categoría B)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Volver al Hub
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-5 h-5" />
            Nueva Solicitud OTR
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* KPI 1: Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Meta Ley REP (Anual)</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {totalReciclado.toLocaleString()}
                <span className="text-lg text-slate-400 font-normal"> / {metaAnual} t</span>
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 mt-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {progress.toFixed(1)}% de la meta obligatoria completada
          </p>
        </div>

        {/* KPI 2: Active */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Solicitudes en Curso</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {
                  mySolicitudes.filter((s) => s.status !== "CERTIFICADA" && s.status !== "TRATADA")
                    .length
                }
              </h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6 font-medium">
            Buscando flota o en tránsito a planta
          </p>
        </div>

        {/* KPI 3: Certs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Certificados Emitidos</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {mySolicitudes.filter((s) => s.status === "CERTIFICADA").length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6 font-medium">Válidos ante SINADER - MMA</p>
        </div>
      </div>

      {/* Tracking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Historial de Solicitudes</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Solicitud</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Carga (Tons)</th>
                <th className="px-6 py-4 font-semibold">Estado de Trazabilidad</th>
                <th className="px-6 py-4 font-semibold text-right">Acción Legal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mySolicitudes.map((solicitud) => {
                const StatusIcon = statusMap[solicitud.status]?.icon || AlertCircle;

                return (
                  <tr key={solicitud.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{solicitud.id}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {format(new Date(solicitud.fechaCreacion), "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-semibold text-slate-800">
                          {solicitud.tonelajeReal || solicitud.tonelajeEstimado} t
                        </span>
                        {solicitud.tonelajeReal &&
                          solicitud.tonelajeEstimado !== solicitud.tonelajeReal && (
                            <span
                              className="text-[10px] text-slate-400 line-through"
                              title="Estimación original"
                            >
                              ({solicitud.tonelajeEstimado}t)
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusMap[solicitud.status]?.color || "text-slate-600 bg-slate-100 ring-slate-200"}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusMap[solicitud.status]?.label || solicitud.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {solicitud.status === "CERTIFICADA" ? (
                        <button
                          onClick={() =>
                            toast.info("Descargando PDF Incorruptible...", {
                              description: `Certificado ${solicitud.certificadoId} firmado electrónicamente.`,
                            })
                          }
                          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Certificado
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">En proceso...</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {mySolicitudes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Factory className="w-12 h-12 text-slate-300 mb-3" />
                      <p>No hay solicitudes creadas aún en esta faena minera.</p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 text-orange-600 font-medium hover:underline"
                      >
                        Crear tu primera solicitud OTR
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal / Stepper */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mb-6">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Declarar Residuos OTR</h3>
              <p className="text-slate-500 text-sm mb-6">
                Ingresa el tonelaje estimado de neumáticos gigantes (Categoría B) que necesitan
                recolección en la faena.
              </p>

              <form onSubmit={handleCreateRequest}>
                <div className="mb-6">
                  <label
                    htmlFor="tonelaje"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Tonelaje Estimado (t)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="tonelaje"
                      value={tonelaje}
                      onChange={(e) => setTonelaje(e.target.value ? Number(e.target.value) : "")}
                      className="block w-full rounded-xl border-slate-300 py-3 px-4 text-slate-900 bg-slate-50 focus:border-orange-500 focus:bg-white focus:ring-orange-500 sm:text-lg outline-none ring-1 ring-slate-200 transition-all font-medium"
                      placeholder="Ej: 45"
                      min="1"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-slate-400 font-medium">Toneladas</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    El peso final real será validado en la romana del Centro de Valorización.
                  </p>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 text-white bg-slate-900 hover:bg-slate-800 rounded-xl font-medium transition-colors shadow-md shadow-slate-900/20"
                  >
                    Publicar Solicitud
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
