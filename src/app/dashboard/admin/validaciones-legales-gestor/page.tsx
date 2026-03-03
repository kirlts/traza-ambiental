"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Search,
  Building,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import Link from "next/link";
import { Settings } from "lucide-react";

interface ManagerProfile {
  id: string;
  manager: {
    id: string;
    name: string;
    email: string;
    rut: string;
  };
  retcId: string | null;
  retcFileUrl: string | null;
  isRetcVerified: boolean;

  // HU-029B
  resolutionNumber: string | null;
  resolutionFileUrl: string | null;
  isResolutionVerified: boolean;
  authorizedCapacity: number | null;

  // HU-029C
  gransicPartner: string | null;

  status: string;
  updatedAt: string;
}

export default function AdminValidacionGestorPage() {
  const [profiles, setProfiles] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<ManagerProfile | null>(null);

  // Estados para diálogos
  const [rejectReason, setRejectReason] = useState("");
  const [authorizedCapacity, setAuthorizedCapacity] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/admin/validacion-legal-gestor");
      if (res.ok) {
        setProfiles(await res.json());
      }
    } catch (error: unknown) {
      console.error("Error fetching profiles:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (action: "APPROVE" | "REJECT", field: "RETC" | "RESOLUTION") => {
    if (!selectedProfile) return;

    if (action === "REJECT" && !rejectReason) {
      toast.error("Debes ingresar un motivo de rechazo");
      return;
    }

    if (action === "APPROVE" && field === "RESOLUTION" && !authorizedCapacity) {
      toast.error("Debes ingresar la capacidad autorizada (Ton/Año)");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/validacion-legal-gestor", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedProfile.id,
          action,
          field,
          rejectionReason: rejectReason,
          authorizedCapacity: field === "RESOLUTION" ? authorizedCapacity : undefined,
        }),
      });

      if (res.ok) {
        toast.success(action === "APPROVE" ? "Validado correctamente" : "Rechazado correctamente");
        fetchProfiles();
        setSelectedProfile(null); // Cerrar detalle o recargar
        setRejectReason("");
        setAuthorizedCapacity("");
      } else {
        toast.error("Error al procesar la solicitud");
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.manager.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.manager.rut?.includes(searchTerm) ||
      p.retcId?.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Lista de Gestores */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre, RUT o RETC..."
              className="pl-8"
              value={searchTerm}
              onChange={(e: unknown) =>
                setSearchTerm((e as ReturnType<typeof JSON.parse>).target.value)
              }
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Cargando...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No hay validaciones pendientes</p>
              </div>
            ) : (
              filteredProfiles.map((profile) => {
                const isSelected = selectedProfile?.id === profile.id;
                const statusConfig = {
                  VERIFICADO: {
                    color: "emerald",
                    bg: "emerald-50",
                    border: "emerald-200",
                    text: "emerald-700",
                  },
                  RECHAZADO: { color: "red", bg: "red-50", border: "red-200", text: "red-700" },
                  EN_REVISION: {
                    color: "amber",
                    bg: "amber-50",
                    border: "amber-200",
                    text: "amber-700",
                  },
                };
                const statusStyle =
                  statusConfig[profile.status as keyof typeof statusConfig] ||
                  statusConfig.EN_REVISION;
                const validacionesCompletas =
                  (profile.isRetcVerified ? 1 : 0) + (profile.isResolutionVerified ? 1 : 0);
                const totalValidaciones = 2;
                const porcentajeValidacion = (validacionesCompletas / totalValidaciones) * 100;

                return (
                  <div
                    key={profile.id}
                    onClick={() => setSelectedProfile(profile)}
                    className={`group relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                      isSelected
                        ? `bg-emerald-50 border-emerald-500 shadow-md`
                        : `bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30`
                    }`}
                  >
                    {/* Indicador de selección */}
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                      </div>
                    )}

                    {/* Header con nombre y badge */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base mb-1 truncate group-hover:text-emerald-700 transition-colors">
                          {profile.manager.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Building className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="font-mono truncate">{profile.manager.rut}</span>
                        </div>
                      </div>
                      <Badge
                        className={`ml-2 flex-shrink-0 border ${
                          statusStyle.color === "emerald"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : statusStyle.color === "red"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                        }`}
                      >
                        {profile.status.replace("_", " ")}
                      </Badge>
                    </div>

                    {/* Barra de progreso de validaciones */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-gray-600">
                          Progreso de Validación
                        </span>
                        <span className="text-xs font-semibold text-gray-700">
                          {validacionesCompletas}/{totalValidaciones}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            porcentajeValidacion === 100
                              ? "bg-emerald-500"
                              : porcentajeValidacion === 50
                                ? "bg-amber-500"
                                : "bg-gray-400"
                          }`}
                          style={{ width: `${porcentajeValidacion}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Indicadores de validación */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        {profile.isRetcVerified ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : profile.retcFileUrl ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        )}
                        <span
                          className={`text-xs ${
                            profile.isRetcVerified
                              ? "text-emerald-700 font-medium"
                              : profile.retcFileUrl
                                ? "text-amber-600"
                                : "text-gray-400"
                          }`}
                        >
                          RETC
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {profile.isResolutionVerified ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : profile.resolutionFileUrl ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-300" />
                        )}
                        <span
                          className={`text-xs ${
                            profile.isResolutionVerified
                              ? "text-emerald-700 font-medium"
                              : profile.resolutionFileUrl
                                ? "text-amber-600"
                                : "text-gray-400"
                          }`}
                        >
                          Resolución
                        </span>
                      </div>
                    </div>

                    {/* Footer con fecha */}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1.5">📅</span>
                        Actualizado:{" "}
                        {new Date(profile.updatedAt).toLocaleDateString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel de Detalle */}
        <div className="lg:col-span-2">
          {selectedProfile ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" />
                  Validación de {selectedProfile.manager.name}
                </CardTitle>
                <CardDescription>
                  Revisa la documentación cargada y valida la identidad y capacidad operativa.
                </CardDescription>
                <div className="pt-2">
                  <Link
                    href={`/dashboard/admin/gestores/${selectedProfile.manager.id}/autorizaciones`}
                  >
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Settings className="mr-2 h-4 w-4" />
                      Gestionar Autorizaciones Detalladas
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1. Validación Identidad RETC */}
                <div
                  className={`p-4 rounded-lg border ${selectedProfile.isRetcVerified ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        1. Identidad RETC
                        {selectedProfile.isRetcVerified && (
                          <CheckCircle className="ml-2 w-4 h-4 text-green-600" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ID RETC: <strong>{selectedProfile.retcId || "No ingresado"}</strong>
                      </p>
                    </div>
                    {selectedProfile.retcFileUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={selectedProfile.retcFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Evidencia
                        </a>
                      </Button>
                    )}
                  </div>

                  {!selectedProfile.isRetcVerified && selectedProfile.retcFileUrl && (
                    <div className="flex gap-3 justify-end mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <XCircle className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rechazar Identidad RETC</DialogTitle>
                            <DialogDescription>Indica el motivo del rechazo.</DialogDescription>
                          </DialogHeader>
                          <Textarea
                            placeholder="Ej: El documento corresponde a una oficina administrativa."
                            value={rejectReason}
                            onChange={(e: unknown) =>
                              setRejectReason((e as ReturnType<typeof JSON.parse>).target.value)
                            }
                          />
                          <DialogFooter>
                            <Button
                              onClick={() => handleValidation("REJECT", "RETC")}
                              disabled={isProcessing}
                            >
                              Confirmar Rechazo
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleValidation("APPROVE", "RETC")}
                        disabled={isProcessing}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprobar Identidad
                      </Button>
                    </div>
                  )}
                </div>

                {/* 2. Validación Resolución Sanitaria (HU-029B) */}
                <div
                  className={`p-4 rounded-lg border ${selectedProfile.isResolutionVerified ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        2. Resolución Sanitaria
                        {selectedProfile.isResolutionVerified && (
                          <CheckCircle className="ml-2 w-4 h-4 text-green-600" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">
                        N° Resolución:{" "}
                        <strong>{selectedProfile.resolutionNumber || "No ingresado"}</strong>
                      </p>
                      {selectedProfile.authorizedCapacity && (
                        <p className="text-sm text-green-700 mt-1 flex items-center">
                          <Scale className="w-3 h-3 mr-1" />
                          Capacidad Autorizada:{" "}
                          <strong>{selectedProfile.authorizedCapacity} Ton/Año</strong>
                        </p>
                      )}
                    </div>
                    {selectedProfile.resolutionFileUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={selectedProfile.resolutionFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Resolución
                        </a>
                      </Button>
                    )}
                  </div>

                  {!selectedProfile.isResolutionVerified && selectedProfile.resolutionFileUrl && (
                    <div className="flex gap-3 justify-end mt-4">
                      {/* Botón Rechazar */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <XCircle className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rechazar Resolución Sanitaria</DialogTitle>
                            <DialogDescription>
                              Motivo (Ej: Giro incorrecto, Código LER faltante).
                            </DialogDescription>
                          </DialogHeader>
                          <Textarea
                            placeholder="Ej: El giro no corresponde a Valorización/Acopio."
                            value={rejectReason}
                            onChange={(e: unknown) =>
                              setRejectReason((e as ReturnType<typeof JSON.parse>).target.value)
                            }
                          />
                          <DialogFooter>
                            <Button
                              onClick={() => handleValidation("REJECT", "RESOLUTION")}
                              disabled={isProcessing}
                            >
                              Confirmar Rechazo
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Botón Aprobar con Capacidad */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Validar y Asignar Capacidad
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Validación Operativa Exitosa</DialogTitle>
                            <DialogDescription>
                              Al aprobar, debes ingresar la capacidad máxima autorizada según la
                              R.S.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="capacity">Capacidad Autorizada (Toneladas/Año)</Label>
                              <Input
                                id="capacity"
                                type="number"
                                placeholder="Ej: 5000"
                                value={authorizedCapacity}
                                onChange={(e: unknown) =>
                                  setAuthorizedCapacity(
                                    (e as ReturnType<typeof JSON.parse>).target.value
                                  )
                                }
                              />
                              <p className="text-xs text-gray-500">
                                Este valor se usará para el balance de masa.
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={() => handleValidation("APPROVE", "RESOLUTION")}
                              disabled={isProcessing}
                            >
                              Confirmar Validación
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {!selectedProfile.resolutionFileUrl && !selectedProfile.isResolutionVerified && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Pendiente de carga por el Gestor
                    </div>
                  )}
                </div>

                {/* 3. Conexión Ecosistema (HU-029C) */}
                <div className="p-4 rounded-lg border bg-orange-50 border-orange-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        3. Conexión Ecosistema
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Sistema de Gestión (GRANSIC):{" "}
                        <strong>{selectedProfile.gransicPartner || "No declarado"}</strong>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Información declarativa para trazabilidad REP.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-lg p-12">
              <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
              <p>Selecciona un gestor para revisar su documentación</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
