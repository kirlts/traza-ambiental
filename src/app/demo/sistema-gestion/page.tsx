"use client";

import { useDemo } from "../demo-context";
import {
  Building2,
  TrendingUp,
  Activity,
  BarChart4,
  CheckCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function SistemaGestionDashboard() {
  const { kpisGlobales, solicitudes } = useDemo();

  const totalSocios = 145; // Ficticio
  const empresasActivas = 89;

  // Calculamos cuantas toneladas llevan certificadas vs la meta del GRUPO
  const progressGlobal = Math.min(
    (kpisGlobales.toneladasRecicladas / kpisGlobales.metaAnual) * 100,
    100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Building2 className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Sistema de Gestión / SIG
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Corporativo</h1>
          <p className="text-slate-500 mt-1">Consolidado Nacional Ley REP (Generadores Asociados)</p>
        </div>

        <Link
          href="/demo"
          className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Volver al Hub
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI 1: Progreso Nacional */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Cumplimiento Meta Anual (Socios)</p>
              <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">
                {kpisGlobales.toneladasRecicladas.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
                <span className="text-xl text-slate-400 font-normal">
                  {" "}
                  / {kpisGlobales.metaAnual.toLocaleString()} t
                </span>
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 mt-6 overflow-hidden">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressGlobal}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-600 mt-3 font-medium flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs">
              <CheckCircle2 className="w-3 h-3" />
            </span>
            {progressGlobal.toFixed(1)}% de la cuota nacional cubierta.
          </p>
        </div>

        {/* KPI 2: Huella Carbono Global */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Impacto ESG Colectivo</p>
              <h3 className="text-3xl font-bold mt-1">
                {kpisGlobales.co2Evitado.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </h3>
            </div>
            <div className="p-3 bg-slate-800 text-emerald-400 rounded-xl">
              <span className="text-xl">🌿</span>
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-6 font-medium relative z-10">
            tCO₂e Emisiones Evitadas
          </p>
        </div>

        {/* KPI 3: Empresas Asociadas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Generadores Adheridos</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalSocios}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-6 font-medium">
            <span className="text-emerald-600">{empresasActivas} activos</span> este mes
          </p>
        </div>
      </div>

      {/* Operativa Reciente - Vista Consolidada */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Operaciones Recientes (Red Nacional)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Generador (Socio)</th>
                  <th className="px-6 py-4 font-semibold">Carga</th>
                  <th className="px-6 py-4 font-semibold">Estado Trazabilidad</th>
                  <th className="px-6 py-4 font-semibold">Certificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitudes.slice(0, 5).map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {solicitud.generador.nombre}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {solicitud.tonelajeReal || solicitud.tonelajeEstimado} t
                    </td>
                    <td className="px-6 py-4">
                      {solicitud.status === "CERTIFICADA" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-1 rounded-md text-xs font-bold">
                          <Activity className="w-3 h-3" />
                          En Progreso
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {solicitud.certificadoId ? (
                        <span className="font-mono text-xs text-slate-500">
                          {solicitud.certificadoId}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen Comercial/Financiero */}
        <div className="bg-indigo-900 rounded-2xl shadow-xl text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-indigo-400" />
            Licitaciones y Tarifas
          </h3>

          <div className="space-y-4">
            <div className="bg-indigo-800/50 rounded-xl p-4 border border-indigo-700">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide mb-1">
                Tarifa Promedio Logística
              </p>
              <p className="text-2xl font-bold">$45.000 <span className="text-sm font-normal text-indigo-300">/ ton</span></p>
            </div>

            <div className="bg-indigo-800/50 rounded-xl p-4 border border-indigo-700">
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide mb-1">
                Presupuesto Ejecutado
              </p>
              <p className="text-2xl font-bold">$125.4M <span className="text-sm font-normal text-indigo-300">CLP</span></p>
            </div>

            <div className="bg-indigo-800/50 rounded-xl p-4 border border-indigo-700">
               <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide mb-2">
                Gestores Licitados (Top 2)
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valoriza Chile</span>
                  <span className="font-bold text-emerald-400">65% Cuota</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Planta Norte NFU</span>
                  <span className="font-bold text-emerald-400">35% Cuota</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
