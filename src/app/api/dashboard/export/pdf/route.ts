import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const anio = parseInt(searchParams.get("anio") || new Date().getFullYear().toString());
    const periodo = searchParams.get("periodo") || "anio";
    const _region = searchParams.get("region") || "todas";
    const _tratamiento = searchParams.get("tratamiento") || "todos";
    const gestor = searchParams.get("gestor") || "todos";

    // Verificar permisos
    const userRoles = session.user.roles || [];
    const hasAccess = userRoles.some((role) => ["Sistema de Gestión", "Productor"].includes(role));
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

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

    // Obtener datos del dashboard
    const certificados = await prisma.certificado.findMany({
      where: whereClause,
      include: {
        solicitud: {
          include: {
            generador: true,
          },
        },
        gestor: true,
      },
      orderBy: {
        fechaEmision: "desc",
      },
    });

    // Calcular estadísticas
    const totalCertificados = certificados.length;
    const totalToneladas = certificados.reduce(
      (sum, cert: ReturnType<typeof JSON.parse>) => sum + (cert.pesoValorizado || 0),
      0
    );
    const gestoresActivos = new Set(
      certificados.map((c: ReturnType<typeof JSON.parse>) => c.gestorId).filter(Boolean)
    ).size;
    const generadoresAtendidos = new Set(
      certificados
        .map((c: ReturnType<typeof JSON.parse>) => c.solicitud?.generador?.id)
        .filter(Boolean)
    ).size;

    // Generar HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Cumplimiento - ${anio}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .title {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .table th, .table td {
            border: 1px solid #e2e8f0;
            padding: 8px 12px;
            text-align: left;
          }
          .table th {
            background: #f1f5f9;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TrazAmbiental</div>
          <div class="title">Sistema Nacional de Gestión de Neumáticos Ley REP</div>
          <h1>Reporte de Cumplimiento - ${anio}</h1>
          <p>Generado el ${new Date().toLocaleDateString("es-CL")}</p>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${totalCertificados}</div>
            <div class="stat-label">Total de Certificados</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${totalToneladas.toFixed(1)} ton</div>
            <div class="stat-label">Toneladas Valorizadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${gestoresActivos}</div>
            <div class="stat-label">Gestores Activos</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${generadoresAtendidos}</div>
            <div class="stat-label">Generadores Atendidos</div>
          </div>
        </div>

        <h2>Detalle de Certificados</h2>
        <table class="table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha Emisión</th>
              <th>Generador</th>
              <th>Gestor</th>
              <th>Peso (ton)</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${certificados
              .slice(0, 100)
              .map(
                (cert: ReturnType<typeof JSON.parse>) => `
              <tr>
                <td>${cert.folio}</td>
                <td>${new Date(cert.fechaEmision).toLocaleDateString("es-CL")}</td>
                <td>${cert.solicitud?.generador?.name || "N/A"}</td>
                <td>${cert.gestor?.name || "N/A"}</td>
                <td>${(cert.pesoValorizado || 0).toFixed(2)}</td>
                <td>${cert.estado}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        ${certificados.length > 100 ? `<p style="color: #666; font-style: italic;">Mostrando los primeros 100 registros de ${certificados.length} totales</p>` : ""}

        <div class="footer">
          <p>Reporte generado automáticamente por el Sistema TrazAmbiental</p>
          <p>© ${new Date().getFullYear()} TrazAmbiental - Gestión de Neumáticos Ley REP</p>
        </div>
      </body>
      </html>
    `;

    // Generar PDF usando Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Retornar el PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="dashboard-cumplimiento-${anio}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error generando PDF:", error);
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
