/**
 * Hook para gestionar Regiones y Comunas de Chile
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { useState, useEffect, useCallback } from "react";

interface Region {
  id: string;
  codigo: string;
  nombre: string;
  totalComunas: number;
}

interface Comuna {
  id: string;
  codigo: string;
  nombre: string;
}

interface UseRegionesYComunasReturn {
  // Regiones
  regiones: Region[];
  regionesLoading: boolean;
  regionesError: string | null;

  // Comunas
  comunas: Comuna[];
  comunasLoading: boolean;
  comunasError: string | null;

  // Métodos
  cargarComunas: (regionId: string) => Promise<void>;
  resetComunas: () => void;
}

/**
 * Hook para obtener regiones y comunas de Chile
 *
 * @returns Objeto con regiones, comunas y métodos
 *
 * @example
 * ```tsx
 * const {
 *   regiones,
 *   comunas,
 *   cargarComunas,
 *   regionesLoading,
 * } = useRegionesYComunas();
 *
 * // Cuando selecciona una región
 * const handleRegionChange = (regionId: string) => {
 *   cargarComunas(regionId);
 * };
 * ```
 */
export function useRegionesYComunas(): UseRegionesYComunasReturn {
  // Estado de regiones
  const [regiones, setRegiones] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [regionesLoading, setRegionesLoading] = useState(true);
  const [regionesError, setRegionesError] = useState<string | null>(null);

  // Estado de comunas
  const [comunas, setComunas] = useState<ReturnType<typeof JSON.parse>[]>([]);
  const [comunasLoading, setComunasLoading] = useState(false);
  const [comunasError, setComunasError] = useState<string | null>(null);

  /**
   * Carga las regiones al montar el componente
   */
  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        setRegionesLoading(true);
        setRegionesError(null);

        const response = await fetch("/api/regiones");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al cargar regiones");
        }

        setRegiones(result.data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? (err as ReturnType<typeof JSON.parse>).message
            : "Error desconocido";
        setRegionesError(message);
        console.error("Error al cargar regiones:", err);
      } finally {
        setRegionesLoading(false);
      }
    };

    cargarRegiones();
  }, []);

  /**
   * Carga las comunas de una región específica
   */
  const cargarComunas = useCallback(async (regionId: string) => {
    try {
      setComunasLoading(true);
      setComunasError(null);
      setComunas([]); // Limpiar comunas anteriores

      const response = await fetch(`/api/regiones/${regionId}/comunas`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al cargar comunas");
      }

      setComunas(result.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? (err as ReturnType<typeof JSON.parse>).message : "Error desconocido";
      setComunasError(message);
      console.error("Error al cargar comunas:", err);
    } finally {
      setComunasLoading(false);
    }
  }, []);

  /**
   * Limpia las comunas cargadas
   */
  const resetComunas = useCallback(() => {
    setComunas([]);
    setComunasError(null);
  }, []);

  return {
    // Regiones
    regiones,
    regionesLoading,
    regionesError,

    // Comunas
    comunas,
    comunasLoading,
    comunasError,

    // Métodos
    cargarComunas,
    resetComunas,
  };
}
