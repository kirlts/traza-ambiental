"use client";

import { useInventarioPermissions } from "@/hooks/useInventarioPermissions";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

interface InventarioGuardProps {
  children: React.ReactNode;
  requiredPermissions?: (
    | "canView"
    | "canCreate"
    | "canEdit"
    | "canDelete"
    | "canRegisterMovements"
  )[];
  fallback?: React.ReactNode;
}

export const InventarioGuard: React.FC<InventarioGuardProps> = ({
  children,
  requiredPermissions = ["canView"],
  fallback,
}) => {
  const permissions = useInventarioPermissions();

  if (permissions.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Verificando permisos...</span>
      </div>
    );
  }

  // Verificar si tiene todos los permisos requeridos
  const hasRequiredPermissions = requiredPermissions.every((permission) => permissions[permission]);

  if (!hasRequiredPermissions) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Denegado</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            No tienes los permisos necesarios para acceder al módulo de Inventario Digital.
          </p>
          <p className="text-xs text-gray-500 text-center">
            Este módulo está disponible solo para Generadores y Administradores.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
