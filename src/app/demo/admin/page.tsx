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
  const { solicitudes, resolverDiscrepancia, kpisGlobales } = useDemo();

  // Filter discrepancias
  const discrepancias = solicitudes.filter((s) => s.status === "PESAJE_DISCREPANTE");

  // Calculate progress
  const progressPercentage = Math.min(
    (kpisGlobales.toneladasRecicladas / kpisGlobales.metaAnual) * 100,
    100
  );

  const handleResolver = (id: string, pesoAprobado: number) => {
    resolverDiscrepancia(id, pesoAprobado);
    toast.success("Discrepancia Resuelta", {
      description: `El flujo de la solicitud ha sido reactivado con ${pesoAprobado}t y enviado al Gestor para sellado.`,
      icon: <CheckCircle className="text-emerald-500" />,
    });
  };

  const mockUsers = [
    {
      id: 1,
      name: "Transportes Nacionales",
      type: "Transportista",
      status: "Activo",
      alert: false,
    },
    { id: 2, name: "Planta Reciclaje NFU", type: "Gestor", status: "Vencido", alert: true }, // Permiso sanitario vencido
    { id: 3, name: "Minera Escondida", type: "Generador", status: "Activo", alert: false },
  ];

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
              <p className="text-slate-400 text-sm font-medium mb-1">Discrepancias</p>
              <p
                className={`text-3xl font-bold ${discrepancias.length > 0 ? "text-red-400" : "text-slate-100"}`}
              >
                {discrepancias.length}
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-1">Estado de Servidores</p>
              <p className="text-xl font-bold text-emerald-400 flex items-center gap-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
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
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle
                className={`w-6 h-6 ${discrepancias.length > 0 ? "text-red-500" : "text-slate-400"}`}
              />
              Resolución de Conflictos
            </h2>
            {discrepancias.length > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                {discrepancias.length} Pendientes
              </span>
            )}
          </div>

          {discrepancias.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Sin Conflictos de Pesaje</h3>
              <p className="text-slate-500 text-sm mt-2">
                No hay registros paralizados que requieran intervención administrativa actualmente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discrepancias.map((disc) => {
                const diff = Math.abs((disc.tonelajeReal || 0) - disc.tonelajeEstimado);
                const percent = (diff / disc.tonelajeEstimado) * 100;

                return (
                  <div
                    key={disc.id}
                    className="bg-white border border-red-200 rounded-3xl p-6 shadow-sm ring-4 ring-red-50 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 bg-red-50 text-red-700 font-bold text-sm rounded-bl-3xl border-b border-l border-red-100">
                      Error {percent.toFixed(1)}%
                    </div>

                    <div className="font-mono text-sm font-bold text-slate-900 mb-1">{disc.id}</div>
                    <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
                      Paralizado el{" "}
                      {format(new Date(disc.fechaActualizacion), "dd MMM yyyy", { locale: es })}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6 relative">
                      {/* Generador Declaration */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                          Declarado (Transporte)
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {disc.tonelajeEstimado}t
                        </p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                          {disc.generador.nombre}
                        </p>
                      </div>

                      {/* Romana Declaration */}
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <p className="text-xs font-bold text-red-400 uppercase mb-1">
                          Pesado en Romana
                        </p>
                        <p className="text-2xl font-bold text-red-700">{disc.tonelajeReal}t</p>
                        <p className="text-xs text-red-500/80 mt-2 line-clamp-1">
                          {disc.gestor?.nombre}
                        </p>
                      </div>

                      {/* VS separator */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-black text-slate-300 text-xs shadow-xs z-10">
                        VS
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-sm font-bold text-slate-800 mb-3">
                        Acción Arbitral (Imponer Peso Fidedigno):
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolver(disc.id, disc.tonelajeEstimado)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl text-sm transition-colors"
                        >
                          Usar {disc.tonelajeEstimado}t
                        </button>
                        <button
                          onClick={() => handleResolver(disc.id, disc.tonelajeReal || 0)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-xl text-sm transition-colors"
                        >
                          Usar {disc.tonelajeReal}t
                        </button>
                        <button
                          onClick={() => {
                            const custom = window.prompt(
                              "Ingrese el peso acordado tras auditoría (t):"
                            );
                            if (custom && !isNaN(Number(custom)))
                              handleResolver(disc.id, Number(custom));
                          }}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-xl text-sm transition-colors shadow-sm"
                        >
                          Manual...
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Control de Gremio (Usuarios) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-500" />
              Control del Gremio Operativo
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm text-slate-500">
                Gestión automatizada de credenciales. Si vencen permisos de salud o circulación, el
                sistema revoca accesos inmediatamente.
              </p>
            </div>

            <ul className="divide-y divide-slate-100">
              {mockUsers.map((user) => (
                <li
                  key={user.id}
                  className={`p-5 flex items-center justify-between transition-colors ${user.alert ? "bg-red-50/30" : "hover:bg-slate-50/50"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${user.alert ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}
                    >
                      {user.alert ? <Ban className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs font-medium text-slate-500">{user.type}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {user.alert ? (
                      <div className="flex flex-col items-end">
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Permiso Vencido
                        </span>
                        <button
                          onClick={() => toast("Acción de simulación: Permiso refrendado manual")}
                          className="text-xs text-indigo-600 hover:underline font-medium"
                        >
                          Refrendar
                        </button>
                      </div>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Acreditado
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <button className="text-indigo-600 text-sm font-bold hover:underline">
                Ver Padrón Completo
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
