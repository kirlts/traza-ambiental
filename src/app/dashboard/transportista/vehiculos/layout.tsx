import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Gestión de Vehículos - Transportista",
  description: "Administre su flota de transporte",
};

export const viewport: Viewport = {
  themeColor: "#459e60",
};

export default function VehiculosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
