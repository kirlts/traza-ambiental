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
<<<<<<< Updated upstream
    nextPath: "/demo/transportista",
=======
    targetSelector: '[data-tour-target="form-creacion"],[data-tour-target="nueva-solicitud"]',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const { isTourActive, tourStep, tourStepCompleted, nextTourStep, endTour } = useDemo();
=======
  const { isTourActive, tourStep, endTour, solicitudes, nextTourStep } = useDemo();
  const router = useRouter();
  const pathname = usePathname();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Determinar si el tour ha sido completado según el estado de la aplicación
  const getIsCompleted = useCallback(() => {
    // Busca la solicitud creada durante el tour (la primera PENDIENTE_ASIGNACION o posterior)
    const activeSol = solicitudes[0];
    if (!activeSol) return false;

    switch (tourStep) {
      case 1:
        return activeSol.status !== "PENDIENTE";
      case 2:
        return activeSol.status === "RECEPCIONADO" || activeSol.status === "PESAJE_DISCREPANTE";
      case 3:
        return activeSol.status === "PESAJE_DISCREPANTE";
      case 4:
        return activeSol.status === "TRATADO_Y_FRACCIONADO";
      case 5:
        return activeSol.status === "CERRADO_Y_CERTIFICADO";
      default:
        return false;
    }
  }, [tourStep, solicitudes]);

  const isCompleted = getIsCompleted();

  const currentStepInfo = TOUR_STEPS.find((s) => s.step === tourStep);

  useEffect(() => {
    if (!isTourActive || !currentStepInfo) return;

    // Enforce path
    if (pathname !== currentStepInfo.path && !isCompleted) {
      router.push(currentStepInfo.path);
      return;
    }

    // Auto-advance
    let advanceTimeout: NodeJS.Timeout;
    if (isCompleted && tourStep < TOUR_STEPS.length) {
      const nextStepInfo = TOUR_STEPS.find((s) => s.step === tourStep + 1);
      if (nextStepInfo) {
        advanceTimeout = setTimeout(() => {
            nextTourStep();
        }, 1500); // Pequeño delay para UX de ver el "completado"
      }
    }

    // Calcular DOMRect reactivo
    const updateRect = () => {
      // Support comma-separated selectors: try each in order, use the first visible one
      const selectors = currentStepInfo.targetSelector.split(',');
      let foundEl: Element | null = null;
      for (const sel of selectors) {
        const el = document.querySelector(sel.trim());
        if (el && el.getBoundingClientRect().width > 0) {
          foundEl = el;
          break;
        }
      }
      if (foundEl) {
        setTargetRect(foundEl.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 500); // Polling por si la UI muta
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearInterval(interval);
      clearTimeout(advanceTimeout);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isTourActive, currentStepInfo, pathname, router, isCompleted, tourStep, nextTourStep]);

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    <div className="fixed bottom-6 right-6 z-[100] w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-5 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs font-bold">
            {tourStep}
          </span>
          <span className="font-semibold text-sm">Recorrido Guiado</span>
=======
    <>
      <div
        id="tour-backdrop"
        className="fixed inset-0 bg-black/60 z-[45] transition-all duration-300"
        style={{
          pointerEvents: 'none',
          clipPath: clipPathStyle,
        }}
      />

      {targetRect && (
        <div
          className="fixed z-[45] border-2 border-emerald-500 rounded-lg pointer-events-none transition-all duration-300 animate-demo-pulse shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={{
            top: targetRect.top - p,
            left: targetRect.left - p,
            width: targetRect.width + p * 2,
            height: targetRect.height + p * 2,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0)" // The backdrop handles the dimming, this just highlights the box
          }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-[9999] w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-5 animate-in slide-in-from-bottom-5">
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
          {!isCompleted ? (
            <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs border border-blue-100">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Interactúe con el área resaltada para avanzar al siguiente paso.</p>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <p>¡Paso completado exitosamente! El sistema avanzará automáticamente.</p>
            </div>
          )}
>>>>>>> Stashed changes
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
