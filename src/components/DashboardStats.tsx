"use client";

import { useState } from "react";

interface UserStats {
  total: number;
  activos: number;
  inactivos: number;
  porRol: Array<{
    roleId: string;
    roleName: string;
    count: number;
  }>;
}

interface RoleStats {
  total: number;
  activos: number;
  conUsuarios: number;
}

interface NeumaticoStats {
  total: number;
  enTransito: number;
  reciclados: number;
  pendientes: number;
}

interface DashboardStatsProps {
  usuarios: UserStats;
  roles: RoleStats;
  neumaticos: NeumaticoStats;
  loading?: boolean;
}

export default function DashboardStats({
  usuarios,
  roles,
  neumaticos,
  loading = false,
}: DashboardStatsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const statsCards = [
    {
      id: "usuarios",
      title: "Usuarios",
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
      mainValue: usuarios.total,
      subtitle: `${usuarios.activos} activos`,
      color: "blue",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
      borderColor: "border-blue-200",
      details: [
        { label: "Activos", value: usuarios.activos, color: "text-green-600" },
        { label: "Inactivos", value: usuarios.inactivos, color: "text-red-600" },
      ],
    },
    {
      id: "roles",
      title: "Roles",
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
      mainValue: roles.total,
      subtitle: `${roles.activos} activos`,
      color: "purple",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-500",
      borderColor: "border-purple-200",
      details: [
        { label: "Activos", value: roles.activos, color: "text-green-600" },
        { label: "Con usuarios", value: roles.conUsuarios, color: "text-blue-600" },
      ],
    },
    {
      id: "neumaticos",
      title: "Neumáticos",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      mainValue: neumaticos.total,
      subtitle: `${neumaticos.reciclados} reciclados`,
      color: "green",
      bgColor: "bg-green-50",
      iconBg: "bg-green-500",
      borderColor: "border-green-200",
      details: [
        { label: "En tránsito", value: neumaticos.enTransito, color: "text-yellow-600" },
        { label: "Reciclados", value: neumaticos.reciclados, color: "text-green-600" },
        { label: "Pendientes", value: neumaticos.pendientes, color: "text-red-600" },
      ],
    },
  ];

  const toggleExpanded = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {statsCards.map((card) => (
        <div
          key={card.id}
          className={`bg-white overflow-hidden shadow rounded-lg border-2 ${card.borderColor} hover:shadow-lg transition-shadow duration-200`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div
                  className={`h-12 w-12 rounded-lg ${card.iconBg} flex items-center justify-center text-white`}
                >
                  {card.icon}
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-600 truncate">{card.title}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-slate-900">
                      {card.mainValue.toLocaleString()}
                    </div>
                    <div className="ml-2 text-sm text-slate-500">{card.subtitle}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Detalles expandibles */}
          <div className={`${card.bgColor} px-5 py-3 border-t ${card.borderColor}`}>
            <button
              onClick={() => toggleExpanded(card.id)}
              className="flex items-center justify-between w-full text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <span>Ver detalles</span>
              <svg
                className={`h-4 w-4 transform transition-transform ${
                  expandedCard === card.id ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {expandedCard === card.id && (
              <div className="mt-3 space-y-2">
                {card.details.map((detail, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{detail.label}:</span>
                    <span className={`font-medium ${detail.color}`}>
                      {detail.value.toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Mostrar distribución por roles solo para usuarios */}
                {card.id === "usuarios" && usuarios.porRol.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs font-medium text-slate-500 mb-2">Por rol:</div>
                    <div className="space-y-1">
                      {usuarios.porRol.map((rol, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 truncate">{rol.roleName}:</span>
                          <span className="font-medium text-blue-600 ml-2">{rol.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
