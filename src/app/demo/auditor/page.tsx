"use client";

import { useDemo } from "../demo-context";
import { useState } from "react";
import {
  Search,
  Lock,
  Eye,
  FileText,
  History,
  CheckCircle2,
  Download,
  Building2,
  Truck,
  Factory,
  Database,
  Info,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { generateCertificadoPDF } from "../generar-pdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AuditorDashboard() {
  const { solicitudes, isTourActive, tourStep, markTourStepCompleted } = useDemo();
  const [searchTerm, setSearchTerm] = useState("");

  const certificadas = solicitudes.filter(
    (s) => s.status === "CERTIFICADA" || s.status === "TRATADA"
  );

  const filtered = certificadas.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.certificadoId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.generador.rut.includes(searchTerm)
  );

  const isTourTarget = isTourActive && tourStep === 4;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Explicación del Perfil */}
      <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 flex gap-3">
        <Info className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
        <div className="text-sm">
          <strong>Perfil Fiscalización (Auditor):</strong> Este módulo representa el acceso de solo lectura para entidades reguladoras (ej. Ministerio del Medio Ambiente).
          Permite rastrear la trazabilidad completa de cada residuo procesado, desde su declaración inicial hasta la emisión de su certificado de valorización,
          asegurando la transparencia y el cumplimiento normativo.
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Lock className="w-4 h-4" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Entorno de Visualización
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Portal Fiscalización (Auditor)
          </h1>
          <p className="text-gray-500 mt-1">
            Revisión de Cumplimiento Ley REP • Acceso Analista
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mr-2"
          >
            Volver al Simulador
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-md font-medium border border-gray-200 shadow-sm" title="El rol de auditor no tiene permisos de modificación sobre los registros">
            <Eye className="w-4 h-4 text-gray-400" />
            Solo Lectura
          </div>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm mb-8 overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Búsqueda de Trazabilidad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono text-base"
                  placeholder="Ingrese ID de Solicitud, N° de Certificado o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                Consulta al registro histórico consolidado de la plataforma.
              </p>
            </div>

            <Button className="w-full md:w-auto bg-gray-800 hover:bg-gray-900 text-white gap-2 shadow-sm" title="Descargue el listado completo de transacciones en formato de hoja de cálculo">
              <Download className="w-4 h-4" />
              Exportar Registros (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forensic Results Panel */}
      <div className="space-y-6">
        {filtered.length === 0 && searchTerm ? (
          <Card className="border border-gray-200 shadow-sm text-center py-12 px-4">
            <Search className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-500">
              No se encontraron registros coincidentes.
            </p>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="border border-gray-200 shadow-sm text-center py-12 px-4">
            <History className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-base font-medium text-gray-500">
              Ingrese un parámetro de búsqueda para visualizar una transacción.
            </p>
          </Card>
        ) : (
          filtered.map((record) => (
            <Card
              key={record.id}
              className="border border-gray-200 overflow-hidden shadow-sm"
            >
              <CardHeader className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 text-white p-2 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="font-bold text-gray-900 text-base">
                      Certificado: {record.certificadoId || "En Proceso"}
                    </CardTitle>
                    <p className="text-gray-500 font-mono text-xs">ID Solicitud: {record.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Valorización Validada
                  </Badge>
                  {record.certificadoId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.success("Preparando Documento...", {
                          description: "Generando PDF del certificado."
                        });
                        generateCertificadoPDF({
                          certificadoId: record.certificadoId!,
                          generador: record.generador,
                          transportista: record.transportista || { nombre: "N/A", patente: "N/A" },
                          gestor: record.gestor || { nombre: "N/A", planta: "N/A" },
                          tonelaje: record.tonelajeReal || record.tonelajeEstimado,
                          fechaEmision: record.fechaActualizacion,
                        });

                        if (isTourTarget) {
                          markTourStepCompleted();
                        }
                      }}
                      className={`ml-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 ${
                        isTourTarget ? "ring-2 ring-emerald-500 animate-pulse border-emerald-500 bg-emerald-50 text-emerald-700" : ""
                      }`}
                      title="Descargar copia oficial del Certificado de Valorización"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Descargar
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">
                  Trazabilidad de la Operación
                </h4>

                <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-2">
                  {/* Step 1: Generación */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[21px] w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900 text-base">
                          {record.generador.nombre}
                        </span>
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-[10px]">
                          Origen
                        </Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">
                            RUT
                          </p>
                          <p className="font-mono text-sm text-gray-700">{record.generador.rut}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5" title="Volumen registrado inicialmente en la plataforma">
                            Volumen Declarado
                          </p>
                          <p className="font-semibold text-sm text-gray-800">{record.tonelajeEstimado}t</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">
                            Fecha de Declaración
                          </p>
                          <p className="font-mono text-xs text-gray-600">
                            {format(new Date(record.fechaCreacion), "dd MMM yyyy, HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Logística */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[21px] w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900 text-base">
                          {record.transportista?.nombre || "N/A"}
                        </span>
                        <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-[10px]">
                          Logística
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Patente Vehículo:{" "}
                        <span className="font-mono font-semibold bg-gray-200 px-1.5 py-0.5 rounded text-xs">
                          {record.transportista?.patente}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Recepción y Sellado */}
                  <div className="relative pl-6">
                    <div className="absolute -left-[21px] w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-white shadow-sm">
                      <Factory className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-semibold text-gray-900 text-base">
                          {record.gestor?.nombre}
                        </span>
                        <Badge variant="default" className="bg-gray-800 text-white text-[10px]">
                          Tratamiento
                        </Badge>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 p-3 bg-gray-50 rounded-md border border-gray-100 mt-2">
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1 flex items-center gap-1" title="Peso oficial verificado al ingresar a la planta">
                            <Lock className="w-3 h-3" />
                            Peso Validado (Romana)
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {record.tonelajeReal}{" "}
                            <span className="text-sm text-gray-500 font-normal">t</span>
                          </p>
                        </div>
                        <div className="flex-1 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4">
                          <p className="text-[10px] text-gray-500 uppercase font-semibold mb-1" title="Identificador único para auditoría en sistemas gubernamentales">
                            Sello de Trazabilidad
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 break-all leading-tight">
                            {record.id.replace(/-/g, "").toLowerCase()}-{new Date(record.fechaActualizacion).getTime().toString(16)}
                          </p>
                          <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Reportado a SINADER
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
