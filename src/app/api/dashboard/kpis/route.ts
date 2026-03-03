import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { type DashboardKPIs, type TratamientoJSON } from "@/types/api";
import { type Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());
    const periodo = searchParams.get("periodo") || "anio";
    const region = searchParams.get("region") || "todas";
    const tratamiento = searchParams.get("tratamiento") || "todos";
    const gestor = searchParams.get("gestor") || "todos";

    // Verificar permisos según los roles del usuario
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role) => ["Sistema de Gestión", "Productor"].includes(role));
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    // Construir filtros de fecha según período
    const fechaInicio = new Date(anio, 0, 1); // 1 de enero del año
    const fechaFin =
      periodo === "trimestre"
        ? new Date(anio, 2, 31) // 31 de marzo (último trimestre)
        : periodo === "mes"
          ? new Date(anio, new Date().getMonth(), 31) // Último día del mes actual
          : new Date(anio, 11, 31); // 31 de diciembre

    // Construir where clause para filtros
    const whereClause: Prisma.CertificadoWhereInput = {
      estado: "emitido",
      fechaEmision: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    // Filtrar por región si se especifica
    if (region !== "todas") {
      // Filtrar por región en la solicitud relacionada
      // Normalizar nombre de región para comparación
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
      // Los valores de gestor vienen como 'gestor1', 'gestor2', etc.
      // o pueden ser IDs válidos
      try {
        // Si es un ID válido (UUID o cuid, generalmente > 20 caracteres)
        if (gestor.length > 20) {
          gestorIdFiltro = gestor;
        } else {
          // Si es un código como 'gestor1', buscar gestores por nombre
          // Mapeo de códigos a nombres de gestores
          const mapeoGestores: { [key: string]: string } = {
            gestor1: "EcoNeum S.A.",
            gestor2: "Gestión NFU SpA",
            gestor3: "ReciclaChile Ltda.",
          };

          const nombreGestor = mapeoGestores[gestor.toLowerCase()];
          if (nombreGestor) {
            // Buscar gestor por nombre
            // Nota: roles puede ser un array o un campo diferente según el schema
            const gestorEncontrado = await prisma.user.findFirst({
              where: {
                name: {
                  contains: nombreGestor,
                  mode: "insensitive",
                },
                // Si roles es un array en el schema, usar: roles: { has: 'Gestor' }
                // Si roles es un campo string, usar: roles: { contains: 'Gestor' }
              },
              select: {
                id: true,
              },
            });

            if (gestorEncontrado) {
              gestorIdFiltro = gestorEncontrado.id;
            }
          }
        }

        if (gestorIdFiltro) {
          whereClause.gestorId = gestorIdFiltro;
        }
      } catch {
        // Si no es un ID válido y no se encontró, ignorar el filtro
      }
    }

    // Si es productor, solo ver sus propios datos
    const isProductor = userRoles.includes("Productor");
    if (isProductor) {
      // Aquí necesitaríamos filtrar por los generadores asociados al productor
      // Por ahora, mostramos todos los datos
    }

    // Obtener estadísticas de certificados
    // Log de filtros eliminado

    const certificados = await prisma.certificado.findMany({
      where: whereClause,
      include: {
        solicitud: {
          include: {
            generador: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            gestor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        gestor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (certificados.length > 0) {
      const totalKg = certificados.reduce(
        (sum, cert: ReturnType<typeof JSON.parse>) => sum + (cert.pesoValorizado || 0),
        0
      );
      const _totalTon = totalKg / 1000;
      // Log de certificados eliminado
    } else {
      // Verificar si hay certificados sin filtros
      const _totalCertificados = await prisma.certificado.count();
      const _certificadosEmitidos = await prisma.certificado.count({
        where: { estado: "emitido" },
      });
      // Log total certificados eliminado
    }

    // Filtrar por tratamiento después de obtener los certificados
    // ya que tratamientos es un campo JSON
    let certificadosFiltrados = certificados;
    if (tratamiento !== "todos") {
      // Normalizar nombre del tratamiento
      const tratamientoNormalizado = tratamiento.toLowerCase().replace(/_/g, " ");
      const mapeoTratamientos: { [key: string]: string[] } = {
        reciclaje: ["reciclaje", "recycling"],
        recauchaje: ["recauchaje", "retreading"],
        coprocesamiento: ["co-procesamiento", "coprocesamiento", "co-processing"],
        "valorizacion energetica": [
          "valorización energética",
          "valorizacion energetica",
          "energy recovery",
        ],
      };

      const tratamientosBuscar = mapeoTratamientos[tratamientoNormalizado] || [tratamiento];

      certificadosFiltrados = certificados.filter((cert: ReturnType<typeof JSON.parse>) => {
        const tratamientos = cert.tratamientos as TratamientoJSON[] | null;
        if (!tratamientos || !Array.isArray(tratamientos)) return false;
        return tratamientos.some((t) => {
          const tipoTratamiento = (t.tipo || "").toLowerCase();
          return tratamientosBuscar.some((buscar) =>
            tipoTratamiento.includes(buscar.toLowerCase())
          );
        });
      });
    }

    // Calcular KPIs usando certificados filtrados
    const totalCertificados = certificadosFiltrados.length;
    // Convertir peso de kg a toneladas (dividir por 1000)
    const totalToneladas = certificadosFiltrados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => {
        const pesoKg = cert.pesoValorizado || 0;
        const pesoToneladas = pesoKg / 1000; // Convertir kg a toneladas
        return sum + pesoToneladas;
      },
      0
    );
    const gestoresUnicos = new Set(
      certificadosFiltrados
        .map((cert: ReturnType<typeof JSON.parse>) => cert.gestorId || cert.solicitud?.gestorId)
        .filter(Boolean)
    );
    const generadoresUnicos = new Set(
      certificadosFiltrados
        .map((cert: ReturnType<typeof JSON.parse>) => cert.solicitud?.generadorId)
        .filter(Boolean)
    );

    // Log de KPIs calculado eliminado

    // Obtener metas configuradas desde la base de datos
    const metasDb = await prisma.meta.findMany({
      where: {
        anio: anio,
        tipo: { in: ["recoleccion", "valorizacion"] },
      },
    });

    // Sumar metas en caso de existir múltiples registros (ej. múltiples sistemas de gestión)
    // Si no hay metas configuradas, se asume 0 para evitar cálculos erróneos
    let metaRecoleccion = 0;
    let metaValorizacion = 0;

    metasDb.forEach((m: ReturnType<typeof JSON.parse>) => {
      if (m.tipo === "recoleccion") metaRecoleccion += m.metaToneladas;
      if (m.tipo === "valorizacion") metaValorizacion += m.metaToneladas;
    });

    // Si no se encontraron metas, usar valores por defecto o 0.
    // Usamos 0 para reflejar que falta configuración.
    if (metaRecoleccion === 0 && metaValorizacion === 0) {
      console.warn(`⚠️ No se encontraron metas configuradas para el año ${anio}`);
    }

    const porcentajeRecoleccion = (totalToneladas / metaRecoleccion) * 100;
    const porcentajeValorizacion = (totalToneladas / metaValorizacion) * 100;

    // Calcular promedio mensual
    const mesesTranscurridos = Math.max(1, new Date().getMonth() + 1);
    const promedioMensual = totalToneladas / mesesTranscurridos;

    const kpis: DashboardKPIs = {
      metaRecoleccion: metaRecoleccion || 1000,
      avanceRecoleccion: totalToneladas || 0,
      porcentajeRecoleccion: Math.min(100, Math.max(0, porcentajeRecoleccion || 0)),
      metaValorizacion: metaValorizacion || 800,
      avanceValorizacion: totalToneladas || 0,
      porcentajeValorizacion: Math.min(100, Math.max(0, porcentajeValorizacion || 0)),
      totalCertificados: totalCertificados || 0,
      gestoresActivos: gestoresUnicos.size || 0,
      generadoresAtendidos: generadoresUnicos.size || 0,
      promedioMensual: promedioMensual || 0,
    };

    // Calcular proyección de cumplimiento
    const hoy = new Date();
    const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
    const diasTranscurridos = Math.max(
      1,
      Math.floor((hoy.getTime() - inicioAnio.getTime()) / (1000 * 60 * 60 * 24))
    );
    const diasTotalesAnio = 365;
    const ritmoDiario =
      diasTranscurridos > 0 && totalToneladas > 0 ? totalToneladas / diasTranscurridos : 0;
    const proyeccionAnual = ritmoDiario > 0 ? ritmoDiario * diasTotalesAnio : 0;
    const cumpliraAtiempo = proyeccionAnual >= metaValorizacion;

    // Calcular fecha estimada de cumplimiento
    const toneladasRestantes = Math.max(0, metaValorizacion - totalToneladas);
    const diasNecesarios =
      ritmoDiario > 0 && toneladasRestantes > 0 ? Math.ceil(toneladasRestantes / ritmoDiario) : 365;
    const fechaEstimada = new Date();
    fechaEstimada.setDate(fechaEstimada.getDate() + diasNecesarios);

    const proyeccion = {
      cumpliraAtiempo: cumpliraAtiempo || false,
      fechaEstimada: fechaEstimada.toISOString(),
      toneladasMensualNecesarias:
        toneladasRestantes > 0 ? toneladasRestantes / 12 : metaValorizacion / 12,
      deficit: Math.max(0, metaValorizacion - proyeccionAnual),
    };

    // Comparación con período anterior
    const anioAnterior = anio - 1;
    const whereClauseAnioAnterior: import("@prisma/client").Prisma.CertificadoWhereInput = {
      estado: "emitido",
      fechaEmision: {
        gte: new Date(anioAnterior, 0, 1),
        lte: new Date(anioAnterior, 11, 31),
      },
    };

    // Aplicar los mismos filtros que el período actual
    if (region !== "todas") {
      const regionNormalizada = region.toLowerCase();
      whereClauseAnioAnterior.solicitud = {
        region: {
          contains: regionNormalizada,
          mode: "insensitive",
        },
      };
    }

    if (gestorIdFiltro) {
      whereClauseAnioAnterior.gestorId = gestorIdFiltro;
    }

    let certificadosAnioAnteriorRaw: Awaited<ReturnType<typeof prisma.certificado.findMany>> = [];
    try {
      certificadosAnioAnteriorRaw = await prisma.certificado.findMany({
        where: whereClauseAnioAnterior,
        include: {
          solicitud: {
            include: {
              generador: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              gestor: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          gestor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (dbError: unknown) {
      console.error("Error en consulta de certificados año anterior:", dbError);
      // Continuar con array vacío si falla
      certificadosAnioAnteriorRaw = [];
    }

    // Aplicar filtro de tratamiento también al año anterior
    let certificadosAnioAnterior = certificadosAnioAnteriorRaw;
    if (tratamiento !== "todos") {
      const tratamientoNormalizado = tratamiento.toLowerCase().replace(/_/g, " ");
      const mapeoTratamientos: { [key: string]: string[] } = {
        reciclaje: ["reciclaje", "recycling"],
        recauchaje: ["recauchaje", "retreading"],
        coprocesamiento: ["co-procesamiento", "coprocesamiento", "co-processing"],
        "valorizacion energetica": [
          "valorización energética",
          "valorizacion energetica",
          "energy recovery",
        ],
      };
      const tratamientosBuscar = mapeoTratamientos[tratamientoNormalizado] || [tratamiento];

      certificadosAnioAnterior = certificadosAnioAnteriorRaw.filter(
        (cert: ReturnType<typeof JSON.parse>) => {
          if (!cert.tratamientos || !Array.isArray(cert.tratamientos)) return false;
          return cert.tratamientos.some((tDoc: ReturnType<typeof JSON.parse>) => {
            const t = tDoc as { tipo?: string };
            const tipoTratamiento = (t.tipo || "").toLowerCase();
            return tratamientosBuscar.some((buscar) =>
              tipoTratamiento.includes(buscar.toLowerCase())
            );
          });
        }
      );
    }

    // Convertir peso de kg a toneladas para el año anterior también
    const toneladasAnioAnterior = certificadosAnioAnterior.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => {
        const pesoKg = cert.pesoValorizado || 0;
        return sum + pesoKg / 1000; // Convertir kg a toneladas
      },
      0
    );
    const variacion =
      totalToneladas > 0 ? ((totalToneladas - toneladasAnioAnterior) / totalToneladas) * 100 : 0;

    const comparacion = {
      periodoActual: {
        toneladas: totalToneladas || 0,
        porcentaje: porcentajeValorizacion || 0,
      },
      periodoAnterior: {
        toneladas: toneladasAnioAnterior || 0,
        porcentaje:
          metaValorizacion > 0 ? ((toneladasAnioAnterior || 0) / metaValorizacion) * 100 : 0,
      },
      variacion: variacion || 0,
      mejora: (totalToneladas || 0) >= (toneladasAnioAnterior || 0),
    };

    // Log de respuesta final eliminado

    return NextResponse.json({
      kpis,
      proyeccion,
      comparacion,
    });
  } catch (error: unknown) {
    console.error("Error en /api/dashboard/kpis:", error);
    let errorStack = undefined;
    if (error instanceof Error) {
      console.error("Stack trace:", (error as ReturnType<typeof JSON.parse>).stack);
      errorStack = (error as ReturnType<typeof JSON.parse>).stack;
    }
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido",
        details: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
