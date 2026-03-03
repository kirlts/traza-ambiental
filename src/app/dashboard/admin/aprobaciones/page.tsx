"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  User,
  Building,
  AlertTriangle,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UsuarioPendiente {
  id: string;
  name: string;
  email: string;
  rut: string;
  roles: string[];
  estadoVerificacion: string;
  fechaRegistro: string;
  tipoEmpresa?: string;
  capacidadProcesamiento?: number;
  tipoPlanta?: string;
  patenteVehiculoPrincipal?: string;
  documentos: Documento[];
}

interface Documento {
  id: string;
  tipoDocumento: string;
  numeroFolio?: string;
  fechaEmision?: string;
  fechaVencimiento: string;
  estadoValidacion: string;
  archivoNombre: string;
  archivoUrl: string;
  archivoTamano: number;
  archivoTipo: string;
  validadoPor?: {
    name: string;
    email: string;
  };
  fechaValidacion?: string;
  notasValidacion?: string;
  vehiculoPatente?: string;
  createdAt: string;
}

export default function AprobacionesAdminPage() {
  const [selectedUser, setSelectedUser] = useState<UsuarioPendiente | null>(null);
  const [selectedDocumentos, setSelectedDocumentos] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [notasAprobacion, setNotasAprobacion] = useState("");
  const [validadoContraPortal, setValidadoContraPortal] = useState(false);
  const [portalVerificado, setPortalVerificado] = useState("");
  const [fechaVerificacionPortal, setFechaVerificacionPortal] = useState("");

  const queryClient = useQueryClient();

  // Obtener usuarios pendientes de aprobación
  const {
    data: dataAprobaciones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-aprobaciones"],
    queryFn: async () => {
      const response = await fetch("/api/admin/aprobaciones");
      if (!response.ok) throw new Error("Error al cargar aprobaciones");
      return response.json();
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });

  // Mutación para aprobar usuario
  const aprobarMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/aprobaciones/${userId}/aprobar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notasValidacion: notasAprobacion,
          validadoContraPortal,
          portalVerificado: validadoContraPortal ? portalVerificado : undefined,
          fechaVerificacionPortal: validadoContraPortal ? fechaVerificacionPortal : undefined,
        }),
      });
      if (!response.ok) throw new Error("Error al aprobar usuario");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-aprobaciones"] });
      setSelectedUser(null);
      setNotasAprobacion("");
      setValidadoContraPortal(false);
      setPortalVerificado("");
      setFechaVerificacionPortal("");
    },
  });

  // Mutación para rechazar usuario
  const rechazarMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/aprobaciones/${userId}/rechazar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivoRechazo,
          documentosRechazados: selectedDocumentos.length > 0 ? selectedDocumentos : undefined,
        }),
      });
      if (!response.ok) throw new Error("Error al rechazar usuario");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-aprobaciones"] });
      setSelectedUser(null);
      setMotivoRechazo("");
      setSelectedDocumentos([]);
    },
  });

  const handleAprobar = (user: UsuarioPendiente) => {
    setSelectedUser(user);
    // Reset form
    setNotasAprobacion("");
    setValidadoContraPortal(false);
    setPortalVerificado("");
    setFechaVerificacionPortal("");
  };

  const handleRechazar = (user: UsuarioPendiente) => {
    setSelectedUser(user);
    setMotivoRechazo("");
    setSelectedDocumentos([]);
  };

  const submitAprobacion = () => {
    if (selectedUser) {
      aprobarMutation.mutate(selectedUser.id);
    }
  };

  const submitRechazo = () => {
    if (selectedUser && motivoRechazo.trim()) {
      rechazarMutation.mutate(selectedUser.id);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE_VERIFICACION":
        return <Badge variant="secondary">Pendiente Verificación</Badge>;
      case "DOCUMENTOS_CARGADOS":
        return <Badge variant="outline">Documentos Cargados</Badge>;
      case "VERIFICADO":
        return (
          <Badge variant="default" className="bg-green-500">
            Verificado
          </Badge>
        );
      default:
        return <Badge variant="secondary">{estado}</Badge>;
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
            Error al cargar las aprobaciones: {(error as ReturnType<typeof JSON.parse>).message}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  const { usuarios = [], estadisticas } = dataAprobaciones || {};

  return (
    <DashboardLayout title="Aprobaciones de Usuario" id="admin-aprobaciones-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Aprobaciones</h1>
            <p className="text-gray-600 mt-2">
              Gestiona las solicitudes de verificación de Transportistas y Gestores
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas?.totalPendientes || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transportistas</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {estadisticas?.transportistasPendientes || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gestores</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {estadisticas?.gestoresPendientes || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos Totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas?.documentosTotales || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de usuarios pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {usuarios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <p>No hay solicitudes pendientes de aprobación</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usuarios.map((usuario: UsuarioPendiente) => (
                  <div
                    key={usuario.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{usuario.name}</h3>
                          {getEstadoBadge(usuario.estadoVerificacion)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Email:</strong> {usuario.email}
                          </p>
                          <p>
                            <strong>RUT:</strong> {usuario.rut}
                          </p>
                          <p>
                            <strong>Rol:</strong> {usuario.roles.join(", ")}
                          </p>
                          {usuario.tipoEmpresa && (
                            <p>
                              <strong>Empresa:</strong> {usuario.tipoEmpresa}
                            </p>
                          )}
                          <p>
                            <strong>Registro:</strong>{" "}
                            {format(new Date(usuario.fechaRegistro), "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(usuario)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Revisar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Revisar Documentos - {usuario.name}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Información del usuario */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">Información del Usuario</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p>
                                      <strong>Nombre:</strong> {usuario.name}
                                    </p>
                                    <p>
                                      <strong>Email:</strong> {usuario.email}
                                    </p>
                                    <p>
                                      <strong>RUT:</strong> {usuario.rut}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      <strong>Rol:</strong> {usuario.roles.join(", ")}
                                    </p>
                                    <p>
                                      <strong>Estado:</strong> {usuario.estadoVerificacion}
                                    </p>
                                    <p>
                                      <strong>Registro:</strong>{" "}
                                      {format(new Date(usuario.fechaRegistro), "dd/MM/yyyy", {
                                        locale: es,
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Lista de documentos */}
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Documentos Subidos ({usuario.documentos.length})
                                </h4>
                                <div className="space-y-3">
                                  {usuario.documentos.map((doc: ReturnType<typeof JSON.parse>) => (
                                    <div key={doc.id} className="border rounded-lg p-3">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <h5 className="font-medium">
                                            {getTipoDocumentoLabel(doc.tipoDocumento)}
                                          </h5>
                                          <div className="text-sm text-gray-600 mt-1">
                                            <p>
                                              <strong>Folio:</strong>{" "}
                                              {doc.numeroFolio || "No especificado"}
                                            </p>
                                            <p>
                                              <strong>Vencimiento:</strong>{" "}
                                              {format(
                                                new Date(doc.fechaVencimiento),
                                                "dd/MM/yyyy",
                                                { locale: es }
                                              )}
                                            </p>
                                            <p>
                                              <strong>Archivo:</strong> {doc.archivoNombre} (
                                              {(doc.archivoTamano / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(doc.archivoUrl, "_blank")}
                                          >
                                            <Download className="h-4 w-4 mr-1" />
                                            Ver
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          onClick={() => handleAprobar(usuario)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>

                        <Button
                          onClick={() => handleRechazar(usuario)}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </div>

                    {/* Documentos preview */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Documentos:</strong> {usuario.documentos.length} subidos
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {usuario.documentos
                          .slice(0, 3)
                          .map((doc: ReturnType<typeof JSON.parse>, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {getTipoDocumentoLabel(doc.tipoDocumento)}
                            </Badge>
                          ))}
                        {usuario.documentos.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{usuario.documentos.length - 3} más
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

        {/* Modal de Aprobación */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aprobar Usuario - {selectedUser.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notas de validación (opcional)
                  </label>
                  <Textarea
                    value={notasAprobacion}
                    onChange={(e: unknown) =>
                      setNotasAprobacion((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                    placeholder="Comentarios sobre la aprobación..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="validadoPortal"
                      checked={validadoContraPortal}
                      onChange={(e: unknown) =>
                        setValidadoContraPortal((e as ReturnType<typeof JSON.parse>).target.checked)
                      }
                      className="rounded"
                    />
                    <label htmlFor="validadoPortal" className="text-sm font-medium">
                      Validado contra portal oficial
                    </label>
                  </div>

                  {validadoContraPortal && (
                    <div className="space-y-2 ml-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Portal verificado</label>
                        <select
                          value={portalVerificado}
                          onChange={(e: unknown) =>
                            setPortalVerificado((e as ReturnType<typeof JSON.parse>).target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Seleccionar portal</option>
                          <option value="MINSAL">MINSAL (Salud)</option>
                          <option value="SEREMI">SEREMI</option>
                          <option value="MMA">MMA (Medio Ambiente)</option>
                          <option value="MTT">MTT (Transportes)</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Fecha de verificación
                        </label>
                        <input
                          type="date"
                          value={fechaVerificacionPortal}
                          onChange={(e: unknown) =>
                            setFechaVerificacionPortal(
                              (e as ReturnType<typeof JSON.parse>).target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={submitAprobacion}
                    disabled={aprobarMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {aprobarMutation.isPending ? "Aprobando..." : "Aprobar Usuario"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Rechazo */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rechazar Usuario - {selectedUser.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    El usuario será notificado del rechazo y podrá reenviar documentos corregidos.
                  </AlertDescription>
                </Alert>

                <div>
                  <label className="block text-sm font-medium mb-2">Motivo del rechazo *</label>
                  <Textarea
                    value={motivoRechazo}
                    onChange={(e: unknown) =>
                      setMotivoRechazo((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                    placeholder="Explica claramente por qué se rechaza la documentación..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={submitRechazo}
                    disabled={rechazarMutation.isPending || !motivoRechazo.trim()}
                    variant="destructive"
                  >
                    {rechazarMutation.isPending ? "Rechazando..." : "Rechazar Usuario"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
