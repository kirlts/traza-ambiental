import { NextResponse } from "next/server";

// Configurar runtime para Node.js (requerido para PDFKit)
export const runtime = "nodejs";

async function generarPDFEjemplo(): Promise<Buffer> {
  // Importación dinámica de PDFKit
  const PDFDocument = (await import("pdfkit")).default;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        autoFirstPage: true,
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err: ReturnType<typeof JSON.parse>) => {
        console.error("Error en PDFDocument:", err);
        reject(err);
      });

      const fechaActual = new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // ========== ENCABEZADO CON LOGO TRAZAMBIENTAL ==========
      // Usamos Helvetica estándar que viene con PDFKit
      // Nota: En entornos serverless, podría requerir configuración adicional para fuentes
      doc.fontSize(28).font("Helvetica-Bold");
      doc.fillColor("#224b3c"); // Verde de la marca
      doc.text("TRAZAMBIENTAL", 50, 50, {
        align: "center",
        width: 512,
      });

      doc.fontSize(12).font("Helvetica");
      doc.fillColor("black");
      doc.text("Sistema Nacional de Gestión de Neumáticos", 50, 85, {
        align: "center",
        width: 512,
      });
      doc.text("Ley REP - Gestión Ambiental", 50, 103, {
        align: "center",
        width: 512,
      });

      // Línea divisoria azul
      doc.lineWidth(2);
      doc.strokeColor("#003d82");
      doc.moveTo(50, 125).lineTo(562, 125).stroke();
      doc.strokeColor("black");
      doc.lineWidth(1);

      // ========== TÍTULO PRINCIPAL ==========
      doc.fontSize(22).font("Helvetica-Bold");
      doc.text("CERTIFICADO DE VALORIZACIÓN", 50, 145, {
        align: "center",
        width: 512,
      });

      doc.moveTo(50, 175).lineTo(562, 175).stroke();
      let yPos = 190;

      // ========== SECCIÓN: DATOS DEL CERTIFICADO ==========
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("DATOS DEL CERTIFICADO", 50, yPos);
      yPos += 22;

      doc.lineWidth(0.5);
      doc.moveTo(50, yPos).lineTo(562, yPos).stroke();
      yPos += 18;

      doc.fontSize(11).font("Helvetica");
      doc.text("Folio: CERT-2025-0001", 50, yPos);
      yPos += 16;
      doc.text(`Fecha de Emisión: ${fechaActual}`, 50, yPos);
      yPos += 16;
      doc.text("Tipo de Tratamiento: Reciclaje Material", 50, yPos);
      yPos += 28;

      // ========== SECCIÓN: GENERADOR ==========
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("GENERADOR", 50, yPos);
      yPos += 22;

      doc.lineWidth(0.5);
      doc.moveTo(50, yPos).lineTo(562, yPos).stroke();
      yPos += 18;

      doc.fontSize(11).font("Helvetica");
      doc.text("Nombre: Empresa de Transporte XYZ Ltda.", 50, yPos);
      yPos += 16;
      doc.text("RUT: 76.543.210-8", 50, yPos);
      yPos += 16;
      doc.text("Dirección: Av. Industrial 1234, Santiago", 50, yPos, {
        width: 462,
      });
      yPos += 28;

      // ========== SECCIÓN: INFORMACIÓN DEL TRATAMIENTO ==========
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("INFORMACIÓN DEL TRATAMIENTO", 50, yPos);
      yPos += 22;

      doc.lineWidth(0.5);
      doc.moveTo(50, yPos).lineTo(562, yPos).stroke();
      yPos += 18;

      doc.fontSize(11).font("Helvetica");
      doc.text("Peso Valorizado: 1.250 kg", 50, yPos);
      yPos += 16;
      doc.text("Categoría: A - Neumáticos de vehículo liviano", 50, yPos, {
        width: 462,
      });
      yPos += 16;
      doc.text("Ubicación: Centro de Reciclaje Santiago", 50, yPos, {
        width: 462,
      });
      yPos += 28;

      // ========== SECCIÓN: GESTOR AUTORIZADO ==========
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("GESTOR AUTORIZADO", 50, yPos);
      yPos += 22;

      doc.lineWidth(0.5);
      doc.moveTo(50, yPos).lineTo(562, yPos).stroke();
      yPos += 18;

      doc.fontSize(11).font("Helvetica");
      doc.text("Nombre: Gestor Ambiental Certificado SpA", 50, yPos);
      yPos += 16;
      doc.text("RUT: 99.888.777-6", 50, yPos);
      yPos += 16;
      doc.text("Autorización: RES-REP-2025-0001", 50, yPos);

      // ========== FOOTER ==========
      const verifUrl = `${process.env.NEXTAUTH_URL || "https://traza-ambiental.com"}/verificar/CERT-2025-0001`;
      doc.fontSize(9).font("Helvetica");
      doc.text(`Verificación Digital: ${verifUrl}`, 50, 742, {
        width: 462,
        align: "left",
      });

      doc.fontSize(8).font("Helvetica");
      doc.text(
        "Este certificado acredita que los neumáticos detallados fueron valorizados según D.S. N°8 de Neumáticos bajo la Ley REP (Ley 20.920).",
        50,
        758,
        {
          width: 462,
          align: "left",
        }
      );

      doc.end();
    } catch (error: unknown) {
      console.error("Error en generarPDFEjemplo:", error);
      reject(error);
    }
  });
}

export async function GET() {
  try {
    const pdfBuffer = await generarPDFEjemplo();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="certificado-ejemplo.pdf"',
      },
    });
  } catch (error: unknown) {
    console.error("[EJEMPLO] Error generando PDF de ejemplo:", error);

    return NextResponse.json(
      {
        error: "Error al generar PDF de ejemplo",
        message:
          error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error),
      },
      { status: 500 }
    );
  }
}
