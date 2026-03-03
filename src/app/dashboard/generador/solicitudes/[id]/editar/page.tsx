"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isGenerador } from "@/lib/auth-helpers";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FormularioSolicitud } from "@/components/solicitud/FormularioSolicitud";
import { toast } from "sonner";
import { SolicitudCompletaData } from "@/lib/validations/solicitud-retiro";

export default function EditarSolicitudPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const solicitudId = params.id as string;

  const [initialData, setInitialData] = useState<Partial<SolicitudCompletaData> | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isGenerador(session)) {
      router.push("/dashboard");
    }
  }, [status, router, session]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/solicitudes/${solicitudId}`);
        if (!res.ok) throw new Error("Error cargando solicitud");
        const result = await res.json();
        const data = result.data;

        // Transform data for form
        const formData = {
          direccionRetiro: data.direccionRetiro,
          region: data.region,
          comuna: data.comuna,
          fechaPreferida: data.fechaPreferida ? data.fechaPreferida.split("T")[0] : "",
          horarioPreferido: data.horarioPreferido,
          categoriaA_cantidad: data.categoriaA_cantidad || 0,
          categoriaA_pesoEst: data.categoriaA_pesoEst || 0,
          categoriaB_cantidad: data.categoriaB_cantidad || 0,
          categoriaB_pesoEst: data.categoriaB_pesoEst || 0,
          nombreContacto: data.nombreContacto,
          telefonoContacto: data.telefonoContacto,
          instrucciones: data.instrucciones,
          fotos: data.fotos || [],
        };

        setInitialData(formData);
      } catch (e: unknown) {
        console.error(e);
        toast.error("Error al cargar la solicitud");
        router.push("/dashboard/generador/solicitudes");
      } finally {
        setLoading(false);
      }
    };

    if (solicitudId && session) {
      fetchData();
    }
  }, [solicitudId, session, router]);

  const handleSubmit = async (data: ReturnType<typeof JSON.parse>) => {
    try {
      const res = await fetch(`/api/solicitudes/${solicitudId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).message ||
            (error as ReturnType<typeof JSON.parse>).error ||
            "Error al actualizar"
        );
      }

      toast.success("Solicitud actualizada correctamente");
      router.push(`/dashboard/generador/solicitudes/${solicitudId}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? (e as ReturnType<typeof JSON.parse>).message : String(e));
      throw e; // Rethrow to stop local submitting state
    }
  };

  if (loading || status === "loading") {
    return (
      <DashboardLayout title="Editando Solicitud">
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Editar Solicitud"
      subtitle={`Editando solicitud #${solicitudId.slice(0, 8)}`}
    >
      <FormularioSolicitud initialData={initialData} onSubmit={handleSubmit} isEditing={true} />
    </DashboardLayout>
  );
}
