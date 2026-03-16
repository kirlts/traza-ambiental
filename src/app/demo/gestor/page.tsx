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
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { generateCertificadoPDF } from "../generar-pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const isTourTarget = isTourActive && tourStep === 3;
  const isTargetPesaje = isTourTarget && porRecibir.length > 0;
  const isTargetCertificar = isTourTarget && enProceso.some(v => v.status === "TRATADA");

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
      toast.error("Discrepancia de Pesaje", {
        description: `Diferencia del ${diffPercent.toFixed(1)}%. El proceso requiere resolución administrativa.`,
        icon: <AlertTriangle className="text-red-500" />,
        duration: 5000,
      });
    } else {
      toast.success("Pesaje Registrado", {
        description: `Carga validada con ${pesoNum} toneladas. Lista para tratamiento.`,
        icon: <Scale className="text-emerald-500" />,
      });
    }

    setSelectedId(null);
    setPesoRomana("");
  };

  const handleEmitirCertificado = (id: string) => {
    emitirCertificado(id);
    toast.success("Certificado Emitido", {
      description:
        "Se ha emitido el Certificado de Valorización y reportado a Ventanilla Única SINADER.",
      icon: <ShieldCheck className="text-emerald-500" />,
    });

    if (isTourTarget) {
      markTourStepCompleted();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Explicación del Perfil */}
      <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 flex gap-3">
        <Info className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
        <div className="text-sm">
          <strong>Perfil Centro de Valorización:</strong> Este módulo es utilizado por las plantas encargadas del tratamiento y reciclaje de NFU.
          Aquí se reciben los camiones, se registra el pesaje oficial en romana para validar el volumen real de la carga y, finalmente,
          se emiten los certificados legales que acreditan el tratamiento del residuo.
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Recycle className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Módulo Centro de Valorización
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control: Recepción y Tratamiento</h1>
          <p className="text-gray-500 mt-1">Planta Principal • Operaciones de Pesaje y Certificación</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mr-2"
          >
            Volver al Simulador
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-md font-medium shadow-sm" title="Indicador de que el sistema está en línea y operando">
            <Settings className="w-4 h-4 animate-spin-slow" style={{ animationDuration: "10s" }} />
            Operaciones Activas
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Recepción en Puertas (Pesaje Romana) */}
        <Card className="border border-gray-200 shadow-sm flex flex-col">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100 pb-4 pt-5 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Recepción en Puertas</CardTitle>
                  <p className="text-emerald-700 text-xs font-medium">
                    Validación de Pesaje (Romana)
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-emerald-200 text-emerald-800 font-bold border-emerald-300">
                {porRecibir.length} Pendientes
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 flex-1 bg-white">
            {porRecibir.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-500 flex flex-col justify-center h-full">
                <Building className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-base font-medium text-gray-900">No hay recepciones pendientes.</p>
                <p className="text-sm mt-1">
                  Las cargas aparecerán aquí una vez el transportista registre la entrega.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {porRecibir.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`border rounded-xl p-5 transition-all ${selectedId === viaje.id ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100" : "border-gray-200 hover:border-emerald-300 bg-white"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {viaje.id}
                          </span>
                          <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600 border-gray-200">
                            {viaje.transportista?.patente || "Sin Patente"}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5" title="Empresa origen de la carga">
                          Generador:{" "}
                          <span className="font-semibold text-gray-900">{viaje.generador.nombre}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                          Volumen Declarado
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {viaje.tonelajeEstimado} <span className="text-sm text-gray-500 font-normal">t</span>
                        </p>
                      </div>
                    </div>

                    {selectedId === viaje.id ? (
                      <form
                        onSubmit={(e) => handlePesaje(e, viaje.id, viaje.tonelajeEstimado)}
                        className="mt-5 pt-5 border-t border-emerald-100 animate-in slide-in-from-top-2"
                      >
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                          Ingresar Peso de Romana (t)
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
                              className={`w-full text-base bg-white border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-900 ${
                                isTargetPesaje ? "ring-2 ring-emerald-500 animate-pulse border-emerald-500" : ""
                              }`}
                              placeholder="Ej: 46.2"
                              autoFocus
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 font-medium">
                              t
                            </div>
                          </div>
                          <Button
                            type="submit"
                            className={`bg-emerald-600 hover:bg-emerald-700 text-white gap-2 ${
                                isTargetPesaje ? "ring-2 ring-emerald-500 animate-pulse" : ""
                            }`}
                            title="Confirme el peso real medido en romana para compararlo con el declarado"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Validar
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          Diferencias mayores al 5% requerirán resolución administrativa.
                        </p>
                      </form>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setSelectedId(viaje.id)}
                        className={`w-full mt-2 flex items-center justify-center gap-2 group ${
                          isTargetPesaje ? "ring-2 ring-emerald-500 animate-pulse border-emerald-500 text-emerald-700 bg-emerald-50" : "text-gray-700"
                        }`}
                        title="Inicie el proceso de validación del peso de esta carga"
                      >
                        Registrar Pesaje en Romana
                        <ArrowRightCircle className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Conversión y Sellado */}
        <Card className="border border-gray-200 shadow-sm flex flex-col">
          <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4 pt-5 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 text-gray-700 rounded-lg">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">Emisión de Certificados</CardTitle>
                  <p className="text-gray-500 text-xs font-medium">
                    Procesamiento y Sellado de Tratamiento
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 flex-1 bg-white">
            {enProceso.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-500 h-full flex flex-col justify-center">
                <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-base font-medium text-gray-900">No hay cargas listas para certificación.</p>
                <p className="text-sm mt-1">
                  Debe validar el peso de las cargas entrantes primero.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {enProceso.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`bg-white rounded-xl p-5 border shadow-sm ${viaje.status === "PESAJE_DISCREPANTE" ? "border-red-200 ring-1 ring-red-100 bg-red-50/10" : "border-gray-200 hover:border-emerald-300"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <FileText
                          className={`w-4 h-4 ${viaje.status === "PESAJE_DISCREPANTE" ? "text-red-500" : "text-emerald-600"}`}
                        />
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {viaje.id}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {format(new Date(viaje.fechaActualizacion), "dd MMM HH:mm", { locale: es })}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">
                          Generador Origen
                        </p>
                        <p className="font-medium text-sm text-gray-900">{viaje.generador.nombre}</p>
                      </div>
                      <div className="text-right" title="Volumen final validado en romana">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase">
                          Volumen Validado
                        </p>
                        <p className="font-bold text-base text-gray-900">
                          {viaje.tonelajeReal} <span className="text-xs text-gray-500 font-normal">t</span>
                        </p>
                      </div>
                    </div>

                    {viaje.status === "PESAJE_DISCREPANTE" ? (
                      <div className="bg-red-50 text-red-800 p-3 rounded-md border border-red-100 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                        <div>
                          <p className="font-semibold text-sm mb-0.5 text-red-900">Discrepancia en Revisión</p>
                          <p className="text-xs text-red-700 leading-relaxed">
                            Proceso en pausa. El peso registrado en romana ({viaje.tonelajeReal}t) presenta una diferencia significativa con la declaración inicial ({viaje.tonelajeEstimado}t). Pendiente de resolución por Administración.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleEmitirCertificado(viaje.id)}
                        className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm ${
                            isTargetCertificar ? "ring-2 ring-emerald-500 animate-pulse border-emerald-500" : ""
                        }`}
                        title="Emita el certificado legal que acredita el tratamiento final de este volumen"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Emitir Certificado de Valorización
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historico de certificaciones */}
      {tratadas.length > 0 && (
        <Card className="mt-8 border border-gray-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Historial de Certificados Emitidos
              </CardTitle>
              <Badge variant="secondary" className="text-gray-600 bg-gray-100">
                {tratadas.length} emitidos
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tratadas.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-gray-200 bg-white hover:border-emerald-200 rounded-xl p-4 flex gap-3 items-center relative group transition-colors shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-gray-900 truncate" title="Número de certificado">{cert.certificadoId}</p>
                    <p className="text-xs text-gray-500 truncate mb-0.5">
                      {cert.generador.nombre}
                    </p>
                    <p className="text-xs font-medium text-emerald-700">
                      {cert.tonelajeReal} t. Tratadas
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      toast.info("Generando Documento...", {
                         description: `Preparando descarga de Certificado ${cert.certificadoId}`
                      });
                      generateCertificadoPDF({
                        certificadoId: cert.certificadoId!,
                        generador: cert.generador,
                        transportista: cert.transportista || { nombre: "N/A", patente: "N/A" },
                        gestor: cert.gestor || { nombre: "N/A", planta: "N/A" },
                        tonelaje: cert.tonelajeReal || cert.tonelajeEstimado,
                        fechaEmision: cert.fechaActualizacion,
                      });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Descargar PDF del Certificado"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
