"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Clock,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface DocumentoVencimiento {
  id: string;
  tipoDocumento: string;
  numeroFolio?: string;
  fechaVencimiento: string;
  estadoValidacion: string;
  archivoNombre: string;
  archivoUrl: string;
  archivoTamano: number;
  archivoTipo: string;
  nivelAlerta: string;
  alertaEnviada30d: boolean;
  alertaEnviada15d: boolean;
  alertaVencido: boolean;
  vehiculoPatente?: string;
  createdAt: string;
  usuario: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    estadoVerificacion: string;
    estadoSuspension: boolean;
    fechaSuspension?: string;
  };
  vehiculo?: {
    id: string;
    patente: string;
    tipo: string;
  };
  diasHastaVencimiento: number;
  prioridad: number;
  requiereAccion: boolean;
}

export default function VencimientosAdminPage() {
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activos" | "suspendidos">("todos");
  const [filtroRol, setFiltroRol] = useState<"todos" | "transportista" | "gestor">("todos");
  const [filtroUrgencia, setFiltroUrgencia] = useState<"todos" | "critico" | "alerta" | "vencido">(
    "todos"
  );

  // Obtener documentos con vencimientos
  const {
    data: dataVencimientos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-vencimientos"],
    queryFn: async () => {
      const response = await fetch("/api/admin/vencimientos");
      if (!response.ok) throw new Error("Error al cargar vencimientos");
      return response.json();
    },
    refetchInterval: 60000, // Refrescar cada minuto
  });

  const getNivelBadge = (nivel: string, requiereAccion: boolean) => {
    const baseClasses = "flex items-center gap-1";

    switch (nivel) {
      case "CRITICO":
        return (
          <Badge variant="destructive" className={`${baseClasses} bg-red-500`}>
            <AlertTriangle className="h-3 w-3" />
            Crítico (15 días)
          </Badge>
        );
      case "ALERTA":
        return (
          <Badge variant="secondary" className={`${baseClasses} bg-yellow-500 text-yellow-900`}>
            <Clock className="h-3 w-3" />
            Alerta (30 días)
          </Badge>
        );
      case "VENCIDO":
        return (
          <Badge variant={requiereAccion ? "destructive" : "outline"} className={`${baseClasses}`}>
            <XCircle className="h-3 w-3" />
            {requiereAccion ? "VENCIDO - Acción requerida" : "Vencido"}
          </Badge>
        );
      default:
        return <Badge variant="outline">{nivel}</Badge>;
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

  const getSuspensionBadge = (suspendido: boolean) => {
    return suspendido ? (
      <Badge variant="destructive" className="bg-red-600">
        <XCircle className="h-3 w-3 mr-1" />
        Suspendido
      </Badge>
    ) : (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />
        Activo
      </Badge>
    );
  };

  const filtrarDocumentos = (documentos: DocumentoVencimiento[]) => {
    return documentos.filter((doc: ReturnType<typeof JSON.parse>) => {
      // Filtro por estado de suspensión
      if (filtroEstado === "activos" && doc.usuario.estadoSuspension) return false;
      if (filtroEstado === "suspendidos" && !doc.usuario.estadoSuspension) return false;

      // Filtro por rol
      if (filtroRol === "transportista" && !doc.usuario.roles.includes("Transportista"))
        return false;
      if (filtroRol === "gestor" && !doc.usuario.roles.includes("Gestor")) return false;

      // Filtro por urgencia
      if (filtroUrgencia === "critico" && doc.nivelAlerta !== "CRITICO") return false;
      if (filtroUrgencia === "alerta" && doc.nivelAlerta !== "ALERTA") return false;
      if (filtroUrgencia === "vencido" && doc.nivelAlerta !== "VENCIDO") return false;

      return true;
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar vencimientos: {(error as ReturnType<typeof JSON.parse>).message}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const { documentos = [], estadisticas } = dataVencimientos || {};
  const documentosFiltrados = filtrarDocumentos(documentos);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Vencimientos</h1>
            <p className="text-gray-600 mt-2">
              Monitorea documentos próximos a vencer y gestiona suspensiones automáticas
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas?.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estadisticas?.vencidos || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticos (15d)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{estadisticas?.criticos || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas (30d)</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{estadisticas?.alerta || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requieren Acción</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {estadisticas?.requierenAccion || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estado de Usuario</label>
                <select
                  value={filtroEstado}
                  onChange={(e: unknown) =>
                    setFiltroEstado(
                      (e as ReturnType<typeof JSON.parse>).target.value as
                        | "todos"
                        | "activos"
                        | "suspendidos"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="suspendidos">Suspendidos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rol</label>
                <select
                  value={filtroRol}
                  onChange={(e: unknown) =>
                    setFiltroRol(
                      (e as ReturnType<typeof JSON.parse>).target.value as
                        | "todos"
                        | "transportista"
                        | "gestor"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="todos">Todos</option>
                  <option value="transportista">Transportistas</option>
                  <option value="gestor">Gestores</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nivel de Urgencia</label>
                <select
                  value={filtroUrgencia}
                  onChange={(e: unknown) =>
                    setFiltroUrgencia(
                      (e as ReturnType<typeof JSON.parse>).target.value as
                        | "todos"
                        | "critico"
                        | "alerta"
                        | "vencido"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="todos">Todos</option>
                  <option value="critico">Crítico (15 días)</option>
                  <option value="alerta">Alerta (30 días)</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos por Vencer ({documentosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {documentosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p>No hay documentos que coincidan con los filtros aplicados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documentosFiltrados.map((doc: ReturnType<typeof JSON.parse>) => (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      doc.requiereAccion
                        ? "border-red-300 bg-red-50"
                        : doc.nivelAlerta === "CRITICO"
                          ? "border-orange-300 bg-orange-50"
                          : doc.nivelAlerta === "ALERTA"
                            ? "border-yellow-300 bg-yellow-50"
                            : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{doc.usuario.name}</h3>
                          {getNivelBadge(doc.nivelAlerta, doc.requiereAccion)}
                          {getSuspensionBadge(doc.usuario.estadoSuspension)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p>
                              <strong>Email:</strong> {doc.usuario.email}
                            </p>
                            <p>
                              <strong>Rol:</strong> {doc.usuario.roles.join(", ")}
                            </p>
                            <p>
                              <strong>Documento:</strong> {getTipoDocumentoLabel(doc.tipoDocumento)}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Folio:</strong> {doc.numeroFolio || "No especificado"}
                            </p>
                            <p>
                              <strong>Vence:</strong>{" "}
                              {format(new Date(doc.fechaVencimiento), "dd/MM/yyyy", { locale: es })}
                            </p>
                            <p>
                              <strong>Días restantes:</strong>
                              <span
                                className={`font-semibold ml-1 ${
                                  doc.diasHastaVencimiento < 0
                                    ? "text-red-600"
                                    : doc.diasHastaVencimiento <= 15
                                      ? "text-red-500"
                                      : doc.diasHastaVencimiento <= 30
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                }`}
                              >
                                {doc.diasHastaVencimiento < 0
                                  ? `${Math.abs(doc.diasHastaVencimiento)} días vencido`
                                  : `${doc.diasHastaVencimiento} días`}
                              </span>
                            </p>
                          </div>
                        </div>

                        {doc.vehiculoPatente && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                              Vehículo: {doc.vehiculoPatente}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.archivoUrl, "_blank")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Ver PDF
                        </Button>

                        {doc.requiereAccion && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              toast.info("Próximamente", {
                                description:
                                  "La funcionalidad de contacto directo estará disponible en la próxima actualización.",
                              });
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Contactar
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Subido: {format(new Date(doc.createdAt), "dd/MM/yyyy", { locale: es })}
                        </span>
                        <span>Tamaño: {(doc.archivoTamano / 1024 / 1024).toFixed(2)} MB</span>
                      </div>

                      {/* Estado de alertas */}
                      <div className="flex gap-2 mt-2">
                        {doc.alertaEnviada30d && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            ✓ Alerta 30d enviada
                          </Badge>
                        )}
                        {doc.alertaEnviada15d && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                            ✓ Alerta 15d enviada
                          </Badge>
                        )}
                        {doc.alertaVencido && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                            ✓ Notificación de suspensión enviada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información del sistema de alertas */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Sistema automático:</strong> Las alertas se envían automáticamente por email a
            los 30 días y 15 días previos al vencimiento. Los usuarios con documentos vencidos son
            suspendidos automáticamente y notificados. Este panel se actualiza cada minuto para
            mostrar información en tiempo real.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
}
