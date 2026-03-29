"use client";

import { useDemo } from "../demo-context";
import { toast } from "sonner";
import {
  ShieldCheck,
  AlertTriangle,
  BarChart4,
  Users,
  FileCheck,
  Ban,
  CheckCircle,
  TrendingUp,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminDashboard() {
  const { solicitudes, bitacora, emitirCertificado, kpisGlobales, isTourActive, tourStep, markTourStepCompleted } = useDemo();

  const isTourTarget = isTourActive && tourStep === 5;
  const listosParaCertificar = solicitudes.filter(s => s.status === "TRATADO_Y_FRACCIONADO");

  // Calculate progress
  const progressPercentage = Math.min(
    (kpisGlobales.toneladasRecicladas / kpisGlobales.metaAnual) * 100,
    100
  );

  const handleEmitir = (id: string) => {
    emitirCertificado(id);
    toast.success("Certificados Emitidos Exitosamente", {
      description: "El paquete REP (Retiro, Recepción y Valorización) ha sido firmado e ingresado a la Bitácora.",
    });
    if (isTourTarget) {
      markTourStepCompleted();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Perfil Administrador
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Control Institucional Integral</h1>
          <p className="text-slate-500 mt-1">Supervisión Traza Ambiental (Nivel 1)</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Volver al Hub
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-purple-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-md">
            <Settings className="w-5 h-5 animate-spin-slow" />
            Configuración Core
          </div>
        </div>
      </div>

      {/* Global KPIs Panel */}
      <div className="bg-slate-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart4 className="text-purple-400 w-6 h-6" />
              Meta Nacional Anual (31 Dic)
            </h2>
            <div className="flex items-end gap-4 mb-4">
              <span className="text-5xl font-black tracking-tighter">
                {kpisGlobales.toneladasRecicladas.toLocaleString()}
              </span>
              <span className="text-xl text-slate-400 mb-1 font-medium">
                / {kpisGlobales.metaAnual.toLocaleString()} Tons
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-4 mb-3 overflow-hidden shadow-inner relative">
              <div
                className="bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div
                  className="absolute inset-0 bg-white/20 w-full h-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
                    backgroundSize: "1rem 1rem",
                  }}
                ></div>
              </div>
            </div>
            <p className="text-sm font-medium text-purple-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              {progressPercentage.toFixed(1)}% de avance legal. Reportabilidad en línea con SINADER.
            </p>
          </div>

          <div className="w-px bg-slate-700 hidden lg:block"></div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold">1,248</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Certificados Válidos</p>
              <p className="text-3xl font-bold text-emerald-400">8,592</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Pendientes de Firma</p>
              <p
                className={`text-3xl font-bold ${listosParaCertificar.length > 0 ? "text-yellow-400 animate-pulse" : "text-slate-100"}`}
              >
                {listosParaCertificar.length}
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Estado de Servidores</p>
              <p className="text-xl font-bold text-emerald-400 flex items-center gap-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-demo-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Óptimo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Discrepancies Juez Panel */}
        <section data-tour-target="emitir-certificados">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-emerald-500" />
              Consolidación Documental
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Lotes Listos para Emisión</h3>

            {listosParaCertificar.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No hay lotes fraccionados pendientes de certificación.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {listosParaCertificar.map(sol => (
                        <div key={sol.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="font-mono text-sm font-bold text-slate-900 block">{sol.id}</span>
                                    <span className="text-xs text-slate-500">Generador: {sol.titular.nombre}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-slate-900">{sol.tonelajeReal}t</span>
                                    <span className="block text-xs text-emerald-600 font-medium">{sol.fracciones?.length} Fracciones</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEmitir(sol.id)}
                                className={`w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-all ${isTourTarget ? 'ring-4 ring-emerald-500/50 animate-pulse' : ''}`}
                            >
                                Emitir Paquete de Cumplimiento REP
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </section>

        {/* Right Column: Bitacora Auditoria */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-500" />
              Bitácora Inmutable (Append-Only)
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm text-slate-500">
                Registro criptográfico de transacciones. Cada transición de la máquina de estados genera evidencia inalterable.
              </p>
            </div>

            <div className="h-[500px] overflow-y-auto">
                <ul className="divide-y divide-slate-100">
                  {bitacora.map((log) => (
                    <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono text-slate-400">{log.id}</span>
                            <span className="text-xs font-medium text-slate-500">{format(new Date(log.timestamp_utc), "dd MMM HH:mm:ss", { locale: es })}</span>
                        </div>
                        <div className="mb-2">
                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold font-mono mr-2">{log.solicitudId}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-sm">
                            <span className="font-medium text-slate-600 truncate max-w-[120px]" title={log.estadoAnterior || "N/A"}>
                                {log.estadoAnterior ? log.estadoAnterior.substring(0, 15) + "..." : "INICIO"}
                            </span>
                            <span className="text-indigo-500 font-bold">→</span>
                            <span className="font-bold text-slate-900 truncate max-w-[150px]" title={log.estadoNuevo}>
                                {log.estadoNuevo.substring(0, 18) + (log.estadoNuevo.length > 18 ? "..." : "")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="font-semibold text-slate-700">{log.rolEjecutor}</span>
                                <span>({log.actorId})</span>
                            </div>
                            {log.evidenciaRef && (
                                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                    Ref: {log.evidenciaRef}
                                </span>
                            )}
                        </div>
                    </li>
                  ))}
                  {bitacora.length === 0 && (
                      <li className="p-8 text-center text-slate-500 text-sm">El registro de auditoría está vacío.</li>
                  )}
                </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
