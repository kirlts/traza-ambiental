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
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { generateCertificadoPDF } from "../generar-pdf";

export default function AuditorDashboard() {
  const { solicitudes } = useDemo();
  const [searchTerm, setSearchTerm] = useState("");

  // Only consider certified/treated requests for auditing logic
  const certificadas = solicitudes.filter(
    (s) => s.status === "CERTIFICADA" || s.status === "TRATADA"
  );

  // Search logic
  const filtered = certificadas.filter(
    (s) =>
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.certificadoId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.generador.rut.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Top Header - Strictly Read Only Look */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Lock className="w-4 h-4" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Entorno Exclusivo de Visualización
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Portal Fiscalización (Auditor)
          </h1>
          <p className="text-slate-500 mt-1">
            Ministerio del Medio Ambiente • Rol Analista (Estatal)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Volver al Hub
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-medium border border-slate-200 shadow-sm cursor-not-allowed">
            <Eye className="w-5 h-5 text-slate-400" />
            Solo Lectura
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div
          className="absolute inset-0 bg-slate-50/50"
          style={{
            backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Validación Pública Integral (Búsqueda Forense)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 border-2 border-slate-200 rounded-2xl bg-white text-slate-900 focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all font-mono text-lg"
                placeholder="Ingrese ID Solicitud, N° Certificado o RUT Generador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              Depósito Histórico Analítico: Corroboración inmediata inalterable.
            </p>
          </div>

          <button className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md">
            <Download className="w-5 h-5" />
            Exportación Masiva Total (CSV)
          </button>
        </div>
      </div>

      {/* Forensic Results Panel */}
      <div className="space-y-6">
        {filtered.length === 0 && searchTerm ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg">
              No se encontraron registros coincidentes en la base de datos inalterable.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg">
              Ingrese un parámetro de búsqueda para examinar una transacción.
            </p>
          </div>
        ) : (
          filtered.map((record) => (
            <div
              key={record.id}
              className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 text-white p-2 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Certificado: {record.certificadoId || "En Proceso Final"}
                    </h3>
                    <p className="text-slate-500 font-mono text-sm">ID Matriz: {record.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Valorizado Legalmente
                  </span>
                  {record.certificadoId && (
                    <button
                      onClick={() => {
                        toast.success("Generando PDF Incorruptible...");
                        generateCertificadoPDF({
                          certificadoId: record.certificadoId!,
                          generador: record.generador,
                          transportista: record.transportista || { nombre: "N/A", patente: "N/A" },
                          gestor: record.gestor || { nombre: "N/A", planta: "N/A" },
                          tonelaje: record.tonelajeReal || record.tonelajeEstimado,
                          fechaEmision: record.fechaActualizacion,
                        });
                      }}
                      className="ml-2 bg-slate-800 hover:bg-slate-900 text-white font-bold p-2 rounded-lg flex items-center justify-center transition-colors"
                      title="Descargar PDF Original"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Forensic Timeline */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                  Trazabilidad Cronológica de la Transacción
                </h4>

                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                  {/* Step 1: Generación */}
                  <div className="relative pl-8">
                    <div className="absolute -left-[17px] w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-600 shadow-xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-900 text-lg">
                          {record.generador.nombre}
                        </span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Origen
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                            RUT Empresa
                          </p>
                          <p className="font-mono text-slate-700">{record.generador.rut}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                            Tonelaje Declarado
                          </p>
                          <p className="font-bold text-slate-800">{record.tonelajeEstimado}t</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                            Timestamp Declaración
                          </p>
                          <p className="font-mono text-xs text-slate-600">
                            {new Date(record.fechaCreacion).toISOString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Logística */}
                  <div className="relative pl-8">
                    <div className="absolute -left-[17px] w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-600 shadow-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-900 text-lg">
                          {record.transportista?.nombre || "N/A"}
                        </span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          Transporte
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        Patente Flota Registrada:{" "}
                        <span className="font-mono font-bold bg-slate-100 px-1 rounded">
                          {record.transportista?.patente}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Recepción y Sellado */}
                  <div className="relative pl-8">
                    <div className="absolute -left-[17px] w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-white shadow-xs">
                      <Factory className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-xs">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-900 text-lg">
                          {record.gestor?.nombre}
                        </span>
                        <span className="text-xs font-bold text-slate-100 bg-slate-800 px-2 py-1 rounded">
                          Disposición Final
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-xl border border-slate-200">
                        <div className="flex-1">
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Dato Soberano de Romana
                          </p>
                          <p className="text-3xl font-black text-slate-900">
                            {record.tonelajeReal}{" "}
                            <span className="text-lg text-slate-500 font-normal">Tons</span>
                          </p>

                          {record.tonelajeReal !== record.tonelajeEstimado && (
                            <p className="text-xs text-slate-500 mt-2">
                              Diferencia de{" "}
                              {Math.abs((record.tonelajeReal || 0) - record.tonelajeEstimado)}t
                              resuelta administrativamente.
                            </p>
                          )}
                        </div>
                        <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                            Sello de Integridad (Ley REP)
                          </p>
                          <p className="font-mono text-[10px] text-slate-400 break-all leading-tight">
                            0x5f8b3c{record.id.replace(/-/g, "").toLowerCase()}a1f99c2b
                          </p>
                          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Validado en RETC/SINADER
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
