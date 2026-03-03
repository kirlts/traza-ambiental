"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/auth-helpers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

interface Solicitud {
  id: string;
  rutEmpresa: string;
  razonSocial: string;
  direccion: string;
  direccionCasaMatriz?: string;
  comuna?: string;
  region?: string;
  telefono?: string;
  idRETC?: string;
  tipoProductorREP?: string;
  tiposResiduos?: string[];
  rutRepresentante: string;
  nombresRepresentante: string;
  apellidosRepresentante: string;
  cargoRepresentante?: string;
  emailRepresentante: string;
  telefonoRepresentante?: string;
  email: string;
  estado: string;
  motivoRechazo?: string;
  fechaSolicitud: string;
  fechaRevision?: string;
  createdAt: string;
}

export default function SolicitudesGeneradorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("pendiente");
  const [loading, setLoading] = useState(true);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<Solicitud | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [accion, setAccion] = useState<"aprobar" | "rechazar" | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session && !isAdmin(session)) {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  const cargarSolicitudes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/solicitudes-generador?estado=${filtroEstado}`);
      const data = await response.json();

      if (response.ok) {
        setSolicitudes(data.solicitudes);
      }
    } catch (error: unknown) {
      console.error("Error cargando solicitudes:", error);
    } finally {
      setLoading(false);
    }
  }, [filtroEstado]);

  useEffect(() => {
    if (status === "authenticated") {
      cargarSolicitudes();
    }
  }, [status, cargarSolicitudes]);

  const abrirModal = (
    solicitud: ReturnType<typeof JSON.parse>,
    accionTipo: "aprobar" | "rechazar"
  ) => {
    setSolicitudSeleccionada(solicitud);
    setAccion(accionTipo);
    setMostrarModal(true);
    setMotivoRechazo("");
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSolicitudSeleccionada(null);
    setAccion(null);
    setMotivoRechazo("");
  };

  const aprobarSolicitud = async () => {
    if (!solicitudSeleccionada) return;

    try {
      setProcesando(true);
      const response = await fetch(
        `/api/solicitudes-generador/${solicitudSeleccionada.id}/aprobar`,
        { method: "POST" }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Solicitud aprobada exitosamente");
        cerrarModal();
        cargarSolicitudes();
      } else {
        toast.error(data.error || "Error al aprobar solicitud");
      }
    } catch (error: unknown) {
      console.error("Error aprobando solicitud:", error);
      toast.error("Error al aprobar solicitud");
    } finally {
      setProcesando(false);
    }
  };

  const rechazarSolicitud = async () => {
    if (!solicitudSeleccionada || !motivoRechazo.trim()) {
      toast.error("Por favor, ingresa un motivo de rechazo");
      return;
    }

    try {
      setProcesando(true);
      const response = await fetch(
        `/api/solicitudes-generador/${solicitudSeleccionada.id}/rechazar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo: motivoRechazo }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Solicitud rechazada");
        cerrarModal();
        cargarSolicitudes();
      } else {
        toast.error(data.error || "Error al rechazar solicitud");
      }
    } catch (error: unknown) {
      console.error("Error rechazando solicitud:", error);
      toast.error("Error al rechazar solicitud");
    } finally {
      setProcesando(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout title="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || !isAdmin(session)) {
    return (
      <DashboardLayout title="Acceso Denegado">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Solicitudes de Registro de Generadores"
      subtitle="Gestiona las solicitudes de registro de empresas generadoras"
    >
      <div className="space-y-6">
        {/* Filters - Tabs Style */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setFiltroEstado("pendiente")}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                filtroEstado === "pendiente"
                  ? "text-emerald-700 border-emerald-600 bg-emerald-50/50"
                  : "text-gray-600 border-transparent hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado("aprobada")}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                filtroEstado === "aprobada"
                  ? "text-emerald-700 border-emerald-600 bg-emerald-50/50"
                  : "text-gray-600 border-transparent hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              Aprobadas
            </button>
            <button
              onClick={() => setFiltroEstado("rechazada")}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                filtroEstado === "rechazada"
                  ? "text-emerald-700 border-emerald-600 bg-emerald-50/50"
                  : "text-gray-600 border-transparent hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              Rechazadas
            </button>
            <button
              onClick={() => setFiltroEstado("todas")}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                filtroEstado === "todas"
                  ? "text-emerald-700 border-emerald-600 bg-emerald-50/50"
                  : "text-gray-600 border-transparent hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                  Representante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                  Fecha Solicitud
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-900 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {solicitudes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="mt-2 text-sm">
                        No hay solicitudes {filtroEstado !== "todas" && filtroEstado + "s"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                solicitudes.map((solicitud: ReturnType<typeof JSON.parse>) => (
                  <tr key={solicitud.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {solicitud.razonSocial}
                      </div>
                      <div className="text-sm text-gray-500">{solicitud.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {solicitud.rutEmpresa}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {solicitud.nombresRepresentante} {solicitud.apellidosRepresentante}
                      </div>
                      <div className="text-sm text-gray-500">{solicitud.emailRepresentante}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-CL", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          solicitud.estado === "pendiente"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : solicitud.estado === "aprobada"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {solicitud.estado === "pendiente" ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => abrirModal(solicitud, "aprobar")}
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-md font-medium transition-colors"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => abrirModal(solicitud, "rechazar")}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md font-medium transition-colors"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {mostrarModal && solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="mt-3">
              <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">
                {accion === "aprobar" ? "✅ Aprobar Solicitud" : "❌ Rechazar Solicitud"}
              </h3>

              {/* Información de la solicitud */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Empresa:</h4>
                  <p className="text-sm text-gray-700">{solicitudSeleccionada.razonSocial}</p>
                  <p className="text-sm text-gray-600">RUT: {solicitudSeleccionada.rutEmpresa}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Representante:</h4>
                  <p className="text-sm text-gray-700">
                    {solicitudSeleccionada.nombresRepresentante}{" "}
                    {solicitudSeleccionada.apellidosRepresentante}
                  </p>
                  <p className="text-sm text-gray-600">
                    RUT: {solicitudSeleccionada.rutRepresentante}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {solicitudSeleccionada.emailRepresentante}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Dirección Comercial:</h4>
                  <p className="text-sm text-gray-600">{solicitudSeleccionada.direccion}</p>
                  {solicitudSeleccionada.direccionCasaMatriz && (
                    <>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 mt-3">
                        Casa Matriz:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {solicitudSeleccionada.direccionCasaMatriz}
                      </p>
                    </>
                  )}
                  {solicitudSeleccionada.comuna && (
                    <p className="text-sm text-gray-600 mt-2">
                      {solicitudSeleccionada.comuna}, {solicitudSeleccionada.region}
                    </p>
                  )}
                </div>

                {solicitudSeleccionada.idRETC && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      ID RETC (Ventanilla Única):
                    </h4>
                    <p className="text-sm text-gray-700 font-mono">
                      {solicitudSeleccionada.idRETC}
                    </p>
                  </div>
                )}

                {solicitudSeleccionada.tipoProductorREP && (
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      Tipo de Productor REP:
                    </h4>
                    <p className="text-sm text-gray-700">
                      {solicitudSeleccionada.tipoProductorREP}
                    </p>
                  </div>
                )}

                {solicitudSeleccionada.tiposResiduos &&
                  solicitudSeleccionada.tiposResiduos.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Tipos de Residuos:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {solicitudSeleccionada.tiposResiduos.map((residuo, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-full"
                          >
                            {residuo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {accion === "aprobar" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-emerald-800">
                    Se creará un usuario con rol de <strong>Generador</strong> y se enviará un email
                    de confirmación a <strong>{solicitudSeleccionada.email}</strong>.
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <label
                    htmlFor="motivoRechazo"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Motivo del rechazo *
                  </label>
                  <textarea
                    id="motivoRechazo"
                    value={motivoRechazo}
                    onChange={(e: unknown) =>
                      setMotivoRechazo((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Explica el motivo del rechazo..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={cerrarModal}
                  disabled={procesando}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={accion === "aprobar" ? aprobarSolicitud : rechazarSolicitud}
                  disabled={procesando}
                  className={`px-6 py-2 rounded-md text-white disabled:opacity-50 font-medium transition-colors shadow-sm hover:shadow-md ${
                    accion === "aprobar"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {procesando ? "Procesando..." : accion === "aprobar" ? "Aprobar" : "Rechazar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
