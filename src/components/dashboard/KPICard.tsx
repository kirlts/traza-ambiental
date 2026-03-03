"use client";

import { Target, Building, Users, FileCheck } from "lucide-react";

interface KPICardProps {
  titulo: string;
  valor: string;
  subtitulo: string;
  icon: string;
  color: "blue" | "emerald" | "purple" | "green";
}

export function KPICard({ titulo, valor, subtitulo, icon, color }: KPICardProps) {
  const getIcon = () => {
    switch (icon) {
      case "target":
        return <Target className="h-8 w-8" />;
      case "building":
        return <Building className="h-8 w-8" />;
      case "users":
        return <Users className="h-8 w-8" />;
      case "file-check":
        return <FileCheck className="h-8 w-8" />;
      default:
        return <Target className="h-8 w-8" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          value: "text-blue-600",
          title: "text-blue-900",
        };
      case "emerald":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: "text-emerald-600",
          value: "text-emerald-600",
          title: "text-emerald-900",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "text-purple-600",
          value: "text-purple-600",
          title: "text-purple-900",
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-600",
          value: "text-green-600",
          title: "text-green-900",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          value: "text-blue-600",
          title: "text-blue-900",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div
      className={`bg-white rounded-lg shadow-md border ${colors.border} p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${colors.bg} rounded-lg p-3`}>
          <div className={colors.icon}>{getIcon()}</div>
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <dl>
            <dt className={`text-sm font-medium ${colors.title} truncate`}>{titulo}</dt>
            <dd className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mt-1">
              <div className={`text-2xl font-bold ${colors.value}`}>{valor}</div>
              <div className="text-sm text-gray-500 whitespace-nowrap">{subtitulo}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
