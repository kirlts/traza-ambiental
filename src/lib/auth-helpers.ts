/**
 * Verifica si un usuario es administrador
 * Se considera administrador si:
 * - Tiene el rol "Administrador"
 * - O su ID es "1"
 */
export function isAdmin(session: ReturnType<typeof JSON.parse>): boolean {
  if (!session || typeof session !== "object") return false;

  const sessionObj = session as { user?: { id?: string; roles?: string[] } };
  if (!sessionObj.user) return false;

  // Verificar si tiene el rol de Administrador
  const hasAdminRole = sessionObj.user.roles?.includes("Administrador") || false;

  // Verificar si el ID es 1
  const isFirstUser = sessionObj.user.id === "1";

  return hasAdminRole || isFirstUser;
}

/**
 * Verifica si un usuario tiene un rol específico
 */
export function hasRole(session: ReturnType<typeof JSON.parse>, roleName: string): boolean {
  if (!session || typeof session !== "object") return false;

  const sessionObj = session as { user?: { roles?: string[] } };
  if (!sessionObj.user?.roles) return false;

  return sessionObj.user.roles.includes(roleName);
}

/**
 * Verifica si un usuario tiene alguno de los roles especificados
 */
export function hasAnyRole(session: ReturnType<typeof JSON.parse>, roleNames: string[]): boolean {
  if (!session || typeof session !== "object") return false;

  const sessionObj = session as { user?: { roles?: string[] } };
  if (!sessionObj.user?.roles) return false;

  return roleNames.some((role) => sessionObj.user?.roles?.includes(role));
}

/**
 * Verifica si un usuario es productor
 * ACTUALIZACIÓN: Se incluye Generador ya que se han unificado los roles
 */
export function isProductor(session: ReturnType<typeof JSON.parse>): boolean {
  return hasRole(session, "Productor") || hasRole(session, "Generador");
}

/**
 * Verifica si un usuario es generador
 */
export function isGenerador(session: ReturnType<typeof JSON.parse>): boolean {
  return hasRole(session, "Generador");
}

/**
 * Verifica si un usuario es transportista
 */
export function isTransportista(session: ReturnType<typeof JSON.parse>): boolean {
  return hasRole(session, "Transportista");
}

/**
 * Verifica si un usuario es gestor
 */
export function isGestor(session: ReturnType<typeof JSON.parse>): boolean {
  return hasRole(session, "Gestor");
}

/**
 * Verifica si un usuario es especialista
 */
export function isEspecialista(session: ReturnType<typeof JSON.parse>): boolean {
  return hasRole(session, "Especialista Sistema Gestión");
}

/**
 * Verifica si un usuario es sistema de gestión
 */
export function isSistemaGestion(session: ReturnType<typeof JSON.parse>): boolean {
  return hasRole(session, "Sistema de Gestión");
}
