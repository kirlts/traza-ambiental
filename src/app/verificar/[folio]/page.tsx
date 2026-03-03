import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Calendar, Truck, Building, Factory } from "lucide-react";

interface VerificacionPageProps {
  params: Promise<{
    folio: string;
  }>;
}

export default async function VerificacionPage({ params }: VerificacionPageProps) {
  const { folio } = await params;

  try {
    // Buscar certificado por folio
    const certificado = await prisma.certificado.findUnique({
      where: { folio },
      include: {
        solicitud: {
          include: {
            generador: {
              select: { name: true },
            },
            transportista: {
              select: { name: true },
            },
            gestor: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!certificado) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600">Certificado No Encontrado</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                No se encontró un certificado con el folio <strong>{folio}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Verifique que el folio sea correcto e intente nuevamente.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Certificado Válido</CardTitle>
              <p className="text-gray-600">Este certificado ha sido verificado exitosamente</p>
            </CardHeader>
          </Card>

          {/* Información del Certificado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Información del Certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Folio</p>
                  <p className="font-mono text-lg">{certificado.folio}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Emisión</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {certificado.fechaEmision.toLocaleDateString("es-CL")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Peso Valorizado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {certificado.pesoValorizado} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cantidad de Unidades</p>
                  <p className="text-xl font-semibold">{certificado.cantidadUnidades}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Categorías</p>
                <div className="flex gap-2">
                  {certificado.categorias.map((cat: ReturnType<typeof JSON.parse>) => (
                    <Badge key={cat} variant="outline">
                      Categoría {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cadena de Trazabilidad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Cadena de Trazabilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Generador</p>
                  <p className="text-sm text-gray-600">{certificado.solicitud.generador?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Transportista</p>
                  <p className="text-sm text-gray-600">
                    {certificado.solicitud.transportista?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Factory className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Gestor</p>
                  <p className="text-sm text-gray-600">{certificado.solicitud.gestor?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tratamientos Aplicados */}
          <Card>
            <CardHeader>
              <CardTitle>Tratamientos Aplicados</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(certificado.tratamientos) && certificado.tratamientos.length > 0 ? (
                <div className="space-y-2">
                  {certificado.tratamientos.map(
                    (tratamiento: ReturnType<typeof JSON.parse>, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">
                          {(tratamiento as { tipo?: string }).tipo || "N/A"}
                        </span>
                        <Badge variant="secondary">
                          {(tratamiento as { peso?: number }).peso || 0} kg
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No hay información de tratamientos disponible</p>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="bg-gray-900 text-white">
            <CardContent className="text-center py-6">
              <p className="text-sm mb-2">
                Este certificado acredita que los neumáticos fueron valorizados
              </p>
              <p className="text-xs text-gray-300">
                según el D.S. N°8 de Neumáticos bajo la Ley REP
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Verificado el {new Date().toLocaleString("es-CL")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error: unknown) {
    console.error("Error verificando certificado:", error);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Error de Verificación</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Ocurrió un error al verificar el certificado <strong>{folio}</strong>
            </p>
            <p className="text-sm text-gray-500">Intente nuevamente más tarde.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export const metadata = {
  title: "Verificación de Certificado | Traza Ambiental",
  description: "Verifique la autenticidad de certificados de valorización de neumáticos",
};
