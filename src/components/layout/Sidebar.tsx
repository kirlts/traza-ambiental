"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLogout } from "@/hooks/useLogout";
import {
  isAdmin,
  isProductor,
  isGenerador,
  isTransportista,
  isGestor,
  isEspecialista,
  isSistemaGestion,
} from "@/lib/auth-helpers";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface MenuItemLinkProps {
  item: MenuItem;
  active: boolean;
  isCollapsed: boolean;
}

function MenuItemLink({ item, active, isCollapsed }: MenuItemLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<{ top: number; left: number } | null>(null);

  const handleMouseEnter = () => {
    if (linkRef.current && isCollapsed) {
      const rect = linkRef.current.getBoundingClientRect();
      setTooltipStyle({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipStyle(null);
  };

  return (
    <>
      <Link
        ref={linkRef}
        href={item.path}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
          isCollapsed ? "justify-center" : ""
        } ${
          active
            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
            : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
      >
        <span
          className={`shrink-0 flex items-center justify-center transition-colors ${
            active ? "text-white" : "text-emerald-600 group-hover:text-emerald-700"
          }`}
        >
          {item.icon}
        </span>
        {!isCollapsed && (
          <span className={`font-medium text-sm truncate ${active ? "text-white" : ""}`}>
            {item.name}
          </span>
        )}
      </Link>
      {isCollapsed &&
        tooltipStyle &&
        createPortal(
          <span
            className="fixed px-2 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md whitespace-nowrap z-[9999] pointer-events-none shadow-lg transition-opacity duration-75"
            style={{
              top: `${tooltipStyle.top}px`,
              left: `${tooltipStyle.left}px`,
              transform: "translateY(-50%)",
            }}
          >
            {item.name}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></span>
          </span>,
          document.body
        )}
    </>
  );
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  // Admin
  {
    name: "Usuarios",
    path: "/dashboard/admin/users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    roles: ["Administrador"],
  },
  {
    name: "Roles",
    path: "/dashboard/admin/roles",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    roles: ["Administrador"],
  },
  {
    name: "Catálogo Productos",
    path: "/dashboard/admin/productos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    roles: ["Administrador"],
  },
  {
    name: "Solicitudes Generador",
    path: "/dashboard/admin/solicitudes-generador",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    roles: ["Administrador"],
  },
  {
    name: "Config. REP",
    path: "/dashboard/admin/configuracion-rep",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    roles: ["Administrador"],
  },
  {
    name: "Validación Legal Gestores",
    path: "/dashboard/admin/validaciones-legales-gestor",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Administrador"],
  },
  {
    name: "Integración RETC",
    path: "/dashboard/admin/integraciones/retc",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
    ),
    roles: ["Administrador"],
  },
  // Generador
  {
    name: "Solicitudes",
    path: "/dashboard/generador/solicitudes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  {
    name: "Inv. Digital",
    path: "/dashboard/generador/inventario",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  {
    name: "Metas REP",
    path: "/dashboard/generador/cumplimiento/metas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  {
    name: "Declaración Anual",
    path: "/dashboard/generador/cumplimiento/declaracion-anual",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  {
    name: "Reportes REP",
    path: "/dashboard/generador/cumplimiento/reportes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  {
    name: "Productos",
    path: "/dashboard/generador/inventario/productos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  {
    name: "Movimientos",
    path: "/dashboard/generador/inventario/movimientos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Generador"],
  },
  // Transportista
  {
    name: "Mis Solicitudes",
    path: "/dashboard/transportista/solicitudes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  {
    name: "Entregas",
    path: "/dashboard/transportista/entregas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  {
    name: "Mis Vehículos",
    path: "/dashboard/transportista/vehiculos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 01-2 2M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2M9 17h6"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  {
    name: "Planif. de Rutas",
    path: "/dashboard/transportista/rutas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  {
    name: "Historial",
    path: "/dashboard/transportista/historial",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  {
    name: "Reportes",
    path: "/dashboard/transportista/reportes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  {
    name: "Validación Legal",
    path: "/dashboard/transportista/validacion-legal",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Transportista"],
  },
  // Sistema de Gestión
  {
    name: "Config. Metas",
    path: "/dashboard/sistema-gestion/configuracion-metas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    roles: ["Sistema de Gestión"],
  },
  {
    name: "Reportes",
    path: "/dashboard/sistema-gestion/reportes",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    roles: ["Sistema de Gestión"],
  },
  // Gestor
  {
    name: "Recepciones",
    path: "/dashboard/gestor/recepciones",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
    ),
    roles: ["Gestor"],
  },
  {
    name: "Tratamientos",
    path: "/dashboard/gestor/tratamientos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
    roles: ["Gestor"],
  },
  {
    name: "Historial",
    path: "/dashboard/gestor/recepciones/completadas",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Gestor"],
  },
  {
    name: "Certificados",
    path: "/dashboard/gestor/certificados",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    roles: ["Gestor"],
  },
  {
    name: "Validación Legal",
    path: "/dashboard/gestor/validacion-legal",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    roles: ["Gestor"],
  },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const handleLogout = useLogout();

  if (!session) return null;

  const filteredMenuItems = menuItems.filter((item: ReturnType<typeof JSON.parse>) => {
    if (!item.roles) return true;
    if (isAdmin(session)) return item.roles.includes("Administrador");
    // Unificamos Productor y Generador para ver items de Generador
    if (isProductor(session) || isGenerador(session)) return item.roles.includes("Generador");
    if (isSistemaGestion(session)) return item.roles.includes("Sistema de Gestión");
    if (isTransportista(session)) return item.roles.includes("Transportista");
    if (isGestor(session)) return item.roles.includes("Gestor");
    if (isEspecialista(session)) return item.roles.includes("Especialista");
    return false;
  });

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname === "/dashboard/admin" ||
        pathname === "/dashboard/generador" ||
        pathname === "/dashboard/transportista" ||
        pathname === "/dashboard/gestor" ||
        pathname === "/dashboard/especialista" ||
        pathname === "/dashboard/sistema-gestion"
      );
    }
    if (path === "/dashboard/sistema-gestion") {
      return (
        pathname.startsWith("/dashboard/sistema-gestion") && !pathname.includes("/reportes/anual")
      );
    }
    if (path === "/dashboard/generador/inventario") {
      return (
        pathname === "/dashboard/generador/inventario" &&
        !pathname.includes("#productos") &&
        !pathname.includes("/movimientos")
      );
    }
    if (path === "/dashboard/generador/inventario/productos") {
      return pathname === "/dashboard/generador/inventario/productos";
    }
    if (path === "/dashboard/generador/inventario/movimientos") {
      return pathname === "/dashboard/generador/inventario/movimientos";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed left-4 top-3 z-50 p-2 rounded-lg bg-white shadow-md text-emerald-800 transition-all duration-300 ${
          isCollapsed ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Abrir menú"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-white shadow-[2px_0_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-64"
        }`}
      >
        {/* Header con Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-100 relative">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <div
              className={`shrink-0 transition-all duration-300 ${isCollapsed ? "w-10 h-10" : "w-12 h-12"}`}
            >
              <Image
                src="/logo-trazambiental-hoja.svg"
                alt="TrazAmbiental"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority={true}
              />
            </div>
            {!isCollapsed && (
              <div className="w-28 h-8 transition-opacity duration-300">
                <Image
                  src="/LogoTexto.svg"
                  alt="TrazAmbiental"
                  width={140}
                  height={32}
                  className="w-full h-full object-contain"
                  priority={true}
                />
              </div>
            )}
          </Link>

          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 p-1.5 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.16)] hover:bg-gray-50 transition-all duration-300 border border-gray-100"
            aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
          >
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {filteredMenuItems.map((item: ReturnType<typeof JSON.parse>) => {
              const active = isActive(item.path);
              return (
                <MenuItemLink
                  key={item.path}
                  item={item}
                  active={active}
                  isCollapsed={isCollapsed}
                />
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-emerald-100 p-4">
          <Link
            href="/dashboard/perfil"
            className={`flex items-center gap-3 hover:bg-(--sidebar-hover) p-2 rounded-lg transition-colors -mx-2 ${isCollapsed ? "justify-center mx-0" : ""}`}
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--primary) to-(--success) flex items-center justify-center text-white font-semibold shrink-0">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-(--foreground) truncate">
                  {session.user?.name}
                </p>
                <p className="text-xs text-(--muted-foreground) truncate">
                  {session.user?.roles?.[0]}
                </p>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-(--destructive) hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </button>
          )}

          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center p-2 text-(--destructive) hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar Sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
