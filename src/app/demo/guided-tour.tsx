"use client";

import { useDemo } from "./demo-context";
import { ArrowRight, CheckCircle2, Info, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const TOUR_STEPS = [
  {
    step: 1,
    title: "Paso 1: Módulo Generador",
    description: "Para comenzar, cree una nueva solicitud de retiro con 120 unidades, LER 16 01 03, y peso 48.0t.",
    path: "/demo/generador",
    targetSelector: '[data-tour-target="form-creacion"]',
  },
  {
    step: 2,
    title: "Paso 2: Módulo Transportista",
    description: "Acepte la carga, ingrese los datos de traslado y registre la entrega en la planta.",
    path: "/demo/transportista",
    targetSelector: '[data-tour-target="card-transporte"]',
  },
  {
    step: 3,
    title: "Paso 3: Centro de Valorización (Romana)",
    description: "Registre el peso real de la carga (45.0t). El sistema validará matemáticamente el margen de desviación > 5% y mutará a PESAJE_DISCREPANTE.",
    path: "/demo/gestor",
    targetSelector: '[data-tour-target="input-romana"]',
  },
  {
    step: 4,
    title: "Paso 4: Resolución y Fraccionamiento",
    description: "Seleccione un motivo de discrepancia y adjunte evidencia para liberar la carga. Luego fraccione exactamente las 45.0t (Ecuación Cero).",
    path: "/demo/gestor",
    targetSelector: '[data-tour-target="modulo-fracciones"]',
  },
  {
    step: 5,
    title: "Paso Final: Admin (Emisión de Certificados)",
    description: "Audite la bitácora inmutable y emita el paquete de cumplimiento REP consolidado.",
    path: "/demo/admin",
    targetSelector: '[data-tour-target="emitir-certificados"]',
  },
];

export function GuidedTourOverlay() {
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
      const el = document.querySelector(currentStepInfo.targetSelector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
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


  if (!isTourActive || tourStep === 0) return null;

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

  // Padding for clip-path
  const p = 8;
  const clipPathStyle = targetRect
    ? `polygon(
        0% 0%, 0% 100%,
        ${targetRect.left - p}px 100%,
        ${targetRect.left - p}px ${targetRect.top - p}px,
        ${targetRect.right + p}px ${targetRect.top - p}px,
        ${targetRect.right + p}px ${targetRect.bottom + p}px,
        ${targetRect.left - p}px ${targetRect.bottom + p}px,
        ${targetRect.left - p}px 100%,
        100% 100%, 100% 0%
      )`
    : "none";

  return (
    <>
      <div
        id="tour-backdrop"
        className="fixed inset-0 bg-black/60 z-[9998] transition-all duration-300"
        style={{
          pointerEvents: 'auto',
          clipPath: clipPathStyle,
        }}
      />

      {targetRect && (
        <div
          className="fixed z-[9998] border-2 border-emerald-500 rounded-lg pointer-events-none transition-all duration-300 animate-demo-pulse shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
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
        </div>
      </div>
    </>
  );
}
