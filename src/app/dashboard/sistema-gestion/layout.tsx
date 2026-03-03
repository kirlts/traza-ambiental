"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isSistemaGestion } from "@/lib/auth-helpers";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SistemaGestionLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      router.push("/login");
      return;
    }

    if (session && !isSistemaGestion(session)) {
      router.push("/dashboard");
      return;
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session || (session && !isSistemaGestion(session))) {
    return null;
  }

  // Envolver el contenido en DashboardLayout para mantener la navegación consistente
  return <DashboardLayout>{children}</DashboardLayout>;
}
