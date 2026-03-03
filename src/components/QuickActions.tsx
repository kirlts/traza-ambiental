"use client";

import { useRouter } from "next/navigation";

interface QuickActionsProps {
  loading?: boolean;
}

export default function QuickActions({ loading = false }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      id: "users",
      title: "Gestionar Usuarios",
      description: "Crear, editar y administrar usuarios del sistema",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      color: "indigo",
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-500",
      borderColor: "border-indigo-200",
      hoverColor: "hover:bg-indigo-100",
      onClick: () => router.push("/dashboard/admin/users"),
    },
    {
      id: "solicitudes",
      title: "Solicitudes de Generadores",
      description: "Aprobar o rechazar solicitudes de registro",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      color: "blue",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
      borderColor: "border-blue-200",
      hoverColor: "hover:bg-blue-100",
      onClick: () => router.push("/dashboard/admin/solicitudes-generador"),
    },
    {
      id: "roles",
      title: "Gestionar Roles",
      description: "Configurar roles y permisos del sistema",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "purple",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
      borderColor: "border-purple-200",
      hoverColor: "hover:bg-purple-100",
      onClick: () => router.push("/dashboard/admin/roles"),
    },
    {
      id: "reports",
      title: "Ver Reportes",
      description: "Generar reportes y estadísticas del sistema",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: "green",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
      borderColor: "border-green-200",
      hoverColor: "hover:bg-green-100",
      onClick: () => {
        // Placeholder para reportes
        alert("Funcionalidad de reportes próximamente disponible");
      },
    },
    {
      id: "settings",
      title: "Configuración",
      description: "Ajustes generales del sistema",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: "gray",
      bgColor: "bg-gray-50",
      iconBg: "bg-gray-500",
      borderColor: "border-gray-200",
      hoverColor: "hover:bg-gray-100",
      onClick: () => {
        // Placeholder para configuración
        alert("Funcionalidad de configuración próximamente disponible");
      },
    },
  ];

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">⚡ Accesos Rápidos</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">⚡ Accesos Rápidos</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`relative border-2 ${action.borderColor} ${action.bgColor} ${action.hoverColor} rounded-lg p-4 text-left transition-all duration-200 hover:shadow-md group`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex-shrink-0 h-10 w-10 rounded-lg ${action.iconBg} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </h4>
                  <p className="text-sm text-gray-500 group-hover:text-gray-600">
                    {action.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-600"
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
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
