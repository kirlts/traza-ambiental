"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Comprobante {
  id: string;
  tipo: string;
  folio: string;
  fecha: string;
  estado: string;
  anio: number;
  descripcion: string;
}

export default function ComprobantesPage() {
  const { data: _session } = useSession();
  const [comprobantes, setComprobantes] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [filtroAnio, setFiltroAnio] = useState<number | "todos">("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  const anosDisponibles = [2024, 2023, 2022, 2021, 2020];
  const tiposComprobante = [
    "Declaración Anual",
    "Certificado de Cumplimiento",
    "Comprobante de Pago",
    "Reporte de Gestión",
  ];

  useEffect(() => {
    // Simulación de carga de comprobantes
    const cargarComprobantes = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const comprobantesSimulados: Comprobante[] = [
        {
          id: "1",
          tipo: "Declaración Anual",
          folio: "DA-2024-001",
          fecha: "2024-03-15",
          estado: "Aprobado",
          anio: 2024,
          descripcion: "Declaración anual de neumáticos 2024",
        },
        {
          id: "2",
          tipo: "Certificado de Cumplimiento",
          folio: "CC-2024-001",
          fecha: "2024-04-20",
          estado: "Vigente",
          anio: 2024,
          descripcion: "Certificado de cumplimiento metas REP 2024",
        },
        {
          id: "3",
          tipo: "Declaración Anual",
          folio: "DA-2023-001",
          fecha: "2023-03-10",
          estado: "Aprobado",
          anio: 2023,
          descripcion: "Declaración anual de neumáticos 2023",
        },
        {
          id: "4",
          tipo: "Comprobante de Pago",
          folio: "CP-2024-001",
          fecha: "2024-02-28",
          estado: "Pagado",
          anio: 2024,
          descripcion: "Comprobante de pago tasa REP 2024",
        },
      ];

      setComprobantes(comprobantesSimulados);
      setLoading(false);
    };

    cargarComprobantes();
  }, []);

  const comprobantesFiltrados = comprobantes.filter((comp) => {
    const cumpleFiltroAnio = filtroAnio === "todos" || comp.anio === filtroAnio;
    const cumpleFiltroTipo = filtroTipo === "todos" || comp.tipo === filtroTipo;
    return cumpleFiltroAnio && cumpleFiltroTipo;
  });

  const descargarComprobante = (_comprobante: Comprobante) => {
    // Simulación de descarga
    // Aquí iría la lógica real de descarga
  };

  const getEstadoBadge = (estado: string) => {
    const estilos = {
      Aprobado: "bg-green-100 text-green-800",
      Vigente: "bg-blue-100 text-blue-800",
      Pagado: "bg-emerald-100 text-emerald-800",
      Pendiente: "bg-yellow-100 text-yellow-800",
      Vencido: "bg-red-100 text-red-800",
    };

    return estilos[estado as keyof typeof estilos] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout
      title="Descarga de Comprobantes"
      subtitle="Accede y descarga todos tus comprobantes y certificados REP"
    >
      <div className="space-y-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#459e60]/10 p-8">
          <h2 className="text-2xl font-black text-[#204d3c] mb-6">Filtrar Comprobantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#2b3b4c] mb-3">Año</label>
              <select
                value={filtroAnio}
                onChange={(e: unknown) =>
                  setFiltroAnio(
                    (e as ReturnType<typeof JSON.parse>).target.value === "todos"
                      ? "todos"
                      : parseInt((e as ReturnType<typeof JSON.parse>).target.value)
                  )
                }
                className="w-full px-4 py-3 border-2 border-[#459e60]/20 rounded-xl focus:border-[#459e60] focus:outline-none font-medium"
              >
                <option value="todos">Todos los años</option>
                {anosDisponibles.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2b3b4c] mb-3">
                Tipo de Comprobante
              </label>
              <select
                value={filtroTipo}
                onChange={(e: unknown) =>
                  setFiltroTipo((e as ReturnType<typeof JSON.parse>).target.value)
                }
                className="w-full px-4 py-3 border-2 border-[#459e60]/20 rounded-xl focus:border-[#459e60] focus:outline-none font-medium"
              >
                <option value="todos">Todos los tipos</option>
                {tiposComprobante.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Comprobantes */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#459e60]/10 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-[#204d3c]">
              Comprobantes Disponibles ({comprobantesFiltrados.length})
            </h2>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar Todos
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#459e60]"></div>
              <p className="ml-4 text-lg font-semibold text-[#2b3b4c]">Cargando comprobantes...</p>
            </div>
          ) : comprobantesFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-600">No se encontraron comprobantes</p>
              <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comprobantesFiltrados.map((comprobante) => (
                <div
                  key={comprobante.id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-[#459e60]/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-lg font-bold text-[#204d3c]">{comprobante.tipo}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${getEstadoBadge(comprobante.estado)}`}
                        >
                          {comprobante.estado}
                        </span>
                      </div>
                      <p className="text-[#2b3b4c] mb-2">{comprobante.descripcion}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>
                          <strong>Folio:</strong> {comprobante.folio}
                        </span>
                        <span>
                          <strong>Fecha:</strong>{" "}
                          {new Date(comprobante.fecha).toLocaleDateString("es-CL")}
                        </span>
                        <span>
                          <strong>Año:</strong> {comprobante.anio}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => descargarComprobante(comprobante)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Descargar
                      </button>
                      <button className="p-2 text-gray-500 hover:text-[#459e60] transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información Adicional */}
        <div className="bg-gradient-to-br from-[#f0fdf4] to-white rounded-2xl shadow-xl border border-[#459e60]/20 p-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#459e60] to-[#44a15d] rounded-xl flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-black text-[#204d3c] mb-3">Información Importante</h3>
              <div className="text-base text-[#2b3b4c]/80 leading-relaxed space-y-2">
                <p>
                  • Los comprobantes están disponibles por un período de 7 años según la normativa
                  REP.
                </p>
                <p>• Puedes descargar los documentos en formato PDF para tus registros.</p>
                <p>
                  • Los certificados de cumplimiento son válidos para auditorías y fiscalizaciones.
                </p>
                <p>
                  • Si necesitas un comprobante específico que no aparece, contacta a soporte
                  técnico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
