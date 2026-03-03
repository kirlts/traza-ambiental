import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role) => ["Sistema de Gestión", "Productor"].includes(role));
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());
    const periodo = searchParams.get("periodo") || "anio";
    const region = searchParams.get("region") || "todas";
    const tratamiento = searchParams.get("tratamiento") || "todos";
    const gestor = searchParams.get("gestor") || "todos";

    // Construir filtros de fecha
    const fechaInicio = new Date(anio, 0, 1);
    const fechaFin =
      periodo === "trimestre"
        ? new Date(anio, 2, 31)
        : periodo === "mes"
          ? new Date(anio, new Date().getMonth(), 31)
          : new Date(anio, 11, 31);

    // Construir where clause
    const whereClause: import("@prisma/client").Prisma.CertificadoWhereInput = {
      estado: "emitido",
      fechaEmision: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    // Filtrar por región si se especifica
    if (region !== "todas") {
      const regionNormalizada = region.toLowerCase();
      whereClause.solicitud = {
        region: {
          contains: regionNormalizada,
          mode: "insensitive",
        },
      };
    }

    // Filtrar por gestor
    let gestorIdFiltro: string | undefined = undefined;
    if (gestor !== "todos") {
      try {
        if (gestor.length > 20) {
          // Assuming valid IDs are longer
          gestorIdFiltro = gestor;
        } else {
          // Intentar mapear códigos de gestor a nombres
          const mapeoGestores: { [key: string]: string } = {
            gestor1: "EcoNeum S.A.",
            gestor2: "Gestión NFU SpA",
            gestor3: "ReciclaChile Ltda.",
          };
          const nombreGestor = mapeoGestores[gestor.toLowerCase()];
          if (nombreGestor) {
            const gestorEncontrado = await prisma.user.findFirst({
              where: {
                name: {
                  contains: nombreGestor,
                  mode: "insensitive",
                },
              },
              select: { id: true },
            });
            if (gestorEncontrado) {
              gestorIdFiltro = gestorEncontrado.id;
            }
          }
        }
        if (gestorIdFiltro) {
          whereClause.gestorId = gestorIdFiltro;
        }
      } catch (e: unknown) {
        console.warn("Filtro de gestor inválido o no encontrado:", gestor, e);
      }
    }

    // Obtener certificados agrupados por tratamiento
    const certificados = await prisma.certificado.findMany({
      where: whereClause,
      select: {
        tratamientos: true,
        pesoValorizado: true,
      },
    });

    // Agrupar por tratamiento
    const tratamientosMap: { [key: string]: number } = {};

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      // Procesar tratamientos (JSON array)
      const tratamientos = Array.isArray(cert.tratamientos) ? cert.tratamientos : [];

      if (tratamientos.length > 0) {
        tratamientos.forEach((tratDoc: ReturnType<typeof JSON.parse>) => {
          const trat = tratDoc as { tipo?: string; tipoTratamiento?: string; peso?: number };
          const tipoTratamiento = trat.tipo || trat.tipoTratamiento || "RECICLAJE_MATERIAL";
          const pesoTratamientoKg = trat.peso || cert.pesoValorizado || 0;
          const pesoTratamientoTon = pesoTratamientoKg / 1000; // Convertir kg a toneladas

          // Normalizar nombre del tratamiento
          const tipoStr = (tipoTratamiento || "").toString().trim();
          const tipoNormalizado = tipoStr.toUpperCase();
          const tipoLower = tipoStr.toLowerCase();

          // Primero verificar por coincidencias exactas (case-insensitive)
          let nombreTratamiento = "Sin especificar";

          // Mapeo completo de variaciones conocidas
          const tratamientoNombres: { [key: string]: string } = {
            // Reciclaje
            reciclaje_material: "Reciclaje",
            reciclaje: "Reciclaje",
            RECICLAJE_MATERIAL: "Reciclaje",
            RECICLAJE: "Reciclaje",
            // Recauchaje
            recauchaje: "Recauchaje",
            RECAUCHAJE: "Recauchaje",
            // Co-procesamiento
            coprocesamiento: "Co-procesamiento",
            "co-procesamiento": "Co-procesamiento",
            COPROCESAMIENTO: "Co-procesamiento",
            "CO-PROCESAMIENTO": "Co-procesamiento",
            // Valorización energética
            valorizacion_energetica: "Valorización Energética",
            valorización_energética: "Valorización Energética",
            VALORIZACION_ENERGETICA: "Valorización Energética",
            VALORIZACIÓN_ENERGÉTICA: "Valorización Energética",
          };

          // Buscar por coincidencia exacta (case-insensitive)
          nombreTratamiento =
            tratamientoNombres[tipoStr] ||
            tratamientoNombres[tipoNormalizado] ||
            tratamientoNombres[tipoLower] ||
            "Sin especificar";

          // Si aún no se encontró, buscar por contenido (más flexible)
          if (nombreTratamiento === "Sin especificar") {
            if (tipoNormalizado.includes("RECICLAJE") || tipoNormalizado.includes("RECICL")) {
              nombreTratamiento = "Reciclaje";
            } else if (
              tipoNormalizado.includes("RECAUCHAJE") ||
              tipoNormalizado.includes("RECAUCH")
            ) {
              nombreTratamiento = "Recauchaje";
            } else if (
              tipoNormalizado.includes("COPROCES") ||
              tipoNormalizado.includes("CO-PROCES")
            ) {
              nombreTratamiento = "Co-procesamiento";
            } else if (
              tipoNormalizado.includes("VALORIZACION") ||
              tipoNormalizado.includes("ENERGETICA") ||
              tipoNormalizado.includes("ENERGÉTICA")
            ) {
              nombreTratamiento = "Valorización Energética";
            }
          }

          // Aplicar filtro si está especificado
          if (
            tratamiento === "todos" ||
            nombreTratamiento.toLowerCase() === tratamiento.toLowerCase()
          ) {
            tratamientosMap[nombreTratamiento] =
              (tratamientosMap[nombreTratamiento] || 0) + pesoTratamientoTon;
          }
        });
      } else {
        // Si no hay tratamientos específicos, usar el peso total
        if (tratamiento === "todos") {
          const pesoTotalKg = cert.pesoValorizado || 0;
          const pesoTotalTon = pesoTotalKg / 1000; // Convertir kg a toneladas
          tratamientosMap["Sin especificar"] =
            (tratamientosMap["Sin especificar"] || 0) + pesoTotalTon;
        }
      }
    });

    // Calcular total y porcentajes
    const totalToneladas = Object.values(tratamientosMap).reduce((sum, peso) => sum + peso, 0);

    // Definir colores para tratamientos
    const coloresTratamientos: { [key: string]: string } = {
      Reciclaje: "#3B82F6",
      Recauchaje: "#10B981",
      "Co-procesamiento": "#F59E0B",
      "Valorización Energética": "#EF4444",
      "Sin especificar": "#6B7280",
    };

    // Crear array de tratamientos con porcentajes
    const tratamientos = Object.entries(tratamientosMap)
      .map(([tipo, toneladas]) => ({
        tipo,
        toneladas: Number(toneladas.toFixed(2)),
        porcentaje:
          totalToneladas > 0 ? Number(((toneladas / totalToneladas) * 100).toFixed(1)) : 0,
        color: coloresTratamientos[tipo] || "#6B7280",
      }))
      .sort(
        (a: ReturnType<typeof JSON.parse>, b: ReturnType<typeof JSON.parse>) =>
          b.toneladas - a.toneladas
      ); // Ordenar por toneladas descendente

    return NextResponse.json({
      tratamientos,
    });
  } catch (error: unknown) {
    console.error("Error en /api/dashboard/distribucion-tratamientos:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
