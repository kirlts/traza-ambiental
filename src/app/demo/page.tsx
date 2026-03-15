"use client";

import Link from "next/link";
import {
  Factory,
  Truck,
  Recycle,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Database,
  LineChart,
  Scale,
} from "lucide-react";
import Image from "next/image";

const ROLES = [
  {
    id: "generador",
    title: "Generador (Minera)",
    description:
      "Crea solicitudes de retiro de neumáticos gigantes (OTR) y monitorea tus KPIs de reciclaje anuales para cumplir con la Ley REP.",
    icon: Factory,
    color: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50",
    href: "/demo/generador",
    highlights: ["KPIs Anuales", "Crear Solicitudes", "Descarga de Certificados"],
  },
  {
    id: "transportista",
    title: "Transportista",
    description:
      "Encuentra cargas disponibles, acepta viajes, simula la recolección de residuos y realiza entregas en plantas de valorización.",
    icon: Truck,
    color: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    href: "/demo/transportista",
    highlights: ["Bolsa de Cargas", "Rutas Activas", "Comprobantes de Entrega"],
  },
  {
    id: "gestor",
    title: "Planta de Valorización",
    description:
      "Recibe camiones, valida el pesaje en romana, detecta discrepancias y emite certificados legales de forma automatizada.",
    icon: Recycle,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    href: "/demo/gestor",
    highlights: ["Recepción de Camiones", "Pesaje (Romana)", "Emisión Automática"],
  },
  {
    id: "admin",
    title: "Administrador (Traza Ambiental)",
    description:
      "Visualiza el estado global de la plataforma, gestiona flotas y resuelve discrepancias de pesaje entre actores.",
    icon: ShieldCheck,
    color: "from-purple-500 to-fuchsia-600",
    bgLight: "bg-purple-50",
    href: "/demo/admin",
    highlights: ["Control Total", "Auditoría de Discrepancias", "Gestión de Permisos"],
  },
  {
    id: "auditor",
    title: "Fiscalización Estatal",
    description:
      "Acceso forense de solo lectura para rastrear certificados específicos y validar la trazabilidad completa del residuo.",
    icon: Search,
    color: "from-slate-600 to-gray-800",
    bgLight: "bg-slate-100",
    href: "/demo/auditor",
    highlights: ["Rastreo Forense", "Validación Pública", "Vista de Solo Lectura"],
  },
];

export default function DemoPortal() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 text-slate-900 font-sans selection:bg-indigo-200">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo-trazambiental-hoja.svg" alt="TrazAmbiental" width={32} height={32} />
            <span className="font-bold text-xl tracking-tight text-slate-800">Traza Ambiental</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              Demo Mode Active
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center justify-center p-2 mb-6 bg-indigo-50 rounded-2xl ring-1 ring-indigo-100">
            <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm font-semibold text-indigo-900 tracking-wide uppercase">
              Experiencia Interactiva
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
            Seleccione un Universo
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Experimente la plataforma Traza Ambiental desde la perspectiva de los diferentes actores
            de la economía circular y la Ley REP. Los datos están conectados en tiempo real.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ROLES.map((role, index) => {
            const Icon = role.icon;
            return (
              <Link
                href={role.href}
                key={role.id}
                className="group relative flex flex-col justify-between bg-white rounded-3xl p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative background gradient */}
                <div
                  className={`absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-linear-to-br ${role.color} rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
                />

                <div>
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${role.bgLight} mb-6 shadow-xs ring-1 ring-black/5`}
                  >
                    <Icon
                      className={`w-7 h-7 bg-clip-text bg-linear-to-br ${role.color} text-transparent`}
                      style={{ stroke: "url(#gradient-" + role.id + ")" }}
                    />
                    {/* SVG Gradient Definition for Icons */}
                    <svg width="0" height="0" className="absolute">
                      <linearGradient
                        id={`gradient-${role.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          className={role.color.split(" ")[0].replace("from-", "text-")}
                          stopColor="currentColor"
                        />
                        <stop
                          offset="100%"
                          className={role.color.split(" ")[1].replace("to-", "text-")}
                          stopColor="currentColor"
                        />
                      </linearGradient>
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{role.description}</p>
                </div>

                <div>
                  <div className="space-y-2 mb-8">
                    {role.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center text-sm text-slate-600">
                        <div
                          className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${role.color} mr-2`}
                        />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <div
                    className={`inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold rounded-xl bg-slate-50 text-slate-700 group-hover:text-white group-hover:bg-linear-to-r ${role.color} transition-all duration-300`}
                  >
                    Entrar al Universo
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Global Architecture Info */}
        <div className="mt-24 p-8 sm:p-12 bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">
                Motor de Simulación Centralizado
              </h2>
              <p className="text-slate-300 text-lg">
                Todos los universos comparten el mismo estado en tiempo real. Crea una solicitud
                como Minera y vela aparecer instantáneamente en la bolsa de cargas del
                Transportista.
              </p>
            </div>
            <div className="md:w-1/2 flex gap-4">
              <div className="flex-1 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                <Database className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <div className="text-white font-medium">Datos Persistentes (Local)</div>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center">
                <Scale className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-white font-medium">Lógica REP Integrada</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
