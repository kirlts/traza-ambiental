"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ArrowLeft, Truck, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function NuevoVehiculoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    patente: "",
    tipo: "",
    capacidadKg: "",
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

  // Mutación para crear vehículo
  const crearMutation = useMutation({
    mutationFn: async (data: ReturnType<typeof JSON.parse>) => {
      const response = await fetch("/api/transportista/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al crear vehículo"
        );
      }

      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["vehiculos"] });
      toast.success("Vehículo creado exitosamente");
      router.push("/dashboard/transportista/vehiculos");
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  const validarFormulario = () => {
    const newErrors: Record<string, string> = {};

    // Validar patente
    if (!formData.patente) {
      newErrors.patente = "La patente es requerida";
    } else {
      const patenteRegex = /^[A-Z]{2,4}-\d{2,4}$/i;
      if (!patenteRegex.test(formData.patente)) {
        newErrors.patente = "Formato inválido. Use: ABCD-12 o AB-1234";
      }
    }

    // Validar tipo
    if (!formData.tipo) {
      newErrors.tipo = "El tipo de vehículo es requerido";
    }

    // Validar capacidad
    if (!formData.capacidadKg) {
      newErrors.capacidadKg = "La capacidad es requerida";
    } else {
      const capacidad = Number(formData.capacidadKg);
      if (isNaN(capacidad) || capacidad <= 0) {
        newErrors.capacidadKg = "Debe ser un número mayor a 0";
      } else if (capacidad > 50000) {
        newErrors.capacidadKg = "La capacidad no puede exceder 50,000 kg";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();

    if (!validarFormulario()) {
      return;
    }

    crearMutation.mutate({
      patente: formData.patente.toUpperCase(),
      tipo: formData.tipo,
      capacidadKg: Number(formData.capacidadKg),
    });
  };

  return (
    <DashboardLayout
      title="Agregar Nuevo Vehículo"
      subtitle="Registre un nuevo vehículo a su flota"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Botón Volver */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-[#459e60] hover:text-[#44a15d] font-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a la Flota
        </Button>

        {/* Formulario */}
        <Card className="border-2 border-[#459e60]/20 shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Nuevo Vehículo</h2>
                <p className="text-sm text-white/80">Complete los datos del vehículo a registrar</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patente */}
              <div className="space-y-2">
                <Label htmlFor="patente" className="text-[#2b3b4c] font-semibold">
                  Patente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="patente"
                  placeholder="ej: ABCD-12 o AB-1234"
                  value={formData.patente}
                  onChange={(e: unknown) => {
                    setFormData({
                      ...formData,
                      patente: (e as ReturnType<typeof JSON.parse>).target.value.toUpperCase(),
                    });
                    setErrors({ ...errors, patente: "" });
                  }}
                  className={`border-2 ${
                    errors.patente ? "border-red-500" : "border-[#459e60]/30"
                  } focus:border-[#459e60] text-lg font-mono uppercase`}
                  maxLength={9}
                />
                {errors.patente && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.patente}
                  </div>
                )}
                <p className="text-xs text-[#2b3b4c]/60">
                  Formato chileno: 4 letras + guión + 2 números o 2 letras + guión + 4 números
                </p>
              </div>

              {/* Tipo de Vehículo */}
              <div className="space-y-2">
                <Label htmlFor="tipo" className="text-[#2b3b4c] font-semibold">
                  Tipo de Vehículo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => {
                    setFormData({ ...formData, tipo: value });
                    setErrors({ ...errors, tipo: "" });
                  }}
                >
                  <SelectTrigger
                    className={`border-2 ${
                      errors.tipo ? "border-red-500" : "border-[#459e60]/30"
                    } focus:border-[#459e60]`}
                  >
                    <SelectValue placeholder="Seleccione el tipo de vehículo" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200 shadow-xl">
                    {tiposVehiculo.map((tipo) => (
                      <SelectItem
                        key={tipo}
                        value={tipo}
                        className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                      >
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipo && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.tipo}
                  </div>
                )}
              </div>

              {/* Capacidad */}
              <div className="space-y-2">
                <Label htmlFor="capacidad" className="text-[#2b3b4c] font-semibold">
                  Capacidad de Carga (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacidad"
                  type="number"
                  placeholder="ej: 8000"
                  value={formData.capacidadKg}
                  onChange={(e: unknown) => {
                    setFormData({
                      ...formData,
                      capacidadKg: (e as ReturnType<typeof JSON.parse>).target.value,
                    });
                    setErrors({ ...errors, capacidadKg: "" });
                  }}
                  className={`border-2 ${
                    errors.capacidadKg ? "border-red-500" : "border-[#459e60]/30"
                  } focus:border-[#459e60] text-lg`}
                  min="1"
                  max="50000"
                />
                {errors.capacidadKg && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.capacidadKg}
                  </div>
                )}
                <p className="text-xs text-[#2b3b4c]/60">
                  Capacidad máxima de carga en kilogramos (hasta 50,000 kg)
                </p>
              </div>

              {/* Información Adicional */}
              <Card className="bg-[#f6fcf3] border-[#459e60]/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-[#2b3b4c] mb-2 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[#459e60]" />
                    Información Importante
                  </h3>
                  <ul className="space-y-2 text-sm text-[#2b3b4c]/70">
                    <li className="flex items-start gap-2">
                      <span className="text-[#459e60] font-bold">•</span>
                      <span>El vehículo se registrará con estado "Activo" por defecto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#459e60] font-bold">•</span>
                      <span>La patente debe ser única en el sistema</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#459e60] font-bold">•</span>
                      <span>
                        La capacidad se utilizará para calcular la disponibilidad de su flota
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Botones de Acción */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="flex-1 border-2 border-[#459e60]/30 text-[#459e60] hover:bg-[#459e60]/10 font-semibold"
                  disabled={crearMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  disabled={crearMutation.isPending}
                >
                  {crearMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Guardar Vehículo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
