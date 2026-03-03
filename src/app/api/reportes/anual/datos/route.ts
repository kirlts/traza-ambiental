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

    // Verificar permisos - Solo sistema_gestion y productor
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role) => ["Sistema de Gestión", "Productor"].includes(role));
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());

    // Validar que el año sea válido
    if (isNaN(anio) || anio < 2000 || anio > 2100) {
      return NextResponse.json({ error: "Año inválido" }, { status: 400 });
    }

    // Determinar sistemaGestionId según el rol
    let sistemaGestionId: string;
    if (userRoles.includes("Sistema de Gestión")) {
      sistemaGestionId = session.user.id;
    } else if (userRoles.includes("Productor")) {
      sistemaGestionId = session.user.id;
    } else {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    // Validar que el año esté finalizado o sea el año actual (permitir reportes del año actual)
    const _anioActual = new Date().getFullYear();
    const fechaInicio = new Date(anio, 0, 1);
    const fechaFin = new Date(anio, 11, 31, 23, 59, 59);

    // Obtener certificados del año
    const certificados = await prisma.certificado.findMany({
      where: {
        estado: "emitido",
        fechaEmision: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        sistemaGestionId,
      },
      include: {
        solicitud: {
          include: {
            generador: {
              select: {
                id: true,
                name: true,
                rut: true,
              },
            },
            gestor: {
              select: {
                id: true,
                name: true,
                rut: true,
              },
            },
          },
        },
        gestor: {
          select: {
            id: true,
            name: true,
            rut: true,
          },
        },
      },
    });

    // Obtener metas del año
    // Las metas pueden tener sistemaGestionId o productorId
    const metas = await prisma.meta.findMany({
      where: {
        anio,
        OR: [{ sistemaGestionId }, { productorId: sistemaGestionId }],
      },
    });

    const metaRecoleccion =
      metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "recoleccion")?.metaToneladas ||
      0;
    const metaValorizacion =
      metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "valorizacion")?.metaToneladas ||
      0;

    // Convertir kg a toneladas
    const totalToneladas = certificados.reduce((sum, cert: ReturnType<typeof JSON.parse>) => {
      return sum + cert.pesoValorizado / 1000;
    }, 0);

    const totalCertificados = certificados.length;

    // Desglose por categoría
    const categoriasMap = new Map<string, { cantidad: number; peso: number }>();

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      cert.categorias.forEach((categoria: string) => {
        const cat = categoria.toUpperCase();
        const current = categoriasMap.get(cat) || { cantidad: 0, peso: 0 };
        categoriasMap.set(cat, {
          cantidad: current.cantidad + cert.cantidadUnidades,
          peso: current.peso + cert.pesoValorizado / 1000,
        });
      });
    });

    const desgloseCategoria = Array.from(categoriasMap.entries()).map(([tipo, data]) => ({
      tipo: tipo.charAt(0) + tipo.slice(1).toLowerCase(),
      cantidad: data.cantidad,
      peso: Math.round(data.peso * 100) / 100,
    }));

    // Desglose por tratamiento
    const desgloseTratamiento: {
      tipo: string;
      cantidad: number;
      peso: number;
      porcentaje: number;
    }[] = [];
    const tratamientosMap = new Map<string, { cantidad: number; peso: number }>();

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      const tratamientos =
        (cert.tratamientos as { tipo?: string; tipoTratamiento?: string; peso?: number }[]) || [];
      tratamientos.forEach((trat: ReturnType<typeof JSON.parse>) => {
        const tipoTratamiento = trat.tipo || trat.tipoTratamiento || "RECICLAJE_MATERIAL";
        const pesoTratamientoKg = trat.peso || cert.pesoValorizado || 0;
        const pesoTratamientoTon = pesoTratamientoKg / 1000;

        // Normalizar nombre del tratamiento
        const tipoNormalizado = tipoTratamiento.toString().toUpperCase().trim();
        let nombreTratamiento = "Sin especificar";

        if (tipoNormalizado.includes("RECICLAJE") || tipoNormalizado.includes("RECICL")) {
          nombreTratamiento = "Reciclaje";
        } else if (tipoNormalizado.includes("RECAUCHAJE") || tipoNormalizado.includes("RECAUCH")) {
          nombreTratamiento = "Recauchaje";
        } else if (tipoNormalizado.includes("COPROCES") || tipoNormalizado.includes("CO-PROCES")) {
          nombreTratamiento = "Co-procesamiento";
        } else if (
          tipoNormalizado.includes("VALORIZACION") ||
          tipoNormalizado.includes("ENERGETICA") ||
          tipoNormalizado.includes("ENERGÉTICA")
        ) {
          nombreTratamiento = "Valorización Energética";
        }

        const current = tratamientosMap.get(nombreTratamiento) || { cantidad: 0, peso: 0 };
        tratamientosMap.set(nombreTratamiento, {
          cantidad: current.cantidad + cert.cantidadUnidades,
          peso: current.peso + pesoTratamientoTon,
        });
      });
    });

    tratamientosMap.forEach((data: ReturnType<typeof JSON.parse>, tipo) => {
      desgloseTratamiento.push({
        tipo,
        cantidad: data.cantidad,
        peso: data.peso,
        porcentaje: totalToneladas > 0 ? (data.peso / totalToneladas) * 100 : 0,
      });
    });

    // Desglose por región
    const desgloseRegion: { region: string; cantidad: number; peso: number }[] = [];
    const regionesMap = new Map<string, { cantidad: number; peso: number }>();

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      const region = cert.solicitud?.region || "Sin especificar";
      const current = regionesMap.get(region) || { cantidad: 0, peso: 0 };
      regionesMap.set(region, {
        cantidad: current.cantidad + cert.cantidadUnidades,
        peso: current.peso + cert.pesoValorizado / 1000,
      });
    });

    regionesMap.forEach(
      (data: ReturnType<typeof JSON.parse>, region: ReturnType<typeof JSON.parse>) => {
        desgloseRegion.push({
          region,
          cantidad: data.cantidad,
          peso: data.peso,
        });
      }
    );

    // Listado de gestores participantes
    const gestoresMap = new Map<
      string,
      { rut: string; nombre: string; certificados: number; toneladas: number }
    >();

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      const gestor = cert.gestor || cert.solicitud?.gestor;
      if (gestor) {
        const gestorId = gestor.id;
        const current = gestoresMap.get(gestorId) || {
          rut: gestor.rut || "",
          nombre: gestor.name || "Sin nombre",
          certificados: 0,
          toneladas: 0,
        };
        gestoresMap.set(gestorId, {
          ...current,
          certificados: current.certificados + 1,
          toneladas: current.toneladas + cert.pesoValorizado / 1000,
        });
      }
    });

    const gestores = Array.from(gestoresMap.values());

    // Total de generadores únicos atendidos
    const generadoresUnicos = new Set(
      certificados
        .map((cert: ReturnType<typeof JSON.parse>) => cert.solicitud?.generadorId)
        .filter(Boolean)
    );

    // Estadísticas adicionales
    const certificadosPorMes = certificados.reduce(
      (acc, cert: ReturnType<typeof JSON.parse>) => {
        const mes = new Date(cert.fechaEmision).getMonth() + 1;
        acc[mes] = (acc[mes] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const promedioMensual = totalToneladas / 12;
    const mesesActivos = Object.keys(certificadosPorMes).length;

    // Resumen ejecutivo mejorado
    const resumenEjecutivo = {
      metaRecoleccion,
      pesoRecolectado: totalToneladas,
      porcentajeRecoleccion:
        metaRecoleccion > 0 ? Math.min(100, (totalToneladas / metaRecoleccion) * 100) : 0,
      metaValorizacion,
      pesoValorizado: totalToneladas,
      porcentajeValorizacion:
        metaValorizacion > 0 ? Math.min(100, (totalToneladas / metaValorizacion) * 100) : 0,
      cumplido: totalToneladas >= metaValorizacion,
      // Métricas adicionales
      promedioMensual: Math.round(promedioMensual * 100) / 100,
      mesesActivos,
      certificadosPorMes,
      eficiencia: mesesActivos > 0 ? totalToneladas / mesesActivos : 0,
    };

    return NextResponse.json({
      resumenEjecutivo,
      desgloseCategoria,
      desgloseTratamiento,
      desgloseRegion,
      gestores,
      totalGeneradores: generadoresUnicos.size,
      totalCertificados,
    });
  } catch (error: unknown) {
    console.error("Error en /api/reportes/anual/datos:", error);
    const message =
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message,
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
