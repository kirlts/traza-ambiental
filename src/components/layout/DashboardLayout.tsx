"use client";

import { ReactNode } from "react";
import TopBar from "./TopBar";

interface Tab {
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  tabs?: Tab[];
  id?: string;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  tabs,
  id,
}: DashboardLayoutProps) {
  // El Sidebar ya lo maneja el layout global (src/app/dashboard/layout.tsx)
  // Aquí solo nos preocupamos del contenido interno.

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]" id={id}>
      {" "}
      {/* Restamos altura aprox del header global si lo hubiera */}
      {/* Header Reutilizable con TopBar */}
      <TopBar title={title} subtitle={subtitle} actions={actions} tabs={tabs} />
      {/* Main Content */}
      {/* Eliminamos márgenes izquierdos porque ya estamos dentro del DashboardContent global */}
      <main className="flex-1 p-4 md:p-6 w-full">{children}</main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} TrazAmbiental - Gestión de Neumáticos Ley REP</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Ayuda
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Documentación
            </a>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
