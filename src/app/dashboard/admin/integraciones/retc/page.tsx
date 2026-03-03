"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface RetcEstablecimiento {
  id: string;
  retcId: string;
  razonSocial: string;
  comuna: string;
  rubro: string;
  estado: string;
  fechaImportacion: string;
}

interface RetcStats {
  total: number;
  ultimos: RetcEstablecimiento[];
  ultimaActualizacion: string | null;
}

interface ImportError {
  message: string;
  details?: string | string[];
  detectedColumns?: string[];
}

export default function CargaRetcPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<RetcStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [importError, setImportError] = useState<ImportError | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/admin/retc/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error: unknown) {
      console.error("Error fetching stats:", error);
      toast.error("Error al cargar estadísticas");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".csv")) {
        toast.error("Por favor selecciona un archivo .csv");
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    setImportError(null); // Limpiar errores previos
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/retc/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const message =
          data.stats.errors > 0
            ? `Importación completada con advertencias: ${data.stats.processed} procesados, ${data.stats.errors} errores`
            : `Importación exitosa: ${data.stats.processed} registros procesados.`;
        toast.success(message);

        if (data.warnings && data.warnings.length > 0) {
          // Advertencias procesadas internamente
        }

        setFile(null);
        setImportError(null);
        // Limpiar input file
        const fileInput = document.getElementById("csv-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchStats();
      } else {
        // Guardar error para mostrar en UI
        setImportError({
          message: data.error || "Error en la importación",
          details: data?.details,
          detectedColumns: data?.detectedColumns,
        });
        toast.error(data.error || "Error en la importación", { duration: 5000 });
        console.error("Error de importación:", data);
      }
    } catch {
      setImportError({
        message: "Error de red al subir el archivo",
      });
      toast.error("Error de red al subir el archivo");
    } finally {
      setUploading(false);
    }
  }, [file, fetchStats]);

  // Memoizar información del archivo para evitar re-renders
  const fileInfo = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2),
    };
  }, [file]);

  return (
    <DashboardLayout
      title="Integración RETC"
      subtitle="Gestión y sincronización del catálogo de establecimientos de Ventanilla Única"
      actions={
        <Button
          onClick={fetchStats}
          disabled={loadingStats}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loadingStats ? "animate-spin" : ""}`} />
          Actualizar Datos
        </Button>
      }
    >
      <div className="space-y-6 w-full">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Card de Carga - Columna Izquierda (2/3 en desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-emerald-100 shadow-sm">
              <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/50 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Upload className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Carga Masiva</CardTitle>
                    <CardDescription>
                      Importar establecimientos desde archivo oficial
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid w-full items-center gap-3">
                  <Label htmlFor="csv-file" className="text-base font-medium">
                    Seleccionar Archivo CSV
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="flex-1 cursor-pointer file:cursor-pointer file:text-emerald-600 file:font-medium hover:file:bg-emerald-50"
                    />
                    <Button
                      onClick={handleUpload}
                      disabled={!file || uploading}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Importar
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Formato requerido: CSV delimitado por punto y coma (;) descargado de{" "}
                      <a
                        href="https://datosretc.mma.gob.cl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        datosretc.mma.gob.cl
                      </a>
                    </p>

                    {/* Mostrar error de importación si existe */}
                    {importError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-900 font-semibold">
                          Error en la importación
                        </AlertTitle>
                        <AlertDescription className="text-red-800 space-y-2 mt-2">
                          <p className="font-medium">{importError?.message}</p>
                          {importError?.details && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold mb-1">Detalles:</p>
                              <ul className="list-disc list-inside text-xs space-y-1">
                                {(Array.isArray(importError.details)
                                  ? importError.details
                                  : [importError.details]
                                )
                                  .slice(0, 5)
                                  .map(
                                    (detail, idx) => detail && <li key={idx}>{String(detail)}</li>
                                  )}
                              </ul>
                            </div>
                          )}
                          {importError?.detectedColumns &&
                            importError?.detectedColumns.length > 0 && (
                              <div className="mt-2 p-2 bg-white rounded border border-red-200">
                                <p className="text-xs font-semibold mb-1">
                                  Columnas detectadas en el archivo:
                                </p>
                                <p className="text-xs font-mono text-red-700">
                                  {(importError?.detectedColumns as string[]).join(", ")}
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                  El archivo debe contener al menos una de estas columnas: ID,
                                  ID_RETC, o VU_ID
                                </p>
                              </div>
                            )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Tabla de formato esperado */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        Columnas Requeridas en el CSV
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-white border-b border-gray-200">
                              <th className="text-left p-2 font-semibold text-gray-700">Columna</th>
                              <th className="text-left p-2 font-semibold text-gray-700">
                                Nombres Aceptados
                              </th>
                              <th className="text-left p-2 font-semibold text-gray-700">
                                Requerido
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium text-gray-900">ID Establecimiento</td>
                              <td className="p-2 text-gray-600 font-mono">ID, ID_RETC, VU_ID</td>
                              <td className="p-2">
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                  Sí
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium text-gray-900">Razón Social</td>
                              <td className="p-2 text-gray-600 font-mono">
                                RAZON_SOCIAL, NOMBRE_EMPRESA
                              </td>
                              <td className="p-2">
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                  Sí
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium text-gray-900">Dirección</td>
                              <td className="p-2 text-gray-600 font-mono">DIRECCION, CALLE</td>
                              <td className="p-2">
                                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                                  Recomendado
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium text-gray-900">Comuna</td>
                              <td className="p-2 text-gray-600 font-mono">COMUNA</td>
                              <td className="p-2">
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                  Sí
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium text-gray-900">Región</td>
                              <td className="p-2 text-gray-600 font-mono">REGION</td>
                              <td className="p-2">
                                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                  Sí
                                </Badge>
                              </td>
                            </tr>
                            <tr className="border-b border-gray-100">
                              <td className="p-2 font-medium text-gray-900">Rubro</td>
                              <td className="p-2 text-gray-600 font-mono">RUBRO, CIIU</td>
                              <td className="p-2">
                                <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                                  Recomendado
                                </Badge>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-2 font-medium text-gray-900">Estado</td>
                              <td className="p-2 text-gray-600 font-mono">ESTADO</td>
                              <td className="p-2">
                                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                                  Opcional
                                </Badge>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-xs font-semibold text-emerald-900 mb-2">
                          Ejemplo de formato:
                        </p>
                        <code className="text-xs text-emerald-800 block whitespace-pre-wrap font-mono bg-white p-2 rounded border border-emerald-200">
                          {`ID;RAZON_SOCIAL;DIRECCION;COMUNA;REGION;RUBRO;ESTADO
VU-12345;Empresa ABC S.A.;Av. Principal 123;Santiago;Metropolitana;Manufactura;ACTIVO
VU-12346;Empresa XYZ Ltda.;Calle Secundaria 456;Valparaíso;Valparaíso;Comercio;ACTIVO`}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {fileInfo && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <FileText className="h-8 w-8 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-900">{fileInfo.name}</p>
                      <p className="text-sm text-emerald-700">
                        {fileInfo.size} MB • Listo para importar
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    Últimos Registros Importados
                  </CardTitle>
                  <Badge variant="outline" className="font-normal">
                    Mostrando {stats?.ultimos.length || 0} recientes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="w-[100px]">ID RETC</TableHead>
                        <TableHead>Razón Social</TableHead>
                        <TableHead>Comuna</TableHead>
                        <TableHead className="hidden md:table-cell">Rubro</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Fecha Carga</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.ultimos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Database className="h-8 w-8 text-gray-300" />
                              <p>No hay datos registrados aún.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats?.ultimos.map((rec) => (
                          <TableRow key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="font-medium font-mono text-xs">
                              {rec.retcId}
                            </TableCell>
                            <TableCell className="font-medium">{rec.razonSocial}</TableCell>
                            <TableCell className="text-muted-foreground">{rec.comuna}</TableCell>
                            <TableCell
                              className="hidden md:table-cell max-w-[200px] truncate text-muted-foreground text-xs"
                              title={rec.rubro}
                            >
                              {rec.rubro}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  rec.estado === "ACTIVO"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                                    : ""
                                }
                              >
                                {rec.estado || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                              {format(new Date(rec.fechaImportacion), "dd/MM/yyyy HH:mm")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card de Estadísticas - Columna Derecha (1/3 en desktop) */}
          <div className="space-y-6">
            <Card className="bg-emerald-700 text-white border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-50">Estado Base de Datos</CardTitle>
                <CardDescription className="text-emerald-100/80">
                  Resumen de sincronización
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-emerald-100/80 uppercase tracking-wider">
                    Total Establecimientos
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      {stats?.total ? new Intl.NumberFormat("es-CL").format(stats.total) : "0"}
                    </span>
                    <span className="text-emerald-100">registros</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-emerald-600">
                  <span className="text-sm font-medium text-emerald-100/80 uppercase tracking-wider">
                    Última Actualización
                  </span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-200" />
                    <span className="text-lg font-medium text-white">
                      {stats?.ultimaActualizacion
                        ? format(new Date(stats.ultimaActualizacion), "d MMM, yyyy", { locale: es })
                        : "Nunca"}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200">
                    {stats?.ultimaActualizacion
                      ? `Hora: ${format(new Date(stats.ultimaActualizacion), "HH:mm")}`
                      : ""}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50/50 border-yellow-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-900">Importancia de los Datos</h4>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      Esta base de datos es crítica para la{" "}
                      <strong>validación automática de identidad</strong> de nuevos usuarios.
                    </p>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      Se recomienda actualizar este catálogo <strong>mensualmente</strong> para
                      asegurar que los nuevos establecimientos puedan registrarse en la plataforma
                      sin fricción.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
