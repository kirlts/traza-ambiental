"use client";

import { DemoProvider } from "./demo-context";
import { ReactNode } from "react";
import { Toaster } from "sonner"; // Assuming sonner is installed based on standard Next.js templates, otherwise I will check package.json
import { GuidedTourOverlay } from "./guided-tour";

// Componente Wrapper para consumir el Context y aplicar el padding condicional
function DemoContainer({ children }: { children: ReactNode }) {
  // We use useDemo from demo-context to check if tour is active, but we can't import useDemo here directly inside DemoLayout because DemoLayout is the Provider.
  // Actually, GuidedTourOverlay is inside DemoProvider, so we can use a wrapper component.
  return (
    <DemoPaddingWrapper>
      {/* We place a toaster here to show success notifications across the demo universes */}
      <Toaster position="top-right" richColors closeButton theme="light" />
      {children}
      <GuidedTourOverlay />
    </DemoPaddingWrapper>
  );
}

import { useDemo } from "./demo-context";

function DemoPaddingWrapper({ children }: { children: ReactNode }) {
  const { isTourActive, tourStep } = useDemo();
  // El overlay ocupa aprox 240px de alto. Añadimos un padding inferior al contenedor principal
  // solo si el tour está activo para asegurar que siempre haya espacio extra para scrollear.
  const paddingBottomClass = isTourActive && tourStep > 0 ? "pb-72" : "";

  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-900 transition-all duration-500 ease-in-out ${paddingBottomClass}`}>
      {children}
    </div>
  );
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <DemoContainer>{children}</DemoContainer>
    </DemoProvider>
  );
}
