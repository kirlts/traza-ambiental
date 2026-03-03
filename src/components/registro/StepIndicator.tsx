interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Indicador de paso actual */}
      <div className="text-center mb-4">
        <span className="text-sm text-gray-600" data-testid="step-indicator">
          {currentStep}/{totalSteps}
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="flex items-center justify-between mb-4">
        {stepLabels.map((label: ReturnType<typeof JSON.parse>, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Círculo del paso */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isCurrent
                          ? "bg-green-600 text-white ring-4 ring-green-200"
                          : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Label del paso */}
                <span
                  className={`
                    mt-2 text-xs text-center hidden sm:block
                    ${isCurrent ? "text-green-600 font-semibold" : "text-gray-500"}
                  `}
                >
                  {label}
                </span>
              </div>

              {/* Línea conectora (no mostrar después del último paso) */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-1 mx-2">
                  <div
                    className={`
                      h-full rounded transition-all duration-300
                      ${isCompleted ? "bg-green-600" : "bg-gray-200"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra de progreso alternativa para móvil */}
      <div className="sm:hidden">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
