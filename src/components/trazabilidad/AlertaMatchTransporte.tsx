import React from "react";

interface Props {
  solicitudId: string;
  estadoActual: string;
  transportista?: {
    name: string;
    email: string;
  } | null;
}

/**
 * Alerta visual para indicar si el ciclo carece de Match de Transporte (CAC-5)
 * Se muestra prominentemente si se intenta validar una recepción sin transportista confirmado.
 */
export default function AlertaMatchTransporte({ estadoActual, transportista }: Props) {
  // Si ya pasó por transporte, no mostrar alerta
  if (["ENTREGADA_GESTOR", "RECIBIDA_PLANTA", "TRATADA"].includes(estadoActual)) {
    return null;
  }

  // Si tiene transportista asignado (Match), mostrar confirmación positiva
  if (transportista) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-3">
        <div className="bg-green-100 p-2 rounded-full">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-green-800 text-sm">Match de Transporte Confirmado</h4>
          <p className="text-xs text-green-700 mt-1">
            Responsable: <strong>{transportista.name}</strong>
          </p>
        </div>
      </div>
    );
  }

  // Si NO tiene transportista y está PENDIENTE -> Alerta de Integridad
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3 animate-pulse">
      <div className="bg-red-100 p-2 rounded-full">
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-red-800 text-sm">Falta Match de Transporte</h4>
        <p className="text-xs text-red-700 mt-1">
          <strong>Riesgo de Trazabilidad:</strong> Esta solicitud aún no ha sido aceptada por un
          transportista habilitado. No se podrá cerrar el ciclo legalmente hasta que ocurra el
          retiro físico.
        </p>
      </div>
    </div>
  );
}
