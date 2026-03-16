"use client";

import { useDemo } from "./demo-context";
import { ArrowRight, CheckCircle2, Info, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TOUR_STEPS = [
  {
    step: 1,
    title: "Paso 1: Módulo Generador",
    description: "Para comenzar, cree una nueva solicitud de retiro utilizando el botón 'Nueva Solicitud de Retiro'. Ingrese un valor de tonelaje estimado (ej: 50 toneladas) y presione 'Publicar Solicitud'.",
    path: "/demo/generador",
    nextPath: "/demo/transportista",
  },
  {
    step: 2,
    title: "Paso 2: Módulo Transportista",
    description: "La solicitud ha sido publicada en la Bolsa de Cargas. Para continuar, acéptela, luego declare la carga en origen y finalmente registre la entrega en la planta de destino.",
    path: "/demo/transportista",
    nextPath: "/demo/gestor",
  },
  {
    step: 3,
    title: "Paso 3: Centro de Valorización",
    description: "Valide el pesaje de la carga entrante en la romana. Ingrese el peso real y luego emita el Certificado de Valorización para la carga que ha sido procesada.",
    path: "/demo/gestor",
    nextPath: "/demo/auditor",
  },
  {
    step: 4,
    title: "Paso 4: Portal Fiscalización",
    description: "Como auditor, usted puede verificar la trazabilidad de la operación. Haga clic en 'Descargar' para visualizar el certificado generado y revisar el registro inalterable de la transacción.",
    path: "/demo/auditor",
    nextPath: "/demo/sistema-gestion",
  },
  {
    step: 5,
    title: "Paso Final: Sistema de Gestión",
    description: "En este panel, revise cómo los indicadores consolidados de cumplimiento y emisiones evitadas se actualizan en tiempo real para todos los actores de la red de generadores.",
    path: "/demo/sistema-gestion",
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
      <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-5 animate-in slide-in-from-bottom-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">¡Recorrido Completado!</span>
          </div>
          <button onClick={endTour} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Ha presenciado cómo la plataforma integra el flujo completo de la Ley REP, automatizando la trazabilidad documental, consolidando indicadores ESG y simplificando el cumplimiento normativo.
        </p>
        <Link
          href="/demo"
          onClick={endTour}
        >
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
            Volver al Simulador
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-5 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold">
            {tourStep}
          </span>
          <span className="font-semibold text-sm">Recorrido Guiado</span>
        </div>
        <button onClick={endTour} className="text-gray-400 hover:text-gray-600 mt-1" title="Cancelar Tour">
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-bold text-gray-900 mb-2">{currentStepInfo.title}</h4>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{currentStepInfo.description}</p>

      <div className="space-y-3">
        {!tourStepCompleted ? (
          <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs border border-blue-100">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Siga las instrucciones en pantalla para continuar con el recorrido.</p>
          </div>
        ) : (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <p>¡Paso completado exitosamente! Presione el botón resaltado para continuar.</p>
          </div>
        )}

        {tourStepCompleted ? (
          <Link
            href={currentStepInfo.nextPath}
            onClick={nextTourStep}
            className="block w-full"
          >
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 ring-2 ring-emerald-500 animate-demo-pulse transition-all">
              Siguiente Paso
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button
            disabled
            className="w-full bg-gray-100 text-gray-400 flex items-center gap-2 opacity-70 border border-gray-200"
          >
            Siguiente Paso
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
