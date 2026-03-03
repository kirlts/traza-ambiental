"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Vehiculo {
  id: string;
  patente: string;
  tipo: string;
  capacidadKg: number;
}

export default function EditarVehiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["vehiculo", id],
    queryFn: async () => {
      const response = await fetch("/api/transportista/vehiculos");
      if (!response.ok) throw new Error("Error cargando vehículo");
      const result = await response.json();
      const vehiculo = result.vehiculos.find((v: ReturnType<typeof JSON.parse>) => v.id === id);
      if (!vehiculo) throw new Error("Vehículo no encontrado");
      return vehiculo as Vehiculo;
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: async (
      dataToUpdate: Partial<{ patente: string; tipo: string; capacidadKg: number }>
    ) => {
      const response = await fetch(`/api/transportista/vehiculos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al actualizar vehículo"
        );
      }
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      toast.success("Vehículo actualizado exitosamente");
      router.push("/dashboard/transportista/vehiculos");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Editar Vehículo" subtitle="Cargando...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#459e60] mx-auto"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Editar Vehículo"
      subtitle={`Actualizando información de ${data?.patente}`}
    >
      <VehiculoFormInner
        key={data?.id || "loading"}
        data={data}
        actualizarMutation={actualizarMutation}
        router={router}
      />
    </DashboardLayout>
  );
}

function VehiculoFormInner({ data, actualizarMutation, router }: ReturnType<typeof JSON.parse>) {
  const [formData, setFormData] = useState({
    patente: data?.patente || "",
    tipo: data?.tipo || "",
    capacidadKg: data?.capacidadKg?.toString() || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tiposVehiculo = [
    "Camión",
    "Camioneta",
    "Furgón",
    "Camión Plataforma",
    "Camión Tolva",
    "Semi-Remolque",
    "Otro",
  ];

  const handleSubmit = (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.patente) newErrors.patente = "La patente es requerida";
    if (!formData.tipo) newErrors.tipo = "El tipo es requerido";
    if (!formData.capacidadKg || Number(formData.capacidadKg) <= 0)
      newErrors.capacidadKg = "Capacidad inválida";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      actualizarMutation.mutate({
        patente: formData.patente.toUpperCase(),
        tipo: formData.tipo,
        capacidadKg: Number(formData.capacidadKg),
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="text-[#459e60] font-semibold"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Volver a la Flota
      </Button>

      <Card className="border-2 border-[#459e60]/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6 text-white">
          <h2 className="text-2xl font-bold">Editar Vehículo</h2>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patente">Patente</Label>
              <Input
                id="patente"
                value={formData.patente}
                onChange={(e: unknown) =>
                  setFormData({
                    ...formData,
                    patente: (e as ReturnType<typeof JSON.parse>).target.value.toUpperCase(),
                  })
                }
                className={errors.patente ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Vehículo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(v: ReturnType<typeof JSON.parse>) =>
                  setFormData({ ...formData, tipo: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {tiposVehiculo.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad (kg)</Label>
              <Input
                id="capacidad"
                type="number"
                value={formData.capacidadKg}
                onChange={(e: unknown) =>
                  setFormData({
                    ...formData,
                    capacidadKg: (e as ReturnType<typeof JSON.parse>).target.value,
                  })
                }
              />
            </div>

            <Button
              type="submit"
              disabled={actualizarMutation.isPending}
              className="w-full bg-[#459e60] text-white"
            >
              {actualizarMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
