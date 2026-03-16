"use client";

import { useState } from "react";
import { useDemo } from "../demo-context";
import { toast } from "sonner";
import {
  Recycle,
  Scale,
  CheckCircle,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Building,
  ArrowRightCircle,
  FileText,
  Download,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { generateCertificadoPDF } from "../generar-pdf";

export default function GestorDashboard() {
  const { solicitudes, registrarPesaje, emitirCertificado, isTourActive, tourStep, markTourStepCompleted } = useDemo();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pesoRomana, setPesoRomana] = useState<number | "">("");

  // Filter requests waiting for Gestor action
  const porRecibir = solicitudes.filter((s) => s.status === "RECIBIDA_EN_PLANTA");
  const enProceso = solicitudes.filter(
    (s) => s.status === "PESAJE_DISCREPANTE" || s.status === "TRATADA"
  );
  const tratadas = solicitudes.filter((s) => s.status === "CERTIFICADA");

  const handlePesaje = (e: React.FormEvent, id: string, pesoEstimado: number) => {
    e.preventDefault();
    if (!pesoRomana || isNaN(Number(pesoRomana)) || Number(pesoRomana) <= 0) {
      toast.error("Peso inválido", { description: "Ingrese un valor numérico real de romana." });
      return;
    }

    const pesoNum = Number(pesoRomana);
    registrarPesaje(id, pesoNum);

    const diff = Math.abs(pesoEstimado - pesoNum);
    const diffPercent = (diff / pesoEstimado) * 100;

    if (diffPercent > 5) {
      toast.error("¡Discrepancia Detectada!", {
        description: `Diferencia del ${diffPercent.toFixed(1)}%. El proceso legal ha sido paralizado.`,
        icon: <AlertTriangle className="text-red-500" />,
        duration: 5000,
      });
    } else {
      toast.success("Pesaje Fidedigno Registrado", {
        description: `Carga validada con ${pesoNum} tons. Lista para valorización.`,
        icon: <Scale className="text-emerald-500" />,
      });
    }

    setSelectedId(null);
    setPesoRomana("");
  };

  const handleEmitirCertificado = (id: string) => {
    emitirCertificado(id);
    toast.success("Certificado Emitido & SINADER", {
      description:
        "Se ha emitido el Certificado final legal. La información ha sido reportada directamente a Ventanilla Única SINADER.",
      icon: <ShieldCheck className="text-emerald-500" />,
    });

    if (isTourActive && tourStep === 3) {
      markTourStepCompleted();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Recycle className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Perfil Gestor (Planta)
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Centro de Valorización NFU</h1>
          <p className="text-slate-500 mt-1">Planta Principal • Resolución Sanitaria al día</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Volver al Hub
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-md">
            <Settings className="w-5 h-5 animate-spin-slow" style={{ animationDuration: "10s" }} />
            Operaciones Activas
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Recepción en Puertas (Pesaje Romana) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recepción en Puertas</h2>
                <p className="text-emerald-700 text-sm font-medium">
                  Validación de Pesaje Fidedigno (Dato Soberano)
                </p>
              </div>
            </div>
            <span className="bg-emerald-200 text-emerald-800 font-bold text-lg px-3 py-1 rounded-xl shadow-sm">
              {porRecibir.length}
            </span>
          </div>

          <div className="p-6">
            {porRecibir.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-500">
                <Building className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                <p className="text-lg">No hay camiones esperando pesaje en este momento.</p>
                <p className="text-sm mt-1">
                  Cuando un transportista marque "Entregar en Planta", aparecerá aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {porRecibir.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`border-2 rounded-2xl p-5 transition-all ${selectedId === viaje.id ? "border-emerald-400 bg-emerald-50/30 ring-4 ring-emerald-50" : "border-slate-100 hover:border-emerald-200 bg-white"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {viaje.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500">
                            {viaje.transportista?.patente || "Sin Patente"}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm flex items-center gap-1.5">
                          Generador:{" "}
                          <span className="font-bold text-slate-800">{viaje.generador.nombre}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                          Peso Declarado
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {viaje.tonelajeEstimado} <span className="text-sm text-slate-500">t</span>
                        </p>
                      </div>
                    </div>

                    {selectedId === viaje.id ? (
                      <form
                        onSubmit={(e) => handlePesaje(e, viaje.id, viaje.tonelajeEstimado)}
                        className="mt-6 pt-6 border-t border-emerald-100 animate-in slide-in-from-top-2"
                      >
                        <label className="block text-sm font-bold text-slate-800 mb-2">
                          Ingresar Dato de Romana Fidedigno (Tons)
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <input
                              type="number"
                              step="0.01"
                              value={pesoRomana}
                              onChange={(e) =>
                                setPesoRomana(e.target.value ? Number(e.target.value) : "")
                              }
                              className="w-full text-lg font-bold bg-white border-2 border-emerald-300 rounded-xl px-4 py-3 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition-all text-emerald-900"
                              placeholder="Ej: 46.2"
                              autoFocus
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-emerald-600 font-bold">
                              t
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Validar
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          Si hay &gt;5% de diferencia respecto a lo declarado, se paralizará el
                          flujo.
                        </p>
                      </form>
                    ) : (
                      <button
                        onClick={() => setSelectedId(viaje.id)}
                        className="w-full mt-4 bg-slate-900 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group shadow-sm"
                      >
                        Iniciar Pesaje en Romana
                        <ArrowRightCircle className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Conversión y Sellado */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="bg-slate-900 p-6 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Conversión y Sellado Legal</h2>
                <p className="text-slate-400 text-sm font-medium">
                  Emisión de Certificado (Autómata del Servidor)
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 bg-slate-50/50">
            {enProceso.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-500 h-full flex flex-col justify-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-lg">No hay cargas listas para certificación.</p>
                <p className="text-sm mt-1">
                  Primero debe validar el peso de los camiones entrantes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enProceso.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`bg-white rounded-2xl p-5 border shadow-sm ${viaje.status === "PESAJE_DISCREPANTE" ? "border-red-200 ring-2 ring-red-50" : "border-slate-200 hover:border-blue-300"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <FileText
                          className={`w-5 h-5 ${viaje.status === "PESAJE_DISCREPANTE" ? "text-red-500" : "text-blue-500"}`}
                        />
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {viaje.id}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {format(new Date(viaje.fechaActualizacion), "dd MMM HH:mm", { locale: es })}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Generador Original
                        </p>
                        <p className="font-bold text-slate-800">{viaje.generador.nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">
                          Volumen Validado
                        </p>
                        <p className="font-bold text-lg text-slate-900">
                          {viaje.tonelajeReal} <span className="text-sm text-slate-500">t</span>
                        </p>
                      </div>
                    </div>

                    {viaje.status === "PESAJE_DISCREPANTE" ? (
                      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-sm mb-1">Registro de Discrepancia Abierto</p>
                          <p className="text-xs opacity-90 leading-relaxed">
                            Flujo paralizado. El peso de romana ({viaje.tonelajeReal}t) difiere del
                            declarado ({viaje.tonelajeEstimado}t) en más del 5%. Esperando
                            resolución por el Administrador Institucional.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEmitirCertificado(viaje.id)}
                        className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 group"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        Tratar Neumáticos y Sellar (Emitir Certificado)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Historico de certificaciones */}
      {tratadas.length > 0 && (
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Últimas Certificaciones Emitidas
            </h3>
            <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {tratadas.length} documentos sellados
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tratadas.map((cert) => (
              <div
                key={cert.id}
                className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4 flex gap-4 items-center relative group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-900 truncate">{cert.certificadoId}</p>
                  <p className="text-xs text-slate-500 truncate mb-1">
                    Gen: {cert.generador.nombre}
                  </p>
                  <p className="text-xs font-bold text-emerald-700">
                    {cert.tonelajeReal} Tons. Procesadas
                  </p>
                </div>
                <button
                  onClick={() => {
                    toast.success("Generando PDF Incorruptible...");
                    generateCertificadoPDF({
                      certificadoId: cert.certificadoId!,
                      generador: cert.generador,
                      transportista: cert.transportista || { nombre: "N/A", patente: "N/A" },
                      gestor: cert.gestor || { nombre: "N/A", planta: "N/A" },
                      tonelaje: cert.tonelajeReal || cert.tonelajeEstimado,
                      fechaEmision: cert.fechaActualizacion,
                    });
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-emerald-100 text-emerald-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-200"
                  title="Descargar PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
