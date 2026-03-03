/**
 * Hook para gestionar formulario multi-paso de Solicitud de Retiro
 * HU-003B: Crear Solicitud de Retiro de NFU
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SolicitudCompletaData } from "@/lib/validations/solicitud-retiro";

// Número total de pasos del formulario
const TOTAL_PASOS = 3;

interface FormData extends Partial<SolicitudCompletaData> {
  usarDireccionRegistrada?: boolean;
}

interface UseSolicitudMultiStepReturn {
  // Estado actual
  pasoActual: number;
  formData: FormData;
  isSubmitting: boolean;
  error: string | null;

  // Navegación
  siguientePaso: () => void;
  pasoAnterior: () => void;
  irAPaso: (paso: number) => void;

  // Datos
  actualizarDatos: (data: ReturnType<typeof JSON.parse>) => void;
  guardarBorrador: () => Promise<void>;
  enviarSolicitud: () => Promise<void>;

  // Utilidades
  esPrimerPaso: boolean;
  esUltimoPaso: boolean;
  progresoPercentaje: number;
}

/**
 * Hook personalizado para gestionar el formulario multi-paso
 *
 * @param initialData Datos iniciales del formulario (útil para editar borradores)
 * @returns Objeto con estado y métodos del formulario
 *
 * @example
 * ```tsx
 * const {
 *   pasoActual,
 *   formData,
 *   siguientePaso,
 *   pasoAnterior,
 *   actualizarDatos,
 *   enviarSolicitud,
 * } = useSolicitudMultiStep();
 * ```
 */
export function useSolicitudMultiStep(
  initialData?: Partial<FormData>
): UseSolicitudMultiStepReturn {
  const router = useRouter();

  // Estado del formulario
  const [pasoActual, setPasoActual] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcular utilidades
  const esPrimerPaso = pasoActual === 1;
  const esUltimoPaso = pasoActual === TOTAL_PASOS;
  const progresoPercentaje = (pasoActual / TOTAL_PASOS) * 100;

  /**
   * Navega al siguiente paso
   */
  const siguientePaso = useCallback(() => {
    if (pasoActual < TOTAL_PASOS) {
      setPasoActual((prev) => prev + 1);
      setError(null);
    }
  }, [pasoActual]);

  /**
   * Navega al paso anterior
   */
  const pasoAnterior = useCallback(() => {
    if (pasoActual > 1) {
      setPasoActual((prev) => prev - 1);
      setError(null);
    }
  }, [pasoActual]);

  /**
   * Navega directamente a un paso específico
   */
  const irAPaso = useCallback((paso: number) => {
    if (paso >= 1 && paso <= TOTAL_PASOS) {
      setPasoActual(paso);
      setError(null);
    }
  }, []);

  /**
   * Actualiza los datos del formulario
   */
  const actualizarDatos = useCallback((data: ReturnType<typeof JSON.parse>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  /**
   * Guarda la solicitud como borrador
   */
  const guardarBorrador = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          esBorrador: true,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al guardar borrador");
      }

      // Redirigir al dashboard con mensaje de éxito
      router.push("/dashboard/generador?mensaje=borrador-guardado");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? (err as ReturnType<typeof JSON.parse>).message : "Error desconocido";
      setError(message);
      toast.error(message);
      console.error("Error al guardar borrador:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  /**
   * Envía la solicitud completa
   */
  const enviarSolicitud = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          esBorrador: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al enviar solicitud");
      }

      // Redirigir a página de confirmación con el folio
      router.push(`/dashboard/generador/solicitudes/${result.data.id}/confirmacion`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? (err as ReturnType<typeof JSON.parse>).message : "Error desconocido";
      setError(message);
      toast.error(message);
      console.error("Error al enviar solicitud:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, router]);

  return {
    // Estado
    pasoActual,
    formData,
    isSubmitting,
    error,

    // Navegación
    siguientePaso,
    pasoAnterior,
    irAPaso,

    // Datos
    actualizarDatos,
    guardarBorrador,
    enviarSolicitud,

    // Utilidades
    esPrimerPaso,
    esUltimoPaso,
    progresoPercentaje,
  };
}
