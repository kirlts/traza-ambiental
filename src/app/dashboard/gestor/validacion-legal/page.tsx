"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Clock, FileText, XCircle, Scale, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface LegalProfile {
  id: string;
  retcId: string | null;
  retcFileUrl: string | null;
  isRetcVerified: boolean;

  resolutionNumber: string | null;
  resolutionFileUrl: string | null;
  isResolutionVerified: boolean;
  authorizedCapacity: number | null;

  gransicPartner: string | null;

  status: "PENDIENTE" | "EN_REVISION" | "VERIFICADO" | "RECHAZADO";
  rejectionReason: string | null;
}

export default function ValidacionLegalPage() {
  const { data: _session } = useSession();
  const [profile, setProfile] = useState<LegalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // States for RETC Form
  const [retcId, setRetcId] = useState("");
  const [retcFile, setRetcFile] = useState<File | null>(null);
  const [submittingRetc, setSubmittingRetc] = useState(false);

  // States for Resolution Form
  const [resolutionNumber, setResolutionNumber] = useState("");
  const [resolutionFile, setResolutionFile] = useState<File | null>(null);
  const [submittingRes, setSubmittingRes] = useState(false);

  // States for Ecosystem Form
  const [gransic, setGransic] = useState("");
  const [submittingEco, setSubmittingEco] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/gestor/validacion-legal");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.retcId) setRetcId(data.retcId);
        if (data.resolutionNumber) setResolutionNumber(data.resolutionNumber);
        if (data.gransicPartner) setGransic(data.gransicPartner);
      }
    } catch (error: unknown) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRetc = async (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    if (!retcId || (!retcFile && !profile?.retcFileUrl)) {
      toast.error("Debes ingresar el ID RETC y subir el comprobante");
      return;
    }

    setSubmittingRetc(true);
    const formData = new FormData();
    formData.append("retcId", retcId);
    if (retcFile) formData.append("retcFile", retcFile);

    try {
      const res = await fetch("/api/gestor/validacion-legal", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Información RETC enviada");
        fetchProfile();
      } else {
        toast.error("Error al enviar");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setSubmittingRetc(false);
    }
  };

  const handleSubmitResolution = async (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    if (!resolutionNumber || (!resolutionFile && !profile?.resolutionFileUrl)) {
      toast.error("Debes ingresar el N° de Resolución y subir el archivo");
      return;
    }

    setSubmittingRes(true);
    const formData = new FormData();
    formData.append("resolutionNumber", resolutionNumber);
    if (resolutionFile) formData.append("resolutionFile", resolutionFile);

    try {
      const res = await fetch("/api/gestor/validacion-legal", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Resolución Sanitaria enviada");
        fetchProfile();
      } else {
        toast.error("Error al enviar");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setSubmittingRes(false);
    }
  };

  const handleSubmitEcosystem = async (e: unknown) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    setSubmittingEco(true);
    const formData = new FormData();
    formData.append("gransicPartner", gransic);

    try {
      const res = await fetch("/api/gestor/validacion-legal", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Información de Ecosistema actualizada");
        fetchProfile();
      } else {
        toast.error("Error al guardar");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setSubmittingEco(false);
    }
  };

  const getStatusBadge = (isVerified: boolean, status: string) => {
    if (isVerified) {
      return (
        <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-2" />
          Verificado
        </span>
      );
    }
    // Si no está verificado pero hay archivo subido, está en revisión
    // O si el estado global es RECHAZADO, mostrarlo
    if (status === "RECHAZADO") {
      return (
        <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4 mr-2" />
          Rechazado
        </span>
      );
    }
    return (
      <span className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-medium">
        <Clock className="w-4 h-4 mr-2" />
        En Revisión / Pendiente
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Validación Legal" subtitle="Cargando perfil...">
        <div className="flex justify-center p-8">Cargando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Validación Legal"
      subtitle="Gestiona tus documentos y permisos operativos"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Global Status Alert */}
        {profile?.status === "RECHAZADO" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Validación Rechazada</AlertTitle>
            <AlertDescription>
              {profile.rejectionReason ||
                "Tu documentación ha sido rechazada. Por favor revisa los comentarios y vuelve a intentarlo."}
            </AlertDescription>
          </Alert>
        )}

        {profile?.isRetcVerified && profile?.isResolutionVerified && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Validación Completa</AlertTitle>
            <AlertDescription className="text-green-700">
              Estás habilitado para operar y emitir certificados.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-1">
          {/* Card 1: Identidad RETC */}
          <Card
            className={
              profile?.isRetcVerified
                ? "border-green-200 shadow-sm"
                : "border-l-4 border-l-blue-500 shadow-md"
            }
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    1. Identidad RETC
                    {profile?.isRetcVerified && (
                      <CheckCircle className="ml-2 w-5 h-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Validación de existencia en Ventanilla Única y tipo de instalación.
                  </CardDescription>
                </div>
                {getStatusBadge(profile?.isRetcVerified || false, profile?.status || "PENDIENTE")}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRetc} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="retcId">ID Establecimiento RETC</Label>
                  <Input
                    id="retcId"
                    placeholder="Ej: 123456"
                    value={retcId}
                    onChange={(e: unknown) =>
                      setRetcId((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                    disabled={profile?.isRetcVerified || submittingRetc}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Comprobante Ventanilla Única</Label>
                  {profile?.retcFileUrl && (
                    <div className="flex items-center p-2 bg-slate-50 rounded border text-sm mb-2">
                      <FileText className="w-4 h-4 mr-2 text-blue-500" />
                      <a
                        href={profile.retcFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex-1 truncate"
                      >
                        Ver documento cargado
                      </a>
                    </div>
                  )}
                  {!profile?.isRetcVerified && (
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e: unknown) =>
                        setRetcFile((e as ReturnType<typeof JSON.parse>).target.files?.[0] || null)
                      }
                      disabled={submittingRetc}
                    />
                  )}
                </div>

                {!profile?.isRetcVerified && (
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={submittingRetc}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {submittingRetc ? "Guardando..." : "Guardar Identidad"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Card 2: Resolución Sanitaria */}
          <Card
            className={
              profile?.isResolutionVerified
                ? "border-green-200 shadow-sm"
                : "border-l-4 border-l-purple-500 shadow-md"
            }
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    2. Resolución Sanitaria
                    {profile?.isResolutionVerified && (
                      <CheckCircle className="ml-2 w-5 h-5 text-green-500" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Permiso sanitario para operar como planta de valorización o acopio.
                  </CardDescription>
                </div>
                {getStatusBadge(
                  profile?.isResolutionVerified || false,
                  profile?.status || "PENDIENTE"
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitResolution} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="resolutionNumber">N° Resolución Sanitaria</Label>
                  <Input
                    id="resolutionNumber"
                    placeholder="Ej: 1588"
                    value={resolutionNumber}
                    onChange={(e: unknown) =>
                      setResolutionNumber((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                    disabled={profile?.isResolutionVerified || submittingRes}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Documento Resolución (PDF)</Label>
                  {profile?.resolutionFileUrl && (
                    <div className="flex items-center p-2 bg-slate-50 rounded border text-sm mb-2">
                      <FileText className="w-4 h-4 mr-2 text-purple-500" />
                      <a
                        href={profile.resolutionFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex-1 truncate"
                      >
                        Ver resolución cargada
                      </a>
                    </div>
                  )}
                  {!profile?.isResolutionVerified && (
                    <Input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e: unknown) =>
                        setResolutionFile(
                          (e as ReturnType<typeof JSON.parse>).target.files?.[0] || null
                        )
                      }
                      disabled={submittingRes}
                    />
                  )}
                </div>

                {profile?.isResolutionVerified && profile?.authorizedCapacity && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center">
                    <Scale className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Capacidad Autorizada</p>
                      <p className="text-lg font-bold text-green-700">
                        {profile.authorizedCapacity} Toneladas/Año
                      </p>
                    </div>
                  </div>
                )}

                {!profile?.isResolutionVerified && (
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={submittingRes}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {submittingRes ? "Guardando..." : "Guardar Resolución"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Card 3: Ecosistema y Declaración GRANSIC */}
          <Card className="border-l-4 border-l-orange-500 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                3. Conexión Ecosistema
                <Users className="ml-2 w-5 h-5 text-orange-500" />
              </CardTitle>
              <CardDescription>
                Declaración de pertenencia a Sistemas de Gestión (GRANSIC).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitEcosystem} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="gransic">Sistema de Gestión (Opcional)</Label>
                  <Input
                    id="gransic"
                    placeholder="Ej: ECONEUMATICOS, NEUMACHILE"
                    value={gransic}
                    onChange={(e: unknown) =>
                      setGransic((e as ReturnType<typeof JSON.parse>).target.value)
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Indica si tienes contrato vigente con algún sistema de gestión colectivo o
                    individual.
                  </p>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={submittingEco}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submittingEco ? "Guardando..." : "Actualizar Información"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
