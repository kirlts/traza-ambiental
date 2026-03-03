"use client";

import { useState } from "react";
import { useRegistroMultiStep } from "@/hooks/useRegistroMultiStep";
import StepIndicator from "@/components/registro/StepIndicator";
import EmpresaForm from "@/components/registro/EmpresaForm";
import RepresentanteForm from "@/components/registro/RepresentanteForm";
import CredencialesForm from "@/components/registro/CredencialesForm";
import SuccessMessage from "@/components/registro/SuccessMessage";

const STEP_LABELS = ["Empresa", "Representante", "Credenciales"];

interface GeneradorFlowProps {
  onBack: () => void;
}

export default function GeneradorFlow({ onBack }: GeneradorFlowProps) {
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [datosRegistro, setDatosRegistro] = useState<{
    razonSocial: string;
    email: string;
  } | null>(null);
  const [errorGeneral, setErrorGeneral] = useState("");

  const handleSubmit = async (data: ReturnType<typeof JSON.parse>) => {
    try {
      setErrorGeneral("");

      const response = await fetch("/api/auth/register/generador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Manejar errores de validación
        if (result.detalles && typeof result.detalles === "object") {
          const errores = Object.values(result.detalles).filter(Boolean);
          if (errores.length > 0) {
            const primerError = errores[0];
            throw new Error(
              Array.isArray(primerError) && primerError.length > 0
                ? primerError[0]
                : String(primerError)
            );
          }
        }
        throw new Error(result.error || "Error al registrar");
      }

      // Registro exitoso
      if (result.data) {
        setDatosRegistro({
          razonSocial: result.data.razonSocial || data.razonSocial || "Empresa",
          email: result.data.email || data.email || "",
        });
        setRegistroExitoso(true);
      } else {
        // Fallback si no hay data en la respuesta
        setDatosRegistro({
          razonSocial: data.razonSocial || "Empresa",
          email: data.email || "",
        });
        setRegistroExitoso(true);
      }
    } catch (error: unknown) {
      console.error("Error en registro:", error);
      setErrorGeneral(
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error al procesar el registro"
      );
      throw error; // Re-throw para que el hook maneje el estado de loading
    }
  };

  const { currentStep, formData, isSubmitting, setFormData, nextStep, prevStep, submitForm } =
    useRegistroMultiStep(handleSubmit);

  // Mostrar mensaje de éxito si el registro fue exitoso
  if (registroExitoso && datosRegistro) {
    return (
      <div className="w-full">
        <SuccessMessage razonSocial={datosRegistro.razonSocial} email={datosRegistro.email} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Volver</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Registro Generador</h2>
          <p className="text-sm text-gray-500">Completa los pasos para registrar tu empresa</p>
        </div>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={3} stepLabels={STEP_LABELS} />

      <div className="mt-8">
        {/* Error general */}
        {errorGeneral && (
          <div
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
          >
            <p className="text-sm font-medium">Error:</p>
            <p className="text-sm">{errorGeneral}</p>
          </div>
        )}

        {/* Formularios por paso */}
        {currentStep === 1 && (
          <EmpresaForm
            initialData={formData}
            onNext={(data: ReturnType<typeof JSON.parse>) => {
              setFormData(data);
              nextStep();
            }}
          />
        )}

        {currentStep === 2 && (
          <RepresentanteForm
            initialData={formData}
            onNext={(data: ReturnType<typeof JSON.parse>) => {
              setFormData(data);
              nextStep();
            }}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <CredencialesForm
            initialData={formData}
            onSubmit={async (data: ReturnType<typeof JSON.parse>) => {
              setFormData(data);
              await submitForm(data);
            }}
            onBack={prevStep}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
