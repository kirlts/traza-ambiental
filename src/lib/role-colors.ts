/**
 * Utilidad para obtener colores consistentes para cada rol
 * Asegura que cada rol tenga un color único y visualmente acorde al diseño
 */

export interface RoleColor {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

// Función para obtener el color del rol basado en su nombre
export const getRoleColor = (roleName: string): RoleColor => {
  const normalizedName = roleName.toUpperCase().trim();

  // Mapeo de colores para roles comunes
  const roleColorMap: Record<string, RoleColor> = {
    ADMIN: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: "bg-purple-100",
    },
    ADMINISTRADOR: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      icon: "bg-purple-100",
    },
    GESTOR: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "bg-emerald-100",
    },
    GENERADOR: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "bg-blue-100",
    },
    PRODUCTOR: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "bg-blue-100",
    },
    TRANSPORTISTA: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: "bg-amber-100",
    },
    AUDITOR: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      icon: "bg-indigo-100",
    },
    SUPERVISOR: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
      icon: "bg-cyan-100",
    },
    OPERADOR: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
      icon: "bg-teal-100",
    },
    "SISTEMA DE GESTIÓN": {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
      icon: "bg-violet-100",
    },
    "SISTEMA GESTIÓN": {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
      icon: "bg-violet-100",
    },
    ESPECIALISTA: {
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
      icon: "bg-pink-100",
    },
    "ESPECIALISTA SISTEMA GESTIÓN": {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: "bg-rose-100",
    },
  };

  // Buscar coincidencia exacta o parcial
  const matchedRole = Object.keys(roleColorMap).find(
    (key) => normalizedName.includes(key) || key.includes(normalizedName)
  );

  if (matchedRole) {
    return roleColorMap[matchedRole];
  }

  // Si no hay coincidencia, usar hash del nombre para colores consistentes
  const colors: RoleColor[] = [
    { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", icon: "bg-sky-100" },
    { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200", icon: "bg-lime-100" },
    {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      icon: "bg-orange-100",
    },
    {
      bg: "bg-fuchsia-50",
      text: "text-fuchsia-700",
      border: "border-fuchsia-200",
      icon: "bg-fuchsia-100",
    },
    {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "bg-emerald-100",
    },
  ];

  // Hash simple basado en el nombre para consistencia
  let hash = 0;
  for (let i = 0; i < roleName.length; i++) {
    hash = roleName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Función auxiliar para obtener el color del botón basado en el color del rol
export const getButtonColor = (roleColor: RoleColor): string => {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-600 hover:bg-purple-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    teal: "bg-teal-600 hover:bg-teal-700",
    violet: "bg-violet-600 hover:bg-violet-700",
    pink: "bg-pink-600 hover:bg-pink-700",
    rose: "bg-rose-600 hover:bg-rose-700",
    sky: "bg-sky-600 hover:bg-sky-700",
    lime: "bg-lime-600 hover:bg-lime-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    fuchsia: "bg-fuchsia-600 hover:bg-fuchsia-700",
  };

  // Extraer el nombre del color del bg (ej: 'bg-purple-50' -> 'purple')
  const colorName = roleColor.bg.split("-")[1];
  return colorMap[colorName] || "bg-emerald-600 hover:bg-emerald-700";
};
