"use client";

import { DemoProvider } from "./demo-context";
import { ReactNode } from "react";
import { Toaster } from "sonner"; // Assuming sonner is installed based on standard Next.js templates, otherwise I will check package.json
import { GuidedTourOverlay } from "./guided-tour";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* We place a toaster here to show success notifications across the demo universes */}
        <Toaster position="top-right" richColors closeButton theme="light" />
        {children}
        <GuidedTourOverlay />
      </div>
    </DemoProvider>
  );
}
