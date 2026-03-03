import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";
import { ReporteAnualData, ReporteGestor } from "@/types/api";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar permisos
    const userRoles = (session.user.roles || []) as string[];
    const hasAccess = userRoles.some((role: string) =>
      ["Sistema de Gestión", "Productor"].includes(role)
    );
    if (!hasAccess) {
      return NextResponse.json({ error: "Rol no autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Obtener reporte
    const reporte = await prisma.reporteAnual.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!reporte) {
      return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    }

    // Verificar permisos de acceso al reporte
    if (userRoles.includes("Sistema de Gestión")) {
      if (reporte.sistemaGestionId !== session.user.id) {
        return NextResponse.json({ error: "No tiene acceso a este reporte" }, { status: 403 });
      }
    }

    // Extraer datos del reporte
    const datosReporte = reporte.datosReporte as unknown as ReporteAnualData;
    const resumenEjecutivo = datosReporte?.resumenEjecutivo || {};
    const desgloseTratamiento = datosReporte?.desgloseTratamiento || [];
    const gestores = datosReporte?.gestores || [];

    // Generar HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte Anual ${reporte.anio} - ${reporte.folio}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
          }
          .title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          }
          .info-section {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
          }
          .info-item {
            margin-bottom: 8px;
            font-size: 14px;
          }
          .info-label {
            font-weight: bold;
            color: #374151;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
          }
          .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
          }
          .stat-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 30px;
          }
          .table th, .table td {
            border: 1px solid #e2e8f0;
            padding: 10px 12px;
            text-align: left;
          }
          .table th {
            background: #f1f5f9;
            font-weight: bold;
            color: #374151;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin: 30px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
          }
          .observaciones {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .verification-code {
            background: #dbeafe;
            padding: 10px;
            border-radius: 6px;
            font-family: monospace;
            font-weight: bold;
            color: #1e40af;
            display: inline-block;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TRAZAMBIENTAL</div>
          <div class="subtitle">Sistema Nacional de Gestión de Neumáticos Ley REP</div>
          <div class="title">REPORTE ANUAL DE CUMPLIMIENTO</div>
          <div>Folio: ${reporte.folio} - Año: ${reporte.anio}</div>
        </div>

        <div class="info-section">
          <div class="info-item">
            <span class="info-label">Fecha de generación:</span> ${reporte.createdAt.toLocaleDateString("es-CL")}
          </div>
          <div class="info-item">
            <span class="info-label">Estado:</span> ${reporte.estado}
          </div>
          <div class="info-item">
            <span class="info-label">Generado por:</span> ${reporte.usuario?.name || "N/A"}
          </div>
          <div class="info-item">
            <span class="info-label">Sistema de Gestión:</span> ${reporte.usuario?.name || "N/A"}
          </div>
          <div class="verification-code">
            Código de verificación: ${reporte.codigoVerificacion}
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${(resumenEjecutivo.metaRecoleccion || 0).toFixed(1)} ton</div>
            <div class="stat-label">Meta Recolección</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${(resumenEjecutivo.pesoRecolectado || 0).toFixed(1)} ton</div>
            <div class="stat-label">Peso Recolectado</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${(resumenEjecutivo.porcentajeRecoleccion || 0).toFixed(1)}%</div>
            <div class="stat-label">% Recolección</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${(resumenEjecutivo.metaValorizacion || 0).toFixed(1)} ton</div>
            <div class="stat-label">Meta Valorización</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${(resumenEjecutivo.pesoValorizado || 0).toFixed(1)} ton</div>
            <div class="stat-label">Peso Valorizado</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${(resumenEjecutivo.porcentajeValorizacion || 0).toFixed(1)}%</div>
            <div class="stat-label">% Valorización</div>
          </div>
        </div>

        ${
          desgloseTratamiento.length > 0
            ? `
          <div class="section-title">Desglose por Tipo de Tratamiento</div>
          <table class="table">
            <thead>
              <tr>
                <th>Tipo de Tratamiento</th>
                <th>Cantidad</th>
                <th>Peso (ton)</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              ${desgloseTratamiento
                .map(
                  (trat: ReturnType<typeof JSON.parse>) => `
                <tr>
                  <td>${trat.tipo || "Sin especificar"}</td>
                  <td>${trat.cantidad || 0}</td>
                  <td>${(trat.peso || 0).toFixed(2)}</td>
                  <td>${(trat.porcentaje || 0).toFixed(1)}%</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
            : ""
        }

        ${
          gestores.length > 0
            ? `
          <div class="section-title">Gestores Participantes</div>
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Certificados</th>
                <th>Toneladas</th>
              </tr>
            </thead>
            <tbody>
              ${gestores
                .slice(0, 20)
                .map(
                  (gestor: ReporteGestor) => `
                <tr>
                  <td>${gestor.nombre || "N/A"}</td>
                  <td>${gestor.email || "N/A"}</td>
                  <td>${gestor.certificados || 0}</td>
                  <td>${(gestor.toneladas || 0).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
            : ""
        }

        ${
          reporte.observaciones
            ? `
          <div class="section-title">Observaciones</div>
          <div class="observaciones">
            ${reporte.observaciones}
          </div>
        `
            : ""
        }

        <div class="footer">
          <p>Reporte generado automáticamente por el Sistema TrazAmbiental</p>
          <p>© ${new Date().getFullYear()} TrazAmbiental - Gestión de Neumáticos Ley REP</p>
        </div>
      </body>
      </html>
    `;

    // Generar PDF usando Puppeteer
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    // Retornar el PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="reporte-anual-${reporte.anio}-${reporte.folio}.pdf"`,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          error instanceof Error
            ? error instanceof Error
              ? (error as ReturnType<typeof JSON.parse>).message
              : String(error)
            : "Error desconocido al generar PDF",
      },
      { status: 500 }
    );
  }
}
