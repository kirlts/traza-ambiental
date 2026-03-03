"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { format } from "date-fns";
import { EstadoSolicitud } from "@prisma/client";

interface Solicitud {
  id: string;
  folio: string;
  direccionRetiro: string;
  region: string;
  comuna: string;
  fechaPreferida: Date;
  pesoTotalEstimado: number;
  cantidadTotal: number;
  estado: EstadoSolicitud;
  generador: {
    id: string;
    name: string;
    email: string;
    rut: string;
  };
}

interface MapaSolicitudesProps {
  solicitudes: Solicitud[];
  onAceptar: (solicitud: ReturnType<typeof JSON.parse>) => void;
  onRechazar: (solicitudId: string, folio: string) => void;
}

// Fix para iconos de Leaflet en Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

export default function MapaSolicitudes({
  solicitudes,
  onAceptar,
  onRechazar,
}: MapaSolicitudesProps) {
  // Centro del mapa (Santiago, Chile por defecto)
  const defaultCenter: [number, number] = [-33.4489, -70.6693];

  // Coordenadas aproximadas por región
  const coordenadasPorRegion: Record<string, [number, number]> = {
    "Región Metropolitana de Santiago": [-33.4489, -70.6693],
    "Región de Valparaíso": [-33.0472, -71.6127],
    "Región del Biobío": [-36.8201, -73.0444],
    "Región de La Araucanía": [-38.7359, -72.5904],
  };

  // Función para generar coordenadas deterministas basadas en el ID
  const obtenerCoordenadas = (solicitud: ReturnType<typeof JSON.parse>, _index: number) => {
    // Generar un offset determinista [0, 1] a partir del ID
    const seed = solicitud.id
      .split("")
      .reduce(
        (acc: ReturnType<typeof JSON.parse>, char: ReturnType<typeof JSON.parse>) =>
          acc + char.charCodeAt(0),
        0
      );
    const getOffset = (multiplier: number) => ((seed * multiplier) % 100) / 100 - 0.5;

    const coords = coordenadasPorRegion[solicitud.region] || defaultCenter;
    const latVariation = solicitud.region ? 0.05 : 2;
    const lngVariation = solicitud.region ? 0.05 : 2;

    return [coords[0] + getOffset(1) * latVariation, coords[1] + getOffset(2) * lngVariation];
  };

  // Icono personalizado para las solicitudes
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="background: #ef4444; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📍</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={defaultCenter} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {solicitudes.map((solicitud: ReturnType<typeof JSON.parse>, index) => {
          const coords = obtenerCoordenadas(solicitud, index) as [number, number];
          return (
            <Marker key={solicitud.id} position={coords} icon={customIcon}>
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-gray-900 mb-2">📍 {solicitud.folio}</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Generador:</span> {solicitud.generador.name}
                    </p>
                    <p>
                      <span className="font-medium">Ubicación:</span> {solicitud.region} -{" "}
                      {solicitud.comuna}
                    </p>
                    <p>
                      <span className="font-medium">Dirección:</span> {solicitud.direccionRetiro}
                    </p>
                    <p>
                      <span className="font-medium">Carga:</span> {solicitud.pesoTotalEstimado} kg |{" "}
                      {solicitud.cantidadTotal} unidades
                    </p>
                    <p>
                      <span className="font-medium">Fecha:</span>{" "}
                      {format(new Date(solicitud.fechaPreferida), "dd/MM/yyyy")}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e: ReturnType<typeof JSON.parse>) => {
                        (e as ReturnType<typeof JSON.parse>).preventDefault();
                        (e as ReturnType<typeof JSON.parse>).stopPropagation();
                        // Pequeño delay para que el popup se cierre primero
                        setTimeout(() => {
                          onAceptar(solicitud);
                        }, 100);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      ✅ Aceptar
                    </button>
                    <button
                      onClick={(e: ReturnType<typeof JSON.parse>) => {
                        (e as ReturnType<typeof JSON.parse>).preventDefault();
                        (e as ReturnType<typeof JSON.parse>).stopPropagation();
                        // Pequeño delay para que el popup se cierre primero
                        setTimeout(() => {
                          onRechazar(solicitud.id, solicitud.folio);
                        }, 100);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
