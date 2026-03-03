"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Map as LMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// Importaciones dinámicas de Leaflet para evitar problemas de SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Fix para iconos de Leaflet en Next.js
if (typeof window !== "undefined") {
  import("leaflet").then((L) => {
    delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  });
}

interface Solicitud {
  id: string;
  folio: string;
  direccionRetiro: string;
  region: string;
  comuna: string;
  generador: {
    name: string;
  };
}

interface MapaSolicitudRutaProps {
  solicitud: Solicitud;
  ubicacionActual: { lat: number; lng: number } | null;
  className?: string;
}

export default function MapaSolicitudRuta({
  solicitud,
  ubicacionActual,
  className,
}: MapaSolicitudRutaProps) {
  const mapRef = useRef<LMap | null>(null);

  // Coordenadas aproximadas de Santiago de Chile (centro por defecto)
  const defaultCenter: [number, number] = [-33.4489, -70.6693];

  // Función para obtener coordenadas aproximadas basadas en la comuna
  const getComunaCoordinates = (
    comuna: string,
    region: ReturnType<typeof JSON.parse>
  ): [number, number] => {
    // Coordenadas aproximadas de comunas comunes en Chile
    const comunasCoords: Record<string, [number, number]> = {
      Santiago: [-33.4489, -70.6693],
      Providencia: [-33.4314, -70.6096],
      "Las Condes": [-33.4189, -70.5931],
      Ñuñoa: [-33.4547, -70.6044],
      "La Reina": [-33.4396, -70.5489],
      Macul: [-33.4846, -70.5983],
      Peñalolén: [-33.4897, -70.5429],
      "La Florida": [-33.5208, -70.595],
      "Puente Alto": [-33.6095, -70.5758],
      Maipú: [-33.5113, -70.757],
      "Estación Central": [-33.4506, -70.6751],
      Quilicura: [-33.3558, -70.7317],
      Renca: [-33.4067, -70.7057],
      "Cerro Navia": [-33.4267, -70.7436],
      "Lo Prado": [-33.4444, -70.7256],
      Pudahuel: [-33.4406, -70.8144],
      "Quinta Normal": [-33.4289, -70.6956],
      Independencia: [-33.4189, -70.6694],
      Conchalí: [-33.3867, -70.6722],
      Huechuraba: [-33.3667, -70.6333],
      Recoleta: [-33.4039, -70.6431],
      Vitacura: [-33.3867, -70.5717],
      "Lo Barnechea": [-33.3467, -70.5167],
      Colina: [-33.1994, -70.6694],
      Lampa: [-33.2833, -70.8833],
      Tiltil: [-33.0833, -70.9333],
      Pirque: [-33.6333, -70.5333],
      "San José de Maipo": [-33.6333, -70.3667],
      "Calera de Tango": [-33.6333, -70.8167],
      Paine: [-33.8167, -70.7333],
      Buin: [-33.7333, -70.7333],
      Talagante: [-33.6667, -70.9333],
      "El Monte": [-33.6667, -71.0167],
      "Isla de Maipo": [-33.75, -70.9],
      "Padre Hurtado": [-33.5667, -70.8167],
      Peñaflor: [-33.6167, -70.8833],
    };

    // Buscar por comuna exacta
    if (comunasCoords[comuna]) {
      return comunasCoords[comuna];
    }

    // Si no encuentra la comuna exacta, buscar por región
    if (
      region.toLowerCase().includes("metropolitana") ||
      region.toLowerCase().includes("santiago")
    ) {
      return [-33.4489, -70.6693]; // Santiago centro
    }

    // Coordenadas por defecto
    return defaultCenter;
  };

  const comunaCoords = getComunaCoordinates(solicitud.comuna, solicitud.region);
  const mapCenter: [number, number] = ubicacionActual
    ? [(comunaCoords[0] + ubicacionActual.lat) / 2, (comunaCoords[1] + ubicacionActual.lng) / 2]
    : comunaCoords;

  const zoomLevel = ubicacionActual ? 12 : 14;

  return (
    <div
      className={`w-full rounded-lg overflow-hidden border border-gray-200 ${className || "h-64"}`}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador de la ubicación de recolección */}
        <Marker position={comunaCoords}>
          <Popup>
            <div className="text-sm">
              <strong>📍 Punto de Recolección</strong>
              <br />
              <span>{solicitud.direccionRetiro}</span>
              <br />
              <span>
                {solicitud.comuna}, {solicitud.region}
              </span>
              <br />
              <small className="text-gray-600">Generador: {solicitud.generador.name}</small>
            </div>
          </Popup>
        </Marker>

        {/* Marcador de la ubicación actual del transportista */}
        {ubicacionActual && (
          <Marker position={[ubicacionActual.lat, ubicacionActual.lng]}>
            <Popup>
              <div className="text-sm">
                <strong>🚚 Tu Ubicación Actual</strong>
                <br />
                <small className="text-gray-600">
                  {ubicacionActual.lat.toFixed(6)}, {ubicacionActual.lng.toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
