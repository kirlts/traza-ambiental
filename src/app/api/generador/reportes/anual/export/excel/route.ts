import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

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

    // Obtener datos del reporte (reutilizando la lógica del endpoint principal)
    const solicitudes = await prisma.solicitudRetiro.findMany({
      where: {
        generadorId: session.user.id,
        createdAt: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    const solicitudesIds = solicitudes.map((s: ReturnType<typeof JSON.parse>) => s.id);

    let certificados: import("@prisma/client").Certificado[] = [];
    if (solicitudesIds.length > 0) {
      try {
        certificados = await prisma.certificado.findMany({
          where: {
            solicitudId: { in: solicitudesIds },
            estado: "emitido",
            fechaEmision: {
              gte: fechaInicio,
              lte: fechaFin,
            },
          },
        });
      } catch {
        certificados = [];
      }
    }

    const declaraciones = await prisma.declaracionAnual.findMany({
      where: {
        productorId: session.user.id,
        anio,
      },
      include: {
        categorias: true,
      },
    });

    const neumaticosDeclarados = declaraciones.reduce((sum, decl) => {
      return (
        sum +
        decl.categorias.reduce((catSum, cat: ReturnType<typeof JSON.parse>) => {
          return catSum + cat.cantidadUnidades;
        }, 0)
      );
    }, 0);

    const totalUnidadesValorizadas = certificados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => sum + (cert?.cantidadUnidades || 0),
      0
    );

    const metas = await prisma.meta.findMany({
      where: {
        anio,
        productorId: session.user.id,
      },
    });

    const metaRecoleccion =
      metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "recoleccion")?.metaToneladas ||
      0;
    const metaValorizacion =
      metas.find((m: ReturnType<typeof JSON.parse>) => m.tipo === "valorizacion")?.metaToneladas ||
      0;

    const totalToneladasRecolectadas = solicitudes.reduce((sum, sol) => {
      const pesoKg = sol.pesoReal || sol.pesoTotalEstimado || 0;
      return sum + pesoKg / 1000;
    }, 0);

    const totalToneladasValorizadas = certificados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => {
        return sum + (cert?.pesoValorizado || 0) / 1000;
      },
      0
    );

    const cumplimientoRecoleccion =
      metaRecoleccion > 0 ? Math.min(100, (totalToneladasRecolectadas / metaRecoleccion) * 100) : 0;
    const cumplimientoValorizacion =
      metaValorizacion > 0
        ? Math.min(100, (totalToneladasValorizadas / metaValorizacion) * 100)
        : 0;

    // Obtener información del generador
    const generador = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        rut: true,
        email: true,
      },
    });

    // Crear libro de Excel con ExcelJS
    const workbook = new ExcelJS.Workbook();
    workbook.creator = generador?.name || "TrazAmbiental";
    workbook.created = new Date();

    // Hoja 1: Resumen Ejecutivo
    const wsResumen = workbook.addWorksheet("Resumen Ejecutivo");
    wsResumen.addRow(["REPORTE ANUAL DE CUMPLIMIENTO - Sistema REP Chile"]);
    wsResumen.addRow(["Generador:", generador?.name || "N/A"]);
    wsResumen.addRow(["RUT:", generador?.rut || "N/A"]);
    wsResumen.addRow(["Año:", anio]);
    wsResumen.addRow(["Fecha de generación:", new Date().toLocaleString("es-CL")]);
    wsResumen.addRow([]);

    wsResumen.addRow(["MÉTRICAS PRINCIPALES"]);
    wsResumen.addRow(["Neumáticos Declarados:", neumaticosDeclarados]);
    wsResumen.addRow(["Neumáticos Valorizados:", totalUnidadesValorizadas]);
    wsResumen.addRow(["Meta Recolección (kg):", metaRecoleccion * 1000]);
    wsResumen.addRow(["Meta Valorización (kg):", metaValorizacion * 1000]);
    wsResumen.addRow([
      "Cumplimiento Recolección (%):",
      Math.round(cumplimientoRecoleccion * 10) / 10,
    ]);
    wsResumen.addRow([
      "Cumplimiento Valorización (%):",
      Math.round(cumplimientoValorizacion * 10) / 10,
    ]);
    wsResumen.addRow(["Total Solicitudes:", solicitudes.length]);
    wsResumen.addRow(["Certificados Generados:", certificados.length]);
    wsResumen.addRow(["Toneladas Recolectadas:", totalToneladasRecolectadas.toFixed(2)]);
    wsResumen.addRow(["Toneladas Valorizadas:", totalToneladasValorizadas.toFixed(2)]);

    wsResumen.getColumn(1).width = 35;
    wsResumen.getColumn(2).width = 25;

    // Estilo para el título
    wsResumen.getRow(1).font = { bold: true, size: 14 };
    wsResumen.getRow(7).font = { bold: true, size: 12 };

    // Hoja 2: Declaraciones
    const wsDeclaraciones = workbook.addWorksheet("Declaraciones");
    wsDeclaraciones.columns = [
      { header: "Año", key: "anio", width: 10 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Total Unidades", key: "totalUnidades", width: 15 },
      { header: "Total Toneladas", key: "totalToneladas", width: 18 },
      { header: "N° Categorías", key: "categorias", width: 15 },
      { header: "Fecha Declaración", key: "fechaDeclaracion", width: 20 },
    ];

    declaraciones.forEach((decl) => {
      wsDeclaraciones.addRow({
        anio: decl.anio,
        estado: decl.estado,
        totalUnidades: decl.totalUnidades,
        totalToneladas: decl.totalToneladas,
        categorias: decl.categorias.length,
        fechaDeclaracion: decl.fechaDeclaracion
          ? new Date(decl.fechaDeclaracion).toLocaleDateString("es-CL")
          : "N/A",
      });
    });

    wsDeclaraciones.getRow(1).font = { bold: true };
    wsDeclaraciones.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF459E60" },
    };
    wsDeclaraciones.getRow(1).font = {
      ...wsDeclaraciones.getRow(1).font,
      color: { argb: "FFFFFFFF" },
    };

    // Hoja 3: Categorías Declaradas
    if (declaraciones.length > 0) {
      const wsCategorias = workbook.addWorksheet("Categorías Declaradas");
      wsCategorias.columns = [
        { header: "Año", key: "anio", width: 10 },
        { header: "Tipo", key: "tipo", width: 10 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Cantidad Unidades", key: "cantidadUnidades", width: 18 },
        { header: "Peso (Toneladas)", key: "pesoToneladas", width: 18 },
      ];

      declaraciones.forEach((decl) => {
        decl.categorias.forEach((cat: ReturnType<typeof JSON.parse>) => {
          wsCategorias.addRow({
            anio: decl.anio,
            tipo: cat.tipo,
            nombre: cat.nombre,
            cantidadUnidades: cat.cantidadUnidades,
            pesoToneladas: cat.pesoToneladas,
          });
        });
      });

      wsCategorias.getRow(1).font = { bold: true };
      wsCategorias.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF459E60" },
      };
      wsCategorias.getRow(1).font = { ...wsCategorias.getRow(1).font, color: { argb: "FFFFFFFF" } };
    }

    // Hoja 4: Solicitudes
    const wsSolicitudes = workbook.addWorksheet("Solicitudes");
    wsSolicitudes.columns = [
      { header: "Folio", key: "folio", width: 20 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Peso Estimado (kg)", key: "pesoEstimado", width: 20 },
      { header: "Peso Real (kg)", key: "pesoReal", width: 20 },
      { header: "Cantidad Total", key: "cantidadTotal", width: 15 },
      { header: "Región", key: "region", width: 20 },
      { header: "Comuna", key: "comuna", width: 20 },
      { header: "Fecha Creación", key: "fechaCreacion", width: 20 },
      { header: "Fecha Recolección", key: "fechaRecoleccion", width: 20 },
    ];

    solicitudes.forEach((sol) => {
      wsSolicitudes.addRow({
        folio: sol.folio,
        estado: sol.estado,
        pesoEstimado: sol.pesoTotalEstimado?.toFixed(2) || "N/A",
        pesoReal: sol.pesoReal?.toFixed(2) || "N/A",
        cantidadTotal: sol.cantidadTotal,
        region: sol.region,
        comuna: sol.comuna,
        fechaCreacion: new Date(sol.createdAt).toLocaleDateString("es-CL"),
        fechaRecoleccion: sol.fechaRecoleccion
          ? new Date(sol.fechaRecoleccion).toLocaleDateString("es-CL")
          : "N/A",
      });
    });

    wsSolicitudes.getRow(1).font = { bold: true };
    wsSolicitudes.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF459E60" },
    };
    wsSolicitudes.getRow(1).font = { ...wsSolicitudes.getRow(1).font, color: { argb: "FFFFFFFF" } };

    // Hoja 5: Metas
    const wsMetas = workbook.addWorksheet("Metas");
    wsMetas.columns = [
      { header: "Año", key: "anio", width: 10 },
      { header: "Tipo", key: "tipo", width: 15 },
      { header: "Meta (Toneladas)", key: "metaToneladas", width: 20 },
      { header: "Avance (Toneladas)", key: "avanceToneladas", width: 20 },
      { header: "Porcentaje Avance", key: "porcentajeAvance", width: 18 },
      { header: "Estado", key: "estado", width: 15 },
    ];

    metas.forEach((meta) => {
      wsMetas.addRow({
        anio: meta.anio,
        tipo: meta.tipo,
        metaToneladas: meta.metaToneladas,
        avanceToneladas: meta.avanceToneladas,
        porcentajeAvance: meta.porcentajeAvance,
        estado: meta.estado,
      });
    });

    wsMetas.getRow(1).font = { bold: true };
    wsMetas.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF459E60" },
    };
    wsMetas.getRow(1).font = { ...wsMetas.getRow(1).font, color: { argb: "FFFFFFFF" } };

    // Generar buffer del archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Retornar archivo Excel
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="reporte-anual-${anio}-generador.xlsx"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error generando Excel del reporte:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido al generar Excel",
      },
      { status: 500 }
    );
  }
}
