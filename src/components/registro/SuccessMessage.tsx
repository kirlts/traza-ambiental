import Link from "next/link";

interface SuccessMessageProps {
  razonSocial: string;
  email: string;
}

export default function SuccessMessage({ razonSocial, email }: SuccessMessageProps) {
  return (
    <div className="text-center space-y-6 py-8" data-testid="success-message">
      {/* Icono de éxito */}
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-6">
          <svg
            className="w-16 h-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Título */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Registro Exitoso</h2>
      </div>

      {/* Mensaje principal */}
      <div className="space-y-4 max-w-lg mx-auto">
        <p className="text-lg text-gray-700">
          Tu solicitud de registro para <span className="font-semibold">{razonSocial}</span> ha sido
          creada exitosamente.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Próximos pasos:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Tu cuenta está pendiente de aprobación</li>
            <li>Nuestro equipo revisará la información</li>
            <li>Recibirás un email cuando tu cuenta sea aprobada</li>
            <li>Podrás iniciar sesión una vez aprobada</li>
          </ol>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-700">Email de confirmación enviado a:</p>
              <p className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded mt-1">
                {email}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⏱️ Tiempo estimado de revisión:</span>
            <br />
            24 a 48 horas hábiles
          </p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="pt-4 space-y-2">
        <p className="text-sm text-gray-600">
          Si tienes alguna pregunta, no dudes en contactarnos.
        </p>
      </div>

      {/* Botón de acción */}
      <div className="pt-6">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Volver al Inicio
        </Link>
      </div>

      {/* Link alternativo */}
      <div>
        <Link href="/login" className="text-sm text-green-600 hover:text-green-500">
          ¿Ya tienes una cuenta aprobada? Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}
