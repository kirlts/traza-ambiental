"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  isAdmin,
  isProductor,
  isGenerador,
  isTransportista,
  isGestor,
  isEspecialista,
  isSistemaGestion,
} from "@/lib/auth-helpers";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Routing inteligente basado en rol
    if (session && status === "authenticated") {
      if (isAdmin(session)) {
        router.push("/dashboard/admin");
      } else if (isProductor(session)) {
        router.push("/dashboard/generador");
      } else if (isSistemaGestion(session)) {
        router.push("/dashboard/sistema-gestion");
      } else if (isGenerador(session)) {
        router.push("/dashboard/generador");
      } else if (isTransportista(session)) {
        router.push("/dashboard/transportista");
      } else if (isGestor(session)) {
        router.push("/dashboard/gestor");
      } else if (isEspecialista(session)) {
        router.push("/dashboard/especialista");
      } else {
        // Fallback si tiene un rol desconocido o ninguno
        // Podría redirigir a una página de "Sin acceso" o "Perfil"
        router.push("/dashboard/perfil");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return null;
}
