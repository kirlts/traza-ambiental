"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Package,
  Truck,
  User,
  ArrowLeft,
  Factory,
  Upload,
  FileText,
  AlertCircle,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const TIPOS_TRATAMIENTO = [
  {
    value: "RECAUCHAJE",
    label: "Recauchaje",
    description: "Reutilización de la banda de rodamiento",
  },
  {
    value: "RECICLAJE_MATERIAL",
    label: "Reciclaje Material",
    description: "Reciclaje del material del neumático",
  },
  {
    value: "COPROCESAMIENTO",
    label: "Co-procesamiento",
    description: "Uso como combustible alternativo",
  },
  {
    value: "VALORIZACION_ENERGETICA",
    label: "Valorización Energética",
    description: "Generación de energía a partir del neumático",
  },
  { value: "OTRO", label: "Otro", description: "Tratamiento específico no listado" },
];

export default function AsignarTratamientoPage({ params }: { params: Promise<{ id: string }> }) {
  // Resolver params usando use() de React (Next.js 15) - DEBE ir al principio
  const { id } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [archivos, setArchivos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoTratamientoSeleccionado, setTipoTratamientoSeleccionado] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: autorizacionesData } = useQuery({
    queryKey: ["gestor-autorizaciones"],
    queryFn: async () => {
      const response = await fetch("/api/gestor/autorizaciones");
      if (!response.ok) return null;
      return response.json();
    },
  });

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["lote-detalle", id],
    queryFn: async () => {
      const response = await fetch(`/api/solicitudes/${id}`);
      if (!response.ok) {
        throw new Error("Error cargando detalles del lote");
      }
      const data = await response.json();
      return data.data || data;
    },
    enabled: !!id,
  });

  const asignarTratamientoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/solicitudes/${id}/asignar-tratamiento`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error asignando tratamiento"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestor-lotes-pendientes-tratamiento"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-tratamientos-asignados"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-completadas"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-completadas-stats"] });
      queryClient.invalidateQueries({ queryKey: ["solicitud-detalle", id] });
      queryClient.invalidateQueries({ queryKey: ["lote-detalle", id] });
      router.push("/dashboard/gestor/tratamientos?success=true");
    },
  });

  useEffect(() => {
    const campoOtro = document.getElementById("otroTratamiento");
    if (campoOtro) {
      campoOtro.style.display = tipoTratamientoSeleccionado === "OTRO" ? "block" : "none";
    }
  }, [tipoTratamientoSeleccionado]);

  const lote = responseData;

  // Función para verificar autorización
  const checkAutorizacion = (tipoValue: string) => {
    if (!autorizacionesData) return { autorizado: true, mensaje: "" }; // Estado inicial

    // Si es OTRO, permitimos (con validación posterior manual si se requiere)
    if (tipoValue === "OTRO") return { autorizado: true, mensaje: "" };

    // 1. Verificación estricta por autorizaciones específicas
    if (autorizacionesData.autorizaciones && autorizacionesData.autorizaciones.length > 0) {
      const auth = autorizacionesData.autorizaciones.find(
        (a: { tratamientosAutorizados: string[] }) => a.tratamientosAutorizados.includes(tipoValue)
      );
      if (auth) {
        return { autorizado: true, mensaje: "✅ Autorizado" };
      }
      return { autorizado: false, mensaje: "❌ No autorizado" };
    }

    // 2. Fallback: Si no hay autorizaciones específicas, verificar perfil global
    // Esto asegura compatibilidad con usuarios anteriores a HU-021
    if (
      autorizacionesData.perfilLegal?.status === "VERIFICADO" &&
      autorizacionesData.perfilLegal?.isResolutionVerified
    ) {
      return { autorizado: true, mensaje: "✅ Autorizado (Global)" };
    }

    return { autorizado: false, mensaje: "❌ Requiere autorización sanitaria" };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Agregar archivos
      archivos.forEach((archivo, index) => {
        formData.append(`documento${index + 1}`, archivo);
      });

      await asignarTratamientoMutation.mutateAsync(formData);
    } catch (error: unknown) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.error("Errores de validación", {
        description: (
          <ul className="list-disc pl-4">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        ),
      });
    }

    if (validFiles.length > 0) {
      setArchivos((prev) => {
        const newFiles = [...prev, ...validFiles];
        // Limitar a 10 archivos máximo
        return newFiles.slice(0, 10);
      });
    }

    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
    e.target.value = "";
  };

  const removeArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const validateFile = (file: File): string | null => {
    // Validar tamaño máximo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return `El archivo ${file.name} es demasiado grande. Máximo 5MB.`;
    }

    // Validar tipo de archivo
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return `Tipo de archivo no permitido: ${file.name}. Solo PDF, JPG, PNG, DOC, DOCX.`;
    }

    return null; // Archivo válido
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast.error("Errores de validación", {
        description: (
          <ul className="list-disc pl-4">
            {errors.map((err: string, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        ),
      });
    }

    if (validFiles.length > 0) {
      setArchivos((prev) => {
        const newFiles = [...prev, ...validFiles];
        // Limitar a 10 archivos máximo
        return newFiles.slice(0, 10);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin mx-auto"
                  style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                ></div>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">
                Cargando Lote
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Obteniendo información del lote a tratar...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Lote no encontrado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El lote solicitado no existe o no está disponible.
            </p>
            <Link href="/dashboard/gestor/tratamientos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Tratamientos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Botón Volver */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-[#459e60] hover:text-[#44a15d] font-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a Tratamientos
        </Button>

        {/* Información del Lote (Referencia) */}
        <Card className="border-2 border-[#459e60]/20 shadow-xl">
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Información del Lote</h2>
                <p className="text-sm text-white/80">
                  Datos del lote a tratar - Folio: {lote.folio}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#2b3b4c] flex items-center gap-2">
                  <User className="h-4 w-4 text-[#459e60]" />
                  Generador
                </Label>
                <div className="text-lg font-bold text-[#459e60]">
                  {lote.generador?.name || "No disponible"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#2b3b4c] flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[#459e60]" />
                  Peso Validado
                </Label>
                <div className="text-lg font-bold text-[#459e60]">
                  {lote?.pesoReal
                    ? `${lote.pesoReal} kg`
                    : lote?.pesoRomana
                      ? `${lote.pesoRomana} kg`
                      : "No disponible"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#2b3b4c] flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#459e60]" />
                  Categoría
                </Label>
                <div className="text-lg font-bold text-[#459e60]">
                  {(() => {
                    const categorias: string[] = [];
                    if (lote?.categoriaA_cantidad > 0) {
                      categorias.push(`A (${lote.categoriaA_cantidad})`);
                    }
                    if (lote?.categoriaB_cantidad > 0) {
                      categorias.push(`B (${lote.categoriaB_cantidad})`);
                    }
                    return categorias.length > 0
                      ? categorias.join(", ")
                      : lote?.categoriaVerificada?.join(", ") || "Sin categorías";
                  })()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Asignación */}
        <form onSubmit={handleSubmit}>
          <Card className="border-2 border-[#459e60]/20 shadow-xl">
            <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Factory className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Asignar Tratamiento</h2>
                  <p className="text-sm text-white/80">
                    Complete la información del tratamiento y suba los documentos de respaldo
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 bg-white space-y-6">
              {/* Tipo de Tratamiento */}
              <div className="space-y-3">
                <Label
                  htmlFor="tipoTratamiento"
                  className="text-[#2b3b4c] font-semibold flex items-center gap-2"
                >
                  <Factory className="h-4 w-4 text-[#459e60]" />
                  Tipo de Tratamiento <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="tipoTratamiento"
                  required
                  value={tipoTratamientoSeleccionado}
                  onValueChange={setTipoTratamientoSeleccionado}
                >
                  <SelectTrigger className="h-12 border-2 border-[#459e60]/30 focus:border-[#459e60] text-base">
                    <SelectValue placeholder="Selecciona el tipo de tratamiento" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white text-gray-900 border-2 border-gray-200 shadow-xl">
                    {TIPOS_TRATAMIENTO.map((tipo) => {
                      const status = checkAutorizacion(tipo.value);
                      return (
                        <SelectItem
                          key={tipo.value}
                          value={tipo.value}
                          disabled={!status.autorizado}
                          className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0] data-[disabled]:opacity-50"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{tipo.label}</span>
                              <span className="text-xs font-normal opacity-70">
                                {status.mensaje}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{tipo.description}</div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Campo adicional para "Otro" */}
              <div className="space-y-3" id="otroTratamiento" style={{ display: "none" }}>
                <Label htmlFor="otroTratamiento" className="text-[#2b3b4c] font-semibold">
                  Especificar Tratamiento
                </Label>
                <Input
                  name="otroTratamiento"
                  placeholder="Describe el tipo de tratamiento específico"
                  className="h-12 border-2 border-[#459e60]/30 focus:border-[#459e60] text-base"
                />
              </div>

              {/* Fechas */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label
                    htmlFor="fechaInicioTratamiento"
                    className="text-[#2b3b4c] font-semibold flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-[#459e60]" />
                    Fecha de Inicio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    name="fechaInicioTratamiento"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="h-12 border-2 border-[#459e60]/30 focus:border-[#459e60] text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="fechaFinTratamiento"
                    className="text-[#2b3b4c] font-semibold flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-[#459e60]" />
                    Fecha de Finalización
                  </Label>
                  <Input
                    type="date"
                    name="fechaFinTratamiento"
                    min={new Date().toISOString().split("T")[0]}
                    className="h-12 border-2 border-[#459e60]/30 focus:border-[#459e60] text-base"
                  />
                </div>
              </div>

              {/* Descripción y Ubicación */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="descripcionTratamiento" className="text-[#2b3b4c] font-semibold">
                    Descripción del Proceso
                  </Label>
                  <Textarea
                    name="descripcionTratamiento"
                    placeholder="Describe brevemente el proceso de tratamiento aplicado..."
                    rows={4}
                    className="w-full border-2 border-[#459e60]/30 focus:border-[#459e60] resize-none text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="ubicacionTratamiento"
                    className="text-[#2b3b4c] font-semibold flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4 text-[#459e60]" />
                    Ubicación del Tratamiento
                  </Label>
                  <Input
                    name="ubicacionTratamiento"
                    placeholder="Dirección o referencia de la instalación"
                    className="h-12 border-2 border-[#459e60]/30 focus:border-[#459e60] text-base"
                  />
                </div>
              </div>

              {/* Documentos de Evidencia */}
              <div className="space-y-6 pt-2">
                <Label className="text-lg text-[#2b3b4c] font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-[#459e60]" />
                  Documentos de Evidencia <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600 -mt-4">
                  Sube al menos un documento que certifique el tratamiento aplicado
                </p>

                {/* Área de drop */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    isDragOver
                      ? "border-[#459e60] bg-[#f0f9f0]"
                      : "border-[#459e60]/30 hover:border-[#459e60]/60 bg-gradient-to-br from-white to-[#f0f9f0]/30"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload
                    className={`h-12 w-12 mx-auto mb-4 transition-colors ${
                      isDragOver ? "text-[#459e60]" : "text-[#459e60]/60"
                    }`}
                  />
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium text-[#2b3b4c]">
                      {isDragOver
                        ? "¡Suelta los archivos aquí!"
                        : "Arrastra y suelta archivos aquí, o haz clic para seleccionar"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Formatos: PDF, JPG, PNG, DOC, DOCX | Máximo 10 archivos, 5MB cada uno
                    </p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label
                    htmlFor="file-upload"
                    className={`inline-flex items-center px-6 py-3 rounded-lg cursor-pointer transition-colors font-semibold ${
                      isDragOver
                        ? "bg-[#44a15d] text-white"
                        : "bg-gradient-to-r from-[#459e60] to-[#44a15d] text-white hover:from-[#44a15d] hover:to-[#4fa362]"
                    }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Seleccionar Archivos
                  </Label>
                </div>

                {/* Lista de archivos seleccionados */}
                {archivos.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#2b3b4c]">
                      Archivos seleccionados ({archivos.length}):
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {archivos.map((archivo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-[#f0f9f0] border-2 border-[#459e60]/40 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText className="h-5 w-5 text-[#459e60] flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-[#2b3b4c] truncate">
                                {archivo.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {(archivo.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArchivo(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 mt-6">
            <Link href="/dashboard/gestor/tratamientos">
              <Button type="button" variant="outline" className="px-6 py-3 text-base">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || archivos.length === 0}
              className="min-w-40 bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#4fa362] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Asignando...
                </>
              ) : (
                <>
                  <Factory className="h-5 w-5 mr-3" />
                  Asignar Tratamiento
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
