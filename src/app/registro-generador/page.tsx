"use client";

import { useState } from "react";
import Image from "next/image";
import { useRegistroMultiStep } from "@/hooks/useRegistroMultiStep";
import StepIndicator from "@/components/registro/StepIndicator";
import EmpresaForm from "@/components/registro/EmpresaForm";
import RepresentanteForm from "@/components/registro/RepresentanteForm";
import CredencialesForm from "@/components/registro/CredencialesForm";
import SuccessMessage from "@/components/registro/SuccessMessage";

const STEP_LABELS = ["Empresa", "Representante", "Credenciales"];

export default function RegistroGeneradorPage() {
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
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="flex justify-center mb-6">
            <Image src="/LogoTexto.svg" alt="TrazAmbiental" width={200} height={80} priority />
          </div>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <SuccessMessage razonSocial={datosRegistro.razonSocial} email={datosRegistro.email} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo-trazambiental.svg"
            alt="TrazAmbiental"
            width={200}
            height={80}
            priority
          />
        </div>

        {/* Título */}
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registro de Generador
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Únete a la plataforma de Gestión de Neumáticos bajo la Ley REP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Indicador de pasos */}
          <StepIndicator currentStep={currentStep} totalSteps={3} stepLabels={STEP_LABELS} />

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
                await submitForm();
              }}
              onBack={prevStep}
              isLoading={isSubmitting}
            />
          )}
        </div>

        {/* Link a login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="font-medium text-green-600 hover:text-green-500">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
