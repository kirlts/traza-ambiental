"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EstadoSolicitud } from "@prisma/client";
import { useSolicitudesRealTime } from "@/hooks/useSolicitudesRealTime";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FiltrosSolicitudes from "@/components/solicitud/FiltrosSolicitudes";
import SolicitudCard from "@/components/solicitud/SolicitudCard";
import SolicitudDetailModal from "@/components/solicitud/SolicitudDetailModal";

/**
 * Página de listado de solicitudes del generador
 * HU-004: Seguimiento de Solicitudes de Retiro
 * Diseño integrado con DashboardLayout
 */
export default function SolicitudesPage() {
  const router = useRouter();
  const [filtroEstado, setFiltroEstado] = useState<EstadoSolicitud | undefined>();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<string | null>(null);

  const { solicitudes, pagination, isLoading, error } = useSolicitudesRealTime({
    estado: filtroEstado,
    busqueda: busqueda,
    page: pagina,
    limit: 10,
  });

  const handleFiltroChange = (filtros: { estado?: EstadoSolicitud; busqueda?: string }) => {
    setFiltroEstado(filtros.estado);
    setBusqueda(filtros.busqueda || "");
    setPagina(1); // Resetear a página 1 cuando se cambian los filtros
  };

  const handleSolicitudClick = (solicitudId: string) => {
    setSolicitudSeleccionada(solicitudId);
  };

  const handleCerrarModal = () => {
    setSolicitudSeleccionada(null);
  };

  const handleNuevaSolicitud = () => {
    router.push("/dashboard/generador/solicitudes/nueva");
  };

  const handleAnterior = () => {
    if (pagination.page > 1) {
      setPagina(pagina - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSiguiente = () => {
    if (pagination.hasMore) {
      setPagina(pagina + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Error State
  if (error) {
    return (
      <DashboardLayout title="Mis Solicitudes" subtitle="Error al cargar">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error al cargar solicitudes
              </h3>
              <p className="text-sm text-red-800">
                {(error as ReturnType<typeof JSON.parse>).message}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Mis Solicitudes de Retiro"
      subtitle="Administra y da seguimiento a todas tus solicitudes de retiro de neumáticos fuera de uso"
      actions={
        <button
          onClick={handleNuevaSolicitud}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#459e60] px-6 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#367d4c]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nueva Solicitud
        </button>
      }
    >
      <div className="w-full space-y-6">
        {/* Filtros */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                Filtros
              </p>
              <h2 className="text-xl font-bold text-gray-900">Refina tus solicitudes</h2>
              <p className="text-sm text-gray-600 mt-1">
                Busca por estado, folio o dirección para encontrar rápidamente el retiro que
                necesitas revisar.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFiltroEstado(undefined);
                  setBusqueda("");
                  setPagina(1);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:border-gray-400"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-5">
            <FiltrosSolicitudes
              onFiltroCambiado={handleFiltroChange}
              filtroEstado={filtroEstado}
              busqueda={busqueda}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center shadow-xl">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#459e60]"></div>
            <p className="mt-4 text-sm font-medium text-[#475569]">Cargando solicitudes...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && solicitudes.length === 0 && (
          <div className="rounded-3xl border border-[#e2e8f0] bg-white p-16 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#eef9f2]">
              <svg
                className="h-10 w-10 text-[#459e60]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-[#1f2937]">Aún no tienes solicitudes</h3>
            <p className="mx-auto mb-8 max-w-md text-sm text-[#64748b]">
              Crea tu primera solicitud de retiro de neumáticos y comienza a gestionar el retiro de
              neumáticos fuera de uso
            </p>
            <button
              onClick={handleNuevaSolicitud}
              className="inline-flex items-center gap-2 rounded-xl bg-[#459e60] px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#367d4c]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Crear Primera Solicitud
            </button>
          </div>
        )}

        {/* Lista de Solicitudes */}
        {!isLoading && solicitudes.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4">
              {solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => (
                <SolicitudCard
                  key={solicitud.id}
                  _id={solicitud.id}
                  folio={solicitud.folio}
                  fechaCreacion={new Date(solicitud.createdAt)}
                  direccion={solicitud.direccionRetiro}
                  region={solicitud.region}
                  estado={solicitud.estado}
                  cantidadTotal={solicitud.cantidadTotal}
                  pesoTotalEstimado={solicitud.pesoTotalEstimado}
                  onClick={() => handleSolicitudClick(solicitud.id)}
                />
              ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e2e8f0] bg-white px-6 py-4 shadow-xl sm:flex-row">
                <div className="text-sm text-[#475569]">
                  Mostrando{" "}
                  <span className="font-semibold text-[#1f3556]">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  a{" "}
                  <span className="font-semibold text-[#1f3556]">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{" "}
                  de <span className="font-semibold text-[#1f3556]">{pagination.total}</span>{" "}
                  solicitudes
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAnterior}
                    disabled={pagination.page === 1}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      pagination.page === 1
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border border-[#cbd5f0] bg-white text-[#1f3556] shadow-sm hover:bg-[#eef3ff]"
                    }`}
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-[#475569] px-2">
                    Página <span className="font-semibold text-[#1f3556]">{pagination.page}</span>{" "}
                    de <span className="font-semibold text-[#1f3556]">{pagination.totalPages}</span>
                  </span>

                  <button
                    onClick={handleSiguiente}
                    disabled={!pagination.hasMore}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      !pagination.hasMore
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border border-[#cbd5f0] bg-white text-[#1f3556] shadow-sm hover:bg-[#eef3ff]"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal de Detalle */}
        {solicitudSeleccionada && (
          <SolicitudDetailModal solicitudId={solicitudSeleccionada} onClose={handleCerrarModal} />
        )}
      </div>
    </DashboardLayout>
  );
}
