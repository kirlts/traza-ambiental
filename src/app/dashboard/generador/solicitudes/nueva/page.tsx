/**
 * Página: Nueva Solicitud de Retiro de NFU
 * Ruta: /dashboard/generador/solicitudes/nueva
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isGenerador } from "@/lib/auth-helpers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FormularioSolicitud } from "@/components/solicitud/FormularioSolicitud";

export default function NuevaSolicitudPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isGenerador(session)) {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return (
      <DashboardLayout title="Nueva Solicitud">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando formulario...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session || !isGenerador(session)) {
    return (
      <DashboardLayout title="Acceso Denegado">
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
            <p className="text-gray-600 mb-8">No tienes permisos para acceder a esta sección.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Nueva Solicitud de Retiro"
      subtitle="Complete el formulario en 3 pasos para solicitar el retiro de neumáticos fuera de uso"
    >
      <FormularioSolicitud />
    </DashboardLayout>
  );
}
