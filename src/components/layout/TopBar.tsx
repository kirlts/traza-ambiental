"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import NotificacionesBell from "../NotificacionesBell";
import { useLogout } from "@/hooks/useLogout";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  tabs?: {
    label: string;
    href: string;
    active: boolean;
    onClick?: () => void;
  }[];
}

export default function TopBar({ title, subtitle, actions, tabs }: TopBarProps) {
  const { data: session } = useSession();

  const handleLogout = useLogout();

  return (
    <header className="sticky top-0 z-30 bg-linear-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between h-20 px-6">
        <div className="flex-1">
          {title && (
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-emerald-900">{title}</h1>
                {subtitle && (
                  <p className="hidden md:block text-sm font-medium text-emerald-700 mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <NotificacionesBell />

          {/* User Profile Link - Oculto en móvil */}
          {session?.user && (
            <Link
              href="/dashboard/perfil"
              className="hidden md:flex flex-col items-end text-sm text-emerald-900 hover:bg-emerald-100/50 px-3 py-1.5 rounded-md transition-colors group"
              title="Ir a mi perfil"
            >
              <span className="font-medium group-hover:text-emerald-800">{session.user.name}</span>
              <span className="text-emerald-600 text-xs group-hover:text-emerald-700">
                {session.user.email}
              </span>
            </Link>
          )}

          {/* Sign Out Button */}
          <button onClick={handleLogout} className="mt-3" title="Cerrar Sesión">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>

          {actions}
        </div>
      </div>

      {/* Navigation Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="px-6 border-t border-emerald-200 bg-emerald-50/50">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={tab.onClick}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  tab.active
                    ? "border-emerald-600 text-emerald-900"
                    : "border-transparent text-emerald-700 hover:text-emerald-900 hover:border-emerald-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
