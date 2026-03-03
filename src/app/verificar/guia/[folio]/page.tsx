"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, FileText, Truck, ShieldCheck, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface VerificarGuiaResultado {
  valido: boolean;
  mensaje?: string;
  documento?: {
    id: string;
    folio: string;
    createdAt: string;
    estado: string;
    cantidadTotal: number;
    pesoTotalEstimado: number;
    generador: { name: string; rut: string };
    transportista: { name: string };
  };
}

export default function VerificarGuiaPage({ params }: { params: Promise<{ folio: string }> }) {
  const { folio } = use(params);
  const [resultado, setResultado] = useState<VerificarGuiaResultado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/public/verificar-guia/${folio}`)
      .then((res) => res.json())
      .then((data: VerificarGuiaResultado) => {
        setResultado(data);
        setLoading(false);
      })
      .catch((_err) => {
        setError("Error al conectar con el servidor de verificación");
        setLoading(false);
      });
  }, [folio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !resultado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-red-800">Error de Verificación</h1>
            <p className="text-red-600 mt-2">{error || "No se pudo obtener la información"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const doc = resultado.documento;
  const esValido = resultado.valido;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card
          className={`border-l-8 ${esValido ? "border-l-emerald-500" : "border-l-red-500"} shadow-lg`}
        >
          <CardContent className="pt-6 text-center">
            {esValido ? (
              <>
                <ShieldCheck className="h-20 w-20 text-emerald-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-emerald-800">DOCUMENTO VÁLIDO</h1>
                <p className="text-emerald-600 mt-2">
                  La integridad de este documento ha sido verificada correctamente.
                </p>
                <Badge
                  variant="outline"
                  className="mt-4 border-emerald-200 text-emerald-700 bg-emerald-50"
                >
                  Firma Digital Verificada
                </Badge>
              </>
            ) : (
              <>
                <AlertTriangle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-red-800">DOCUMENTO INVÁLIDO</h1>
                <p className="text-red-600 mt-2">
                  {resultado.mensaje || "El documento no coincide con nuestros registros."}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {esValido && doc && (
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Detalles del Documento
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Folio
                  </p>
                  <p className="text-slate-900 font-bold">{doc.folio}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Fecha de Emisión
                  </p>
                  <p className="text-slate-900">
                    {format(new Date(doc.createdAt), "dd 'de' MMMM, yyyy HH:mm", { locale: es })}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Generador de Residuos
                  </p>
                  <p className="text-slate-900 font-medium">{doc.generador.name}</p>
                  <p className="text-xs text-slate-500">RUT: {doc.generador.rut}</p>
                </div>

                <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-700">Información de Retiro</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Cantidad</p>
                      <p className="text-sm text-slate-700">{doc.cantidadTotal} unidades</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase">Peso</p>
                      <p className="text-sm text-slate-700">{doc.pesoTotalEstimado} kg (est.)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Transportista
                  </p>
                  <p className="text-slate-900 font-medium">{doc.transportista.name}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Estado Actual
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {doc.estado.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-xs text-slate-400">
                  Código de Verificación Único: <span className="font-mono">{doc.id}</span>
                </p>
                <p className="text-[10px] text-slate-300 mt-2 px-8 leading-relaxed">
                  Este sistema de verificación confirma que los datos mostrados coinciden
                  exactamente con los registros oficiales de Traza Ambiental para este folio. No
                  modifique ni altere este documento.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} Traza Ambiental - Sistema de Trazabilidad REP Chile
        </div>
      </div>
    </div>
  );
}
