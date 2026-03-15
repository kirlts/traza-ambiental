"use client";

import { useDemo } from "../demo-context";
import { toast } from "sonner";
import {
  Truck,
  MapPin,
  ArrowRight,
  Navigation2,
  CheckSquare,
  PackageCheck,
  Building2,
  AlertTriangle,
  Clock,
  Briefcase,
  Factory,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TransportistaDashboard() {
  const { solicitudes, acceptViaje, iniciarTransito, entregarEnPlanta, isTourActive, tourStep } = useDemo();

  // Filter requests relevant to logistics
  const disponibles = solicitudes.filter((s) => s.status === "BUSCANDO_TRANSPORTISTA");
  const misViajesActivos = solicitudes.filter(
    (s) =>
      (s.status === "ASIGNADA" || s.status === "EN_TRANSITO") &&
      s.transportista?.nombre === "Mi Flota (Demo)"
  );

  // Completed today or recently
  const completados = solicitudes.filter(
    (s) =>
      (s.status === "RECIBIDA_EN_PLANTA" ||
        s.status === "PESAJE_DISCREPANTE" ||
        s.status === "TRATADA" ||
        s.status === "CERTIFICADA") &&
      s.transportista?.nombre === "Mi Flota (Demo)"
  );

  const handleAccept = (id: string, ton: number) => {
    acceptViaje(id);
    toast.success("Viaje Aceptado", {
      description: `Has asegurado una carga de ${ton} tons. Dirígete al origen.`,
      icon: <Briefcase className="text-blue-500" />,
    });
  };

  const handleLoad = (id: string) => {
    iniciarTransito(id);
    toast("Conectando con SII...", {
      description:
        "Se ha autogenerado la Guía de Despacho Electrónica #48922. El viaje legal ha comenzado.",
      icon: <Truck className="text-indigo-500" />,
    });
  };

  const handleDeliver = (id: string) => {
    entregarEnPlanta(id);
    toast.success("Entrega Fina Completa", {
      description:
        "Has entregado la carga en puertas. Esperando confirmación de pesaje en Romana por la Planta.",
      icon: <PackageCheck className="text-emerald-500" />,
    });

    if (isTourActive && tourStep === 2) {
      toast.info("¡Acciones completadas!", {
        description: "Avanza al perfil Planta Gestora en el panel del recorrido guiado.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Truck className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Perfil Transportista
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Operador Logístico</h1>
          <p className="text-slate-500 mt-1">Mi Flota (Demo) • Patente: DEMO-01</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Volver al Hub
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-medium border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Disponible para viajes
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Active Trips & Completed */}
        <div className="lg:col-span-7 space-y-8">
          {/* Active Trips Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Navigation2 className="w-6 h-6 text-indigo-500" />
              <h2 className="text-2xl font-bold text-slate-900">En Ejecución</h2>
            </div>

            {misViajesActivos.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">Sin Viajes Activos</h3>
                <p className="text-slate-500 mt-2">
                  Busca cargas disponibles en la Bolsa de la derecha para comenzar un viaje.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {misViajesActivos.map((viaje) => (
                  <div
                    key={viaje.id}
                    className="bg-white border-2 border-indigo-100 shadow-lg shadow-indigo-100/50 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-indigo-200"
                  >
                    <div className="absolute top-0 right-0 p-4 bg-indigo-50 rounded-bl-3xl text-indigo-700 font-bold text-xl">
                      {viaje.tonelajeEstimado} t
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {viaje.status === "ASIGNADA" ? "1. Ir a Cargar" : "2. En Tránsito a Planta"}
                      </span>
                      <span className="text-sm font-medium text-slate-400 font-mono">
                        {viaje.id}
                      </span>
                    </div>

                    <div className="relative pl-6 pb-6 border-l-2 border-dashed border-slate-200 ml-3 space-y-6">
                      {/* Origin */}
                      <div className="relative">
                        <div
                          className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${viaje.status === "EN_TRANSITO" ? "bg-emerald-500" : "bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"}`}
                        ></div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Origen (Generador)
                        </h4>
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-900 text-lg">
                              {viaje.generador.nombre}
                            </p>
                            <p className="text-slate-500 text-sm">{viaje.generador.direccion}</p>
                          </div>
                        </div>
                        {viaje.status === "ASIGNADA" && (
                          <button
                            onClick={() => handleLoad(viaje.id)}
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
                          >
                            <CheckSquare className="w-4 h-4" />
                            Declarar Carga Subida
                          </button>
                        )}
                      </div>

                      {/* Destination */}
                      <div className="relative">
                        <div
                          className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${viaje.status === "EN_TRANSITO" ? "bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]" : "bg-slate-300"}`}
                        ></div>
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Destino (Planta Valorizadora)
                        </h4>
                        <div className="flex items-start gap-3">
                          <Factory className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                          <div>
                            <p
                              className={`font-bold text-lg ${viaje.status === "EN_TRANSITO" ? "text-slate-900" : "text-slate-500"}`}
                            >
                              Centro Valorizador (Demo)
                            </p>
                            <p className="text-slate-500 text-sm">Planta Principal</p>
                          </div>
                        </div>
                        {viaje.status === "EN_TRANSITO" && (
                          <button
                            onClick={() => handleDeliver(viaje.id)}
                            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all shadow-md shadow-emerald-200 flex items-center gap-2 w-full sm:w-auto justify-center"
                          >
                            <PackageCheck className="w-4 h-4" />
                            Entregar en Planta
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* History / Completed Deliveries */}
          {completados.length > 0 && (
            <section className="pt-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                Historial de Entregas Recientes
              </h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Generador</th>
                      <th className="px-6 py-3">Carga Fidedigna</th>
                      <th className="px-6 py-3">Estado Romana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completados.map((comp) => (
                      <tr key={comp.id}>
                        <td className="px-6 py-4 font-mono text-slate-400 text-xs">{comp.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {comp.generador.nombre}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900">
                            {comp.tonelajeReal || comp.tonelajeEstimado} t
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {comp.status === "RECIBIDA_EN_PLANTA" && (
                            <span className="text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded">
                              Esperando Pesaje
                            </span>
                          )}
                          {comp.status === "PESAJE_DISCREPANTE" && (
                            <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Discrepancia
                            </span>
                          )}
                          {(comp.status === "TRATADA" || comp.status === "CERTIFICADA") && (
                            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">
                              Validado OK
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Bolsa de Cargas */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden sticky top-24">
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  Bolsa de Cargas
                </h2>
                <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded-md">
                  {disponibles.length} Disponibles
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Subastas de retiros pendientes en el territorio nacional.
              </p>
            </div>

            <div className="p-4 bg-slate-50 h-[600px] overflow-y-auto space-y-4">
              {disponibles.length === 0 ? (
                <div className="text-center py-12 px-4 text-slate-500">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p>
                    No hay cargas disponibles en este momento. Esperando que un Generador publique
                    una solicitud.
                  </p>
                </div>
              ) : (
                disponibles.map((viaje) => (
                  <div
                    key={viaje.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-mono text-xs text-slate-400">{viaje.id}</div>
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Publicado{" "}
                        {format(new Date(viaje.fechaCreacion), "dd MMM HH:mm", { locale: es })}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg mb-1">
                      {viaje.generador.nombre}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {viaje.generador.direccion}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                          Volumen Estimado
                        </p>
                        <p className="text-xl font-bold text-orange-600">
                          {viaje.tonelajeEstimado} t
                        </p>
                      </div>
                      <button
                        onClick={() => handleAccept(viaje.id, viaje.tonelajeEstimado)}
                        className="bg-slate-900 text-white hover:bg-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-1.5 group-hover:scale-105 active:scale-95"
                      >
                        Aceptar Viaje
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
