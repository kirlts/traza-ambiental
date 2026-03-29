"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { EstadoSolicitud } from "@prisma/client";

// Type Definitions
export interface Fraccion {
  id: string;
  codigoLER: string;
  peso: number;
  tipoOperacion: "VALORIZACION" | "ELIMINACION" | "REUTILIZACION";
}

export interface Solicitud {
  id: string;
  titular: {
    nombre: string;
    rut: string;
  };
  establecimiento: {
    nombre: string;
    codigoVU: string;
    direccion: string;
  };
  tonelajeEstimado: number;
  tonelajeReal?: number;
  cantidadUnidades: number;
  codigoLER: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  status: EstadoSolicitud;
  transportista?: {
    nombre: string;
    patente: string;
    conductor: string;
    guiaDespachoRef: string;
  };
  gestor?: {
    nombre: string;
    planta: string;
  };
  fracciones?: Fraccion[];
  certificadoId?: string;
}

export interface BitacoraRegistro {
  id: string;
  solicitudId: string;
  timestamp_utc: string;
  actorId: string;
  rolEjecutor: string;
  estadoAnterior: EstadoSolicitud | null;
  estadoNuevo: EstadoSolicitud;
  evidenciaRef?: string;
}

interface DemoState {
  solicitudes: Solicitud[];
  bitacora: BitacoraRegistro[];
  kpisGlobales: {
    metaAnual: number;
    toneladasRecicladas: number;
    co2Evitado: number;
  };
  crearSolicitud: (tonelaje: number, cantidad: number, ler: string) => void;
  asignarTransporte: (id: string, patente: string, conductor: string, guiaDespachoRef: string) => void;
  iniciarTransito: (id: string) => void;
  registrarPesaje: (id: string, pesoReal: number) => void;
  subsanarDiscrepancia: (id: string, motivo: string, evidenciaId: string) => void;
  registrarFraccionamiento: (id: string, fracciones: Omit<Fraccion, "id">[]) => void;
  emitirCertificado: (id: string) => void;
  resetSimulation: () => void;
  isTourActive: boolean;
  tourStep: number;
  tourStepCompleted: boolean;
  startTour: () => void;
  nextTourStep: () => void;
  markTourStepCompleted: () => void;
  endTour: () => void;
}

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
    return [];
  });

  const [bitacora, setBitacora] = useState<BitacoraRegistro[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("traza_demo_bitacora");
      if (saved) return JSON.parse(saved);
    }
    return [];
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

  const [tourStepCompleted, setTourStepCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("traza_demo_tour_completed") === "true";
    }
    return false;
  });

  // Calculate KPIs dynamically
  const baseTons = 1250;
  const tonsRecicladas = solicitudes
    .filter((s) => s.status === "CERRADO_Y_CERTIFICADO")
    .reduce((acc, curr) => acc + (curr.tonelajeReal || curr.tonelajeEstimado), 0) + baseTons;

  const kpisGlobales = {
    metaAnual: 5000, // 5000 Tons goal
    toneladasRecicladas: tonsRecicladas,
    co2Evitado: tonsRecicladas * 2.8, // Factor de conversión aproximado
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("traza_demo_solicitudes", JSON.stringify(solicitudes));
    localStorage.setItem("traza_demo_bitacora", JSON.stringify(bitacora));
  }, [solicitudes, bitacora]);

  useEffect(() => {
    localStorage.setItem("traza_demo_tour", String(isTourActive));
    localStorage.setItem("traza_demo_tour_step", String(tourStep));
    localStorage.setItem("traza_demo_tour_completed", String(tourStepCompleted));
  }, [isTourActive, tourStep, tourStepCompleted]);

  // Log FSM state changes to BitacoraAuditoria
  const logBitacora = (
    solicitudId: string,
    estadoAnterior: EstadoSolicitud | null,
    estadoNuevo: EstadoSolicitud,
    actorId: string,
    rolEjecutor: string,
    evidenciaRef?: string
  ) => {
    const newLog: BitacoraRegistro = {
      id: `LOG-${Math.floor(Math.random() * 900000) + 100000}`,
      solicitudId,
      timestamp_utc: new Date().toISOString(),
      actorId,
      rolEjecutor,
      estadoAnterior,
      estadoNuevo,
      evidenciaRef,
    };
    setBitacora((prev) => [newLog, ...prev]);
  };

  const updateSolicitud = (id: string, updates: Partial<Solicitud>) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, ...updates, fechaActualizacion: new Date().toISOString() } : s
      )
    );
  };

  // Actions
  const crearSolicitud = (tonelaje: number, cantidad: number, ler: string) => {
    const newId = generateId();
    const newSol: Solicitud = {
      id: newId,
      titular: { nombre: "Minera Demo S.A.", rut: "99.999.999-9" },
      establecimiento: { nombre: "Instalación Demo", codigoVU: "VU-123456", direccion: "Ruta 5 Norte Km 1300" },
      tonelajeEstimado: tonelaje,
      cantidadUnidades: cantidad,
      codigoLER: ler,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      status: "PENDIENTE_ASIGNACION",
    };
    setSolicitudes((prev) => [newSol, ...prev]);
    logBitacora(newId, null, "PENDIENTE_ASIGNACION", "USER-GEN-01", "GENERADOR");
  };

  const asignarTransporte = (id: string, patente: string, conductor: string, guiaDespachoRef: string) => {
    const sol = solicitudes.find(s => s.id === id);
    if (!sol) return;
    updateSolicitud(id, {
      status: "TRANSPORTE_ASIGNADO",
      transportista: { nombre: "Mi Flota (Demo)", patente, conductor, guiaDespachoRef },
    });
    logBitacora(id, sol.status, "TRANSPORTE_ASIGNADO", "USER-TRN-01", "TRANSPORTISTA", guiaDespachoRef);
  };

  const iniciarTransito = (id: string) => {
    const sol = solicitudes.find(s => s.id === id);
    if (!sol) return;
    updateSolicitud(id, { status: "EN_TRANSITO" });
    logBitacora(id, sol.status, "EN_TRANSITO", "USER-TRN-01", "TRANSPORTISTA");
  };

  const registrarPesaje = (id: string, pesoReal: number) => {
    const sol = solicitudes.find((s) => s.id === id);
    if (!sol) return;

    // > 5% difference logic
    const diff = Math.abs(sol.tonelajeEstimado - pesoReal);
    const percentDiff = diff / sol.tonelajeEstimado;

    if (percentDiff > 0.05) {
      updateSolicitud(id, {
        tonelajeReal: pesoReal,
        status: "PESAJE_DISCREPANTE",
        gestor: { nombre: "Centro Valorizador (Demo)", planta: "Planta Principal" }
      });
      logBitacora(id, sol.status, "PESAJE_DISCREPANTE", "USER-GES-01", "GESTOR");
    } else {
      updateSolicitud(id, {
        tonelajeReal: pesoReal,
        status: "RECEPCIONADO",
        gestor: { nombre: "Centro Valorizador (Demo)", planta: "Planta Principal" }
      });
      logBitacora(id, sol.status, "RECEPCIONADO", "USER-GES-01", "GESTOR");
    }
  };

  const subsanarDiscrepancia = (id: string, motivo: string, evidenciaId: string) => {
    const sol = solicitudes.find((s) => s.id === id);
    if (!sol) return;
    updateSolicitud(id, { status: "RECEPCIONADO" });
    // Note: pesoReal was already saved when it went into PESAJE_DISCREPANTE
    logBitacora(id, sol.status, "RECEPCIONADO", "USER-GES-01", "GESTOR", evidenciaId);
  };

  const registrarFraccionamiento = (id: string, fraccionesInput: Omit<Fraccion, "id">[]) => {
    const sol = solicitudes.find((s) => s.id === id);
    if (!sol) return;

    const sumaFracciones = fraccionesInput.reduce((sum, f) => sum + f.peso, 0);
    // Tolerancia muy pequeña para coma flotante
    if (Math.abs(sumaFracciones - (sol.tonelajeReal || sol.tonelajeEstimado)) > 0.01) {
       throw new Error(`La suma de las fracciones (${sumaFracciones}t) no coincide con el peso real de la solicitud (${sol.tonelajeReal}t).`);
    }

    const fracciones = fraccionesInput.map(f => ({ ...f, id: `FRAC-${Math.floor(Math.random() * 90000) + 10000}` }));

    updateSolicitud(id, {
      status: "TRATADO_Y_FRACCIONADO",
      fracciones
    });
    logBitacora(id, sol.status, "TRATADO_Y_FRACCIONADO", "USER-GES-01", "GESTOR");
  };

  const emitirCertificado = (id: string) => {
    const sol = solicitudes.find((s) => s.id === id);
    if (!sol) return;
    updateSolicitud(id, {
      status: "CERRADO_Y_CERTIFICADO",
      certificadoId: `CERT-REP-${Math.floor(Math.random() * 90000) + 10000}`,
    });
    logBitacora(id, sol.status, "CERRADO_Y_CERTIFICADO", "USER-ADM-01", "ADMIN");
  };

  const resetSimulation = () => {
    setSolicitudes([]);
    setBitacora([]);
    localStorage.removeItem("traza_demo_solicitudes");
    localStorage.removeItem("traza_demo_bitacora");
    setIsTourActive(false);
    setTourStep(0);
    setTourStepCompleted(false);
  };

  const startTour = () => {
    resetSimulation();
    setIsTourActive(true);
    setTourStep(1); // Paso 1: Generador
    setTourStepCompleted(false);
  };

  const nextTourStep = () => {
    setTourStep((prev) => prev + 1);
    setTourStepCompleted(false);
  };

  const markTourStepCompleted = () => {
    setTourStepCompleted(true);
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStep(0);
    setTourStepCompleted(false);
  };

  if (!isClient) {
    return null; // or a loading spinner to prevent hydration mismatch
  }

  return (
    <DemoContext.Provider
      value={{
        solicitudes,
        bitacora,
        kpisGlobales,
        crearSolicitud,
        asignarTransporte,
        iniciarTransito,
        registrarPesaje,
        subsanarDiscrepancia,
        registrarFraccionamiento,
        emitirCertificado,
        resetSimulation,
        isTourActive,
        tourStep,
        tourStepCompleted,
        startTour,
        nextTourStep,
        markTourStepCompleted,
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
