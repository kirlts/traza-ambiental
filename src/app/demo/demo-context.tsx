"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Type Definitions
export type SolicitudStatus =
  | "PENDIENTE" // Generador la creó
  | "BUSCANDO_TRANSPORTISTA" // Publicada en la bolsa
  | "ASIGNADA" // Transportista la aceptó
  | "EN_TRANSITO" // Transportista cargó y va en camino
  | "RECIBIDA_EN_PLANTA" // Gestor la recibió pero no la ha pesado
  | "PESAJE_DISCREPANTE" // Hay diferencia > 5% en romana
  | "TRATADA" // Gestor la valorizó (Finalizada)
  | "CERTIFICADA"; // Certificado emitido

export interface Solicitud {
  id: string;
  generador: {
    nombre: string;
    rut: string;
    direccion: string;
  };
  tonelajeEstimado: number; // Declarado por generador
  tonelajeReal?: number; // Pesado por gestor en romana
  fechaCreacion: string;
  fechaActualizacion: string;
  status: SolicitudStatus;
  transportista?: {
    nombre: string;
    patente: string;
  };
  gestor?: {
    nombre: string;
    planta: string;
  };
  certificadoId?: string;
}

interface DemoState {
  solicitudes: Solicitud[];
  kpisGlobales: {
    metaAnual: number;
    toneladasRecicladas: number;
    co2Evitado: number; // Toneladas de CO2e evitadas
  };
  addSolicitud: (tonelaje: number) => void;
  acceptViaje: (id: string) => void;
  iniciarTransito: (id: string) => void;
  entregarEnPlanta: (id: string) => void;
  registrarPesaje: (id: string, pesoReal: number) => void;
  emitirCertificado: (id: string) => void;
  resolverDiscrepancia: (id: string, pesoAcordado: number) => void;
  resetSimulation: () => void;
  // Tour State
  isTourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  endTour: () => void;
}

// Initial Mock Data (The Illusion)
const MOCK_DATA: Solicitud[] = [
  {
    id: "SOL-2026-001",
    generador: {
      nombre: "Minera Escondida",
      rut: "76.123.456-7",
      direccion: "Ruta 5 Norte Km 1300, Antofagasta",
    },
    tonelajeEstimado: 120, // 120 toneladas de NFU gigante OTR
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    fechaActualizacion: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: "CERTIFICADA",
    transportista: { nombre: "Transportes Nacionales", patente: "KX-JW-44" },
    gestor: { nombre: "Planta Reciclaje NFU Norte", planta: "Planta Antofagasta" },
    tonelajeReal: 121.5,
    certificadoId: "CERT-REP-99882",
  },
  {
    id: "SOL-2026-002",
    generador: {
      nombre: "Codelco Chuquicamata",
      rut: "61.704.000-K",
      direccion: "Calama, Región de Antofagasta",
    },
    tonelajeEstimado: 45,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    fechaActualizacion: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    status: "BUSCANDO_TRANSPORTISTA",
  },
  {
    id: "SOL-2026-003",
    generador: { nombre: "Minera Centinela", rut: "77.888.999-1", direccion: "Sierra Gorda" },
    tonelajeEstimado: 85,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    fechaActualizacion: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: "EN_TRANSITO",
    transportista: { nombre: "Logística Circular SPA", patente: "ZZ-AA-11" },
  },
  {
    id: "SOL-2026-004",
    generador: {
      nombre: "Anglo American Sur",
      rut: "76.555.444-3",
      direccion: "Ruta 5 Norte Km 20",
    },
    tonelajeEstimado: 30,
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    fechaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: "RECIBIDA_EN_PLANTA",
    transportista: { nombre: "Transportes Rápidos", patente: "WW-QQ-99" },
    gestor: { nombre: "Valoriza Chile", planta: "Planta Lampa" },
  },
];

const DemoContext = createContext<DemoState | undefined>(undefined);

// Helpers
const generateId = () => `SOL-2026-00${Math.floor(Math.random() * 900) + 10}`;

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Small timeout to satisfy linter rule against synchronous setState in effect
    const timeout = setTimeout(() => {
      setIsClient(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("traza_demo_solicitudes");
      if (saved) return JSON.parse(saved);
    }
    return MOCK_DATA;
  });

  const [isTourActive, setIsTourActive] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("traza_demo_tour") === "true";
    }
    return false;
  });

  const [tourStep, setTourStep] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("traza_demo_tour_step")) || 0;
    }
    return 0;
  });

  // Calculate KPIs dynamically
  const baseTons = 1250;
  const tonsRecicladas = solicitudes
    .filter((s) => s.status === "CERTIFICADA" || s.status === "TRATADA")
    .reduce((acc, curr) => acc + (curr.tonelajeReal || curr.tonelajeEstimado), 0) + baseTons;

  const kpisGlobales = {
    metaAnual: 5000, // 5000 Tons goal
    toneladasRecicladas: tonsRecicladas,
    co2Evitado: tonsRecicladas * 2.8, // Factor de conversión aproximado: 2.8 toneladas de CO2e evitadas por tonelada de NFU reciclada
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("traza_demo_solicitudes", JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem("traza_demo_tour", String(isTourActive));
    localStorage.setItem("traza_demo_tour_step", String(tourStep));
  }, [isTourActive, tourStep]);

  // Actions
  const addSolicitud = (tonelaje: number) => {
    const newSol: Solicitud = {
      id: generateId(),
      generador: { nombre: "Minera Demo S.A.", rut: "99.999.999-9", direccion: "Instalación Demo" },
      tonelajeEstimado: tonelaje,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      status: "BUSCANDO_TRANSPORTISTA",
    };
    setSolicitudes((prev) => [newSol, ...prev]);
  };

  const updateSolicitud = (id: string, updates: Partial<Solicitud>) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...updates, fechaActualizacion: new Date().toISOString() } : s
      )
    );
  };

  const acceptViaje = (id: string) => {
    updateSolicitud(id, {
      status: "ASIGNADA",
      transportista: { nombre: "Mi Flota (Demo)", patente: "DEMO-01" },
    });
  };

  const iniciarTransito = (id: string) => updateSolicitud(id, { status: "EN_TRANSITO" });

  const entregarEnPlanta = (id: string) => {
    updateSolicitud(id, {
      status: "RECIBIDA_EN_PLANTA",
      gestor: { nombre: "Centro Valorizador (Demo)", planta: "Planta Principal" },
    });
  };

  const registrarPesaje = (id: string, pesoReal: number) => {
    const sol = solicitudes.find((s) => s.id === id);
    if (!sol) return;

    // > 5% difference logic
    const diff = Math.abs(sol.tonelajeEstimado - pesoReal);
    const percentDiff = (diff / sol.tonelajeEstimado) * 100;

    if (percentDiff > 5) {
      updateSolicitud(id, { tonelajeReal: pesoReal, status: "PESAJE_DISCREPANTE" });
    } else {
      updateSolicitud(id, { tonelajeReal: pesoReal, status: "TRATADA" });
    }
  };

  const emitirCertificado = (id: string) => {
    updateSolicitud(id, {
      status: "CERTIFICADA",
      certificadoId: `CERT-REP-${Math.floor(Math.random() * 90000) + 10000}`,
    });
  };

  const resolverDiscrepancia = (id: string, pesoAcordado: number) => {
    updateSolicitud(id, {
      tonelajeReal: pesoAcordado,
      status: "TRATADA",
    });
  };

  const resetSimulation = () => {
    setSolicitudes(MOCK_DATA);
    localStorage.setItem("traza_demo_solicitudes", JSON.stringify(MOCK_DATA));
    setIsTourActive(false);
    setTourStep(0);
  };

  const startTour = () => {
    resetSimulation(); // Limpiar para empezar de cero
    // Remover todos los datos excepto quizás los históricos, para que sea un lienzo en blanco o usar MOCK_DATA?
    // Mejor empezar con MOCK_DATA vacío o dejar MOCK_DATA como ambiente inicial
    // Dejemos MOCK_DATA y que el tour guíe sobre crear uno nuevo.
    setIsTourActive(true);
    setTourStep(1); // Paso 1: Generador
  };

  const nextTourStep = () => {
    setTourStep((prev) => prev + 1);
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
  };

  if (!isClient) {
    return null; // or a loading spinner to prevent hydration mismatch
  }

  return (
    <DemoContext.Provider
      value={{
        solicitudes,
        kpisGlobales,
        addSolicitud,
        acceptViaje,
        iniciarTransito,
        entregarEnPlanta,
        registrarPesaje,
        emitirCertificado,
        resolverDiscrepancia,
        resetSimulation,
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        endTour,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
