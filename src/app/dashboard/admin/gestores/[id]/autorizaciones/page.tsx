"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Plus, FileText, Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const TREATMENTS = [
  { value: "RECAUCHAJE", label: "Recauchaje" },
  { value: "RECICLAJE_MATERIAL", label: "Reciclaje Material" },
  { value: "CO_PROCESAMIENTO", label: "Co-procesamiento" },
  { value: "VALORIZACION_ENERGETICA", label: "Valorización Energética" },
  { value: "OTRO", label: "Otro" },
];
interface AutorizacionFormData {
  numeroResolucion: string;
  autoridadEmisora: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  capacidadAnualTn: number;
  categoriasResiduos: string[];
  tratamientosAutorizados: string[];
  observaciones?: string;
}
export default function GestionAutorizacionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: gestorId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch autorizaciones
  const { data, isLoading } = useQuery({
    queryKey: ["admin-gestor-autorizaciones", gestorId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/gestores/${gestorId}/autorizaciones`);
      if (!res.ok) throw new Error("Error cargando autorizaciones");
      return res.json();
    },
  });

  // Mutation crear
  const createMutation = useMutation<unknown, Error, AutorizacionFormData>({
    mutationFn: async (formData) => {
      const res = await fetch(`/api/admin/gestores/${gestorId}/autorizaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear autorización");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gestor-autorizaciones", gestorId] });
      setIsOpen(false);
      toast.success("Autorización creada exitosamente");
    },
    onError: (err: unknown) => {
      toast.error((err as Error).message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Recolectar tratamientos seleccionados (multi-select manual con checkboxes en el form)
    // Simplificación: usaremos el Select múltiple o checkboxes
    // Aquí asumiremos que el form envía los datos correctos.
    // Para simplificar la UI, usaré un estado local para los checkboxes

    createMutation.mutate({
      numeroResolucion: formData.get("numeroResolucion") as string,
      autoridadEmisora: formData.get("autoridadEmisora") as string,
      fechaEmision: formData.get("fechaEmision") as string,
      fechaVencimiento: formData.get("fechaVencimiento") as string,
      capacidadAnualTn: Number(formData.get("capacidadAnualTn")),
      categoriasResiduos: (formData.get("categoriasResiduos") as string)
        .split(",")
        .map((s) => s.trim()),
      tratamientosAutorizados: selectedTreatments,
      observaciones: formData.get("observaciones") as string,
    });
  };

  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  const toggleTreatment = (value: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  return (
    <DashboardLayout
      title="Gestión de Autorizaciones Sanitarias"
      subtitle="Administración detallada de resoluciones por gestor"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Autorizaciones Vigentes</h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nueva Autorización
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Autorización Sanitaria</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Número de Resolución</Label>
                    <Input name="numeroResolucion" required placeholder="Ej: Res. Ex. N° 1234" />
                  </div>
                  <div className="space-y-2">
                    <Label>Autoridad Emisora</Label>
                    <Input name="autoridadEmisora" required placeholder="Ej: SEREMI Salud RM" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha Emisión</Label>
                    <Input name="fechaEmision" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Fecha Vencimiento</Label>
                    <Input name="fechaVencimiento" type="date" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tratamientos Autorizados</Label>
                  <div className="grid grid-cols-2 gap-2 border p-3 rounded-md">
                    {TREATMENTS.map((t) => (
                      <div key={t.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={t.value}
                          checked={selectedTreatments.includes(t.value)}
                          onCheckedChange={() => toggleTreatment(t.value)}
                        />
                        <label htmlFor={t.value} className="text-sm cursor-pointer">
                          {t.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Capacidad Anual (Ton)</Label>
                    <Input name="capacidadAnualTn" type="number" required placeholder="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categorías Residuos (Sep. por comas)</Label>
                    <Input
                      name="categoriasResiduos"
                      required
                      placeholder="Neumáticos, Envases, etc."
                      defaultValue="Neumáticos"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observaciones</Label>
                  <Input name="observaciones" placeholder="Notas adicionales" />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Guardando..." : "Guardar Autorización"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <div className="grid gap-4">
            {data?.autorizaciones?.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 border rounded-lg text-gray-500">
                No hay autorizaciones registradas.
              </div>
            ) : (
              data?.autorizaciones?.map((auth: ReturnType<typeof JSON.parse>) => (
                <Card key={auth.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          {auth.numeroResolucion}
                        </CardTitle>
                        <CardDescription>{auth.autoridadEmisora}</CardDescription>
                      </div>
                      <Badge variant={auth.estado === "VIGENTE" ? "default" : "destructive"}>
                        {auth.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-gray-600">Vigencia</p>
                        <p>
                          {format(new Date(auth.fechaEmision), "dd/MM/yyyy")} -{" "}
                          {format(new Date(auth.fechaVencimiento), "dd/MM/yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Capacidad</p>
                        <p className="flex items-center gap-1">
                          <Scale className="h-4 w-4" />
                          {auth.capacidadAnualTn} Ton/Año
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Tratamientos</p>
                        <ul className="list-disc pl-4">
                          {auth.tratamientosAutorizados.map((t: string) => (
                            <li key={t}>{t.replace("_", " ")}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
