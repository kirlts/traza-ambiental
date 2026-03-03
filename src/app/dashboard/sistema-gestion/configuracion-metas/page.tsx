"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Meta {
  id: string;
  anio: number;
  tipo: string;
  metaToneladas: number;
  avanceToneladas: number;
  porcentajeAvance: number;
  cumplida: boolean;
  origen: string;
}

interface HistorialItem {
  anio: number;
  recoleccion?: Meta;
  valorizacion?: Meta;
}

export default function ConfiguracionMetasPage() {
  const router = useRouter();
  const anioActual = new Date().getFullYear();
  useSession();

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const [metaRecoleccion, setMetaRecoleccion] = useState("");
  const [metaValorizacion, setMetaValorizacion] = useState("");
  const [metasExistentes, setMetasExistentes] = useState<Meta[]>([]);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [accion, setAccion] = useState<"crear" | "actualizar">("crear");

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar metas actuales
      const responseMetas = await fetch("/api/sistema-gestion/metas");
      if (responseMetas.ok) {
        const data = await responseMetas.json();
        setMetasExistentes(data.metas || []);

        const recoleccion = data.metas?.find((m: Meta) => m.tipo === "recoleccion");
        const valorizacion = data.metas?.find((m: Meta) => m.tipo === "valorizacion");

        if (recoleccion) {
          setMetaRecoleccion(recoleccion.metaToneladas.toString());
          setAccion("actualizar");
        }
        if (valorizacion) {
          setMetaValorizacion(valorizacion.metaToneladas.toString());
          setAccion("actualizar");
        }
      }

      // Cargar historial
      const responseHistorial = await fetch("/api/sistema-gestion/metas/historial");
      if (responseHistorial.ok) {
        const data = await responseHistorial.json();
        setHistorial(data.historial || []);
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function handleGuardar() {
    try {
      setGuardando(true);
      setError(null);
      setExito(null);

      const metaRecoleccionNum = parseFloat(metaRecoleccion);
      const metaValorizacionNum = parseFloat(metaValorizacion);

      // Validaciones
      if (!metaRecoleccion || isNaN(metaRecoleccionNum) || metaRecoleccionNum <= 0) {
        setError("La meta de recolección debe ser un número positivo");
        return;
      }

      if (!metaValorizacion || isNaN(metaValorizacionNum) || metaValorizacionNum <= 0) {
        setError("La meta de valorización debe ser un número positivo");
        return;
      }

      if (metaValorizacionNum > metaRecoleccionNum) {
        const result = await Swal.fire({
          title: "¿Continuar?",
          text: "La meta de valorización es mayor que la de recolección. ¿Está seguro de continuar?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, continuar",
          cancelButtonText: "Cancelar",
        });
        if (!result.isConfirmed) return;
      }

      // Guardar o actualizar metas
      const metaRecoleccionExistente = metasExistentes.find((m) => m.tipo === "recoleccion");
      const metaValorizacionExistente = metasExistentes.find((m) => m.tipo === "valorizacion");

      // Crear/actualizar recolección
      if (metaRecoleccionExistente) {
        const response = await fetch(`/api/sistema-gestion/metas/${metaRecoleccionExistente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metaToneladas: metaRecoleccionNum,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al actualizar meta de recolección");
        }
      } else {
        const response = await fetch("/api/sistema-gestion/metas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anio: anioActual,
            tipo: "recoleccion",
            metaToneladas: metaRecoleccionNum,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al crear meta de recolección");
        }
      }

      // Crear/actualizar valorización
      if (metaValorizacionExistente) {
        const response = await fetch(`/api/sistema-gestion/metas/${metaValorizacionExistente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metaToneladas: metaValorizacionNum,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al actualizar meta de valorización");
        }
      } else {
        const response = await fetch("/api/sistema-gestion/metas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anio: anioActual,
            tipo: "valorizacion",
            metaToneladas: metaValorizacionNum,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Error al crear meta de valorización");
        }
      }

      setExito("¡Metas guardadas exitosamente!");
      setMostrarConfirmacion(false);

      // Recargar datos
      setTimeout(() => {
        cargarDatos();
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Error al guardar metas");
    } finally {
      setGuardando(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMostrarConfirmacion(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Metas Anuales</h1>
        <p className="mt-2 text-gray-600">
          Configure sus metas de recolección y valorización para el año {anioActual}
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {exito && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-800">{exito}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Metas del Año {anioActual}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meta de Recolección */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Meta de Recolección (toneladas) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={metaRecoleccion}
              onChange={(e) => setMetaRecoleccion(e.target.value)}
              placeholder="Ej: 1000.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              ℹ️ Peso total de NFU que debe recolectarse durante el año
            </p>
          </div>

          {/* Meta de Valorización */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Meta de Valorización (toneladas) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={metaValorizacion}
              onChange={(e) => setMetaValorizacion(e.target.value)}
              placeholder="Ej: 800.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              ℹ️ Peso total de NFU que debe valorizarse durante el año
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {guardando
                ? "Guardando..."
                : accion === "actualizar"
                  ? "💾 Actualizar Metas"
                  : "💾 Guardar Metas"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/sistema-gestion")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Historial */}
      {historial.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Historial de Metas</h2>
          <div className="space-y-4">
            {historial.map((item) => (
              <div key={item.anio} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Año {item.anio}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {item.recoleccion && (
                    <div>
                      <p className="text-gray-600">Recolección:</p>
                      <p className="font-semibold">{item.recoleccion.metaToneladas} ton</p>
                      <p className="text-xs text-gray-500">
                        {item.recoleccion.cumplida
                          ? "✅ Cumplida"
                          : `${item.recoleccion.porcentajeAvance.toFixed(1)}% avance`}
                      </p>
                    </div>
                  )}
                  {item.valorizacion && (
                    <div>
                      <p className="text-gray-600">Valorización:</p>
                      <p className="font-semibold">{item.valorizacion.metaToneladas} ton</p>
                      <p className="text-xs text-gray-500">
                        {item.valorizacion.cumplida
                          ? "✅ Cumplida"
                          : `${item.valorizacion.porcentajeAvance.toFixed(1)}% avance`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirmar {accion === "actualizar" ? "Actualización" : "Creación"} de Metas
            </h3>
            <div className="space-y-2 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Año:</span> {anioActual}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Meta de Recolección:</span> {metaRecoleccion}{" "}
                toneladas
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Meta de Valorización:</span> {metaValorizacion}{" "}
                toneladas
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              ¿Está seguro de que desea {accion === "actualizar" ? "actualizar" : "guardar"} estas
              metas?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {guardando ? "Guardando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setMostrarConfirmacion(false)}
                disabled={guardando}
                className="flex-1 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
