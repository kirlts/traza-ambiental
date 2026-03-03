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
    const _region = searchParams.get("region") || "todas";
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

    if (gestor !== "todos") {
      whereClause.gestorId = gestor;
    }

    // Obtener certificados agrupados por mes y tratamiento
    const certificados = await prisma.certificado.findMany({
      where: whereClause,
      select: {
        fechaEmision: true,
        tratamientos: true,
        pesoValorizado: true,
      },
    });

    // Obtener meta de valorización anual para calcular la mensual
    const metasDb = await prisma.meta.findMany({
      where: {
        anio: anio,
        tipo: "valorizacion",
      },
    });

    const metaValorizacionAnual = metasDb.reduce((sum, m) => sum + m.metaToneladas, 0);
    const metaMensual = metaValorizacionAnual > 0 ? metaValorizacionAnual / 12 : 0;

    // Procesar datos por mes
    type MesData = {
      mes: string;
      reciclaje: number;
      recauchaje: number;
      coprocesamiento: number;
      valorizacion_energetica: number;
      total: number;
      meta: number;
    };
    const mesesData: { [key: string]: MesData } = {};

    // Inicializar todos los meses
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const mesesToProcess =
      periodo === "trimestre" ? 3 : periodo === "mes" ? new Date().getMonth() + 1 : 12;

    for (let i = 0; i < mesesToProcess; i++) {
      const mesKey = meses[i];
      mesesData[mesKey] = {
        mes: mesKey,
        reciclaje: 0,
        recauchaje: 0,
        coprocesamiento: 0,
        valorizacion_energetica: 0,
        total: 0,
        meta: parseFloat(metaMensual.toFixed(2)),
      };
    }

    // Agrupar certificados por mes y tratamiento
    certificados.forEach((cert) => {
      const fecha = new Date(cert.fechaEmision);
      const mesIndex = fecha.getMonth();
      const mesKey = meses[mesIndex];

      if (mesesData[mesKey]) {
        // Procesar tratamientos (JSON array)
        const tratamientos = Array.isArray(cert.tratamientos)
          ? (cert.tratamientos as Array<{ tipo?: string; tipoTratamiento?: string; peso?: number }>)
          : [];

        tratamientos.forEach((tratDoc) => {
          const trat = tratDoc;
          const tipoTratamiento = trat.tipo || trat.tipoTratamiento || "RECICLAJE_MATERIAL";
          const pesoTratamientoKg = trat.peso || cert.pesoValorizado || 0;
          const pesoTratamientoTon = pesoTratamientoKg / 1000; // Convertir kg a toneladas

          // Mapear tipos de tratamiento a las claves esperadas
          const tratamientoMap: { [key: string]: keyof Omit<MesData, "mes" | "total" | "meta"> } = {
            RECICLAJE_MATERIAL: "reciclaje",
            RECAUCHAJE: "recauchaje",
            COPROCESAMIENTO: "coprocesamiento",
            VALORIZACION_ENERGETICA: "valorizacion_energetica",
            reciclaje: "reciclaje",
            recauchaje: "recauchaje",
            "co-procesamiento": "coprocesamiento",
            valorización_energética: "valorizacion_energetica",
            valorizacion_energetica: "valorizacion_energetica",
          };

          const key = tratamientoMap[tipoTratamiento] || "reciclaje";

          // Aplicar filtro de tratamiento si está especificado
          if (tratamiento === "todos" || key === tratamiento.toLowerCase().replace(/\s+/g, "_")) {
            mesesData[mesKey][key] += pesoTratamientoTon;
            mesesData[mesKey].total += pesoTratamientoTon;
          }
        });

        // Si no hay tratamientos, usar el peso total
        if (tratamientos.length === 0 && tratamiento === "todos") {
          const pesoTotalKg = cert.pesoValorizado || 0;
          const pesoTotalTon = pesoTotalKg / 1000; // Convertir kg a toneladas
          mesesData[mesKey].reciclaje += pesoTotalTon;
          mesesData[mesKey].total += pesoTotalTon;
        }
      }
    });

    // Convertir a array y ordenar por mes
    const mesesOrdenados = Object.values(mesesData).sort((a: MesData, b: MesData) => {
      const mesesOrder = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ];
      return mesesOrder.indexOf(a.mes) - mesesOrder.indexOf(b.mes);
    });

    return NextResponse.json({
      meses: mesesOrdenados,
      metaMensual: parseFloat(metaMensual.toFixed(2)),
    });
  } catch (error: unknown) {
    console.error("Error en /api/dashboard/toneladas-por-mes:", error);
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
