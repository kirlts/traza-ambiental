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
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TransportistaDashboard() {
  const { solicitudes, acceptViaje, iniciarTransito, entregarEnPlanta, isTourActive, tourStep, markTourStepCompleted } = useDemo();

  const disponibles = solicitudes.filter((s) => s.status === "BUSCANDO_TRANSPORTISTA");
  const misViajesActivos = solicitudes.filter(
    (s) =>
      (s.status === "ASIGNADA" || s.status === "EN_TRANSITO") &&
      s.transportista?.nombre === "Mi Flota (Demo)"
  );

  const completados = solicitudes.filter(
    (s) =>
      (s.status === "RECIBIDA_EN_PLANTA" ||
        s.status === "PESAJE_DISCREPANTE" ||
        s.status === "TRATADA" ||
        s.status === "CERTIFICADA") &&
      s.transportista?.nombre === "Mi Flota (Demo)"
  );

  const isTourTarget = isTourActive && tourStep === 2;
  const isTargetLoad = isTourTarget && misViajesActivos.some(v => v.status === "ASIGNADA");
  const isTargetDeliver = isTourTarget && misViajesActivos.some(v => v.status === "EN_TRANSITO");
  // Accept target applies if there are no active trips in tour mode.
  const isTargetAccept = isTourTarget && misViajesActivos.length === 0;

  const handleAccept = (id: string, ton: number) => {
    acceptViaje(id);
    toast.success("Viaje Aceptado", {
      description: `Se ha asignado una carga de ${ton} toneladas a su flota. Diríjase al origen.`,
      icon: <Briefcase className="text-blue-500" />,
    });
  };

  const handleLoad = (id: string) => {
    iniciarTransito(id);
    toast.info("Transito Iniciado", {
      description:
        "Se ha registrado el inicio del traslado de la carga hacia el Centro de Valorización.",
      icon: <Truck className="text-emerald-500" />,
    });
  };

  const handleDeliver = (id: string) => {
    entregarEnPlanta(id);
    toast.success("Entrega Registrada", {
      description:
        "Carga entregada en instalaciones. Pendiente de validación de pesaje en romana.",
      icon: <PackageCheck className="text-emerald-500" />,
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
          <strong>Perfil Transportista:</strong> Este módulo es para los operadores logísticos encargados del traslado físico de los NFU.
          Permite buscar cargas disponibles ("Bolsa de Cargas"), aceptar viajes, declarar el momento de carga en la instalación del Generador
          y registrar la entrega final en el Centro de Valorización.
        </div>
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Truck className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">
              Módulo Transportista
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control: Logística</h1>
          <p className="text-gray-500 mt-1">Mi Flota (Demo) • Patente: DEMO-01</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors mr-2"
          >
            Volver al Simulador
          </Link>
          <div className="inline-flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md font-medium border border-emerald-100 shadow-sm" title="El sistema monitorea en tiempo real la disponibilidad de la flota">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Disponible para viajes
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Active Trips & Completed */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Trips Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Navigation2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Rutas en Ejecución</h2>
            </div>

            {misViajesActivos.length === 0 ? (
              <Card className="border border-gray-200 shadow-sm text-center">
                <CardContent className="p-10 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Sin Rutas Activas</h3>
                  <p className="text-gray-500 mt-1 text-sm">
                    Acepte una carga desde la "Bolsa de Cargas" para comenzar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {misViajesActivos.map((viaje) => (
                  <Card key={viaje.id} className="border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-gray-50 rounded-bl-lg text-gray-700 font-bold border-b border-l border-gray-200">
                      {viaje.tonelajeEstimado} t
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wide">
                          {viaje.status === "ASIGNADA" ? "1. Ir a Cargar" : "2. En Tránsito a Planta"}
                        </Badge>
                        <span className="text-sm font-medium text-gray-500 font-mono">
                          {viaje.id}
                        </span>
                      </div>

                      <div className="relative pl-6 pb-2 border-l-2 border-dashed border-gray-200 ml-3 space-y-6">
                        {/* Origin */}
                        <div className="relative">
                          <div
                            className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white ${viaje.status === "EN_TRANSITO" ? "bg-emerald-500" : "bg-emerald-600 ring-2 ring-emerald-200"}`}
                          ></div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Origen (Generador)
                          </h4>
                          <div className="flex items-start gap-3">
                            <Building2 className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {viaje.generador.nombre}
                              </p>
                              <p className="text-gray-500 text-sm">{viaje.generador.direccion}</p>
                            </div>
                          </div>
                          {viaje.status === "ASIGNADA" && (
                            <Button
                              onClick={() => handleLoad(viaje.id)}
                              className={`mt-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2 ${
                                isTargetLoad ? "ring-2 ring-emerald-500 animate-pulse" : ""
                              }`}
                              title="Confirme que el material ya ha sido cargado en el vehículo"
                            >
                              <CheckSquare className="w-4 h-4" />
                              Registrar Carga en Vehículo
                            </Button>
                          )}
                        </div>

                        {/* Destination */}
                        <div className="relative pt-2">
                          <div
                            className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white ${viaje.status === "EN_TRANSITO" ? "bg-emerald-600 ring-2 ring-emerald-200" : "bg-gray-300"}`}
                          ></div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Destino (Centro de Valorización)
                          </h4>
                          <div className="flex items-start gap-3">
                            <Factory className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p
                                className={`font-semibold ${viaje.status === "EN_TRANSITO" ? "text-gray-900" : "text-gray-500"}`}
                              >
                                Centro Valorizador (Demo)
                              </p>
                              <p className="text-gray-500 text-sm">Planta Principal</p>
                            </div>
                          </div>
                          {viaje.status === "EN_TRANSITO" && (
                            <Button
                              onClick={() => handleDeliver(viaje.id)}
                              className={`mt-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2 ${
                                isTargetDeliver ? "ring-2 ring-emerald-500 animate-pulse" : ""
                              }`}
                              title="Confirme que ha entregado el material en la planta de destino"
                            >
                              <PackageCheck className="w-4 h-4" />
                              Registrar Entrega en Planta
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* History / Completed Deliveries */}
          {completados.length > 0 && (
            <section className="pt-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-gray-700" />
                Historial de Entregas Recientes
              </h3>
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                    <tr>
                      <th className="px-6 py-3">ID Viaje</th>
                      <th className="px-6 py-3">Generador Origen</th>
                      <th className="px-6 py-3">Volumen Transportado</th>
                      <th className="px-6 py-3">Validación en Romana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {completados.map((comp) => (
                      <tr key={comp.id}>
                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">{comp.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {comp.generador.nombre}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {comp.tonelajeReal || comp.tonelajeEstimado} t
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {comp.status === "RECIBIDA_EN_PLANTA" && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pendiente Pesaje
                            </Badge>
                          )}
                          {comp.status === "PESAJE_DISCREPANTE" && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1 w-max">
                              <AlertTriangle className="w-3 h-3" /> Discrepancia
                            </Badge>
                          )}
                          {(comp.status === "TRATADA" || comp.status === "CERTIFICADA") && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Pesaje Validado
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </section>
          )}
        </div>

        {/* Right Column: Bolsa de Cargas */}
        <div className="lg:col-span-5">
          <Card className="border border-gray-200 shadow-sm sticky top-24 overflow-hidden">
            <div className="bg-gray-50 p-5 border-b border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Bolsa de Cargas
                </h2>
                <Badge variant="secondary" className="bg-white text-gray-700 font-semibold border-gray-200">
                  {disponibles.length} Disponibles
                </Badge>
              </div>
              <p className="text-gray-500 text-sm">
                Solicitudes de retiro publicadas y pendientes de asignación.
              </p>
            </div>

            <div className="p-4 bg-white h-[500px] overflow-y-auto space-y-4">
              {disponibles.length === 0 ? (
                <div className="text-center py-12 px-4 text-gray-500">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p>
                    No hay solicitudes de retiro disponibles en este momento.
                  </p>
                </div>
              ) : (
                disponibles.map((viaje) => (
                  <Card
                    key={viaje.id}
                    className="border border-gray-200 shadow-xs hover:border-emerald-300 transition-colors group"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-mono text-xs text-gray-500">{viaje.id}</div>
                        <div className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Publicado{" "}
                          {format(new Date(viaje.fechaCreacion), "dd MMM HH:mm", { locale: es })}
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 text-base mb-1">
                        {viaje.generador.nombre}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-1 flex items-center gap-1.5" title="Ubicación donde debe realizarse el retiro de la carga">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {viaje.generador.direccion}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                            Volumen Est.
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {viaje.tonelajeEstimado} t
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAccept(viaje.id, viaje.tonelajeEstimado)}
                          className={`bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-1.5 ${
                            isTargetAccept ? "ring-2 ring-emerald-500 animate-pulse" : ""
                          }`}
                          title="Asigne esta solicitud de carga a su flota para iniciar el transporte"
                        >
                          Aceptar Viaje
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
