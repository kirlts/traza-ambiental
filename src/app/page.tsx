"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Truck,
  BarChart3,
  Shield,
  FileCheck,
  Users,
  Recycle,
  Package,
  Droplet,
  Cpu,
  Battery,
  BatteryCharging,
  Shirt,
} from "lucide-react";

export default function Home() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = useMemo(
    () => [
      "Neumáticos fuera de uso (NFU)",
      "Envases y embalajes",
      "Aceites lubricantes usados",
      "Aparatos eléctricos y electrónicos (AEE)",
      "Pilas",
      "Baterías",
      "Textiles",
    ],
    []
  );

  useEffect(() => {
    const currentCategory = categories[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Escribiendo
          if (currentText.length < currentCategory.length) {
            setCurrentText(currentCategory.substring(0, currentText.length + 1));
          } else {
            // Esperar antes de empezar a borrar
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          // Borrando
          if (currentText.length > 0) {
            setCurrentText(currentText.substring(0, currentText.length - 1));
          } else {
            // Pasar a la siguiente categoría
            setIsDeleting(false);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
          }
        }
      },
      isDeleting ? 50 : 100
    ); // Más rápido al borrar que al escribir

    return () => clearTimeout(timeout);
  }, [categories, currentText, currentIndex, isDeleting]);

  return (
    <>
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "TrazAmbiental",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description:
              "Plataforma digital líder para la gestión integral de productos prioritarios bajo la Ley REP Chile: Neumáticos, Envases, Aceites, RAEE, Pilas, Baterías y Textiles",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "CLP",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "100",
            },
            featureList: [
              "Gestión de Neumáticos fuera de uso (NFU)",
              "Gestión de Envases y embalajes",
              "Gestión de Aceites lubricantes usados",
              "Gestión de Aparatos eléctricos y electrónicos (AEE)",
              "Gestión de Pilas",
              "Gestión de Baterías",
              "Gestión de Textiles",
              "Trazabilidad completa",
              "Cumplimiento Ley REP Chile",
              "Certificación digital",
              "Reportes automáticos",
            ],
            provider: {
              "@type": "Organization",
              name: "TrazAmbiental",
              areaServed: "CL",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "TrazAmbiental - Gestión REP de Productos Prioritarios en Chile",
            description:
              "Plataforma digital para cumplir con la Ley 20.920 de Responsabilidad Extendida del Productor",
            keywords:
              "ley rep chile, productos prioritarios, neumáticos, envases, aceites, RAEE, pilas, baterías, textiles, economía circular",
            inLanguage: "es-CL",
            about: {
              "@type": "Thing",
              name: "Ley REP Chile",
              description:
                "Ley 20.920 de Responsabilidad Extendida del Productor y Fomento al Reciclaje",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50">
        {/* Header/Navigation */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image src="/LogoTexto.svg" alt="TrazAmbiental" width={180} height={45} priority />
              </div>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-6 py-2 text-emerald-700 hover:text-emerald-800 font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-all hover:shadow-lg"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-500/5 to-blue-500/5"></div>
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 animate-pulse"></div>
                  <Image
                    src="/logo-trazambiental-hoja.svg"
                    alt="TrazAmbiental Logo"
                    width={180}
                    height={180}
                    priority
                    className="drop-shadow-2xl relative z-10 animate-float"
                  />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Gestión Inteligente de
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-blue-600 min-h-[1.2em]">
                  {currentText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                Plataforma digital para la trazabilidad completa del ciclo de vida de productos
                prioritarios bajo la Ley REP Chile
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold text-lg transition-all hover:shadow-2xl hover:scale-105"
                >
                  Comenzar Ahora
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white text-emerald-700 rounded-xl hover:bg-gray-50 font-semibold text-lg transition-all border-2 border-emerald-600 hover:shadow-xl"
                >
                  Iniciar Sesión
                </Link>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/demo"
                  className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 ease-in-out bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl overflow-hidden hover:scale-105 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)]"
                >
                  <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[30deg] group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Explorar Demo Interactivo
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas para cumplir con la Ley REP
              </h2>
              <p className="text-xl text-gray-600">
                Solución integral para generadores, transportistas y gestores
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <FileCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Solicitudes de Retiro</h3>
                <p className="text-gray-600">
                  Crea y gestiona solicitudes de retiro de productos prioritarios de forma rápida y
                  eficiente con validación automática.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Truck className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Transporte</h3>
                <p className="text-gray-600">
                  Optimiza rutas, asigna vehículos y realiza seguimiento en tiempo real de todas las
                  entregas.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reportes y Estadísticas</h3>
                <p className="text-gray-600">
                  Genera informes de cumplimiento automáticos y visualiza métricas en tiempo real
                  para tomar decisiones.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Certificación Digital</h3>
                <p className="text-gray-600">
                  Obtén certificados digitales automáticos que validan el correcto tratamiento y
                  disposición final.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-7 h-7 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Trazabilidad Completa</h3>
                <p className="text-gray-600">
                  Sigue cada producto desde su generación hasta su disposición final con total
                  transparencia.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Múltiples Roles</h3>
                <p className="text-gray-600">
                  Sistema de roles completo: generadores (productores), transportistas, gestores y
                  administradores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ley REP Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Qué es la Ley REP de Chile?
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                La <strong>Ley 20.920</strong> de{" "}
                <strong>Responsabilidad Extendida del Productor (REP)</strong> establece que los
                productores e importadores de ciertos productos prioritarios deben financiar y
                organizar la gestión de los residuos que resultan al término de su vida útil.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Principios Fundamentales</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Jerarquía de residuos:</strong> Evitar generación → Reutilizar →
                      Reciclar/Valorar → Eliminar
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Responsabilidad del productor:</strong> Financiar y organizar la
                      gestión de residuos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Economía circular:</strong> Maximizar la valorización y reciclaje de
                      materiales
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Actores Involucrados</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Productores e importadores:</strong> Obligados a cumplir metas de
                      recolección
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Gestores:</strong> Empresas autorizadas para valorización y
                      tratamiento
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Transportistas:</strong> Logística y traslado de residuos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Generadores:</strong> Empresas y consumidores que desechan productos
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-linear-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <p className="text-xl font-semibold mb-4">
                La Ley REP establece <strong>metas de recolección y valorización</strong> para cada
                producto prioritario mediante decretos supremos del Ministerio del Medio Ambiente
              </p>
              <p className="text-lg opacity-90">
                TrazAmbiental te ayuda a cumplir con todas las obligaciones legales de forma simple
                y eficiente
              </p>
            </div>
          </div>
        </section>

        {/* Productos Prioritarios Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Productos Prioritarios bajo la Ley REP
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Gestiona eficientemente los 7 productos prioritarios definidos por el Ministerio del
                Medio Ambiente de Chile
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Neumáticos */}
              <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Neumáticos Fuera de Uso (NFU)
                </h3>
                <p className="text-gray-600 text-sm">
                  Neumáticos que ya no sirven para su uso original. Los productores/importadores
                  deben organizar su recolección, valorización o reciclaje bajo esquemas de economía
                  circular.
                </p>
              </div>

              {/* Envases y embalajes */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Envases y Embalajes</h3>
                <p className="text-gray-600 text-sm">
                  Todo envase de cartón, papel, plástico, metal, vidrio u otros materiales. Los
                  residuos generados al final de su vida útil están sujetos a la ley de
                  responsabilidad extendida.
                </p>
              </div>

              {/* Aceites */}
              <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aceites Lubricantes Usados</h3>
                <p className="text-gray-600 text-sm">
                  Aceites utilizados en motores y mecanismos que al terminar su vida útil se
                  convierten en residuos potencialmente contaminantes que requieren gestión
                  especializada.
                </p>
              </div>

              {/* RAEE */}
              <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Aparatos Eléctricos y Electrónicos (AEE)
                </h3>
                <p className="text-gray-600 text-sm">
                  Electrodomésticos, computadoras, teléfonos y equipos electrónicos. Al terminar su
                  vida útil se convierten en RAEE y requieren gestión especial de valorización.
                </p>
              </div>

              {/* Pilas */}
              <div className="bg-linear-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Battery className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pilas</h3>
                <p className="text-gray-600 text-sm">
                  Elementos de energía portátiles que al agotarse generan residuos con componentes
                  potencialmente peligrosos que deben ser gestionados adecuadamente.
                </p>
              </div>

              {/* Baterías */}
              <div className="bg-linear-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                  <BatteryCharging className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Baterías</h3>
                <p className="text-gray-600 text-sm">
                  Baterías industriales, automotrices y de otros usos que contienen metales pesados
                  o componentes peligrosos que requieren tratamiento especializado.
                </p>
              </div>

              {/* Textiles */}
              <div className="bg-linear-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Textiles</h3>
                <p className="text-gray-600 text-sm">
                  Categoría en evaluación para incorporarse como producto prioritario. Incluye ropa,
                  telas y otros materiales textiles que pueden ser reutilizados o reciclados.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Cumplimiento Normativo Garantizado
              </h4>
              <p className="text-gray-700">
                Cada producto prioritario cuenta con <strong>decretos supremos específicos</strong>{" "}
                que establecen metas de recolección y valorización. TrazAmbiental está diseñado para
                ayudarte a cumplir con todas las obligaciones establecidas por el Ministerio del
                Medio Ambiente de Chile, garantizando trazabilidad completa desde la generación
                hasta la disposición final.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-linear-to-br from-emerald-600 to-blue-600 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">¿Por qué elegir TrazAmbiental?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                      <span className="text-lg">
                        Cumplimiento garantizado con la normativa REP chilena
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                      <span className="text-lg">
                        Ahorra tiempo con procesos automatizados y digitales
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                      <span className="text-lg">Reducción de costos operativos hasta un 40%</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                      <span className="text-lg">
                        Soporte técnico especializado y capacitación incluida
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0 mt-1" />
                      <span className="text-lg">
                        Interfaz intuitiva diseñada para todos los usuarios
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">19+</div>
                    <div className="text-xl mb-8">Módulos Implementados</div>
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div>
                        <div className="text-4xl font-bold">100%</div>
                        <div className="text-sm opacity-90">Trazabilidad</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold">24/7</div>
                        <div className="text-sm opacity-90">Disponibilidad</div>
                      </div>
                      <div>
                        <div className="text-4xl font-bold">6+</div>
                        <div className="text-sm opacity-90">Roles</div>
                      </div>
                    </div>
                    <Link
                      href="/register"
                      className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-100 font-bold text-lg transition-all hover:shadow-xl"
                    >
                      Solicitar Demo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comienza a gestionar tus productos prioritarios hoy mismo
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Únete a la plataforma líder en gestión REP de productos prioritarios en Chile
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-10 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-lg transition-all hover:shadow-2xl hover:scale-105"
              >
                Crear Cuenta Gratis
              </Link>
              <Link
                href="/login"
                className="px-10 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-lg transition-all border-2 border-gray-300 hover:shadow-xl"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-trazambiental-hoja.svg"
                  alt="TrazAmbiental"
                  width={40}
                  height={40}
                />
                <div>
                  <div className="font-bold text-lg">TrazAmbiental</div>
                  <div className="text-sm text-gray-400">Gestión REP Chile</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400">
                  © 2025 TrazAmbiental. Todos los derechos reservados.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Plataforma de Gestión de Productos Prioritarios - Ley REP Chile
                </p>
              </div>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes shimmer {
            100% {
              transform: translateX(150%) skewX(30deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}
