/**
 * Componente: Cargador de Fotos para Solicitudes
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface CargadorFotosProps {
  fotos: string[];
  onChange: (fotos: string[]) => void;
  maxFotos?: number;
  maxSize?: number; // en bytes
}

/**
 * Componente para cargar y previsualizar fotos
 * Soporta drag & drop y click para seleccionar
 */
export function CargadorFotos({
  fotos,
  onChange,
  maxFotos = 5,
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
}: CargadorFotosProps) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convierte un archivo a base64 para preview temporal
   */
  const convertirABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Maneja la carga de archivos
   */
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setCargando(true);
        setError(null);

        // Validar número máximo de fotos
        if (fotos.length + acceptedFiles.length > maxFotos) {
          setError(`Máximo ${maxFotos} fotos permitidas`);
          return;
        }

        // Validar tamaño de cada archivo
        const archivosGrandes = acceptedFiles.filter((file) => file.size > maxSize);
        if (archivosGrandes.length > 0) {
          setError(`Algunos archivos exceden ${maxSize / (1024 * 1024)}MB`);
          return;
        }

        // Convertir archivos a base64 para preview
        // En producción, aquí subirías a un servicio de storage (AWS S3, Cloudinary, etc.)
        const nuevasFotos = await Promise.all(acceptedFiles.map((file) => convertirABase64(file)));

        // Agregar nuevas fotos a las existentes
        onChange([...fotos, ...nuevasFotos]);
      } catch (err: unknown) {
        console.error("Error al cargar fotos:", err);
        setError("Error al cargar las fotos. Intente nuevamente.");
      } finally {
        setCargando(false);
      }
    },
    [fotos, maxFotos, maxSize, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize,
    maxFiles: maxFotos - fotos.length,
    disabled: cargando || fotos.length >= maxFotos,
  });

  /**
   * Elimina una foto por índice
   */
  const eliminarFoto = (index: number) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    onChange(nuevasFotos);
  };

  return (
    <div className="space-y-4">
      {/* Zona de Drop */}
      {fotos.length < maxFotos && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }
            ${cargando ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-2">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {cargando ? (
              <p className="text-gray-600">Cargando fotos...</p>
            ) : isDragActive ? (
              <p className="text-blue-600 font-medium">Suelta las fotos aquí</p>
            ) : (
              <>
                <p className="text-gray-600">
                  <span className="font-medium text-blue-600">Click para seleccionar</span> o
                  arrastra fotos aquí
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG o WebP (máx. {maxSize / (1024 * 1024)}MB cada una)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Preview de fotos cargadas */}
      {fotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              Fotos cargadas ({fotos.length}/{maxFotos})
            </p>
            {fotos.length >= maxFotos && <p className="text-sm text-amber-600">Límite alcanzado</p>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {fotos.map((foto, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={() => eliminarFoto(index)}
                  className="
                    absolute top-2 right-2
                    w-8 h-8 rounded-full
                    bg-red-500 text-white
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    hover:bg-red-600
                    flex items-center justify-center
                    shadow-lg
                  "
                  title="Eliminar foto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Número de foto */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm text-blue-800">
          <strong>💡 Consejo:</strong> Las fotos ayudan al transportista a identificar y prepararse
          para el retiro. Incluya imágenes del estado y ubicación de los neumáticos.
        </p>
      </div>
    </div>
  );
}
