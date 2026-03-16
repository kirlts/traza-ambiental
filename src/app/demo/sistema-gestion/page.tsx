"use client";

import { useDemo } from "../demo-context";
import {
  Building2,
  TrendingUp,
  Activity,
  BarChart4,
  CheckCircle2,
  Users,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SistemaGestionDashboard() {
  const { kpisGlobales, solicitudes, isTourActive, tourStep, markTourStepCompleted } = useDemo();

  useEffect(() => {
    if (isTourActive && tourStep === 5) {
      markTourStepCompleted();
    }
  }, [isTourActive, tourStep, markTourStepCompleted]);

  const totalSocios = 145; // Ficticio
  const empresasActivas = 89;

  // Calculamos cuantas toneladas llevan certificadas vs la meta del GRUPO
  const progressGlobal = Math.min(
    (kpisGlobales.toneladasRecicladas / kpisGlobales.metaAnual) * 100,
    100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      {/* Explicación del Perfil */}
      <div className="mb-6 p-4 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100 flex gap-3">
        <Info className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
        <div className="text-sm">
          <strong>Perfil Sistema de Gestión (SIG):</strong> Este módulo consolida la información de múltiples empresas generadoras asociadas.
          Permite a la entidad administradora del SIG monitorear el cumplimiento de la cuota nacional de reciclaje exigida por la Ley REP,
          evaluar el impacto ambiental colectivo (emisiones evitadas) y gestionar datos administrativos como tarifas y presupuestos de licitaciones.
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Building2 className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Módulo Sistema de Gestión (SIG)
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Consolidado Nacional</h1>
          <p className="text-gray-500 mt-1">Monitoreo de Metas Ley REP y Red de Asociados</p>
        </div>

        <Link
          href="/demo"
          className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mr-2"
        >
          Volver al Simulador
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI 1: Progreso Nacional */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500" title="Volumen total procesado por todos los generadores asociados frente a la cuota exigida por el regulador">Cumplimiento Meta Anual (Red SIG)</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">
                  {kpisGlobales.toneladasRecicladas.toLocaleString(undefined, {
                    maximumFractionDigits: 1,
                  })}
                  <span className="text-xl text-gray-400 font-normal ml-1">
                    / {kpisGlobales.metaAnual.toLocaleString()} t
                  </span>
                </h3>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 mt-6 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressGlobal}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-4 font-medium flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-xs">
                <CheckCircle2 className="w-3 h-3" />
              </span>
              {progressGlobal.toFixed(1)}% de la cuota nacional cubierta.
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Huella Carbono Global */}
        <Card className="bg-gray-900 text-white border border-gray-800 shadow-sm relative overflow-hidden">
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400" title="Cálculo agregado de las emisiones de carbono evitadas gracias a la valorización de NFU de toda la red">Reporte ESG Colectivo</p>
                <h3 className="text-3xl font-bold mt-2">
                  {kpisGlobales.co2Evitado.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </h3>
              </div>
              <div className="p-3 bg-gray-800 text-emerald-400 rounded-lg">
                <span className="text-xl">🌿</span>
              </div>
            </div>
            <p className="text-sm text-emerald-400 mt-8 font-medium">
              tCO₂e Emisiones Evitadas
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Empresas Asociadas */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500" title="Número total de empresas generadoras inscritas bajo el alero de este Sistema de Gestión">Generadores Adheridos</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalSocios}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-8 font-medium">
              <span className="text-emerald-600">{empresasActivas} activos</span> este mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Operativa Reciente - Vista Consolidada */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4 pt-5 px-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg font-bold text-gray-900">
                Operaciones Recientes (Red Nacional)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Generador Asociado</th>
                  <th className="px-6 py-4 font-semibold">Volumen</th>
                  <th className="px-6 py-4 font-semibold">Estado Trazabilidad</th>
                  <th className="px-6 py-4 font-semibold">Certificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {solicitudes.slice(0, 5).map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {solicitud.generador.nombre}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {solicitud.tonelajeReal || solicitud.tonelajeEstimado} t
                    </td>
                    <td className="px-6 py-4">
                      {solicitud.status === "CERTIFICADA" ? (
                        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Completado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 gap-1">
                          <Activity className="w-3 h-3" />
                          En Progreso
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {solicitud.certificadoId ? (
                        <span className="font-mono text-xs text-gray-500">
                          {solicitud.certificadoId}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Resumen Comercial/Financiero */}
        <Card className="bg-gray-50 border border-gray-200 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-4 pt-5 px-6">
             <CardTitle className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <BarChart4 className="w-5 h-5 text-gray-500" />
              Gestión Administrativa
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1" title="Costo medio de transporte y valorización pagado por el sistema">
                  Tarifa Promedio Logística
                </p>
                <p className="text-2xl font-bold text-gray-900">$45.000 <span className="text-sm font-normal text-gray-500">/ ton</span></p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1" title="Presupuesto total asignado a proveedores logísticos y de valorización">
                  Presupuesto Ejecutado
                </p>
                <p className="text-2xl font-bold text-gray-900">$125.4M <span className="text-sm font-normal text-gray-500">CLP</span></p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
                 <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3" title="Proveedores de tratamiento con mayor volumen adjudicado">
                  Centros de Valorización Adjudicados
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Valoriza Chile</span>
                    <Badge variant="secondary" className="font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">65% Cuota</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">Planta Norte NFU</span>
                    <Badge variant="secondary" className="font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">35% Cuota</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
