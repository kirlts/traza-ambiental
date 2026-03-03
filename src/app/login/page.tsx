"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Usuarios de prueba disponibles
const testUsers = [
  {
    email: "admin@trazambiental.com",
    password: "admin123",
    role: "Administrador",
    icon: "⚙️",
    description: "Acceso completo al sistema",
  },
  {
    email: "generador@trazambiental.com",
    password: "generador123",
    role: "Generador",
    icon: "🏭",
    description: "Productor/importador de neumáticos (Rol Unificado)",
  },
  {
    email: "transportista@trazambiental.com",
    password: "transportista123",
    role: "Transportista",
    icon: "🚛",
    description: "Transporte y logística de NFU",
  },
  {
    email: "gestor@trazambiental.com",
    password: "gestor123",
    role: "Gestor",
    icon: "♻️",
    description: "Valorización y procesamiento",
  },
  {
    email: "especialista@trazambiental.com",
    password: "especialista123",
    role: "Especialista",
    icon: "📊",
    description: "Monitoreo y cumplimiento REP",
  },
  {
    email: "operador@trazambiental.com",
    password: "operador123",
    role: "Operador",
    icon: "👤",
    description: "Operaciones básicas",
  },
  {
    email: "supervisor@trazambiental.com",
    password: "supervisor123",
    role: "Supervisor",
    icon: "👁️",
    description: "Supervisión y reportes",
  },
  {
    email: "auditor@trazambiental.com",
    password: "auditor123",
    role: "Auditor",
    icon: "🔍",
    description: "Auditoría y revisión",
  },
  {
    email: "sistema@trazambiental.com",
    password: "sistema123",
    role: "Sistema de Gestión",
    icon: "📊",
    description: "Dashboard global de cumplimiento REP",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestUsers, setShowTestUsers] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: ReturnType<typeof JSON.parse>) => {
    (e as ReturnType<typeof JSON.parse>).preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales inválidas");
        setIsLoading(false);
      } else if (result?.ok) {
        // Redirección manual después de login exitoso
        router.push("/dashboard");
        router.refresh();
      } else {
        // Si no hay error pero tampoco éxito, asumir credenciales incorrectas
        setError("Credenciales inválidas");
        setIsLoading(false);
      }
    } catch {
      setError("Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  const handleTestUserLogin = (testUser: (typeof testUsers)[0]) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Error al iniciar sesión con Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Image
              src="/logo-trazambiental-hoja.svg"
              alt="TrazAmbiental"
              width={80}
              height={80}
              priority
              className="drop-shadow-lg"
            />
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <Image src="/LogoTexto.svg" alt="TrazAmbiental" width={200} height={50} priority />
        </div>
        <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-center text-base text-gray-700 font-medium">
          Accede a la plataforma de Gestión de Neumáticos bajo la Ley REP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                role="alert"
                data-testid="login-error"
                className="bg-red-50 shadow-sm text-red-800 px-4 py-3 rounded-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    setEmail((e as ReturnType<typeof JSON.parse>).target.value)
                  }
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e: ReturnType<typeof JSON.parse>) =>
                    setPassword((e as ReturnType<typeof JSON.parse>).target.value)
                  }
                  className="block w-full pl-10 pr-3 py-3 bg-gray-50 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-md text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600 font-medium">O continúa con</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center gap-3 py-3 px-4 rounded-lg shadow-sm bg-white text-base font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Crear cuenta nueva
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Panel de usuarios de prueba */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white shadow-xl sm:rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-linear-to-r from-emerald-600 to-emerald-500">
            <button
              onClick={() => setShowTestUsers(!showTestUsers)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧪</span>
                <h3 className="text-lg font-semibold text-white">Usuarios de Prueba</h3>
              </div>
              <svg
                className={`w-5 h-5 text-white transform transition-transform duration-200 ${
                  showTestUsers ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {showTestUsers && (
            <div className="px-6 py-6">
              <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-emerald-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Haz clic en cualquier usuario para autocompletar el formulario:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {testUsers.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => handleTestUserLogin(user)}
                    className="text-left p-4 bg-white shadow-sm rounded-xl hover:shadow-md hover:bg-emerald-50 transition-all group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl shrink-0">{user.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {user.role}
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-0.5">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {user.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-amber-900 font-semibold">Importante</p>
                    <p className="text-xs text-amber-800 mt-1">
                      Estos usuarios son solo para pruebas y desarrollo. Todas las contraseñas
                      siguen el patrón:{" "}
                      <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 font-semibold">
                        rol123
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
