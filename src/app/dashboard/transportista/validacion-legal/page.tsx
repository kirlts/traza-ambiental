"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Toaster, toast } from "react-hot-toast";

interface LegalProfile {
  id: string;
  retcId?: string;
  sanitaryResolution?: string;
  retcFileUrl?: string;
  resolutionFileUrl?: string;
  sinaderFileUrl?: string;
  isRetcVerified: boolean;
  isResolutionVerified: boolean;
  isSinaderVerified: boolean;
  status: "PENDIENTE" | "EN_REVISION" | "VERIFICADO" | "RECHAZADO";
  rejectionReason?: string;
}

export default function ValidacionLegalPage() {
  const [profile, setProfile] = useState<LegalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/transportista/validacion-legal");
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error: unknown) {
      console.error("Error cargando perfil:", error);
      toast.error("Error al cargar estado de validación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: unknown, type: string) => {
    const file = (e as ReturnType<typeof JSON.parse>).target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no debe superar los 5MB");
      return;
    }

    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", type);

    // Si es un documento que requiere metadatos manuales, podríamos abrir un modal primero
    // Por simplicidad en este MVP, asumimos que se actualiza solo el archivo o pedimos datos después
    // Idealmente: Usar un Modal para pedir ID RETC junto con el archivo

    try {
      const res = await fetch("/api/transportista/validacion-legal", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Documento subido correctamente");
      setProfile(data.profile);
    } catch (error: unknown) {
      toast.error(
        (error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)) || "Error al subir documento"
      );
    } finally {
      setUploading(null);
    }
  };

  const _handleMetadataUpdate = async (_type: string, _metadata: ReturnType<typeof JSON.parse>) => {
    // Reutilizamos el endpoint POST pero enviando metadata y quizás un archivo dummy o modificando el endpoint para aceptar solo metadata
    // Por ahora, asumiremos que el usuario debe volver a subir el archivo si quiere cambiar metadatos,
    // o implementar un endpoint PATCH específico.
    // Para simplificar, aquí solo mostramos la UI de carga.
    toast("Funcionalidad de actualización de metadatos en desarrollo", { icon: "🚧" });
  };

  const getStatusBadge = (isVerified: boolean, fileUrl?: string) => {
    if (isVerified)
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
          Verificado
        </span>
      );
    if (fileUrl)
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-200">
          En Revisión
        </span>
      );
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">
        Pendiente
      </span>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Validación Legal" subtitle="Cargando información...">
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Validación Legal"
      subtitle="Gestiona tus documentos para habilitar tu operación (Resolución Sanitaria, RETC, SINADER)"
    >
      <Toaster position="top-right" />

      <div className="w-full space-y-6">
        {/* Estado Global */}
        <div
          className={`p-6 rounded-xl border ${
            profile?.status === "VERIFICADO"
              ? "bg-emerald-50 border-emerald-200"
              : profile?.status === "RECHAZADO"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full ${
                profile?.status === "VERIFICADO"
                  ? "bg-emerald-100 text-emerald-600"
                  : profile?.status === "RECHAZADO"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
              }`}
            >
              {profile?.status === "VERIFICADO" ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Estado de Habilitación: {profile?.status || "PENDIENTE"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {profile?.status === "VERIFICADO"
                  ? "Tu cuenta está plenamente habilitada para operar."
                  : "Debes completar y validar todos los documentos requeridos para poder aceptar solicitudes."}
              </p>
              {profile?.rejectionReason && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg text-sm text-red-800">
                  <strong>Motivo de rechazo:</strong> {profile.rejectionReason}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tarjetas de Documentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RETC */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">ID RETC</h3>
                <p className="text-xs text-gray-500">
                  Registro de Emisiones y Transferencia de Contaminantes
                </p>
              </div>
              {getStatusBadge(profile?.isRetcVerified || false, profile?.retcFileUrl)}
            </div>

            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-gray-500">ID Registrado:</span>
                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                  {profile?.retcId || "No registrado"}
                </span>
              </div>

              {profile?.retcFileUrl && (
                <a
                  href={profile.retcFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ver comprobante actual
                </a>
              )}

              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actualizar Comprobante
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e: unknown) => handleFileUpload(e, "retc")}
                    disabled={uploading === "retc"}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploading === "retc" && <span className="animate-spin">⌛</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Resolución Sanitaria */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Resolución Sanitaria</h3>
                <p className="text-xs text-gray-500">Autorización para transporte de residuos</p>
              </div>
              {getStatusBadge(profile?.isResolutionVerified || false, profile?.resolutionFileUrl)}
            </div>

            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-gray-500">N° Resolución:</span>
                <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                  {profile?.sanitaryResolution || "No registrado"}
                </span>
              </div>

              {profile?.resolutionFileUrl && (
                <a
                  href={profile.resolutionFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ver resolución actual
                </a>
              )}

              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actualizar Resolución
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e: unknown) => handleFileUpload(e, "resolucion")}
                    disabled={uploading === "resolucion"}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploading === "resolucion" && <span className="animate-spin">⌛</span>}
                </div>
              </div>
            </div>
          </div>

          {/* SINADER */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Cuenta SINADER</h3>
                <p className="text-xs text-gray-500">
                  Evidencia de inscripción activa en Sistema Nacional de Declaración de Residuos
                </p>
              </div>
              {getStatusBadge(profile?.isSinaderVerified || false, profile?.sinaderFileUrl)}
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Sube una captura de pantalla o certificado que demuestre que tu cuenta en SINADER
                está activa y habilitada para declarar.
              </p>

              {profile?.sinaderFileUrl && (
                <a
                  href={profile.sinaderFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ver evidencia SINADER
                </a>
              )}

              <div className="pt-2 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actualizar Evidencia
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e: unknown) => handleFileUpload(e, "sinader")}
                    disabled={uploading === "sinader"}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {uploading === "sinader" && <span className="animate-spin">⌛</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
