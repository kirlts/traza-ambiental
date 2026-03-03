"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Truck, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type VehiculosResponse, type CapacidadVehiculoResponse } from "@/types/api";

// La interfaz Vehiculo ahora se importa desde @/types/auth

interface ModalSeleccionVehiculoProps {
  isOpen: boolean;
  solicitudFolio: string;
  pesoRequerido: number;
  onClose: () => void;
  onConfirm: (vehiculoId: string) => Promise<void>;
}

interface Vehiculo {
  id: string;
  patente: string;
  tipo: string;
  capacidadKg: number;
  estado: string;
}

export default function ModalSeleccionVehiculo({
  isOpen,
  solicitudFolio,
  pesoRequerido,
  onClose,
  onConfirm,
}: ModalSeleccionVehiculoProps) {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string>("");
  const [capacidades, setCapacidades] = useState<Record<string, number>>({});
  const [cargando, setCargando] = useState(false);
  const [cargandoVehiculos, setCargandoVehiculos] = useState(true);

  const cargarVehiculos = useCallback(async () => {
    setCargandoVehiculos(true);
    try {
      const response = await fetch("/api/transportista/vehiculos");
      if (response.ok) {
        const responseData: VehiculosResponse = await response.json();
        const vehiculosList = responseData.data.vehiculos as unknown as Vehiculo[];
        setVehiculos(vehiculosList);

        // Obtener capacidad disponible por vehículo
        const capacidadesObj: Record<string, number> = {};
        for (const v of vehiculosList) {
          if (v.estado === "activo") {
            try {
              const capResponse = await fetch(`/api/transportista/vehiculos/${v.id}/capacidad`);
              if (capResponse.ok) {
                const capData: CapacidadVehiculoResponse = await capResponse.json();
                capacidadesObj[v.id] = capData.data.capacidadDisponible;
              }
            } catch (error: unknown) {
              console.error(`Error al obtener capacidad del vehículo ${v.id}:`, error);
              // Usar capacidad total como fallback
              capacidadesObj[v.id] = v.capacidadKg;
            }
          }
        }
        setCapacidades(capacidadesObj);

        // Seleccionar primer vehículo por defecto si hay disponibles y tienen capacidad
        if (vehiculosList.length > 0 && !vehiculoSeleccionado) {
          // Preferir uno que tenga capacidad
          const apto = vehiculosList.find(
            (v) => v.estado === "activo" && (capacidadesObj[v.id] || 0) >= pesoRequerido
          );
          if (apto) {
            setVehiculoSeleccionado(apto.id);
          } else {
            setVehiculoSeleccionado(vehiculosList[0].id);
          }
        }
      }
    } catch (error: unknown) {
      console.error("Error al cargar vehículos:", error);
    } finally {
      setCargandoVehiculos(false);
    }
  }, [pesoRequerido, vehiculoSeleccionado]);

  useEffect(() => {
    if (isOpen) {
      cargarVehiculos();
    }
  }, [isOpen, cargarVehiculos]);

  const handleSubmit = async () => {
    if (!vehiculoSeleccionado) {
      return;
    }

    setCargando(true);
    try {
      await onConfirm(vehiculoSeleccionado);
      onClose();
      setVehiculoSeleccionado("");
    } catch (error: unknown) {
      console.error("Error al aceptar solicitud:", error);
    } finally {
      setCargando(false);
    }
  };

  const vehiculo = vehiculos.find((v) => v.id === vehiculoSeleccionado);
  const capacidadVehiculo = vehiculo?.capacidadKg || 0;
  const capacidadDisponible = vehiculo ? capacidades[vehiculo.id] : 0;
  const tieneCapacidad = capacidadDisponible >= pesoRequerido;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-xl border-0 z-[9999]">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-100">
          <div className="mx-auto bg-[#459e60]/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <Truck className="h-6 w-6 text-[#459e60]" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-[#2b3b4c]">
            Aceptar Solicitud de Retiro
          </DialogTitle>
          <DialogDescription className="text-center text-[#2b3b4c]/60">
            Selecciona el vehículo que realizará el retiro #{solicitudFolio}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium text-[#2b3b4c]/70">Peso total a retirar:</span>
            <span className="text-lg font-bold text-[#459e60]">{pesoRequerido} kg</span>
          </div>

          {cargandoVehiculos ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#459e60]"></div>
            </div>
          ) : vehiculos.length === 0 ? (
            <div className="text-center py-4 space-y-3">
              <div className="text-red-500 bg-red-50 p-3 rounded-lg inline-flex">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-gray-900 font-medium">No tienes vehículos disponibles</p>
              <p className="text-sm text-gray-500">
                Debes registrar al menos un vehículo para aceptar solicitudes.
              </p>
              <Link
                href="/dashboard/transportista/vehiculos"
                className="inline-flex items-center text-[#459e60] hover:underline font-medium text-sm"
              >
                Ir a gestión de vehículos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2b3b4c]">Seleccionar Vehículo</label>
                <select
                  value={vehiculoSeleccionado}
                  onChange={(e) => setVehiculoSeleccionado(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#459e60]/20 focus:border-[#459e60] transition-all text-sm"
                >
                  <option value="" disabled>
                    Selecciona un vehículo...
                  </option>
                  {vehiculos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.patente} - {v.tipo} ({v.capacidadKg} kg)
                    </option>
                  ))}
                </select>
              </div>

              {vehiculo && (
                <div
                  className={`p-4 rounded-lg border transition-all ${tieneCapacidad ? "bg-[#f6fcf3] border-[#459e60]/20" : "bg-red-50 border-red-100"}`}
                >
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#2b3b4c]/70">Capacidad total:</span>
                      <span className="font-medium text-[#2b3b4c]">{capacidadVehiculo} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#2b3b4c]/70">Disponible actual:</span>
                      <span
                        className={`font-bold ${tieneCapacidad ? "text-[#459e60]" : "text-red-600"}`}
                      >
                        {capacidadDisponible} kg
                      </span>
                    </div>
                  </div>

                  {!tieneCapacidad && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-red-600 bg-red-100/50 p-2 rounded border border-red-200">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p>Capacidad insuficiente para esta carga ({pesoRequerido} kg).</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between gap-3 border-t border-gray-100 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={cargando}
            className="w-full sm:w-auto border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={cargando || !vehiculoSeleccionado || (!!vehiculo && !tieneCapacidad)}
            className="w-full sm:w-auto bg-[#459e60] hover:bg-[#3d8b54] text-white shadow-md shadow-[#459e60]/20"
          >
            {cargando ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Confirmar Asignación
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
