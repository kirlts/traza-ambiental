"use client";

import { useState, use, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Truck,
  AlertTriangle,
  CheckCircle,
  Upload,
  X,
  Scale,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AlertaMatchTransporte from "@/components/trazabilidad/AlertaMatchTransporte";

interface DatosTransportista {
  id: string;
  folio: string;
  fechaEntrega: string;
  pesoDeclarado: number | null;
  cantidadDeclarada: number | null;
  categoriaDeclarada: string[];
  fotosTransportista: string[];
  observacionesTransportista: string | null;
  generador: {
    name: string;
    email: string;
  };
  transportista: {
    name: string;
    email: string;
  } | null;
  vehiculo: {
    patente: string;
    tipo: string;
  } | null;
  nombreReceptor: string | null;
  rutReceptor: string | null;
  observacionesEntrega: string | null;
  ubicacionEntregaGPS: string | null;
  estado?: string;
}

interface Discrepancia {
  tipo: "peso" | "cantidad" | "categoria";
  porcentajeDiferencia: number | null;
  significativa: boolean;
}

interface RespuestaValidacion {
  solicitud: {
    id: string;
    folio: string;
    estado: string;
    fechaRecepcionPlanta: string;
  };
  discrepancias: Discrepancia[];
  archivosProcesados: number;
}

export default function ValidarRecepcionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Estado del formulario
  const [pesoRomana, setPesoRomana] = useState("");
  const [cantidadVerificada, setCantidadVerificada] = useState("");
  const [categoriaVerificada, setCategoriaVerificada] = useState<string[]>([]);
  const [observacionesGestor, setObservacionesGestor] = useState("");
  const [guiaDespacho, setGuiaDespacho] = useState<File | null>(null);
  const [fotos, setFotos] = useState<File[]>([]);
  const guiaDespachoInputRef = useRef<HTMLInputElement>(null);

  // Obtener datos del transportista
  const {
    data: datosTransportista,
    isLoading: loadingDatos,
    error: errorDatos,
  } = useQuery({
    queryKey: ["datos-transportista", id],
    queryFn: async (): Promise<DatosTransportista> => {
      const response = await fetch(`/api/solicitudes/${id}/datos-transportista`);
      if (!response.ok) {
        throw new Error("Error obteniendo datos del transportista");
      }
      return response.json();
    },
  });

  // Calcular discrepancias en tiempo real
  const discrepancias = calcularDiscrepanciasLocales();

  // Mutación para validar recepción
  const validarMutation = useMutation({
    mutationFn: async (formData: FormData): Promise<RespuestaValidacion> => {
      const response = await fetch(`/api/solicitudes/${id}/validar-recepcion`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Error validando recepción";
        try {
          const error = await response.json();
          errorMessage =
            (error as { error?: string; message?: string }).error ||
            (error instanceof Error ? error.message : String(error)) ||
            errorMessage;

          // Agregar detalles si están disponibles
          if (
            (error as ReturnType<typeof JSON.parse>).details &&
            Array.isArray((error as ReturnType<typeof JSON.parse>).details)
          ) {
            const detalles = (error as ReturnType<typeof JSON.parse>).details
              .map((d: ReturnType<typeof JSON.parse>) => d.message || d.path?.join("."))
              .join(", ");
            if (detalles) {
              errorMessage += `: ${detalles}`;
            }
          }
        } catch {
          // Si no se puede parsear el error, usar el mensaje por defecto
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data: RespuestaValidacion) => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["recepciones-pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-completadas-stats"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-recepciones-completadas"] });
      queryClient.invalidateQueries({ queryKey: ["gestor-lotes-pendientes-tratamiento"] });
      queryClient.invalidateQueries({ queryKey: ["solicitud-detalle", id] });

      // Mostrar mensaje de éxito y redirigir
      toast.success(`Recepción validada exitosamente`, {
        description: `Solicitud ${data.solicitud.folio} marcada como RECIBIDA EN PLANTA`,
      });

      // Redirigir a la lista de recepciones
      router.push("/dashboard/gestor/recepciones");
    },
    onError: (error: unknown) => {
      toast.error("Error al validar recepción", {
        description: error instanceof Error ? error.message : "Error desconocido",
      });
    },
  });

  // Función para calcular discrepancias localmente
  function calcularDiscrepanciasLocales() {
    if (!datosTransportista) return [];

    const discrepancias: Array<{
      tipo: string;
      porcentaje: number | null;
      significativa: boolean;
      descripcion: string;
    }> = [];

    // Discrepancia de peso
    const pesoRomanaNum = parseFloat(pesoRomana);
    if (pesoRomanaNum > 0 && datosTransportista.pesoDeclarado) {
      const porcentaje =
        ((pesoRomanaNum - datosTransportista.pesoDeclarado) / datosTransportista.pesoDeclarado) *
        100;
      if (Math.abs(porcentaje) > 1) {
        discrepancias.push({
          tipo: "peso",
          porcentaje,
          significativa: Math.abs(porcentaje) > 20,
          descripcion: `${porcentaje > 0 ? "+" : ""}${porcentaje.toFixed(1)}% (${pesoRomanaNum}kg vs ${datosTransportista.pesoDeclarado}kg declarado)`,
        });
      }
    }

    // Discrepancia de cantidad
    const cantidadNum = parseInt(cantidadVerificada);
    if (cantidadNum > 0 && datosTransportista.cantidadDeclarada) {
      const porcentaje =
        ((cantidadNum - datosTransportista.cantidadDeclarada) /
          datosTransportista.cantidadDeclarada) *
        100;
      if (Math.abs(porcentaje) > 0) {
        discrepancias.push({
          tipo: "cantidad",
          porcentaje,
          significativa: Math.abs(porcentaje) > 25,
          descripcion: `${porcentaje > 0 ? "+" : ""}${porcentaje.toFixed(1)}% (${cantidadNum} vs ${datosTransportista.cantidadDeclarada} unidades declaradas)`,
        });
      }
    }

    // Discrepancia de categoría
    if (categoriaVerificada.length > 0) {
      const categoriasDiferentes =
        datosTransportista.categoriaDeclarada.some(
          (cat: string) => !categoriaVerificada.includes(cat)
        ) ||
        categoriaVerificada.some(
          (cat: string) => !datosTransportista.categoriaDeclarada.includes(cat)
        );

      if (categoriasDiferentes) {
        discrepancias.push({
          tipo: "categoria",
          porcentaje: null,
          significativa: false,
          descripcion: `Categorías verificadas (${categoriaVerificada.join(", ")}) difieren de declaradas (${datosTransportista.categoriaDeclarada.join(", ")})`,
        });
      }
    }

    return discrepancias;
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datosTransportista) return;

    // Validaciones básicas
    if (!pesoRomana || parseFloat(pesoRomana) <= 0) {
      toast.error("Debe ingresar un peso válido");
      return;
    }

    if (!cantidadVerificada || parseInt(cantidadVerificada) <= 0) {
      toast.error("Debe ingresar una cantidad válida");
      return;
    }

    if (categoriaVerificada.length === 0) {
      toast.error("Debe seleccionar al menos una categoría");
      return;
    }

    // Crear FormData
    const formData = new FormData();

    // Asegurar que los valores sean strings válidos
    const pesoRomanaValue = pesoRomana.trim();
    const cantidadVerificadaValue = cantidadVerificada.trim();
    const categoriaVerificadaValue = JSON.stringify(categoriaVerificada);

    formData.append("pesoRomana", pesoRomanaValue);
    formData.append("cantidadVerificada", cantidadVerificadaValue);
    formData.append("categoriaVerificada", categoriaVerificadaValue);

    if (observacionesGestor && observacionesGestor.trim()) {
      formData.append("observacionesGestor", observacionesGestor.trim());
    }

    // Agregar archivos
    if (guiaDespacho) {
      formData.append("guiaDespacho", guiaDespacho);
    }

    fotos.forEach((foto, index) => {
      formData.append(`foto${index}`, foto);
    });

    // Log para debugging eliminado

    validarMutation.mutate(formData);
  };

  // Manejar checkboxes de categoría
  const handleCategoriaChange = (categoria: string, checked: boolean) => {
    if (checked) {
      setCategoriaVerificada([...categoriaVerificada, categoria]);
    } else {
      setCategoriaVerificada(categoriaVerificada.filter((cat: string) => cat !== categoria));
    }
  };

  // Manejar subida de archivos
  const handleGuiaDespachoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error("Archivo demasiado grande", {
          description: "La guía de despacho no debe superar 5MB",
        });
        return;
      }
      setGuiaDespacho(file);
    }
  };

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validFiles = files.filter((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Foto demasiado grande`, {
          description: `La foto ${file.name} supera 5MB y no será incluida`,
        });
        return false;
      }
      return true;
    });

    if (fotos.length + validFiles.length > 5) {
      toast.error("Máximo 5 fotos permitidas");
      return;
    }

    setFotos([...fotos, ...validFiles]);
  };

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
  };

  if (loadingDatos) {
    return (
      <DashboardLayout title="Validar Recepción">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-[#459e60] hover:text-[#44a15d] font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Recepciones
          </Button>
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (errorDatos || !datosTransportista) {
    return (
      <DashboardLayout title="Validar Recepción">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-[#459e60] hover:text-[#44a15d] font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Recepciones
          </Button>
          <Card className="border-2 border-red-500 shadow-xl">
            <CardContent className="p-6">
              <p className="text-red-600 font-semibold">
                Error: {errorDatos instanceof Error ? errorDatos.message : "Error cargando datos"}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Validar Recepción" subtitle={`Folio: ${datosTransportista.folio}`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botón Volver */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-[#459e60] hover:text-[#44a15d] font-semibold"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver a Recepciones
        </Button>

        {/* Alerta de Match de Transporte (HU-028) */}
        <AlertaMatchTransporte
          solicitudId={id}
          estadoActual="ENTREGADA_GESTOR" // Asumimos este estado porque estamos en validar recepción
          transportista={datosTransportista.transportista}
        />

        {/* Datos del Transportista (Referencia) */}
        <Card className="border-2 border-[#459e60]/20 shadow-xl">
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Datos del Transportista (Referencia)
                </h2>
                <p className="text-sm text-white/80">
                  Información declarada por el transportista durante la entrega
                </p>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#2b3b4c]">Peso Declarado</Label>
                <div className="text-xl font-bold text-[#459e60]">
                  {datosTransportista.pesoDeclarado
                    ? `${datosTransportista.pesoDeclarado} kg`
                    : "No declarado"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#2b3b4c]">Cantidad Declarada</Label>
                <div className="text-xl font-bold text-[#459e60]">
                  {datosTransportista.cantidadDeclarada
                    ? `${datosTransportista.cantidadDeclarada} unidades`
                    : "No declarada"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#2b3b4c]">Categoría Declarada</Label>
                <div className="text-xl font-bold text-[#459e60]">
                  {datosTransportista.categoriaDeclarada.length > 0
                    ? datosTransportista.categoriaDeclarada.join(", ")
                    : "No declarada"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Validación */}
        <form onSubmit={handleSubmit}>
          <Card className="border-2 border-[#459e60]/20 shadow-xl">
            <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Validación del Gestor</h2>
                  <p className="text-sm text-white/80">
                    Ingrese los datos verificados físicamente en la romana
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* Peso Real y Cantidad */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pesoRomana" className="text-[#2b3b4c] font-semibold">
                    Peso Real según Romana (kg) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pesoRomana"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10000"
                    value={pesoRomana}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPesoRomana(e.target.value)
                    }
                    placeholder="0.00"
                    required
                    className="border-2 border-[#459e60]/30 focus:border-[#459e60] text-lg h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cantidadVerificada" className="text-[#2b3b4c] font-semibold">
                    Cantidad Verificada (unidades) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidadVerificada"
                    type="number"
                    min="1"
                    max="2000"
                    value={cantidadVerificada}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCantidadVerificada(e.target.value)
                    }
                    placeholder="0"
                    required
                    className="border-2 border-[#459e60]/30 focus:border-[#459e60] text-lg h-12"
                  />
                </div>
              </div>

              {/* Categoría Verificada */}
              <div className="space-y-3">
                <Label className="text-[#2b3b4c] font-semibold">
                  Categoría Verificada <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                  <div className="flex items-center space-x-3 p-4 border-2 border-[#459e60]/20 rounded-lg hover:border-[#459e60]/40 transition-colors">
                    <Checkbox
                      id="categoriaA"
                      checked={categoriaVerificada.includes("A")}
                      onCheckedChange={(checked: boolean) => handleCategoriaChange("A", checked)}
                      className="h-5 w-5 border-2 border-[#459e60]"
                    />
                    <Label
                      htmlFor="categoriaA"
                      className="text-sm font-medium text-[#2b3b4c] cursor-pointer"
                    >
                      Categoría A - Neumáticos de vehículos livianos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border-2 border-[#459e60]/20 rounded-lg hover:border-[#459e60]/40 transition-colors">
                    <Checkbox
                      id="categoriaB"
                      checked={categoriaVerificada.includes("B")}
                      onCheckedChange={(checked: boolean) => handleCategoriaChange("B", checked)}
                      className="h-5 w-5 border-2 border-[#459e60]"
                    />
                    <Label
                      htmlFor="categoriaB"
                      className="text-sm font-medium text-[#2b3b4c] cursor-pointer"
                    >
                      Categoría B - Neumáticos de vehículos pesados
                    </Label>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <Label htmlFor="observaciones" className="text-[#2b3b4c] font-semibold">
                  Observaciones sobre el estado de los NFU
                </Label>
                <Textarea
                  id="observaciones"
                  value={observacionesGestor}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setObservacionesGestor(e.target.value)
                  }
                  placeholder="Describa el estado físico de los neumáticos, cualquier daño, etc."
                  rows={4}
                  className="w-full border-2 border-[#459e60]/30 focus:border-[#459e60] resize-none text-base"
                />
              </div>

              {/* Documentos */}
              <div className="space-y-6 pt-2">
                <Label className="text-lg text-[#2b3b4c] font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6 text-[#459e60]" />
                  Documentos Adjuntos
                </Label>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Guía de Despacho */}
                  <div className="space-y-3 p-5 border-2 border-[#459e60]/20 rounded-xl bg-gradient-to-br from-white to-[#f0f9f0]/30">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-[#459e60]" />
                      <Label
                        htmlFor="guiaDespacho"
                        className="text-base font-semibold text-[#2b3b4c] cursor-pointer"
                      >
                        Guía de Despacho
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">PDF, JPG, PNG (máx. 5MB)</p>
                    <div className="space-y-3">
                      <Input
                        ref={guiaDespachoInputRef}
                        id="guiaDespacho"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleGuiaDespachoChange}
                        className="border-2 border-[#459e60]/30 focus:border-[#459e60] cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#459e60] file:text-white hover:file:bg-[#44a15d] transition-colors"
                      />
                      {guiaDespacho ? (
                        <div className="flex items-center justify-between p-4 bg-[#f0f9f0] border-2 border-[#459e60]/40 rounded-lg">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <CheckCircle className="h-5 w-5 text-[#459e60] flex-shrink-0" />
                            <span className="text-sm font-medium text-[#2b3b4c] truncate">
                              {guiaDespacho.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setGuiaDespacho(null);
                              if (guiaDespachoInputRef.current) {
                                guiaDespachoInputRef.current.value = "";
                              }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Sin archivos seleccionados</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fotos */}
                  <div className="space-y-3 p-5 border-2 border-[#459e60]/20 rounded-xl bg-gradient-to-br from-white to-[#f0f9f0]/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Upload className="h-5 w-5 text-[#459e60]" />
                      <Label
                        htmlFor="fotos"
                        className="text-base font-semibold text-[#2b3b4c] cursor-pointer"
                      >
                        Fotos Adicionales
                      </Label>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      JPG, PNG (máx. 5 archivos, 5MB c/u)
                    </p>
                    <div className="space-y-3">
                      <Input
                        id="fotos"
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={handleFotosChange}
                        className="border-2 border-[#459e60]/30 focus:border-[#459e60] cursor-pointer file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#459e60] file:text-white hover:file:bg-[#44a15d] transition-colors"
                      />
                      {fotos.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {fotos.map((foto, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-[#f0f9f0] border-2 border-[#459e60]/40 rounded-lg"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <CheckCircle className="h-4 w-4 text-[#459e60] flex-shrink-0" />
                                <span className="text-xs font-medium text-[#2b3b4c] truncate">
                                  {foto.name}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFoto(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2 h-8 w-8 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Sin archivos seleccionados</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discrepancias */}
          {discrepancias.length > 0 && (
            <Card
              className={`border-2 shadow-xl ${discrepancias.some((d: { significativa: boolean }) => d.significativa) ? "border-red-300 bg-red-50" : "border-yellow-300 bg-yellow-50"}`}
            >
              <div
                className={`p-6 ${discrepancias.some((d: { significativa: boolean }) => d.significativa) ? "bg-red-100" : "bg-yellow-100"}`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`h-6 w-6 ${discrepancias.some((d: { significativa: boolean }) => d.significativa) ? "text-red-600" : "text-yellow-600"}`}
                  />
                  <div>
                    <h3
                      className={`text-xl font-bold ${discrepancias.some((d: { significativa: boolean }) => d.significativa) ? "text-red-800" : "text-yellow-800"}`}
                    >
                      Discrepancias Detectadas
                    </h3>
                    <p
                      className={`text-sm ${discrepancias.some((d: { significativa: boolean }) => d.significativa) ? "text-red-700" : "text-yellow-700"}`}
                    >
                      Se encontraron diferencias entre los datos declarados y verificados
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {discrepancias.map(
                    (
                      discrepancia: { significativa: boolean; tipo: string; descripcion: string },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 ${
                          discrepancia.significativa
                            ? "border-red-300 bg-red-100"
                            : "border-yellow-300 bg-yellow-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`h-5 w-5 mt-0.5 ${
                              discrepancia.significativa ? "text-red-600" : "text-yellow-600"
                            }`}
                          />
                          <div className="flex-1">
                            <p
                              className={`font-semibold ${
                                discrepancia.significativa ? "text-red-800" : "text-yellow-800"
                              }`}
                            >
                              {discrepancia.tipo.toUpperCase()}
                            </p>
                            <p
                              className={`text-sm ${
                                discrepancia.significativa ? "text-red-700" : "text-yellow-700"
                              }`}
                            >
                              {discrepancia.descripcion}
                            </p>
                            {discrepancia.significativa && (
                              <p className="text-sm font-semibold text-red-800 mt-2">
                                ⚠️ Discrepancia significativa - Se notificará al administrador
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4">
            <Link href="/dashboard/gestor/recepciones">
              <Button
                type="button"
                variant="outline"
                className="border-2 border-gray-300 hover:border-gray-400 font-semibold px-6"
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={validarMutation.isPending}
              className="min-w-48 bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#4fa362] text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              {validarMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirmar Recepción
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
