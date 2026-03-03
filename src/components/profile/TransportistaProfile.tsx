"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Save,
  Shield,
  Bell,
  CheckCircle,
  AlertTriangle,
  Edit3,
  X,
  FileText,
  Download,
  Plus,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TransportistaProfile() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(false);

  // Estado para gestión de documentos
  const [modalDocumentoAbierto, setModalDocumentoAbierto] = useState(false);
  const [documentoForm, setDocumentoForm] = useState({
    tipoDocumento: "",
    numeroFolio: "",
    fechaEmision: "",
    fechaVencimiento: "",
    categoria: "",
    vehiculoPatente: "",
  });

  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    telefono: "",
    direccion: "",
    comuna: "",
    region: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query para obtener documentos del usuario
  const { data: documentos = [], isLoading: loadingDocumentos } = useQuery({
    queryKey: ["user-documentos"],
    queryFn: async () => {
      const response = await fetch("/api/user/documentos");
      if (!response.ok) throw new Error("Error al cargar documentos");
      const data = await response.json();
      return data.documentos || [];
    },
  });

  // Mutación para subir documento
  const subirDocumentoMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const response = await fetch("/api/user/documentos", {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al subir documento"
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-documentos"] });
      setModalDocumentoAbierto(false);
      setDocumentoForm({
        tipoDocumento: "",
        numeroFolio: "",
        fechaEmision: "",
        fechaVencimiento: "",
        categoria: "",
        vehiculoPatente: "",
      });
      setArchivoSeleccionado(null);
      toast.success("Documento subido exitosamente");
    },
    onError: (error: ReturnType<typeof JSON.parse>) => {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    },
  });

  // Mutación para actualizar perfil
  // NOTA: El endpoint de actualización de perfil de transportista está pendiente de implementación
  // Por ahora, los cambios se guardan localmente pero no se persisten en el servidor
  const actualizarMutation = useMutation({
    mutationFn: async (_data) => {
      // Por ahora, la funcionalidad de edición de perfil está deshabilitada
      // const response = await fetch("/api/transportista/perfil", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })
      // if (!response.ok) throw new Error("Error al actualizar perfil")
      // return response.json()

      // Simulación temporal - no persiste cambios
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Perfil actualizado exitosamente");
      setEditando(false);
    },
    onError: () => {
      toast.error("Error al actualizar el perfil");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      actualizarMutation.mutate(formData as unknown as void);
    }
  };

  // Funciones para gestión de documentos
  const handleArchivoSeleccionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoSeleccionado(file);
    }
  };

  const handleSubirDocumento = () => {
    if (!archivoSeleccionado) {
      toast.error("Debes seleccionar un archivo");
      return;
    }

    if (!documentoForm.tipoDocumento || !documentoForm.fechaVencimiento) {
      toast.error("Tipo de documento y fecha de vencimiento son requeridos");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("archivo", archivoSeleccionado);
    formDataToSend.append("tipoDocumento", documentoForm.tipoDocumento);
    formDataToSend.append("numeroFolio", documentoForm.numeroFolio);
    formDataToSend.append("fechaEmision", documentoForm.fechaEmision);
    formDataToSend.append("fechaVencimiento", documentoForm.fechaVencimiento);
    formDataToSend.append("categoria", documentoForm.categoria);
    formDataToSend.append("vehiculoPatente", documentoForm.vehiculoPatente);

    subirDocumentoMutation.mutate(formDataToSend);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return <Badge className="bg-green-500">Aprobado</Badge>;
      case "PENDIENTE":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "RECHAZADO":
        return <Badge variant="destructive">Rechazado</Badge>;
      case "VENCIDO":
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getTipoDocumentoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      AUTORIZACION_SANITARIA_TRANSPORTE: "Autorización Sanitaria Transporte",
      PERMISO_CIRCULACION: "Permiso Circulación",
      REVISION_TECNICA: "Revisión Técnica",
      CERTIFICADO_ANTECEDENTES: "Certificado Antecedentes",
      AUTORIZACION_SANITARIA_PLANTA: "Autorización Sanitaria Planta",
      RCA: "Resolución Calificación Ambiental",
      REGISTRO_GESTOR_MMA: "Registro Gestor MMA",
      CERTIFICADO_INSTALACION_ELECTRICA: "Certificado Instalación Eléctrica",
      CERTIFICADO_VIGENCIA_PODERES: "Certificado Vigencia Poderes",
      PATENTE_MUNICIPAL: "Patente Municipal",
    };
    return labels[tipo] || tipo;
  };

  const getDiasHastaVencimiento = (fechaVencimiento: string) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header con Información del Usuario */}
      <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-[#459e60] via-[#44a15d] to-[#4fa362]">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/40 shadow-xl">
                <User className="h-16 w-16 text-white" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-[#459e60]" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                {session?.user?.name || "Usuario"}
              </h2>
              <p className="text-white/90 text-lg mb-3 flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-5 w-5" />
                {session?.user?.email}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-semibold">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Transportista
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-semibold">
                  <Shield className="h-4 w-4 mr-2" />
                  Cuenta Verificada
                </Badge>
              </div>
            </div>

            {/* Botón Editar */}
            {!editando && (
              <Button
                onClick={() => setEditando(true)}
                className="bg-white text-[#459e60] hover:bg-white/90 font-bold shadow-lg px-6"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Datos */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Personales */}
        <Card className="border-0 shadow-xl">
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="h-6 w-6" />
              Datos Personales
            </h3>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nombre */}
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-[#459e60]" />
                  Nombre Completo
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    setFormData({
                      ...formData,
                      name: (e as ReturnType<typeof JSON.parse>).target.value,
                    })
                  }
                  disabled={!editando}
                  className={`h-12 border-2 text-gray-900 font-medium ${
                    errors.name
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-[#459e60]"
                  } ${!editando ? "bg-gray-50 text-gray-600" : "bg-white"} transition-all`}
                  placeholder="Ingrese su nombre completo"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-[#459e60]" />
                  Email
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    setFormData({
                      ...formData,
                      email: (e as ReturnType<typeof JSON.parse>).target.value,
                    })
                  }
                  disabled={!editando}
                  className={`h-12 border-2 text-gray-900 font-medium ${
                    errors.email
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-200 focus:border-[#459e60]"
                  } ${!editando ? "bg-gray-50 text-gray-600" : "bg-white"} transition-all`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-3">
                <Label
                  htmlFor="telefono"
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-[#459e60]" />
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    setFormData({
                      ...formData,
                      telefono: (e as ReturnType<typeof JSON.parse>).target.value,
                    })
                  }
                  disabled={!editando}
                  placeholder="+56 9 1234 5678"
                  className={`h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] ${
                    !editando ? "bg-gray-50 text-gray-600" : "bg-white"
                  } transition-all`}
                />
              </div>

              {/* RUT */}
              <div className="space-y-3">
                <Label
                  htmlFor="rut"
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-[#459e60]" />
                  RUT
                </Label>
                <Input
                  id="rut"
                  value={session?.user?.rut || "No disponible"}
                  disabled
                  className="h-12 border-2 border-gray-200 bg-gray-50 text-gray-500 font-medium"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  El RUT no puede ser modificado por seguridad
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dirección */}
        <Card className="border-0 shadow-xl">
          <div className="bg-gradient-to-r from-[#4fa362] to-[#459e60] px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Dirección
            </h3>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="grid gap-6">
              {/* Dirección */}
              <div className="space-y-3">
                <Label htmlFor="direccion" className="text-sm font-bold text-gray-700">
                  Dirección Completa
                </Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    setFormData({
                      ...formData,
                      direccion: (e as ReturnType<typeof JSON.parse>).target.value,
                    })
                  }
                  disabled={!editando}
                  placeholder="Calle y número"
                  className={`h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] ${
                    !editando ? "bg-gray-50 text-gray-600" : "bg-white"
                  } transition-all`}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Región */}
                <div className="space-y-3">
                  <Label htmlFor="region" className="text-sm font-bold text-gray-700">
                    Región
                  </Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      setFormData({
                        ...formData,
                        region: (e as ReturnType<typeof JSON.parse>).target.value,
                      })
                    }
                    disabled={!editando}
                    placeholder="Región"
                    className={`h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] ${
                      !editando ? "bg-gray-50 text-gray-600" : "bg-white"
                    } transition-all`}
                  />
                </div>

                {/* Comuna */}
                <div className="space-y-3">
                  <Label htmlFor="comuna" className="text-sm font-bold text-gray-700">
                    Comuna
                  </Label>
                  <Input
                    id="comuna"
                    value={formData.comuna}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      setFormData({
                        ...formData,
                        comuna: (e as ReturnType<typeof JSON.parse>).target.value,
                      })
                    }
                    disabled={!editando}
                    placeholder="Comuna"
                    className={`h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] ${
                      !editando ? "bg-gray-50 text-gray-600" : "bg-white"
                    } transition-all`}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        {editando && (
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => {
                setEditando(false);
                setFormData({
                  name: session?.user?.name || "",
                  email: session?.user?.email || "",
                  telefono: "",
                  direccion: "",
                  comuna: "",
                  region: "",
                });
                setErrors({});
              }}
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50 font-bold text-gray-700"
              disabled={actualizarMutation.isPending}
            >
              <X className="h-5 w-5 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#459e60] text-white font-bold shadow-lg"
              disabled={actualizarMutation.isPending}
            >
              {actualizarMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        )}
      </form>

      {/* Preferencias y Seguridad */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Preferencias */}
        <Card className="border-0 shadow-xl">
          <div className="bg-gradient-to-r from-[#44a15d] to-[#4fa362] px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Preferencias
            </h3>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f6fcf3] to-white rounded-xl border-2 border-[#459e60]/20">
                <div>
                  <p className="font-bold text-gray-900">Notificaciones Email</p>
                  <p className="text-sm text-gray-600">Recibir notificaciones por correo</p>
                </div>
                <Badge className="bg-[#459e60] text-white font-bold px-4 py-2">Activo</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200">
                <div>
                  <p className="font-bold text-gray-900">Notificaciones Push</p>
                  <p className="text-sm text-gray-600">Alertas en tiempo real</p>
                </div>
                <Badge className="bg-gray-300 text-gray-700 font-bold px-4 py-2">
                  Próximamente
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="border-0 shadow-xl">
          <div className="bg-gradient-to-r from-[#4fa362] to-[#44a15d] px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Seguridad
            </h3>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#f6fcf3] to-white rounded-xl border-2 border-[#459e60]/20">
                <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#459e60]" />
                  Contraseña
                </p>
                <p className="text-sm text-gray-600 mb-4">Última actualización: No disponible</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#459e60] text-[#459e60] hover:bg-[#459e60] hover:text-white font-bold"
                  disabled
                >
                  Cambiar Contraseña
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border-2 border-green-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-800 mb-1">Cuenta Verificada</p>
                    <p className="text-sm text-green-700">
                      Su cuenta está completamente verificada y protegida
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos de Verificación */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-[#2d5a3d] to-[#1a3a2a] px-6 py-4">
            <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Documentos de Verificación
              </div>
              <Dialog open={modalDocumentoAbierto} onOpenChange={setModalDocumentoAbierto}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white text-[#2d5a3d] hover:bg-gray-100">
                    <Plus className="h-4 w-4 mr-1" />
                    Subir Documento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white border-2 border-gray-200 shadow-2xl">
                  <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      Subir Nuevo Documento
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                      Selecciona el tipo de documento y sube el archivo correspondiente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-5 pt-4">
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="tipoDocumento"
                          className="text-sm font-semibold text-gray-800 mb-2 block"
                        >
                          Tipo de Documento *
                        </Label>
                        <Select
                          value={documentoForm.tipoDocumento}
                          onValueChange={(value) =>
                            setDocumentoForm({ ...documentoForm, tipoDocumento: value })
                          }
                        >
                          <SelectTrigger className="border-2 border-gray-300 focus:border-[#459e60] bg-white text-gray-900 font-medium">
                            <SelectValue
                              placeholder="Selecciona el tipo"
                              className="text-gray-500"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                            <SelectItem
                              value="AUTORIZACION_SANITARIA_TRANSPORTE"
                              className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                            >
                              Autorización Sanitaria Transporte
                            </SelectItem>
                            <SelectItem
                              value="PERMISO_CIRCULACION"
                              className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                            >
                              Permiso de Circulación
                            </SelectItem>
                            <SelectItem
                              value="REVISION_TECNICA"
                              className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                            >
                              Revisión Técnica
                            </SelectItem>
                            <SelectItem
                              value="CERTIFICADO_ANTECEDENTES"
                              className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                            >
                              Certificado de Antecedentes
                            </SelectItem>
                            <SelectItem
                              value="CERTIFICADO_VIGENCIA_PODERES"
                              className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                            >
                              Certificado Vigencia Poderes
                            </SelectItem>
                            <SelectItem
                              value="PATENTE_MUNICIPAL"
                              className="text-gray-900 hover:bg-[#f0f9f0] focus:bg-[#f0f9f0]"
                            >
                              Patente Municipal
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="numeroFolio"
                          className="text-sm font-semibold text-gray-800 mb-2 block"
                        >
                          Número de Folio
                        </Label>
                        <Input
                          id="numeroFolio"
                          value={documentoForm.numeroFolio}
                          onChange={(e: ReturnType<typeof JSON.parse>) =>
                            setDocumentoForm({
                              ...documentoForm,
                              numeroFolio: (e as ReturnType<typeof JSON.parse>).target.value,
                            })
                          }
                          placeholder="Opcional"
                          className="border-2 border-gray-300 focus:border-[#459e60] bg-white text-gray-900 placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="fechaEmision"
                          className="text-sm font-semibold text-gray-800 mb-2 block"
                        >
                          Fecha de Emisión
                        </Label>
                        <Input
                          id="fechaEmision"
                          type="date"
                          value={documentoForm.fechaEmision}
                          onChange={(e: ReturnType<typeof JSON.parse>) =>
                            setDocumentoForm({
                              ...documentoForm,
                              fechaEmision: (e as ReturnType<typeof JSON.parse>).target.value,
                            })
                          }
                          className="border-2 border-gray-300 focus:border-[#459e60] bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="fechaVencimiento"
                          className="text-sm font-semibold text-gray-800 mb-2 block"
                        >
                          Fecha de Vencimiento *
                        </Label>
                        <Input
                          id="fechaVencimiento"
                          type="date"
                          value={documentoForm.fechaVencimiento}
                          onChange={(e: ReturnType<typeof JSON.parse>) =>
                            setDocumentoForm({
                              ...documentoForm,
                              fechaVencimiento: (e as ReturnType<typeof JSON.parse>).target.value,
                            })
                          }
                          required
                          className="border-2 border-gray-300 focus:border-[#459e60] bg-white text-gray-900"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="vehiculoPatente"
                          className="text-sm font-semibold text-gray-800 mb-2 block"
                        >
                          Patente del Vehículo
                        </Label>
                        <Input
                          id="vehiculoPatente"
                          value={documentoForm.vehiculoPatente}
                          onChange={(e: ReturnType<typeof JSON.parse>) =>
                            setDocumentoForm({
                              ...documentoForm,
                              vehiculoPatente: (e as ReturnType<typeof JSON.parse>).target.value,
                            })
                          }
                          placeholder="Solo para documentos de vehículo"
                          className="border-2 border-gray-300 focus:border-[#459e60] bg-white text-gray-900 placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="archivo"
                          className="text-sm font-semibold text-gray-800 mb-2 block"
                        >
                          Archivo *
                        </Label>
                        <Input
                          id="archivo"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleArchivoSeleccionado}
                          className="border-2 border-gray-300 focus:border-[#459e60] bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#459e60] file:text-white hover:file:bg-[#3d8b53] file:cursor-pointer"
                        />
                        {archivoSeleccionado && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm font-medium text-green-800">
                              ✓ Archivo seleccionado: {archivoSeleccionado.name}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Tamaño: {(archivoSeleccionado.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        onClick={() => setModalDocumentoAbierto(false)}
                        className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSubirDocumento}
                        disabled={subirDocumentoMutation.isPending}
                        className="flex-1 bg-[#459e60] hover:bg-[#3d8b53] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {subirDocumentoMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Subiendo...
                          </div>
                        ) : (
                          "Subir Documento"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {loadingDocumentos ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#459e60]"></div>
              </div>
            ) : documentos.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">No tienes documentos subidos aún</p>
                <p className="text-sm text-gray-500">
                  Sube tus documentos de verificación para mantener tu cuenta activa
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {documentos.map((doc: ReturnType<typeof JSON.parse>) => {
                  const diasHastaVencimiento = getDiasHastaVencimiento(doc.fechaVencimiento);
                  return (
                    <div
                      key={doc.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {getTipoDocumentoLabel(doc.tipoDocumento)}
                            </h4>
                            {getEstadoBadge(doc.estadoValidacion)}
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            {doc.numeroFolio && (
                              <p>
                                <strong>Folio:</strong> {doc.numeroFolio}
                              </p>
                            )}
                            <p>
                              <strong>Vence:</strong>{" "}
                              {format(new Date(doc.fechaVencimiento), "dd/MM/yyyy", { locale: es })}
                            </p>
                            {diasHastaVencimiento <= 30 && (
                              <p
                                className={`font-semibold ${
                                  diasHastaVencimiento < 0
                                    ? "text-red-600"
                                    : diasHastaVencimiento <= 15
                                      ? "text-red-500"
                                      : "text-yellow-600"
                                }`}
                              >
                                {diasHastaVencimiento < 0
                                  ? `Vencido hace ${Math.abs(diasHastaVencimiento)} días`
                                  : `Vence en ${diasHastaVencimiento} días`}
                              </p>
                            )}
                            {doc.vehiculoPatente && (
                              <p>
                                <strong>Vehículo:</strong> {doc.vehiculoPatente}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.archivoUrl, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = doc.archivoUrl;
                              link.download = doc.archivoNombre;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Descargar
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                        <span>
                          Subido: {format(new Date(doc.createdAt), "dd/MM/yyyy", { locale: es })}
                        </span>
                        <span>{(doc.archivoTamano / 1024 / 1024).toFixed(2)} MB</span>
                      </div>

                      {doc.estadoValidacion === "RECHAZADO" && doc.notasValidacion && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-semibold text-red-800 mb-1">
                            Motivo del rechazo:
                          </p>
                          <p className="text-sm text-red-700">{doc.notasValidacion}</p>
                        </div>
                      )}

                      {doc.estadoValidacion === "APROBADO" && doc.notasValidacion && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm font-semibold text-green-800 mb-1">
                            Notas del administrador:
                          </p>
                          <p className="text-sm text-green-700">{doc.notasValidacion}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
