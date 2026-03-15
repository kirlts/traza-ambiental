"use client";

import { useDemo } from "./demo-context";
import { ArrowRight, CheckCircle2, Play, Info, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TOUR_STEPS = [
  {
    step: 1,
    title: "Paso 1: Perfil Generador",
    description: "Cree una nueva solicitud de retiro (Ej: 50 toneladas).",
    path: "/demo/generador",
    targetAction: "addSolicitud",
    nextPath: "/demo/transportista",
  },
  {
    step: 2,
    title: "Paso 2: Perfil Transportista",
    description: "Vaya a la Bolsa de Cargas, acepte el viaje recién creado y luego inicie el tránsito.",
    path: "/demo/transportista",
    targetAction: "iniciarTransito",
    nextPath: "/demo/gestor",
  },
  {
    step: 3,
    title: "Paso 3: Perfil Gestor (Planta)",
    description: "Reciba el camión, registre el pesaje en la romana y emita el certificado.",
    path: "/demo/gestor",
    targetAction: "emitirCertificado",
    nextPath: "/demo/auditor",
  },
  {
    step: 4,
    title: "Paso 4: Perfil Auditor",
    description: "Busque el certificado generado para validar la trazabilidad del residuo.",
    path: "/demo/auditor",
    targetAction: "viewCertificate",
    nextPath: "/demo",
  },
];

export function GuidedTourOverlay() {
  const { isTourActive, tourStep, nextTourStep, endTour } = useDemo();
  const pathname = usePathname();

  if (!isTourActive || tourStep === 0) return null;

  const currentStepInfo = TOUR_STEPS.find((s) => s.step === tourStep);

  if (!currentStepInfo) {
    // Finished tour
    return (
      <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 p-5 animate-in slide-in-from-bottom-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">¡Recorrido Completado!</span>
          </div>
          <button onClick={endTour} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Ha completado exitosamente todo el flujo integrado de la Ley REP a través de los diferentes módulos.
        </p>
        <Link
          href="/demo"
          onClick={endTour}
          className="flex w-full items-center justify-center py-2 px-4 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const isCorrectPath = pathname === currentStepInfo.path;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-indigo-500/20 p-5 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
            {tourStep}
          </span>
          <span className="font-bold text-slate-900 text-sm">Tour Interactivo Activo</span>
        </div>
        <button onClick={endTour} className="text-slate-400 hover:text-slate-600" title="Cancelar Tour">
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-semibold text-indigo-900 mb-1">{currentStepInfo.title}</h4>
      <p className="text-sm text-slate-600 mb-4">{currentStepInfo.description}</p>

      {!isCorrectPath ? (
        <Link
          href={currentStepInfo.path}
          className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Play className="w-4 h-4" />
          Ir al Perfil
        </Link>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-xl text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Realice la acción en esta pantalla. Cuando termine, avance al siguiente paso.</p>
          </div>
          <Link
            href={currentStepInfo.nextPath}
            onClick={nextTourStep}
            className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            Siguiente Perfil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
