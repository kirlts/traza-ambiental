"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InvDigitalRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la ruta correcta del inventario
    router.replace("/dashboard/generador/inventario");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Redirigiendo al inventario digital...</p>
      </div>
    </div>
  );
}
