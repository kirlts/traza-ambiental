import React from "react";

export type EstadoSolicitud =
  | "PENDIENTE"
  | "ACEPTADA"
  | "EN_CAMINO"
  | "RECOLECTADA"
  | "ENTREGADA_GESTOR"
  | "RECIBIDA_PLANTA"
  | "TRATADA"
  | "RECHAZADA"
  | "CANCELADA";

interface Props {
  estado: EstadoSolicitud;
}

export default function FlujoEstadoTrazabilidad({ estado }: Props) {
  const pasos = [
    { id: "origen", label: "Origen (Generador)", status: "completado", icon: "🏭" },
    { id: "transporte", label: "Transporte (Match)", status: "pendiente", icon: "🚛" },
    { id: "destino", label: "Destino (Planta)", status: "pendiente", icon: "♻️" },
  ];

  // Determinar estado de cada paso según el estado actual de la solicitud
  // Lógica de "Match de Transporte": Solo se marca completado si pasó por manos del transportista (ACEPTADA+)

  if (["PENDIENTE", "RECHAZADA", "CANCELADA"].includes(estado)) {
    pasos[0].status = "completado"; // Siempre inicia en origen
    pasos[1].status = "pendiente";
    pasos[2].status = "pendiente";
  } else if (["ACEPTADA", "EN_CAMINO", "RECOLECTADA"].includes(estado)) {
    pasos[0].status = "completado";
    pasos[1].status = "proceso"; // En tránsito / En poder del transportista
    pasos[2].status = "pendiente";
  } else if (estado === "ENTREGADA_GESTOR") {
    pasos[0].status = "completado";
    pasos[1].status = "completado"; // Match confirmado (Entregó carga)
    pasos[2].status = "proceso"; // Pendiente de validación final
  } else if (["RECIBIDA_PLANTA", "TRATADA"].includes(estado)) {
    pasos[0].status = "completado";
    pasos[1].status = "completado";
    pasos[2].status = "completado"; // Ciclo cerrado
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Línea de conexión de fondo */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>

        {/* Línea de progreso coloreada */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500"
          style={{
            width:
              pasos[2].status === "completado"
                ? "100%"
                : pasos[1].status === "completado"
                  ? "75%"
                  : pasos[1].status === "proceso"
                    ? "50%"
                    : "25%",
          }}
        ></div>

        {pasos.map((paso) => (
          <div key={paso.id} className="flex flex-col items-center relative z-10 bg-white px-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-4 transition-all duration-300
                ${
                  paso.status === "completado"
                    ? "bg-green-100 border-green-500 text-green-700"
                    : paso.status === "proceso"
                      ? "bg-blue-100 border-blue-500 text-blue-700 animate-pulse"
                      : "bg-gray-100 border-gray-300 text-gray-400 grayscale"
                }
              `}
            >
              {paso.icon}
            </div>
            <span
              className={`mt-2 text-xs font-bold ${
                paso.status === "completado"
                  ? "text-green-700"
                  : paso.status === "proceso"
                    ? "text-blue-600"
                    : "text-gray-400"
              }`}
            >
              {paso.label}
            </span>
            {paso.status === "completado" && (
              <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirmado
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Alerta de Match si falta transporte */}
      {estado === "PENDIENTE" && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-xs text-yellow-800">
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <strong>Atención:</strong> Falta el &quot;Match de Transporte&quot;. Un transportista
          habilitado debe aceptar la solicitud.
        </div>
      )}
    </div>
  );
}
