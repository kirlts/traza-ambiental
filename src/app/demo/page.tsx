"use client";

import Link from "next/link";
import {
  Factory,
  Truck,
  Recycle,
  ShieldCheck,
  Search,
  ArrowRight,
  Database,
  Scale,
  RefreshCw,
  PlayCircle,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { useDemo } from "./demo-context";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

const ROLES = [
  {
    id: "generador",
    title: "Generador",
    description:
      "Panel de control para la declaración de Neumáticos Fuera de Uso (NFU) y monitoreo de metas de reciclaje.",
    icon: Factory,
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    href: "/demo/generador",
    highlights: ["Indicadores Anuales", "Creación de Solicitudes", "Certificados Emitidos"],
  },
  {
    id: "transportista",
    title: "Transportista",
    description:
      "Gestión logística de retiros, asignación de viajes y control de entregas en centros de valorización.",
    icon: Truck,
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    href: "/demo/transportista",
    highlights: ["Ofertas de Carga", "Rutas en Tránsito", "Confirmación de Entrega"],
  },
  {
    id: "gestor",
    title: "Centro de Valorización",
    description:
      "Recepción de cargas, registro de pesaje validado y emisión formal de certificados de tratamiento.",
    icon: Recycle,
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    href: "/demo/gestor",
    highlights: ["Recepciones Pendientes", "Control de Pesaje", "Emisión de Certificados"],
  },
  {
    id: "admin",
    title: "Administrador de Plataforma",
    description:
      "Monitorización global del sistema, administración de usuarios y resolución de alertas operativas.",
    icon: ShieldCheck,
    color: "from-slate-500 to-slate-600",
    bgLight: "bg-slate-50",
    href: "/demo/admin",
    highlights: ["Visión Global", "Gestión de Alertas", "Administración de Roles"],
  },
  {
    id: "auditor",
    title: "Fiscalización",
    description:
      "Acceso de lectura y auditoría para la revisión de trazabilidad y validación de certificados emitidos.",
    icon: Search,
    color: "from-slate-500 to-slate-600",
    bgLight: "bg-slate-50",
    href: "/demo/auditor",
    highlights: ["Auditoría de Trazabilidad", "Validación Documental", "Reportes de Cumplimiento"],
  },
  {
    id: "sistema-gestion",
    title: "Sistema de Gestión",
    description:
      "Consolidación de metas nacionales, cálculo de impacto ambiental colectivo y gestión de presupuestos.",
    icon: Building2,
    color: "from-slate-500 to-slate-600",
    bgLight: "bg-slate-50",
    href: "/demo/sistema-gestion",
    highlights: ["Metas Consolidadas", "Reportes ESG", "Gestión de Licitaciones"],
  },
];

export default function DemoPortal() {
  const { resetSimulation, startTour } = useDemo();
  const router = useRouter();

  const handleStartTour = () => {
    startTour();
    router.push("/demo/generador");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/logo-trazambiental-hoja.svg" alt="TrazAmbiental" width={32} height={32} />
            <span className="font-bold text-xl tracking-tight text-emerald-900">Traza Ambiental</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => resetSimulation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar Simulador
            </button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-demo-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Entorno de Simulación
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-gray-900">
            Simulador de Trazabilidad Ley REP
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Explore los diferentes módulos de la plataforma desde la perspectiva de cada actor en la cadena de valor. Este entorno simulado permite conocer los flujos operativos principales.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleStartTour}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <PlayCircle className="w-5 h-5" />
              Iniciar Recorrido Guiado
            </button>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROLES.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                href={role.href}
                key={role.id}
                className="group flex flex-col h-full"
              >
                <Card className="flex flex-col h-full border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${role.bgLight} group-hover:bg-emerald-100 transition-colors`}>
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{role.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">{role.description}</p>

                    <div className="space-y-2 mb-6">
                      {role.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                          {highlight}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                      Ingresar al Módulo
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Global Architecture Info */}
        <div className="mt-16">
          <Card className="bg-gray-50 border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Entorno Integrado
                  </h2>
                  <p className="text-gray-600">
                    Los módulos del simulador operan sobre una base de datos efímera compartida. Las acciones realizadas en un perfil (ej. creación de una solicitud) se reflejarán inmediatamente en los paneles correspondientes de los demás actores.
                  </p>
                </div>
                <div className="md:w-1/2 flex gap-4 w-full">
                  <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col items-center justify-center text-center">
                    <Database className="w-6 h-6 text-emerald-600 mb-2" />
                    <div className="text-gray-900 font-medium text-sm">Estado Simulado Local</div>
                  </div>
                  <div className="flex-1 bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col items-center justify-center text-center">
                    <Scale className="w-6 h-6 text-emerald-600 mb-2" />
                    <div className="text-gray-900 font-medium text-sm">Validación REP Integrada</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
