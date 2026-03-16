"use client";

import { useDemo } from "./demo-context";
import { ArrowRight, CheckCircle2, Info, X } from "lucide-react";
import Link from "next/link";

const TOUR_STEPS = [
  {
    step: 1,
    title: "Paso 1: Perfil Generador",
    description: "Venda su NFU de inmediato. Declare su retiro (ej: 50 tons) y la plataforma buscará flotas autorizadas al instante, mitigando su riesgo legal.",
    path: "/demo/generador",
    targetAction: "addSolicitud",
    nextPath: "/demo/transportista",
  },
  {
    step: 2,
    title: "Paso 2: Perfil Logístico",
    description: "Adiós a los papeles y tiempos muertos. Su flota acepta la carga digitalmente y reporta la entrega en tiempo real desde la cabina.",
    path: "/demo/transportista",
    targetAction: "iniciarTransito",
    nextPath: "/demo/gestor",
  },
  {
    step: 3,
    title: "Paso 3: Planta Valorizadora",
    description: "Cero error de digitación. Registre el pesaje de Romana y el Autómata de Traza emitirá el Certificado Infalsificable al instante.",
    path: "/demo/gestor",
    targetAction: "emitirCertificado",
    nextPath: "/demo/auditor",
  },
  {
    step: 4,
    title: "Paso 4: Fiscalización Estatal",
    description: "Cumplimiento 100% garantizado Ley REP. Vea cómo el hash inmutable sella todo el historial, listo para cualquier auditoría sin estrés.",
    path: "/demo/auditor",
    targetAction: "viewCertificate",
    nextPath: "/demo/sistema-gestion",
  },
  {
    step: 5,
    title: "Paso Final: Sistema de Gestión",
    description: "La 'Vista de Dios'. Observe cómo las toneladas recicladas se suman a la meta nacional y calculan las emisiones de CO2 evitadas para su reporte ESG.",
    path: "/demo/sistema-gestion",
    targetAction: "viewDashboard",
    nextPath: "/demo",
  },
];

export function GuidedTourOverlay() {
  const { isTourActive, tourStep, tourStepCompleted, nextTourStep, endTour } = useDemo();

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
          Ha presenciado cómo Traza Ambiental automatiza el 100% de la cadena de valor de sus residuos, eliminando riesgos legales, reduciendo horas hombre y centralizando la visibilidad para alta gerencia.
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

      <div className="space-y-3">
        {!tourStepCompleted ? (
          <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-xl text-xs">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Complete la acción requerida en esta pantalla para continuar con la demostración.</p>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <p>¡Acción completada! Ya puede avanzar al siguiente paso del flujo.</p>
          </div>
        )}

        {tourStepCompleted ? (
          <Link
            href={currentStepInfo.nextPath}
            onClick={nextTourStep}
            className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            Siguiente paso
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-200 text-slate-400 font-medium cursor-not-allowed opacity-50"
          >
            Siguiente paso
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
