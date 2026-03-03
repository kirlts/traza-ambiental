"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, User, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TestHU009Page() {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["test-recepciones"],
    queryFn: async () => {
      const response = await fetch("/api/test/recepciones");
      if (!response.ok) {
        throw new Error("Error cargando recepciones");
      }
      return response.json();
    },
  });

  const recepciones = response?.recepciones || [];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">🧪 PRUEBA HU-009 (Sin Autenticación)</h1>
          <p className="text-muted-foreground">Cargando datos de prueba...</p>
        </div>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">❌ Error en HU-009</h1>
          <p className="text-muted-foreground mb-4">
            Error:{" "}
            {error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : "Error desconocido"}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold mb-2">🔧 Debug Info:</h3>
            <pre className="text-sm text-red-800 whitespace-pre-wrap">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 PRUEBA HU-009: Recepciones Pendientes</h1>
        <p className="text-muted-foreground mb-4">
          Página de prueba sin autenticación para verificar que HU-009 funciona
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            📦 Recepciones: {recepciones.length}
          </Badge>
          <Link href="/login">
            <Button variant="outline">🔐 Ir al Login Real</Button>
          </Link>
        </div>
      </div>

      {recepciones.length === 0 ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay recepciones pendientes</h3>
            <p className="text-muted-foreground mb-4">
              Esto significa que HU-009 no tiene datos de prueba.
            </p>
            <p className="text-sm text-muted-foreground">
              💡 Ejecuta el seed de HU-009 para crear datos de prueba
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {recepciones.map((recepcion: ReturnType<typeof JSON.parse>) => (
            <Card key={recepcion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{recepcion.folio}</CardTitle>
                      <CardDescription>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Entregado{" "}
                          {format(new Date(recepcion.fechaEntrega), "PPP", { locale: es })}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    Pendiente Validación
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Información del Generador */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4" />
                      Generador
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>{recepcion.generador.name}</div>
                      <div>{recepcion.generador.email}</div>
                    </div>
                  </div>

                  {/* Información del Transportista */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Truck className="h-4 w-4" />
                      Transportista
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {recepcion.transportista ? (
                        <>
                          <div>{recepcion.transportista.name}</div>
                          <div>{recepcion.transportista.email}</div>
                          {recepcion.vehiculo && (
                            <div className="text-xs">
                              {recepcion.vehiculo.patente} ({recepcion.vehiculo.tipo})
                            </div>
                          )}
                        </>
                      ) : (
                        <div>No asignado</div>
                      )}
                    </div>
                  </div>

                  {/* Datos Declarados */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      📋 Datos Declarados
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {recepcion.pesoDeclarado && <div>Peso: {recepcion.pesoDeclarado} kg</div>}
                      {recepcion.cantidadDeclarada && (
                        <div>Cantidad: {recepcion.cantidadDeclarada} unidades</div>
                      )}
                      {recepcion.categoriaDeclarada.length > 0 && (
                        <div>Categoría: {recepcion.categoriaDeclarada.join(", ")}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {recepcion.direccionRetiro}, {recepcion.comuna}
                  </div>
                </div>

                {/* Botón de prueba */}
                <div className="mt-4 pt-4 border-t">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">
                      🎯 <strong>Esta es una página de PRUEBA</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      Para probar HU-009 completo, necesitas hacer login como gestor en la
                      aplicación real.
                    </p>
                    <div className="mt-3">
                      <Link href="/login">
                        <Button size="sm" className="mr-2">
                          🔐 Ir al Login Real
                        </Button>
                      </Link>
                      <Link href="/dashboard/gestor">
                        <Button size="sm" variant="outline">
                          📊 Ir al Dashboard Gestor
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Debug Info */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">🔍 Información de Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(response?.debug || "No debug info", null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
