import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SolicitudDetalleActions from "@/components/transportista/SolicitudDetalleActions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Calendar, Package, User, Phone, FileText, Clock } from "lucide-react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const solicitud = await prisma.solicitudRetiro.findUnique({
    where: { id },
    include: {
      generador: {
        select: {
          name: true,
          email: true,
          rut: true,
        },
      },
      vehiculo: true,
      guiaDespacho: true,
    },
  });

  if (!solicitud) {
    notFound();
  }

  // Verificar autorización
  const isAssigned = solicitud.transportistaId === session.user.id;
  const isPending = solicitud.estado === "PENDIENTE" && !solicitud.transportistaId;

  if (!isAssigned && !isPending) {
    return (
      <DashboardLayout title="Acceso Denegado" subtitle="No tiene permisos para ver esta solicitud">
        <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
          <p className="text-gray-700">
            Esta solicitud no está disponible o no tiene permisos para verla.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Solicitud ${solicitud.folio}`}
      subtitle="Detalles de la solicitud de retiro"
    >
      <div className="w-full space-y-6">
        {/* Estado Header */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Solicitud #{solicitud.folio}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Creada el {format(solicitud.createdAt, "dd 'de' MMMM, yyyy", { locale: es })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                solicitud.estado === "PENDIENTE"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : solicitud.estado === "ACEPTADA"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : solicitud.estado === "RECOLECTADA"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-gray-50 text-gray-700 border border-gray-200"
              }`}
            >
              {solicitud.estado.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ubicación */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 h-full">
            <h3 className="text-base font-semibold flex items-center gap-2 text-emerald-900">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              Ubicación de Retiro
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Dirección
                </p>
                <p className="font-medium text-gray-900 text-base">{solicitud.direccionRetiro}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Zona
                </p>
                <p className="text-gray-700">
                  {solicitud.comuna}, {solicitud.region}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Empresa Generadora
                </p>
                <p className="font-semibold text-emerald-700">{solicitud.generador?.name || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Contacto y Horario */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 h-full">
            <h3 className="text-base font-semibold flex items-center gap-2 text-emerald-900">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              Contacto y Horario
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Contacto
                  </p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">{solicitud.nombreContacto}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Teléfono
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${solicitud.telefonoContacto}`}
                      className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                    >
                      {solicitud.telefonoContacto}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Preferencia de Retiro
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900">
                      {format(solicitud.fechaPreferida, "dd/MM/yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900">
                      {solicitud.horarioPreferido}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carga */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 md:col-span-2">
            <h3 className="text-base font-semibold flex items-center gap-2 text-emerald-900">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              Detalles de la Carga
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200 text-center">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-2">
                  Peso Total Estimado
                </p>
                <p className="text-3xl font-bold text-emerald-700">
                  {solicitud.pesoTotalEstimado}{" "}
                  <span className="text-base font-normal text-gray-600">kg</span>
                </p>
              </div>
              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200 text-center">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-2">
                  Cantidad Total
                </p>
                <p className="text-3xl font-bold text-emerald-700">
                  {solicitud.cantidadTotal}{" "}
                  <span className="text-base font-normal text-gray-600">un.</span>
                </p>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center flex flex-col justify-center">
                <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-3">
                  Desglose
                </p>
                <div className="text-sm font-medium space-y-2 text-gray-700">
                  {solicitud.categoriaA_cantidad > 0 && (
                    <div className="flex justify-between px-2">
                      <span className="text-gray-600">Cat A:</span>
                      <span className="font-semibold text-gray-900">
                        {solicitud.categoriaA_cantidad} un.
                      </span>
                    </div>
                  )}
                  {solicitud.categoriaB_cantidad > 0 && (
                    <div className="flex justify-between px-2">
                      <span className="text-gray-600">Cat B:</span>
                      <span className="font-semibold text-gray-900">
                        {solicitud.categoriaB_cantidad} un.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {solicitud.instrucciones && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <FileText className="w-4 h-4" /> Instrucciones Especiales
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">{solicitud.instrucciones}</p>
              </div>
            )}
          </div>
        </div>

        <SolicitudDetalleActions
          solicitud={{
            id: solicitud.id,
            folio: solicitud.folio,
            pesoTotalEstimado: solicitud.pesoTotalEstimado,
            estado: solicitud.estado,
          }}
          guiaDespacho={solicitud.guiaDespacho}
          isAssigned={isAssigned}
          isPending={isPending}
        />
      </div>
    </DashboardLayout>
  );
}
