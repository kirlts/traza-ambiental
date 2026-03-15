"use client";

import { DemoProvider } from "./demo-context";
import { ReactNode } from "react";
import { Toaster } from "sonner"; // Assuming sonner is installed based on standard Next.js templates, otherwise I will check package.json
import { GuidedTourOverlay } from "./guided-tour";

import { useDemo } from "./demo-context";

function DemoLayoutInner({ children }: { children: ReactNode }) {
  const { isTourActive } = useDemo();
  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-900 ${isTourActive ? 'pb-72' : ''}`}>
      <Toaster position="top-right" richColors closeButton theme="light" />
      {children}
      <GuidedTourOverlay />
    </div>
  );
}

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <DemoLayoutInner>{children}</DemoLayoutInner>
    </DemoProvider>
  );
}
