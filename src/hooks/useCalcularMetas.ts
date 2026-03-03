import { useMemo } from "react";

export function useCalcularMetas(anioDeclaracion: number, toneladasDeclaradas: number) {
  const metas = useMemo(() => {
    if (toneladasDeclaradas <= 0) return null;

    const configuracionPorcentajes: Record<number, { recoleccion: number; valorizacion: number }> =
      {
        2024: { recoleccion: 20, valorizacion: 75 },
        2025: { recoleccion: 25, valorizacion: 80 },
        2026: { recoleccion: 30, valorizacion: 85 },
        2027: { recoleccion: 35, valorizacion: 90 },
        2028: { recoleccion: 40, valorizacion: 90 },
        2029: { recoleccion: 45, valorizacion: 95 },
        2030: { recoleccion: 50, valorizacion: 95 },
      };

    const anioMeta = anioDeclaracion + 1;
    const porcentajes = configuracionPorcentajes[anioMeta] || configuracionPorcentajes[2025];

    const metaRecoleccion = (toneladasDeclaradas * porcentajes.recoleccion) / 100;
    const metaValorizacion = (metaRecoleccion * porcentajes.valorizacion) / 100;

    return {
      metaRecoleccion: Number(metaRecoleccion.toFixed(2)),
      metaValorizacion: Number(metaValorizacion.toFixed(2)),
      anioMeta,
      porcentajeRecoleccion: porcentajes.recoleccion,
      porcentajeValorizacion: porcentajes.valorizacion,
    };
  }, [anioDeclaracion, toneladasDeclaradas]);

  return { metas, isLoading: false };
}
