import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

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
      } catch (error: unknown) {
        console.warn(
          "⚠️  Modelo Certificado no disponible:",
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Modelo no encontrado"
        );
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

    // Generar HTML para el PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte Anual ${anio} - ${generador?.name || "Generador"}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #459e60;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #459e60;
            margin-bottom: 10px;
          }
          .title {
            font-size: 20px;
            color: #2b3b4c;
            margin-bottom: 5px;
          }
          .subtitle {
            font-size: 14px;
            color: #666;
          }
          .info-section {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f6fcf3;
            border-left: 4px solid #459e60;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: bold;
            color: #2b3b4c;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .metric-card {
            padding: 20px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .metric-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #204d3c;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #204d3c;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #459e60;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #459e60;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 5px;
          }
          .progress-fill {
            height: 100%;
            background-color: #459e60;
            transition: width 0.3s;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TRAZAMBIENTAL</div>
          <div class="title">Sistema Nacional de Gestión de Neumáticos</div>
          <div class="subtitle">Ley REP - Gestión Ambiental</div>
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Reporte Anual:</span>
            <span>${anio}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Generador:</span>
            <span>${generador?.name || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">RUT:</span>
            <span>${generador?.rut || "N/A"}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fecha de Generación:</span>
            <span>${new Date().toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</span>
          </div>
        </div>

        <div class="section-title">Métricas Principales</div>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Neumáticos Declarados</div>
            <div class="metric-value">${neumaticosDeclarados.toLocaleString("es-CL")}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Neumáticos Valorizados</div>
            <div class="metric-value">${totalUnidadesValorizadas.toLocaleString("es-CL")}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Meta Recolección</div>
            <div class="metric-value">${(metaRecoleccion * 1000).toLocaleString("es-CL")} kg</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Meta Valorización</div>
            <div class="metric-value">${(metaValorizacion * 1000).toLocaleString("es-CL")} kg</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Cumplimiento Recolección</div>
            <div class="metric-value">${Math.round(cumplimientoRecoleccion * 10) / 10}%</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(100, cumplimientoRecoleccion)}%"></div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Cumplimiento Valorización</div>
            <div class="metric-value">${Math.round(cumplimientoValorizacion * 10) / 10}%</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.min(100, cumplimientoValorizacion)}%"></div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total Solicitudes</div>
            <div class="metric-value">${solicitudes.length}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Certificados Generados</div>
            <div class="metric-value">${certificados.length}</div>
          </div>
        </div>

        <div class="section-title">Detalle de Declaraciones</div>
        ${
          declaraciones.length > 0
            ? `
          <table>
            <thead>
              <tr>
                <th>Año</th>
                <th>Estado</th>
                <th>Total Unidades</th>
                <th>Total Toneladas</th>
                <th>Categorías</th>
              </tr>
            </thead>
            <tbody>
              ${declaraciones
                .map(
                  (decl) => `
                <tr>
                  <td>${decl.anio}</td>
                  <td>${decl.estado}</td>
                  <td>${decl.totalUnidades.toLocaleString("es-CL")}</td>
                  <td>${decl.totalToneladas.toFixed(2)}</td>
                  <td>${decl.categorias.length}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
            : "<p>No hay declaraciones registradas para este año.</p>"
        }

        <div class="section-title">Resumen de Solicitudes</div>
        ${
          solicitudes.length > 0
            ? `
          <table>
            <thead>
              <tr>
                <th>Folio</th>
                <th>Estado</th>
                <th>Peso Estimado (kg)</th>
                <th>Peso Real (kg)</th>
                <th>Fecha Creación</th>
              </tr>
            </thead>
            <tbody>
              ${solicitudes
                .slice(0, 20)
                .map(
                  (sol) => `
                <tr>
                  <td>${sol.folio}</td>
                  <td>${sol.estado}</td>
                  <td>${sol.pesoTotalEstimado?.toFixed(2) || "N/A"}</td>
                  <td>${sol.pesoReal?.toFixed(2) || "N/A"}</td>
                  <td>${new Date(sol.createdAt).toLocaleDateString("es-CL")}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          ${solicitudes.length > 20 ? `<p style="color: #666; font-style: italic;">Mostrando las primeras 20 solicitudes de ${solicitudes.length} totales</p>` : ""}
        `
            : "<p>No hay solicitudes registradas para este año.</p>"
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
        "Content-Disposition": `attachment; filename="reporte-anual-${anio}-generador.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error generando PDF del reporte:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message:
          (error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)) || "Error desconocido al generar PDF",
      },
      { status: 500 }
    );
  }
}
