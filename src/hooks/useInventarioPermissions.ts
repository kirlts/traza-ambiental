import { useSession } from "next-auth/react";
import { type UserRolesResponse } from "@/types/api";
import { type Role } from "@/types/auth";

export interface InventarioPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canRegisterMovements: boolean;
  isGenerador: boolean;
  isAdmin: boolean;
  loading: boolean;
}

import { useQuery } from "@tanstack/react-query";

export const useInventarioPermissions = (): InventarioPermissions => {
  const { data: session, status } = useSession();

  const { data: rolesData, isLoading: queryLoading } = useQuery({
    queryKey: ["user-me-roles", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/users/me/roles");
      if (!response.ok) throw new Error("Error al obtener roles");
      return response.json() as Promise<UserRolesResponse>;
    },
    enabled: status === "authenticated" && !!session?.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const loading = status === "loading" || (status === "authenticated" && queryLoading);

  if (loading || !rolesData) {
    return {
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canRegisterMovements: false,
      isGenerador: false,
      isAdmin: false,
      loading: loading,
    };
  }

  const userRoles = rolesData.data.roles || [];
  const isAdminRole = userRoles.some((role: Role) => role.name === "Administrador");
  const isGeneradorRole = userRoles.some((role: Role) => role.name === "Generador");

  return {
    canView: isAdminRole || isGeneradorRole,
    canCreate: isAdminRole || isGeneradorRole,
    canEdit: isAdminRole || isGeneradorRole,
    canDelete: isAdminRole,
    canRegisterMovements: isAdminRole || isGeneradorRole,
    isGenerador: isGeneradorRole,
    isAdmin: isAdminRole,
    loading: false,
  };
};
