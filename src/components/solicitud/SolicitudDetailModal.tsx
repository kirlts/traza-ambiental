"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EstadoSolicitud } from "@prisma/client";
import EstadoSolicitudBadge from "./EstadoSolicitudBadge";
import { useEffect, useState } from "react";

interface SolicitudCompleta {
  id: string;
  folio: string;
  createdAt: Date;
  direccionRetiro: string;
  region: string;
  comuna: string;
  fechaPreferida: Date;
  horarioPreferido: string;
  estado: EstadoSolicitud;
  cantidadTotal: number;
  pesoTotalEstimado: number;
  categoriaA_cantidad: number;
  categoriaA_pesoEst: number;
  categoriaB_cantidad: number;
  categoriaB_pesoEst: number;
  nombreContacto: string;
  telefonoContacto: string;
  instrucciones?: string;
  fotos: string[];
  transportista?: {
    name: string;
    email: string;
  };
  generador: {
    name: string;
    email: string;
  };
}

interface SolicitudDetailModalProps {
  solicitudId: string;
  onClose: () => void;
}

/**
 * Modal para mostrar el detalle completo de una solicitud
 * HU-004: Seguimiento de Solicitudes de Retiro
 */
export default function SolicitudDetailModal({ solicitudId, onClose }: SolicitudDetailModalProps) {
  const [solicitud, setSolicitud] = useState<SolicitudCompleta | null>(null);
  const [historial, setHistorial] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistorial, setShowHistorial] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar detalles de la solicitud
        const response = await fetch(`/api/solicitudes/${solicitudId}`);
        const data = await response.json();
        setSolicitud(data.data);

        // Cargar historial
        const historialResponse = await fetch(`/api/solicitudes/${solicitudId}/historial`);
        const historialData = await historialResponse.json();
        setHistorial(historialData.data.historial);
      } catch (error: unknown) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [solicitudId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{solicitud.folio}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Creada el{" "}
              {format(new Date(solicitud.createdAt), "d 'de' MMMM, yyyy 'a las' HH:mm", {
                locale: es,
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <EstadoSolicitudBadge estado={solicitud.estado} />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información del Retiro */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="text-sm font-medium text-gray-900">{solicitud.direccionRetiro}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Región</p>
                <p className="text-sm font-medium text-gray-900">{solicitud.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Comuna</p>
                <p className="text-sm font-medium text-gray-900">{solicitud.comuna}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha Preferida</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(solicitud.fechaPreferida), "EEEE, d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="text-sm font-medium text-gray-900">
                  {solicitud.horarioPreferido === "manana"
                    ? "Mañana (8:00 - 12:00)"
                    : "Tarde (14:00 - 18:00)"}
                </p>
              </div>
            </div>
          </section>

          {/* Detalles de NFU */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Detalles de NFU
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Categoría A - Vehículos Livianos
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-medium">{solicitud.categoriaA_cantidad} unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Peso estimado:</span>
                  <span className="font-medium">{solicitud.categoriaA_pesoEst.toFixed(1)} kg</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Categoría B - Vehículos Pesados
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-medium">{solicitud.categoriaB_cantidad} unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Peso estimado:</span>
                  <span className="font-medium">{solicitud.categoriaB_pesoEst.toFixed(1)} kg</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">Total</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-900">
                    {solicitud.cantidadTotal} unidades
                  </p>
                  <p className="text-xs text-blue-700">
                    {solicitud.pesoTotalEstimado.toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Contacto en Sitio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="text-sm font-medium text-gray-900">{solicitud.nombreContacto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="text-sm font-medium text-gray-900">{solicitud.telefonoContacto}</p>
              </div>
              {solicitud.instrucciones && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Instrucciones adicionales</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                    {solicitud.instrucciones}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Fotos */}
          {solicitud.fotos && solicitud.fotos.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Fotos ({solicitud.fotos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {solicitud.fotos.map((foto, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto}
                      alt={`Foto ${index + 1} de solicitud ${solicitud.folio}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Historial */}
          {historial.length > 0 && (
            <section>
              <button
                onClick={() => setShowHistorial(!showHistorial)}
                className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Historial de Cambios ({historial.length})
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${showHistorial ? "transform rotate-180" : ""}`}
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
              </button>

              {showHistorial && (
                <div className="mt-4 space-y-3">
                  {historial.map((cambio, _index) => (
                    <div key={cambio.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
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
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                              </>
                            )}
                            <EstadoSolicitudBadge estado={cambio.estadoNuevo} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(cambio.fecha), "d 'de' MMMM, yyyy 'a las' HH:mm", {
                              locale: es,
                            })}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            Por: {cambio.realizadoPor.nombre}
                          </p>
                          {cambio.notas && (
                            <p className="text-sm text-gray-600 mt-1 italic">
                              &quot;{cambio.notas}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
