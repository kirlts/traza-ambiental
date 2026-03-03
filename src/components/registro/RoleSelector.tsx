interface RoleSelectorProps {
  onSelect: (role: "generador" | "transportista" | "gestor") => void;
}

export default function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Elige tu perfil</h2>
        <p className="mt-4 text-lg text-gray-600">
          Selecciona el tipo de cuenta que deseas crear para comenzar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Generador */}
        <div
          onClick={() => onSelect("generador")}
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-emerald-600 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generador</h3>
            <p className="text-sm text-gray-500 mb-4">
              Empresas que generan residuos de neumáticos (NFU) y necesitan certificar su
              disposición final.
            </p>
            <ul className="text-xs text-gray-400 text-left w-full space-y-1 mt-auto">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                Declaración de residuos
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                Certificados de valorización
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                Cumplimiento Ley REP
              </li>
            </ul>
          </div>
        </div>

        {/* Transportista */}
        <div
          onClick={() => onSelect("transportista")}
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-blue-600 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Transportista</h3>
            <p className="text-sm text-gray-500 mb-4">
              Empresas autorizadas para el traslado de neumáticos fuera de uso desde el punto de
              generación.
            </p>
            <ul className="text-xs text-gray-400 text-left w-full space-y-1 mt-auto">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Gestión de retiros
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Trazabilidad de rutas
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Validación de entregas
              </li>
            </ul>
          </div>
        </div>

        {/* Gestor */}
        <div
          onClick={() => onSelect("gestor")}
          className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-indigo-500 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="p-6 flex flex-col items-center text-center h-full">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors duration-300">
              <svg
                className="w-8 h-8 text-indigo-600 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestor</h3>
            <p className="text-sm text-gray-500 mb-4">
              Plantas de valorización, reciclaje o disposición final autorizadas.
            </p>
            <ul className="text-xs text-gray-400 text-left w-full space-y-1 mt-auto">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Recepción de material
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Emisión de certificados
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Control de inventario
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Necesitas registrarte como administrador?
          <span className="block mt-1 font-medium text-gray-900">
            Selecciona el perfil de tu empresa (Generador, Transportista o Gestor) y se te asignará
            automáticamente el rol de administrador.
          </span>
        </p>
      </div>
    </div>
  );
}
