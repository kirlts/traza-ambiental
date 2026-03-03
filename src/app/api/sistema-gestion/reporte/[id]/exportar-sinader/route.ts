import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import ExcelJS from "exceljs";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: _reporteId } = await params;
    const session = await auth();

    // Validar autenticación
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos - Solo Sistema de Gestión
    const userRoles = session.user.roles || [];
    if (!userRoles.includes("Sistema de Gestión")) {
      return NextResponse.json(
        { error: "Rol no autorizado. Solo Sistemas de Gestión pueden exportar para RETC." },
        { status: 403 }
      );
    }

    // Obtener parámetros de query para filtros
    const { searchParams } = new URL(req.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());

    // Obtener certificados del año para el sistema de gestión
    const fechaInicio = new Date(anio, 0, 1);
    const fechaFin = new Date(anio, 11, 31, 23, 59, 59);

    const certificados = await prisma.certificado.findMany({
      where: {
        estado: "emitido",
        fechaEmision: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        sistemaGestionId: session.user.id,
      },
      include: {
        solicitud: {
          include: {
            generador: {
              select: {
                rut: true,
                name: true,
                idRETC: true,
              },
            },
          },
          select: {
            region: true,
            comuna: true,
            categoriaA_cantidad: true,
            categoriaA_pesoEst: true,
            categoriaB_cantidad: true,
            categoriaB_pesoEst: true,
          },
        },
        gestor: {
          select: {
            rut: true,
            name: true,
            idRETC: true,
          },
        },
      },
    });

    if (certificados.length === 0) {
      return NextResponse.json(
        { error: "No hay certificados para el período seleccionado" },
        { status: 404 }
      );
    }

    // Validar consistencia de datos (CAC-4)
    const totalPesoCertificados = certificados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => sum + cert.pesoValorizado / 1000,
      0
    );
    const totalPesoSolicitudes = certificados.reduce((sum, cert: ReturnType<typeof JSON.parse>) => {
      const pesoA = (cert.solicitud?.categoriaA_pesoEst || 0) / 1000;
      const pesoB = (cert.solicitud?.categoriaB_pesoEst || 0) / 1000;
      return sum + pesoA + pesoB;
    }, 0);

    // Tolerancia del 5% para diferencias por redondeo
    const diferencia = Math.abs(totalPesoCertificados - totalPesoSolicitudes);
    const tolerancia = totalPesoSolicitudes * 0.05;

    if (diferencia > tolerancia) {
      return NextResponse.json(
        {
          error:
            "Inconsistencia detectada en los datos. La suma de desgloses no coincide con el total.",
          detalles: {
            totalCertificados: totalPesoCertificados.toFixed(2),
            totalSolicitudes: totalPesoSolicitudes.toFixed(2),
            diferencia: diferencia.toFixed(2),
          },
        },
        { status: 400 }
      );
    }

    // Crear Workbook de Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TrazaAmbiental";
    workbook.created = new Date();

    // --- HOJA 1: CARGA MASIVA RETC/SINADER (Formato Estándar) ---
    const worksheet = workbook.addWorksheet("Carga Masiva RETC");

    // Columnas según formato RETC/SINADER para Sistemas de Gestión
    worksheet.columns = [
      { header: "Año Reporte", key: "anio", width: 12 },
      { header: "RUT Sistema Gestión", key: "rutSistema", width: 18 },
      { header: "Razón Social Sistema", key: "razonSocialSistema", width: 35 },
      { header: "ID RETC Sistema", key: "idRetcSistema", width: 15 },
      { header: "Región", key: "region", width: 20 },
      { header: "Comuna", key: "comuna", width: 20 },
      { header: "Categoría REP", key: "categoria", width: 15 },
      { header: "Descripción Residuo", key: "descripcion", width: 40 },
      { header: "Cantidad Unidades", key: "unidades", width: 18 },
      { header: "Peso (Toneladas)", key: "peso", width: 18 },
      { header: "Tipo Tratamiento", key: "tratamiento", width: 25 },
      { header: "RUT Gestor", key: "rutGestor", width: 18 },
      { header: "Razón Social Gestor", key: "razonSocialGestor", width: 35 },
      { header: "ID RETC Gestor", key: "idRetcGestor", width: 15 },
    ];

    // Estilo de Cabecera
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2E7D32" }, // Verde corporativo
    };

    // Obtener datos del sistema de gestión
    const sistemaGestion = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        rut: true,
        name: true,
        idRETC: true,
      },
    });

    // Agrupar certificados por combinación única: Región + Categoría + Tratamiento + Gestor
    const filasMap = new Map<
      string,
      {
        region: string;
        comuna: string;
        categoria: string;
        tratamiento: string;
        rutGestor: string;
        razonSocialGestor: string;
        idRetcGestor: string;
        unidades: number;
        peso: number;
      }
    >();

    certificados.forEach((cert: ReturnType<typeof JSON.parse>) => {
      const region = cert.solicitud?.region || "Sin especificar";
      const comuna = cert.solicitud?.comuna || "Sin especificar";

      // Procesar categorías
      const categorias = Array.isArray(cert.categorias) ? cert.categorias : [];

      // Procesar tratamientos
      const tratamientos = Array.isArray(cert.tratamientos) ? cert.tratamientos : [];

      // Si no hay tratamientos, usar "Sin especificar"
      if (tratamientos.length === 0) {
        tratamientos.push({ tipo: "Sin especificar", peso: cert.pesoValorizado });
      }

      // Gestor
      const rutGestor = cert.gestor?.rut || "";
      const razonSocialGestor = cert.gestor?.name || "Sin especificar";
      const idRetcGestor = cert.gestor?.idRETC || "";

      // Crear una fila por cada combinación de Categoría + Tratamiento
      categorias.forEach((cat: ReturnType<typeof JSON.parse>) => {
        tratamientos.forEach((trat: ReturnType<typeof JSON.parse>) => {
          const tipoTratamiento = trat.tipo || trat.tipoTratamiento || "Sin especificar";
          const pesoTratamientoKg = trat.peso || cert.pesoValorizado / categorias.length;
          const pesoTratamientoTon = pesoTratamientoKg / 1000;

          // Clave única para agrupar
          const clave = `${region}|${comuna}|${cat}|${tipoTratamiento}|${rutGestor}`;

          const existente = filasMap.get(clave) || {
            region,
            comuna,
            categoria: `Categoría ${cat}`,
            tratamiento: tipoTratamiento,
            rutGestor,
            razonSocialGestor,
            idRetcGestor,
            unidades: 0,
            peso: 0,
          };

          filasMap.set(clave, {
            ...existente,
            unidades: existente.unidades + cert.cantidadUnidades,
            peso: existente.peso + pesoTratamientoTon,
          });
        });
      });
    });

    // Agregar filas al Excel
    filasMap.forEach((fila) => {
      worksheet.addRow({
        anio,
        rutSistema: sistemaGestion?.rut || "",
        razonSocialSistema: sistemaGestion?.name || "",
        idRetcSistema: sistemaGestion?.idRETC || "",
        region: fila.region,
        comuna: fila.comuna,
        categoria: fila.categoria,
        descripcion: "Neumáticos Fuera de Uso (NFU)",
        unidades: Math.round(fila.unidades),
        peso: Math.round(fila.peso * 100) / 100, // 2 decimales
        tratamiento: fila.tratamiento,
        rutGestor: fila.rutGestor,
        razonSocialGestor: fila.razonSocialGestor,
        idRetcGestor: fila.idRetcGestor,
      });
    });

    // Generar Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Retornar respuesta con archivo adjunto
    const headers = new Headers();
    headers.append(
      "Content-Disposition",
      `attachment; filename="Reporte_RETC_SistemaGestion_${anio}_${sistemaGestion?.rut || "sin_rut"}.xlsx"`
    );
    headers.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    console.error("Error generando Excel RETC:", error);
    return NextResponse.json({ error: "Error interno generando el archivo" }, { status: 500 });
  }
}
