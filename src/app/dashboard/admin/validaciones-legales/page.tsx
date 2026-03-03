"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Toaster, toast } from "react-hot-toast";

interface LegalProfile {
  id: string;
  carrierId: string;
  retcId?: string;
  sanitaryResolution?: string;
  retcFileUrl?: string;
  resolutionFileUrl?: string;
  sinaderFileUrl?: string;
  isRetcVerified: boolean;
  isResolutionVerified: boolean;
  isSinaderVerified: boolean;
  status: string;
  carrier: {
    name: string;
    email: string;
    rut: string;
  };
}

export default function AdminValidacionLegalPage() {
  const [profiles, setProfiles] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<LegalProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/admin/validacion-legal");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProfiles(data);
      }
    } catch {
      toast.error("Error cargando perfiles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDoc = async (profileId: string, type: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/validacion-legal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, type, action }),
      });
      if (!res.ok) throw new Error("Error actualizando");

      toast.success(`Documento ${action === "APPROVE" ? "validado" : "rechazado"}`);
      fetchProfiles(); // Recargar para ver cambios

      // Actualizar el seleccionado localmente también para UX inmediata
      if (selectedProfile && selectedProfile.id === profileId) {
        // Simple hack: cerrar y reabrir o fetch individual. Fetch global es rápido.
      }
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  const handleGlobalAction = async (action: "APPROVE" | "REJECT") => {
    if (!selectedProfile) return;
    try {
      const res = await fetch("/api/admin/validacion-legal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedProfile.id,
          type: "global",
          action,
          reason: action === "REJECT" ? rejectionReason : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      toast.success(`Transportista ${action === "APPROVE" ? "HABILITADO" : "RECHAZADO"}`);
      setSelectedProfile(null);
      fetchProfiles();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)
      );
    }
  };

  return (
    <DashboardLayout
      title="Validación Legal Transportistas"
      subtitle="Revisión de documentos para habilitación operativa (HU-027)"
    >
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Transportistas */}
        <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-700">Transportistas Pendientes</h3>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedProfile?.id === profile.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{profile.carrier.name}</p>
                    <p className="text-xs text-gray-500">{profile.carrier.rut}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      profile.status === "VERIFICADO"
                        ? "bg-green-100 text-green-800"
                        : profile.status === "RECHAZADO"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {profile.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-1 text-xs">
                  <span
                    className={`px-1.5 py-0.5 rounded ${profile.isRetcVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    RETC
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded ${profile.isResolutionVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    RES
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded ${profile.isSinaderVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    SINADER
                  </span>
                </div>
              </div>
            ))}
            {profiles.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500 text-sm">
                No hay perfiles pendientes
              </div>
            )}
          </div>
        </div>

        {/* Detalle y Validación */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProfile ? (
            <>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="text-xl font-bold mb-1">{selectedProfile.carrier.name}</h2>
                <p className="text-gray-500 text-sm mb-6">
                  RUT: {selectedProfile.carrier.rut} | Email: {selectedProfile.carrier.email}
                </p>

                {/* Documentos */}
                <div className="space-y-6">
                  {/* RETC */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">ID RETC</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        ID Declarado:{" "}
                        <span className="font-mono bg-white px-1 border rounded">
                          {selectedProfile.retcId || "No indica"}
                        </span>
                      </p>
                      {selectedProfile.retcFileUrl ? (
                        <a
                          href={selectedProfile.retcFileUrl}
                          target="_blank"
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          📄 Ver Documento
                        </a>
                      ) : (
                        <span className="text-red-500 text-xs">Sin archivo adjunto</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyDoc(selectedProfile.id, "retc", "APPROVE")}
                        className={`px-3 py-1 text-sm rounded border ${selectedProfile.isRetcVerified ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-green-50 text-gray-600"}`}
                      >
                        {selectedProfile.isRetcVerified ? "Validado" : "Validar"}
                      </button>
                    </div>
                  </div>

                  {/* Resolución */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Resolución Sanitaria</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        N° Declarado:{" "}
                        <span className="font-mono bg-white px-1 border rounded">
                          {selectedProfile.sanitaryResolution || "No indica"}
                        </span>
                      </p>
                      {selectedProfile.resolutionFileUrl ? (
                        <a
                          href={selectedProfile.resolutionFileUrl}
                          target="_blank"
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          📄 Ver Documento
                        </a>
                      ) : (
                        <span className="text-red-500 text-xs">Sin archivo adjunto</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyDoc(selectedProfile.id, "resolucion", "APPROVE")}
                        className={`px-3 py-1 text-sm rounded border ${selectedProfile.isResolutionVerified ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-green-50 text-gray-600"}`}
                      >
                        {selectedProfile.isResolutionVerified ? "Validado" : "Validar"}
                      </button>
                    </div>
                  </div>

                  {/* SINADER */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-gray-900">Cuenta SINADER</h4>
                      <p className="text-sm text-gray-600 mb-2">Evidencia de cuenta activa</p>
                      {selectedProfile.sinaderFileUrl ? (
                        <a
                          href={selectedProfile.sinaderFileUrl}
                          target="_blank"
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          🖼️ Ver Captura/Certificado
                        </a>
                      ) : (
                        <span className="text-red-500 text-xs">Sin archivo adjunto</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyDoc(selectedProfile.id, "sinader", "APPROVE")}
                        className={`px-3 py-1 text-sm rounded border ${selectedProfile.isSinaderVerified ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-green-50 text-gray-600"}`}
                      >
                        {selectedProfile.isSinaderVerified ? "Validado" : "Validar"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Acciones Globales */}
                <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between gap-4 items-end">
                  <div className="w-full md:w-2/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razón de Rechazo (Opcional)
                    </label>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e: unknown) =>
                        setRejectionReason((e as ReturnType<typeof JSON.parse>).target.value)
                      }
                      placeholder="Ej: Resolución sanitaria ilegible..."
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleGlobalAction("REJECT")}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm"
                    >
                      Rechazar Todo
                    </button>
                    <button
                      onClick={() => handleGlobalAction("APPROVE")}
                      disabled={
                        !selectedProfile.isRetcVerified ||
                        !selectedProfile.isResolutionVerified ||
                        !selectedProfile.isSinaderVerified
                      }
                      className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Habilitar Transportista
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed text-center text-gray-400">
              Selecciona un transportista para revisar su documentación
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
