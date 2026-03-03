"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Shield,
  CheckCircle,
  AlertTriangle,
  Edit3,
  X,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { isProductor, isGenerador, isTransportista } from "@/lib/auth-helpers";
import { useRegionesYComunas } from "@/hooks/useRegionesyComunas";
import TransportistaProfile from "@/components/profile/TransportistaProfile";

export default function PerfilPage() {
  const { data: session, update: updateSession } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editando, setEditando] = useState(false);

  const esTransportista = session && isTransportista(session);

  const { regiones, regionesLoading, comunas, comunasLoading, cargarComunas } =
    useRegionesYComunas();

  // Cargar datos del perfil
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Error al cargar perfil");
      return response.json();
    },
  });

  const actualizarMutation = useMutation({
    mutationFn: async (data: ReturnType<typeof JSON.parse>) => {
      const payload: Record<string, unknown> = { name: data.name };
      const esProductorGenerador = session && (isProductor(session) || isGenerador(session));
      if (esProductorGenerador) {
        payload.idRETC = data.idRETC || null;
        payload.direccionComercial = data.direccionComercial || null;
        payload.direccionCasaMatriz = data.direccionCasaMatriz || null;
        payload.tipoProductorREP = data.tipoProductorREP || null;
        payload.tiposResiduos = data.tiposResiduos || [];
      }
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          (error as ReturnType<typeof JSON.parse>).error || "Error al actualizar perfil"
        );
      }
      return response.json();
    },
    onSuccess: async () => {
      await updateSession();
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Perfil actualizado exitosamente");
      setEditando(false);
      router.refresh();
    },
    onError: (error: ReturnType<typeof JSON.parse>) => {
      toast.error(
        (error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : String(error)) || "Error al actualizar el perfil"
      );
    },
  });

  return (
    <DashboardLayout
      title="Mi Perfil"
      subtitle="Gestione su información personal y preferencias de cuenta"
    >
      {esTransportista ? (
        <TransportistaProfile />
      ) : (
        <ProfileFormInner
          key={userProfile?.id || session?.user?.id || "loading"}
          userProfile={userProfile}
          session={session}
          editando={editando}
          setEditando={setEditando}
          actualizarMutation={actualizarMutation}
          regiones={regiones}
          regionesLoading={regionesLoading}
          comunas={comunas}
          comunasLoading={comunasLoading}
          cargarComunas={cargarComunas}
        />
      )}
    </DashboardLayout>
  );
}

function ProfileFormInner({
  userProfile,
  session,
  editando,
  setEditando,
  actualizarMutation,
  regiones,
  _regionesLoading,
  comunas,
  comunasLoading,
  cargarComunas,
}: ReturnType<typeof JSON.parse>) {
  const esProductorGenerador = session && (isProductor(session) || isGenerador(session));

  const [formData, setFormData] = useState({
    name: userProfile?.name || session?.user?.name || "",
    email: userProfile?.email || session?.user?.email || "",
    telefono: "",
    direccion: "",
    comuna: "",
    region: "",
    idRETC: userProfile?.idRETC || "",
    direccionComercial: userProfile?.direccionComercial || "",
    direccionCasaMatriz: userProfile?.direccionCasaMatriz || "",
    tipoProductorREP: userProfile?.tipoProductorREP || "",
    tiposResiduos: userProfile?.tiposResiduos || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.region && regiones.length > 0) {
      const region = (regiones as unknown as { id: string; nombre: string }[]).find(
        (r: ReturnType<typeof JSON.parse>) => r.nombre === formData.region
      );
      if (region) cargarComunas(region.id);
    }
  }, [formData.region, regiones, cargarComunas]);

  const handleSubmit = (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      actualizarMutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-[#459e60] via-[#44a15d] to-[#4fa362]">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/40 shadow-xl overflow-hidden transition-transform transform group-hover:scale-105">
                {session?.user?.image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <User className="h-16 w-16 text-white" strokeWidth={1.5} />
                )}
              </div>
              {editando && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-[#459e60]" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">{formData.name || "Usuario"}</h2>
              <p className="text-white/90 text-lg mb-3 flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-5 w-5" />
                {formData.email}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {session?.user?.roles?.map((rol: string) => (
                  <Badge
                    key={rol}
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-semibold capitalize"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {rol.toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>

            {!editando && (
              <Button
                onClick={() => setEditando(true)}
                className="bg-white text-[#459e60] hover:bg-white/90 font-bold shadow-lg px-6 transition-transform hover:scale-105"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="h-6 w-6" />
              Datos Personales
            </h3>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-[#459e60]" />
                  Nombre Completo <span className="text-red-500">*</span>
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
                  className={`h-12 border-2 text-gray-900 font-medium ${errors.name ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#459e60]"} transition-all`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-gray-700 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-[#459e60]" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="h-12 border-2 border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                />
              </div>

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
                  className="h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] transition-all"
                />
              </div>

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
                  value={userProfile?.rut || "No disponible"}
                  disabled
                  className="h-12 border-2 border-gray-200 bg-gray-50 text-gray-500 font-medium"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#4fa362] to-[#459e60] px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Ubicación
            </h3>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="grid gap-6">
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
                  className="h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] transition-all"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="region" className="text-sm font-bold text-gray-700">
                    Región
                  </Label>
                  {editando ? (
                    <select
                      id="region"
                      value={formData.region}
                      onChange={(e: ReturnType<typeof JSON.parse>) => {
                        const nombreRegion = (e as ReturnType<typeof JSON.parse>).target.value;
                        setFormData((prev) => ({ ...prev, region: nombreRegion, comuna: "" }));
                        const region = (
                          regiones as unknown as { id: string; nombre: string }[]
                        ).find((r: ReturnType<typeof JSON.parse>) => r.nombre === nombreRegion);
                        if (region) cargarComunas(region.id);
                      }}
                      className="h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] rounded-md px-3 w-full bg-white transition-all"
                    >
                      <option value="">Seleccionar región...</option>
                      {(regiones as unknown as { id: string; nombre: string }[]).map(
                        (region: ReturnType<typeof JSON.parse>) => (
                          <option key={region.id} value={region.nombre}>
                            {region.nombre}
                          </option>
                        )
                      )}
                    </select>
                  ) : (
                    <Input
                      id="region"
                      value={formData.region}
                      disabled
                      className="h-12 border-2 text-gray-900 font-medium border-gray-200 bg-gray-50 text-gray-600"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="comuna" className="text-sm font-bold text-gray-700">
                    Comuna
                  </Label>
                  {editando ? (
                    <select
                      id="comuna"
                      value={formData.comuna}
                      onChange={(e: ReturnType<typeof JSON.parse>) =>
                        setFormData((prev) => ({
                          ...prev,
                          comuna: (e as ReturnType<typeof JSON.parse>).target.value,
                        }))
                      }
                      disabled={!formData.region || comunasLoading}
                      className="h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] rounded-md px-3 w-full bg-white transition-all"
                    >
                      <option value="">Seleccionar comuna...</option>
                      {(comunas as unknown as { id: string; nombre: string }[]).map((comuna) => (
                        <option key={comuna.id} value={comuna.nombre}>
                          {comuna.nombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id="comuna"
                      value={formData.comuna}
                      disabled
                      className="h-12 border-2 text-gray-900 font-medium border-gray-200 bg-gray-50 text-gray-600"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {esProductorGenerador && (
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#459e60] to-[#44a15d] px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Información de Productor REP
              </h3>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="grid gap-6">
                <div className="space-y-3">
                  <Label htmlFor="idRETC" className="text-sm font-bold text-gray-700">
                    ID RETC
                  </Label>
                  <Input
                    id="idRETC"
                    value={formData.idRETC}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      setFormData({
                        ...formData,
                        idRETC: (e as ReturnType<typeof JSON.parse>).target.value.toUpperCase(),
                      })
                    }
                    disabled={!editando}
                    className="h-12 border-2 text-gray-900 font-medium uppercase border-gray-200 focus:border-[#459e60] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tipoProductorREP" className="text-sm font-bold text-gray-700">
                    Tipo de Productor REP
                  </Label>
                  <select
                    id="tipoProductorREP"
                    value={formData.tipoProductorREP}
                    onChange={(e: ReturnType<typeof JSON.parse>) =>
                      setFormData({
                        ...formData,
                        tipoProductorREP: (e as ReturnType<typeof JSON.parse>).target.value,
                      })
                    }
                    disabled={!editando}
                    className="h-12 border-2 text-gray-900 font-medium border-gray-200 focus:border-[#459e60] rounded-md px-3 w-full bg-white transition-all"
                  >
                    <option value="">Seleccionar tipo...</option>
                    <option value="Fabricante">Fabricante</option>
                    <option value="Importador">Importador</option>
                    <option value="Envasador/Envasador por Cuenta de Terceros">
                      Envasador/Envasador por Cuenta de Terceros
                    </option>
                    <option value="Comercializador Bajo Marca Propia">
                      Comercializador Bajo Marca Propia
                    </option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700 mb-2">Tipos de Residuos</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                    {[
                      "Neumáticos",
                      "Baterías",
                      "Aceites Lubricantes",
                      "AEE",
                      "Envases",
                      "Embalajes",
                    ].map((residuo) => (
                      <label
                        key={residuo}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${!editando ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.tiposResiduos.includes(residuo)}
                          onChange={(e: ReturnType<typeof JSON.parse>) => {
                            if (editando) {
                              const newResiduos = (e as ReturnType<typeof JSON.parse>).target
                                .checked
                                ? [...formData.tiposResiduos, residuo]
                                : formData.tiposResiduos.filter(
                                    (r: ReturnType<typeof JSON.parse>) => r !== residuo
                                  );
                              setFormData({ ...formData, tiposResiduos: newResiduos });
                            }
                          }}
                          disabled={!editando}
                          className="h-4 w-4 text-[#459e60] focus:ring-[#459e60] border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-900">{residuo}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {editando && (
          <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Button
              type="button"
              onClick={() => setEditando(false)}
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50 font-bold text-gray-700 transition-colors"
              disabled={actualizarMutation.isPending}
            >
              <X className="h-5 w-5 mr-2" /> Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-[#459e60] to-[#44a15d] hover:from-[#44a15d] hover:to-[#459e60] text-white font-bold shadow-lg transition-all hover:shadow-xl"
              disabled={actualizarMutation.isPending}
            >
              {actualizarMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        )}
      </form>

      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#2d5a3d] to-[#1a3a2a] px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="h-6 w-6" /> Seguridad
          </h3>
        </div>
        <CardContent className="p-6 bg-white">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#f6fcf3] to-white rounded-xl border-2 border-[#459e60]/20 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#459e60]" /> Contraseña
                </p>
                <p className="text-sm text-gray-600">Gestione su contraseña de acceso.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-[#459e60] text-[#459e60]"
                disabled
              >
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
