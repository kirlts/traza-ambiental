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

    // Verificar que el usuario sea un generador
    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.user.id },
      include: { role: true },
    });

    const isGenerador = userRoles.some(
      (ur: ReturnType<typeof JSON.parse>) => ur.role.name === "Generador"
    );
    if (!isGenerador) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());

    // Validar que el año sea válido
    if (isNaN(anio) || anio < 2000 || anio > 2100) {
      return NextResponse.json({ error: "Año inválido" }, { status: 400 });
    }

    const fechaInicio = new Date(anio, 0, 1, 0, 0, 0, 0);
    const fechaFin = new Date(anio, 11, 31, 23, 59, 59, 999);

    // Obtener solicitudes y declaraciones en paralelo para optimizar tiempo de respuesta
    const [solicitudes, declaraciones] = await Promise.all([
      prisma.solicitudRetiro.findMany({
        where: {
          generadorId: session.user.id,
          createdAt: { gte: fechaInicio, lte: fechaFin },
        },
      }),
      prisma.declaracionAnual.findMany({
        where: {
          productorId: session.user.id,
          anio,
        },
        include: {
          categorias: true,
        },
      }),
    ]);

    const solicitudesIds = solicitudes.map((s: ReturnType<typeof JSON.parse>) => s.id);

    // Obtener certificados relacionados
    let certificados: import("@prisma/client").Certificado[] = [];
    if (solicitudesIds.length > 0) {
      certificados = await prisma.certificado.findMany({
        where: {
          solicitudId: { in: solicitudesIds },
          estado: "emitido",
          fechaEmision: { gte: fechaInicio, lte: fechaFin },
        },
      });
    }

    // Calcular total de neumáticos declarados
    const neumaticosDeclarados = declaraciones.reduce((sum, decl) => {
      return (
        sum +
        decl.categorias.reduce((catSum, cat: ReturnType<typeof JSON.parse>) => {
          return catSum + cat.cantidadUnidades;
        }, 0)
      );
    }, 0);

    // Calcular total de toneladas declaradas (para calcular metas)
    const _totalToneladasDeclaradas = declaraciones.reduce((sum, decl) => {
      return (
        sum +
        decl.categorias.reduce((catSum, cat: ReturnType<typeof JSON.parse>) => {
          return catSum + cat.pesoToneladas;
        }, 0)
      );
    }, 0);

    // Calcular total de neumáticos valorizados (de certificados)
    const totalUnidadesValorizadas = certificados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => sum + (cert?.cantidadUnidades || 0),
      0
    );

    // Calcular metas basándose en la declaración del año anterior
    // Las metas del año X se calculan desde la declaración del año X-1
    const anioDeclaracionParaMetas = anio - 1;
    const declaracionAnterior = await prisma.declaracionAnual.findFirst({
      where: {
        productorId: session.user.id,
        anio: anioDeclaracionParaMetas,
        estado: "enviada", // Solo declaraciones enviadas cuentan para metas
      },
      include: {
        categorias: true,
      },
    });

    let metaRecoleccion = 0;
    let metaValorizacion = 0;

    if (declaracionAnterior) {
      // Calcular toneladas declaradas en el año anterior
      const toneladasDeclaradasAnterior = declaracionAnterior.categorias.reduce(
        (sum, cat: ReturnType<typeof JSON.parse>) => sum + cat.pesoToneladas,
        0
      );

      if (toneladasDeclaradasAnterior > 0) {
        // Obtener porcentajes configurados para el año de la meta (año del reporte)
        const { calcularMetasREP } = await import("@/lib/helpers/declaracion-helpers");
        const metasCalculadas = await calcularMetasREP(
          anioDeclaracionParaMetas,
          toneladasDeclaradasAnterior
        );

        metaRecoleccion = metasCalculadas.metaRecoleccion; // En toneladas
        metaValorizacion = metasCalculadas.metaValorizacion; // En toneladas
      }
    }

    // Calcular toneladas recolectadas (basado en peso real o estimado de solicitudes completadas)
    const totalToneladasRecolectadas = solicitudes.reduce((sum, sol) => {
      // Usar pesoReal si está disponible, sino pesoTotalEstimado, convertido a toneladas
      const pesoKg = sol.pesoReal || sol.pesoTotalEstimado || 0;
      return sum + pesoKg / 1000;
    }, 0);

    // Calcular toneladas valorizadas (basado en certificados emitidos)
    // El pesoValorizado ya está en kg, solo convertir a toneladas
    const totalToneladasValorizadas = certificados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => {
        return sum + (cert?.pesoValorizado || 0) / 1000;
      },
      0
    );

    // Calcular porcentajes de cumplimiento
    const cumplimientoRecoleccion =
      metaRecoleccion > 0 ? Math.min(100, (totalToneladasRecolectadas / metaRecoleccion) * 100) : 0;
    const cumplimientoValorizacion =
      metaValorizacion > 0
        ? Math.min(100, (totalToneladasValorizadas / metaValorizacion) * 100)
        : 0;

    // Contar certificados generados
    const certificadosGenerados = certificados.length;

    return NextResponse.json({
      anio,
      neumaticosDeclarados,
      neumaticosValorizados: totalUnidadesValorizadas,
      metaRecoleccion: metaRecoleccion, // En toneladas
      metaValorizacion: metaValorizacion, // En toneladas
      cumplimientoRecoleccion: Math.round(cumplimientoRecoleccion * 10) / 10,
      cumplimientoValorizacion: Math.round(cumplimientoValorizacion * 10) / 10,
      certificadosGenerados,
      totalSolicitudes: solicitudes.length,
      solicitudesCompletadas: certificados.length,
      fechaGeneracion: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Error en /api/generador/reportes/anual:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
