interface AlertaBannerProps {
  tipo: "info" | "warning" | "error" | "success";
  titulo: string;
  mensaje: string;
  accion?: {
    texto: string;
    onClick: () => void;
  };
}

export default function AlertaBanner({ tipo, titulo, mensaje, accion }: AlertaBannerProps) {
  const estilos = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      texto: "text-blue-800",
      boton: "bg-blue-600 hover:bg-blue-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      texto: "text-yellow-800",
      boton: "bg-yellow-600 hover:bg-yellow-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      texto: "text-red-800",
      boton: "bg-red-600 hover:bg-red-700",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      texto: "text-green-800",
      boton: "bg-green-600 hover:bg-green-700",
    },
  };

  const estilo = estilos[tipo];

  const iconos = {
    info: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    success: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className={`border-l-4 ${estilo.border} ${estilo.bg} p-4 rounded-r-lg`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${estilo.icon}`}>{iconos[tipo]}</div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${estilo.texto}`}>{titulo}</h3>
          <div className={`mt-2 text-sm ${estilo.texto}`}>
            <p>{mensaje}</p>
          </div>
          {accion && (
            <div className="mt-4">
              <button
                onClick={accion.onClick}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${estilo.boton} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {accion.texto}
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
