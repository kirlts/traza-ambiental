"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, CheckCircle2, AlertCircle, Upload, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MONTHS_SHORT = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

export default function SinaderComplianceCard() {
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estado para el formulario
  const [formMonth, setFormMonth] = useState<string>("");
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formFolio, setFormFolio] = useState("");

  // Query estado cumplimiento
  const { data } = useQuery({
    queryKey: ["sinader-compliance", selectedYear],
    queryFn: async () => {
      const res = await fetch(`/api/gestor/cumplimiento-sinader?anio=${selectedYear}`);
      if (!res.ok) throw new Error("Error cargando cumplimiento");
      return res.json();
    },
  });

  // Mutation subir
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/gestor/cumplimiento-sinader", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Error subiendo declaración");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sinader-compliance", selectedYear] });
      setIsDialogOpen(false);
      toast.success("Declaración subida correctamente");
      resetForm();
    },
    onError: () => {
      toast.error("Error al subir declaración");
    },
  });

  const resetForm = () => {
    setFormMonth("");
    setFormFile(null);
    setFormFolio("");
  };

  const openUploadModal = (monthIndex?: number) => {
    if (monthIndex !== undefined) {
      setFormMonth((monthIndex + 1).toString());
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    if (!formMonth || !formFile) {
      toast.error("Mes y archivo son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("mes", formMonth);
    formData.append("anio", selectedYear.toString());
    formData.append("archivo", formFile);
    if (formFolio) formData.append("folioSinader", formFolio);

    uploadMutation.mutate(formData);
  };

  // Helpers para estado del mes
  const getMonthStatus = (monthIndex: number) => {
    const declaration = data?.declaraciones?.find(
      (d: ReturnType<typeof JSON.parse>) => d.mes === monthIndex + 1
    );
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (declaration) return "completed";
    if (selectedYear < currentYear) return "overdue";
    if (selectedYear === currentYear && monthIndex < currentMonth) return "overdue";
    if (selectedYear === currentYear && monthIndex === currentMonth) return "current";
    return "future";
  };

  // Calcular progreso
  const totalCompleted = data?.declaraciones?.length || 0;
  const currentMonthIndex = new Date().getMonth();
  const expectedCompleted = selectedYear < new Date().getFullYear() ? 12 : currentMonthIndex;
  const pendingCount = Math.max(0, expectedCompleted - totalCompleted);

  return (
    <Card className="border shadow-sm bg-white overflow-visible">
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Panel Izquierdo: Resumen y Acción */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800">SINADER</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Declaraciones Mensuales</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{totalCompleted}</span>
                <span className="text-sm text-slate-500">/ 12</span>
              </div>
              <div className="text-xs font-medium mt-1">
                {pendingCount > 0 ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {pendingCount} Pendientes
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Al día
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Select
              value={selectedYear.toString()}
              onValueChange={(v: ReturnType<typeof JSON.parse>) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-full bg-white h-9 text-xs border-slate-300 text-slate-900 z-10 relative">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 z-50">
                <SelectItem
                  value="2024"
                  className="text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  Año 2024
                </SelectItem>
                <SelectItem
                  value="2025"
                  className="text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  Año 2025
                </SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs font-medium"
                  onClick={() => openUploadModal()}
                >
                  <Upload className="h-3 w-3 mr-2" />
                  Subir Declaración
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border shadow-xl">
                <DialogHeader>
                  <DialogTitle className="text-slate-900">Subir Declaración SINADER</DialogTitle>
                  <CardDescription className="text-slate-500">
                    Carga el comprobante PDF oficial.
                  </CardDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-slate-800">Mes</Label>
                    <Select value={formMonth} onValueChange={setFormMonth}>
                      <SelectTrigger className="bg-white border-slate-300 text-slate-900">
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {MONTHS.map((m: ReturnType<typeof JSON.parse>, i) => (
                          <SelectItem
                            key={i}
                            value={(i + 1).toString()}
                            className="text-slate-900 hover:bg-slate-100"
                          >
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-800">Archivo PDF</Label>
                    <Input
                      type="file"
                      accept=".pdf"
                      className="bg-white border-slate-300 text-slate-900 file:text-slate-900 file:bg-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-slate-200"
                      onChange={(e: ReturnType<typeof JSON.parse>) =>
                        setFormFile((e as ReturnType<typeof JSON.parse>).target.files?.[0] || null)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-800">Folio (Opcional)</Label>
                    <Input
                      placeholder="Ej: 123456"
                      value={formFolio}
                      onChange={(e: ReturnType<typeof JSON.parse>) =>
                        setFormFolio((e as ReturnType<typeof JSON.parse>).target.value)
                      }
                      className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={uploadMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                      {uploadMutation.isPending ? "Subiendo..." : "Guardar"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Panel Derecho: Timeline Compacto */}
        <div className="flex-1 p-6 overflow-visible overflow-x-auto">
          <div className="grid grid-cols-6 lg:grid-cols-12 gap-3 min-w-[600px] pt-10">
            {MONTHS.map((monthName, index) => {
              const status = getMonthStatus(index);
              const declaration = data?.declaraciones?.find(
                (d: ReturnType<typeof JSON.parse>) => d.mes === index + 1
              );

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (status === "completed" && declaration?.archivoUrl) {
                      window.open(declaration.archivoUrl, "_blank");
                    } else if (status === "overdue" || status === "current") {
                      openUploadModal(index);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer h-24 relative group",
                    status === "completed" &&
                      "bg-emerald-50 border-emerald-200 hover:border-emerald-300",
                    status === "overdue" && "bg-white border-red-200 hover:bg-red-50",
                    status === "current" && "bg-white border-blue-300 ring-2 ring-blue-100",
                    status === "future" && "bg-slate-50 border-slate-100 opacity-50 cursor-default"
                  )}
                >
                  {/* Indicador Superior */}
                  <div className="mb-2">
                    {status === "completed" ? (
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                    ) : status === "overdue" ? (
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : status === "current" ? (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                    )}
                  </div>

                  {/* Nombre Mes */}
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      status === "completed"
                        ? "text-emerald-700"
                        : status === "overdue"
                          ? "text-red-700"
                          : "text-slate-500"
                    )}
                  >
                    {MONTHS_SHORT[index]}
                  </span>

                  {/* Tooltip on Hover */}
                  {status === "completed" && (
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none transition-opacity">
                      {declaration.folioSinader
                        ? `Folio: ${declaration.folioSinader}`
                        : "Ver Comprobante"}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                  {status === "overdue" && (
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs p-2 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none transition-opacity">
                      Clic para declarar
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-4 justify-end text-xs text-slate-500 px-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Completado
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div> Pendiente
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div> En curso
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
