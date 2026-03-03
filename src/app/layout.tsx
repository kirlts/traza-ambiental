import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import QueryProvider from "@/providers/QueryProvider";
import { PWARegister } from "@/components/PWARegister";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "TrazAmbiental - Gestión REP de Productos Prioritarios en Chile | Ley 20.920",
  description:
    "Plataforma digital líder para la gestión integral de productos prioritarios bajo la Ley REP Chile: Neumáticos, Envases, Aceites, RAEE, Pilas, Baterías y Textiles. Cumple con la Responsabilidad Extendida del Productor.",
  keywords:
    "ley rep chile, productos prioritarios rep, neumáticos fuera de uso, envases y embalajes, aceites lubricantes usados, aparatos eléctricos electrónicos, pilas baterías, gestión residuos, economía circular, trazabilidad, responsabilidad extendida productor, ministerio medio ambiente, valorización residuos, reciclaje chile, gestión ambiental",
  authors: [{ name: "TrazAmbiental" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TrazAmbiental - Gestión REP de Productos Prioritarios en Chile",
    description:
      "Plataforma digital para cumplir con la Ley REP Chile. Gestiona neumáticos, envases, aceites, RAEE, pilas, baterías y textiles de manera eficiente.",
    type: "website",
    locale: "es_CL",
    siteName: "TrazAmbiental",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrazAmbiental - Gestión REP Chile",
    description: "Gestión integral de productos prioritarios bajo la Ley REP",
  },
  alternates: {
    canonical: "https://traza-ambiental.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <QueryProvider>
            {children}
            <PWARegister />
            <Toaster position="top-right" richColors />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
