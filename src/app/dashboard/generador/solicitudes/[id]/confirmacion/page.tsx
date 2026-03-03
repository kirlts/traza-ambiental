/**
 * Página: Confirmación de Solicitud Creada
 * Ruta: /dashboard/generador/solicitudes/[id]/confirmacion
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface SolicitudData {
  folio: string;
  fechaPreferida: string;
  horarioPreferido: string;
  direccionRetiro: string;
  comuna: string;
  region: string;
  totales: {
    cantidad: number;
    pesoEstimado: number;
  };
  estado: string;
  createdAt: string;
}

export default function ConfirmacionPage() {
  const params = useParams();
  const _router = useRouter();
  const solicitudId = params.id as string;

  const [solicitud, setSolicitud] = useState<SolicitudData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarSolicitud = async () => {
      try {
        const response = await fetch(`/api/solicitudes/${solicitudId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al cargar solicitud");
        }

        setSolicitud(result.data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : "Error desconocido";
        setError(message);
        console.error("Error al cargar solicitud:", err);
      } finally {
        setCargando(false);
      }
    };

    if (solicitudId) {
      cargarSolicitud();
    }
  }, [solicitudId]);

  if (cargando) {
    return (
      <DashboardLayout title="Confirmación de Solicitud">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando confirmación...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !solicitud) {
    return (
      <DashboardLayout title="Error">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar confirmación</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/dashboard/generador">Volver al Dashboard</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Solicitud Confirmada" subtitle={`Folio: ${solicitud.folio}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Mensaje de éxito */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            {/* Icono de éxito */}
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Solicitud Creada Exitosamente!
            </h1>
            <p className="text-gray-600 mb-6">
              Su solicitud de retiro de NFU ha sido registrada en el sistema
            </p>

            {/* Folio destacado */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6 inline-block">
              <p className="text-sm text-emerald-800 font-medium mb-1">Número de Folio:</p>
              <p className="text-4xl font-bold text-emerald-600 tracking-wider">
                {solicitud.folio}
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-4">Guarde este número para futuras consultas</p>
          </div>
        </div>

        {/* Resumen de la solicitud */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen de su Solicitud</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información del retiro */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Retiro</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <p className="text-gray-900 mb-2">
                  <span className="font-medium block text-xs text-gray-500 uppercase">
                    Dirección
                  </span>
                  {solicitud.direccionRetiro}
                </p>
                <p className="text-gray-900 mb-2">
                  <span className="font-medium block text-xs text-gray-500 uppercase">
                    Ubicación
                  </span>
                  {solicitud.comuna}, {solicitud.region}
                </p>
                <p className="text-gray-900 mb-2">
                  <span className="font-medium block text-xs text-gray-500 uppercase">
                    Fecha preferida
                  </span>
                  {new Date(solicitud.fechaPreferida).toLocaleDateString("es-CL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium block text-xs text-gray-500 uppercase">Horario</span>
                  {solicitud.horarioPreferido === "manana"
                    ? "Mañana (8:00 - 12:00)"
                    : "Tarde (14:00 - 18:00)"}
                </p>
              </div>
            </div>

            {/* Totales */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Cantidades Solicitadas</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">
                      {solicitud.totales.cantidad}
                    </p>
                    <p className="text-sm text-gray-600">Unidades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">
                      {solicitud.totales.pesoEstimado.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">Kilogramos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Estado Actual</h3>
              <div className="bg-gray-50 rounded-lg p-4 h-full flex items-center justify-center">
                <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                  <span className="font-medium">Pendiente de Asignación</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Próximos Pasos</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Recibirá un email de confirmación con los detalles de su solicitud</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Un transportista será asignado dentro de las próximas 24-48 horas</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Podrá hacer seguimiento del estado de su solicitud en su dashboard</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Recibirá notificaciones cuando cambie el estado de la solicitud</span>
            </li>
          </ol>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href={`/dashboard/generador/solicitudes/${solicitudId}`}>
              Ver Detalles de la Solicitud
            </Link>
          </Button>
          <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/dashboard/generador/solicitudes/nueva">Crear Otra Solicitud</Link>
          </Button>
          <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href="/dashboard/generador">Volver al Dashboard</Link>
          </Button>
        </div>

        {/* Información de contacto */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            ¿Necesita ayuda? Contacte a soporte:{" "}
            <a href="mailto:soporte@trazambiental.com" className="text-emerald-600 hover:underline">
              soporte@trazambiental.com
            </a>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
