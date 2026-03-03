"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RoleSelector from "@/components/registro/RoleSelector";
import GeneradorFlow from "@/components/registro/GeneradorFlow";
import TransportistaForm from "@/components/registro/TransportistaForm";
import GestorForm from "@/components/registro/GestorForm";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<"generador" | "transportista" | "gestor" | null>(
    null
  );

  const renderContent = () => {
    switch (selectedRole) {
      case "generador":
        return <GeneradorFlow onBack={() => setSelectedRole(null)} />;
      case "transportista":
        return <TransportistaForm onBack={() => setSelectedRole(null)} />;
      case "gestor":
        return <GestorForm onBack={() => setSelectedRole(null)} />;
      default:
        return <RoleSelector onSelect={setSelectedRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-trazambiental-hoja.svg"
            alt="TrazAmbiental"
            width={60}
            height={60}
            priority
            className="drop-shadow-lg"
          />
        </div>
        <div className="flex justify-center mb-6">
          <Image src="/LogoTexto.svg" alt="TrazAmbiental" width={200} height={50} priority />
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`mt-8 sm:mx-auto ${selectedRole ? "sm:max-w-2xl" : "sm:max-w-5xl"}`}>
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 transition-all duration-300">
          {renderContent()}

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
