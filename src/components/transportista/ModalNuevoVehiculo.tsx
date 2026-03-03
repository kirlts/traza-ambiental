"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Truck, Save, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

interface ModalNuevoVehiculoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalNuevoVehiculo({ isOpen, onClose }: ModalNuevoVehiculoProps) {
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
      // Limpiar formulario
      setFormData({ patente: "", tipo: "", capacidadKg: "" });
      setErrors({});
      onClose();
    },
    onError: (error: ReturnType<typeof JSON.parse>) => {
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

  const handleSubmit = (e: ReturnType<typeof JSON.parse>) => {
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

  const handleClose = () => {
    setFormData({ patente: "", tipo: "", capacidadKg: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border border-gray-200 shadow-xl bg-white">
        {/* Header */}
        <div className="bg-emerald-600 p-5 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Nuevo Vehículo</h2>
                <p className="text-sm text-white/90">Complete los datos del vehículo a registrar</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Formulario */}
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patente */}
            <div className="space-y-2">
              <Label htmlFor="patente" className="text-gray-700 font-semibold">
                Patente <span className="text-red-500">*</span>
              </Label>
              <Input
                id="patente"
                placeholder="EJ: ABCD-12 O AB-1234"
                value={formData.patente}
                onChange={(e: ReturnType<typeof JSON.parse>) => {
                  setFormData({
                    ...formData,
                    patente: (e as ReturnType<typeof JSON.parse>).target.value.toUpperCase(),
                  });
                  setErrors({ ...errors, patente: "" });
                }}
                className={`h-10 ${
                  errors.patente ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base font-mono uppercase`}
                maxLength={9}
              />
              {errors.patente && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.patente}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Formato chileno: 4 letras + guión + 2 números o 2 letras + guión + 4 números
              </p>
            </div>

            {/* Tipo de Vehículo */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-gray-700 font-semibold">
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
                  className={`h-10 ${
                    errors.tipo ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                >
                  <SelectValue placeholder="Seleccione el tipo de vehículo" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white text-gray-900 border border-gray-200">
                  {tiposVehiculo.map((tipo) => (
                    <SelectItem
                      key={tipo}
                      value={tipo}
                      className="text-gray-900 hover:bg-emerald-50"
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
              <Label htmlFor="capacidad" className="text-gray-700 font-semibold">
                Capacidad de Carga (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="capacidad"
                type="number"
                placeholder="ej: 8000"
                value={formData.capacidadKg}
                onChange={(e: ReturnType<typeof JSON.parse>) => {
                  setFormData({
                    ...formData,
                    capacidadKg: (e as ReturnType<typeof JSON.parse>).target.value,
                  });
                  setErrors({ ...errors, capacidadKg: "" });
                }}
                className={`h-10 ${
                  errors.capacidadKg ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base`}
                min="1"
                max="50000"
              />
              {errors.capacidadKg && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.capacidadKg}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Capacidad máxima de carga en kilogramos (hasta 50,000 kg)
              </p>
            </div>

            {/* Información Adicional */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4" />
                Información Importante
              </h3>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>El vehículo se registrará con estado "Activo" por defecto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>La patente debe ser única en el sistema</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>La capacidad se utilizará para calcular la disponibilidad de su flota</span>
                </li>
              </ul>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold h-10"
                disabled={crearMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm h-10"
                disabled={crearMutation.isPending}
              >
                {crearMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Vehículo
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
