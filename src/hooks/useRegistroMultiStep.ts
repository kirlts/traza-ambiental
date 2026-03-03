import { useState } from "react";
import type {
  EmpresaFormData,
  RepresentanteFormData,
  CredencialesFormData,
} from "@/lib/validations/registro-generador";

export type FormData = Partial<EmpresaFormData> &
  Partial<RepresentanteFormData> &
  Partial<CredencialesFormData>;

export type Step = 1 | 2 | 3;

interface UseRegistroMultiStepReturn {
  currentStep: Step;
  formData: FormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  setFormData: (data: ReturnType<typeof JSON.parse>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: Step) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  submitForm: (finalData?: Partial<FormData>) => Promise<void>;
  setIsSubmitting: (value: boolean) => void;
}

export function useRegistroMultiStep(
  onSubmit: (data: ReturnType<typeof JSON.parse>) => Promise<void>
): UseRegistroMultiStepReturn {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormDataState] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFormData = (data: ReturnType<typeof JSON.parse>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
    // Limpiar errores cuando el usuario modifica los datos
    clearErrors();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearErrors = () => {
    setErrors({});
  };

  const submitForm = async (finalData?: Partial<FormData>) => {
    setIsSubmitting(true);
    clearErrors();
    try {
      const dataToSubmit = { ...formData, ...finalData };
      await onSubmit(dataToSubmit);
    } catch (error: unknown) {
      console.error("Error en submitForm:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    setFormData,
    nextStep,
    prevStep,
    goToStep,
    setErrors,
    clearErrors,
    submitForm,
    setIsSubmitting,
  };
}
