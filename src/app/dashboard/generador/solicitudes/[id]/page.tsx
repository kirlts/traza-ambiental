"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EstadoSolicitud } from "@prisma/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EstadoSolicitudBadge from "@/components/solicitud/EstadoSolicitudBadge";
import FlujoEstadoTrazabilidad from "@/components/trazabilidad/FlujoEstadoTrazabilidad";

interface CambioEstado {
  id: string;
  estadoAnterior: EstadoSolicitud | null;
  estadoNuevo: EstadoSolicitud;
  fecha: string;
  usuario: {
    name: string | null;
    email: string;
  };
}

interface SolicitudCompleta {
  id: string;
  folio: string;
  createdAt: string;
  direccionRetiro: string;
  region: string;
  comuna: string;
  fechaPreferida: string;
  horarioPreferido: string;
  estado: EstadoSolicitud;
  totales: {
    cantidad: number;
    pesoEstimado: number;
  };
  // Mapeo para compatibilidad con UI existente si es necesario,
  // aunque el API devuelve esto dentro de 'totales', a veces la UI espera las props planas
  // Revisando el API, devuelve objetos completos.
  generador: {
    name: string | null;
    email: string;
  };
  transportista?: {
    name: string | null;
    email: string;
  } | null;
  historialEstados: CambioEstado[];

  // Campos adicionales que podrían venir del API o calcularse
  categoriaA_cantidad?: number; // No vienen explícitos en el top level del JSON del API leido, pero podrian estar en la DB
  categoriaB_cantidad?: number;
  categoriaA_pesoEst?: number;
  categoriaB_pesoEst?: number;

  // El API devuelve "totales" con cantidad y pesoEstimado.
  // Pero el modal espera categoriaA_cantidad etc.
  // Revisemos el API de nuevo. El API NO devuelve los desgloses por categoría en el top level del objeto 'data'.
  // Devuelve: id, folio, estado, fechaRecepcionPlanta, createdAt, fechaPreferida, horarioPreferido, direccionRetiro, comuna, region, totales, generador, transportista...
  // Falta info de categorías en el response del API que leí.

  // Espera, el helper 'formatearSolicitudParaResponse' SÍ incluye categoriaA y categoriaB.
  // Pero el route.ts construye el objeto 'data' manualmente:
  /*
      const data = {
      id: solicitud.id,
      ...
      totales: { ... },
      ...
    }
  */
  // Y NO incluye categoriaA / categoriaB en ese objeto manual.
  // Esto podría ser un problema si queremos mostrar el desglose.
  // Asumiré que por ahora mostramos totales, o tendré que actualizar el API.
  // El usuario pidió "implementa la pantalla de detalles". Si falta info en el API, debo arreglarlo o adaptarme.
  // Revisaré el API de nuevo para estar seguro.

  nombreContacto?: string; // No está en el API response manual
  telefonoContacto?: string; // No está en el API response manual
  instrucciones?: string | null; // No está en el API response manual
  fotos?: string[]; // No está en el API response manual
}

export default function SolicitudDetallePage() {
  const params = useParams();
  const _router = useRouter();
  const solicitudId = params.id as string;

  const [solicitud, setSolicitud] = useState<SolicitudCompleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistorial, setShowHistorial] = useState(false);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await fetch(`/api/solicitudes/${solicitudId}`);
        if (!response.ok) {
          throw new Error("Error al cargar la solicitud");
        }
        const result = await response.json();
        setSolicitud(result.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : "Error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    if (solicitudId) {
      fetchSolicitud();
    }
  }, [solicitudId]);

  if (loading) {
    return (
      <DashboardLayout title="Cargando solicitud..." subtitle="Por favor espere">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !solicitud) {
    return (
      <DashboardLayout title="Error" subtitle="No se pudo cargar la solicitud">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitud no encontrada</h2>
          <p className="text-gray-600 mb-6">
            {error || "La solicitud que buscas no existe o no tienes permisos."}
          </p>
          <Link
            href="/dashboard/generador/solicitudes"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a Mis Solicitudes
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Solicitud ${solicitud.folio}`}
      subtitle={`Detalles de la solicitud creada el ${format(new Date(solicitud.createdAt), "d 'de' MMMM, yyyy", { locale: es })}`}
      actions={
        <div className="flex gap-2">
          <Link
            href="/dashboard/generador/solicitudes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </Link>

          {(solicitud.estado === "PENDIENTE" || solicitud.estado === "RECHAZADA") && (
            <Link
              href={`/dashboard/generador/solicitudes/${solicitud.id}/editar`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar Solicitud
            </Link>
          )}
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Estado */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Estado Actual</h2>
            <p className="text-sm text-gray-500">Seguimiento en tiempo real</p>
          </div>
          <EstadoSolicitudBadge estado={solicitud.estado} />
        </div>

        {/* Flujo de Trazabilidad (HU-028) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Trazabilidad del Retiro</h3>
          <FlujoEstadoTrazabilidad estado={solicitud.estado} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del Retiro */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Información del Retiro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dirección de Retiro</p>
                  <p className="font-medium text-gray-900">{solicitud.direccionRetiro}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                  <p className="font-medium text-gray-900">
                    {solicitud.comuna}, {solicitud.region}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha Preferida</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(solicitud.fechaPreferida), "EEEE, d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Horario Preferido</p>
                  <p className="font-medium text-gray-900">
                    {solicitud.horarioPreferido === "manana"
                      ? "Mañana (8:00 - 12:00)"
                      : "Tarde (14:00 - 18:00)"}
                  </p>
                </div>
              </div>
            </section>

            {/* Historial */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowHistorial(!showHistorial)}
              >
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Historial de Cambios
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${showHistorial ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {showHistorial && (
                <div className="mt-6 space-y-6 border-l-2 border-gray-100 ml-2 pl-6 relative">
                  {solicitud.historialEstados?.length > 0 ? (
                    solicitud.historialEstados.map((cambio) => (
                      <div key={cambio.id} className="relative">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-500">
                              {format(new Date(cambio.fecha), "d 'de' MMM, HH:mm", { locale: es })}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {cambio.usuario.name || cambio.usuario.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {cambio.estadoAnterior && (
                              <>
                                <EstadoSolicitudBadge estado={cambio.estadoAnterior} />
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </>
                            )}
                            <EstadoSolicitudBadge estado={cambio.estadoNuevo} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No hay historial disponible.</p>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Resumen de Carga */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Carga</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                    Cantidad Total
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {solicitud.totales.cantidad}
                  </p>
                  <p className="text-xs text-blue-500">Unidades</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-emerald-600 font-medium uppercase tracking-wide">
                    Peso Estimado
                  </p>
                  <p className="text-3xl font-bold text-emerald-900 mt-1">
                    {solicitud.totales.pesoEstimado.toFixed(1)}
                  </p>
                  <p className="text-xs text-emerald-500">Kilogramos</p>
                </div>
              </div>
            </section>

            {/* Transportista Asignado */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Transportista</h3>
              {solicitud.transportista ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {solicitud.transportista.name || "Sin nombre"}
                    </p>
                    <p className="text-sm text-gray-500">{solicitud.transportista.email}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500">Aún no asignado</p>
                </div>
              )}
            </section>

            {/* Contacto */}
            {/* Nota: Si el API no devuelve estos datos, esta sección quedará vacía o con datos por defecto.
                Por ahora lo ocultaré si no hay datos, o mostraré placeholders si es crítico. 
                En el modal sí se mostraba, así que asumiré que debería estar. 
                Si falla, tendré que actualizar el API. */}
            {solicitud.generador && (
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Generador</h3>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {solicitud.generador.name || "Sin nombre"}
                    </p>
                    <p className="text-sm text-gray-500">{solicitud.generador.email}</p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
