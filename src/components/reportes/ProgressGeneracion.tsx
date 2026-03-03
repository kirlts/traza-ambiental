"use client";

import { Loader2 } from "lucide-react";

interface ProgressGeneracionProps {
  progreso: number;
}

export function ProgressGeneracion({ progreso }: ProgressGeneracionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
        <h3 className="text-md font-semibold text-gray-900">Generando reporte...</h3>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progreso}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 text-center">{progreso}% completado</p>
    </div>
  );
}
