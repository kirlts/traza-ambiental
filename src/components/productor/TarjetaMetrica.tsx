import { ReactNode } from "react";

interface TarjetaMetricaProps {
  titulo: string;
  valor: string | number;
  subtexto?: string;
  icono: ReactNode;
  colorIcono?: string;
  tendencia?: {
    valor: number;
    esPositiva: boolean;
  };
  onClick?: () => void;
}

export default function TarjetaMetrica({
  titulo,
  valor,
  subtexto,
  icono,
  colorIcono = "bg-blue-100 text-blue-600",
  tendencia,
  onClick,
}: TarjetaMetricaProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      className={`bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 ${
        onClick ? "hover:shadow-md transition-shadow cursor-pointer" : ""
      }`}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`flex items-center justify-center h-12 w-12 rounded-md ${colorIcono}`}>
              {icono}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-600 truncate">{titulo}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-slate-900">{valor}</div>
                {subtexto && <div className="ml-2 text-sm text-slate-500">{subtexto}</div>}
              </dd>
              {tendencia && (
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-baseline text-sm font-semibold ${
                      tendencia.esPositiva ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tendencia.esPositiva ? (
                      <svg
                        className="self-center flex-shrink-0 h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="self-center flex-shrink-0 h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                    {Math.abs(tendencia.valor)}%
                  </span>
                  <span className="ml-1 text-sm text-slate-500">vs. año anterior</span>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
