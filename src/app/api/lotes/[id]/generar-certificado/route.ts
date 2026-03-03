import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";
import QRCode from "qrcode";
import puppeteer from "puppeteer";
import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import { join } from "path";
import { type CertificadoMetadata } from "@/types/api";
import { type Prisma, type SolicitudRetiro } from "@prisma/client";

interface _SolicitudForCertificado extends SolicitudRetiro {
  generador: { name: string | null; rut: string | null; email: string | null } | null;
  transportista: { name: string | null; rut: string | null; email: string | null } | null;
  gestor: { name: string | null; rut: string | null; email: string | null } | null;
  vehiculo: { patente: string | null; tipo: string | null } | null;
  cambiosEstado: { notas: string | null }[];
}

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: solicitudId } = await params;

    // Leer metadatos adicionales del body (HU-032)
    let metadatos: CertificadoMetadata = {};
    try {
      metadatos = await request.json();
    } catch {
      // Si falla o está vacío, continuar sin metadatos
    }
    const { destino, productoFinal } = metadatos;

    // Verificar que el usuario sea gestor usando el helper
    if (!isGestor(session)) {
      return NextResponse.json(
        { error: "Solo gestores pueden generar certificados" },
        { status: 403 }
      );
    }

    // HU-029C: Verificar que el gestor tenga su perfil legal validado
    const perfilLegal = await prisma.managerLegalProfile.findUnique({
      where: { managerId: session.user.id },
    });

    if (!perfilLegal || perfilLegal.status !== "VERIFICADO") {
      return NextResponse.json(
        {
          error:
            "Tu perfil legal debe estar VERIFICADO por un administrador para emitir certificados.",
          code: "LEGAL_PROFILE_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    const certificadoModel = prisma.certificado;
    if (!certificadoModel) {
      return NextResponse.json(
        {
          error: "Modelo Certificado no está disponible. Por favor, regenera Prisma Client.",
          details: "Ejecuta: npx prisma generate",
        },
        { status: 500 }
      );
    }

    // Obtener la solicitud con todas las relaciones necesarias
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
      include: {
        generador: {
          select: {
            name: true,
            rut: true,
            email: true,
          },
        },
        transportista: {
          select: {
            name: true,
            rut: true,
            email: true,
          },
        },
        gestor: {
          select: {
            name: true,
            rut: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            patente: true,
            tipo: true,
          },
        },
        cambiosEstado: {
          where: {
            estadoNuevo: "TRATADA",
          },
          orderBy: {
            fecha: "desc",
          },
          take: 1,
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // HU-032: Validación de Capacidad Operativa (Balance de Masa)
    if (perfilLegal.authorizedCapacity) {
      const anioActual = new Date().getFullYear();
      const fechaInicio = new Date(anioActual, 0, 1);
      const fechaFin = new Date(anioActual, 11, 31, 23, 59, 59);

      const certificadosAnio = await prisma.certificado.findMany({
        where: {
          gestorId: session.user.id,
          fechaEmision: {
            gte: fechaInicio,
            lte: fechaFin,
          },
          estado: "emitido",
        },
        select: {
          pesoValorizado: true,
        },
      });

      const totalProcesadoKg = certificadosAnio.reduce(
        (sum: number, cert: ReturnType<typeof JSON.parse>) => sum + (cert.pesoValorizado || 0),
        0
      );
      const totalProcesadoTons = totalProcesadoKg / 1000;

      const pesoSolicitudKg = solicitud.pesoReal || solicitud.pesoTotalEstimado || 0;
      const pesoSolicitudTons = pesoSolicitudKg / 1000;

      const nuevaProyeccionTons = totalProcesadoTons + pesoSolicitudTons;

      // Log de balance de masa eliminado

      if (nuevaProyeccionTons > perfilLegal.authorizedCapacity) {
        return NextResponse.json(
          {
            error: `Capacidad anual excedida.`,
            details: `Tu capacidad autorizada es de ${perfilLegal.authorizedCapacity} toneladas/año. Con este certificado llegarías a ${nuevaProyeccionTons.toFixed(2)} toneladas.`,
            code: "CAPACITY_EXCEEDED",
          },
          { status: 403 }
        );
      }
    }

    // Verificar que el gestor sea el propietario
    if (solicitud.gestorId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos sobre esta solicitud" },
        { status: 403 }
      );
    }

    // Verificar que esté en estado TRATADA
    if (solicitud.estado !== "TRATADA") {
      return NextResponse.json(
        {
          error: "Solo se puede generar certificado para lotes tratados",
          estadoActual: solicitud.estado,
        },
        { status: 400 }
      );
    }

    // Verificar si no exista ya un certificado
    try {
      const certificadoExistente = await prisma.certificado.findUnique({
        where: { solicitudId },
      });

      if (certificadoExistente) {
        return NextResponse.json(
          {
            error: "Ya existe un certificado para este lote",
            certificado: certificadoExistente,
          },
          { status: 400 }
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)
          : "Error desconocido";
      console.warn("⚠️ Error verificando certificado existente:", errorMessage);
    }

    // Extraer información del tratamiento desde las notas del CambioEstado
    const cambioEstado = solicitud.cambiosEstado[0];
    const notas = cambioEstado?.notas || "";

    let tipoTratamiento = "No especificado";
    let fechaInicioTratamiento = "";
    let ubicacionTratamiento = solicitud.direccionRetiro || "N/A";

    if (notas) {
      const tipoMatch = notas.match(/Tratamiento asignado:\s*([^|]+)/);
      if (tipoMatch) {
        tipoTratamiento = tipoMatch[1].trim();
      }

      const fechaInicioMatch = notas.match(/Fecha inicio:\s*([^|]+)/);
      if (fechaInicioMatch) {
        fechaInicioTratamiento = fechaInicioMatch[1].trim();
      }

      const ubicacionMatch = notas.match(/Ubicación:\s*([^|]+)/);
      if (ubicacionMatch) {
        ubicacionTratamiento = ubicacionMatch[1].trim();
      }
    }

    // Generar folio secuencial
    const anioActual = new Date().getFullYear();
    let folio: string;
    try {
      folio = await generarFolioSecuencial(anioActual);
    } catch (error: unknown) {
      console.error("❌ Error generando folio:", error);
      const errorMessage =
        error instanceof Error
          ? error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)
          : "Error desconocido";
      return NextResponse.json(
        {
          error: "Error al generar folio del certificado",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Generar token único para verificación
    const tokenVerificacion = randomBytes(32).toString("hex");

    // Generar código QR como base64 para incluirlo en el HTML
    let qrCodeBase64: string;
    try {
      const qrCodeData = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verificar/${folio}`;
      qrCodeBase64 = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 2,
      });
    } catch (error: unknown) {
      console.error("❌ Error generando QR code:", error);
      const errorMessage =
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido";
      return NextResponse.json(
        {
          error: "Error al generar código QR",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Generar PDF del certificado usando Puppeteer (HTML/CSS)
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generarCertificadoPDF(
        solicitud,
        tipoTratamiento,
        fechaInicioTratamiento,
        ubicacionTratamiento,
        folio,
        qrCodeBase64,
        destino,
        productoFinal
      );
    } catch (error: unknown) {
      console.error("❌ Error generando PDF:", error);
      const errorMessage =
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido";
      return NextResponse.json(
        {
          error: "Error al generar PDF del certificado",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Subir archivos (PDF y QR) usando el sistema de almacenamiento
    let pdfUrl: string;
    let qrCodeUrl: string;
    try {
      // Generar QR como buffer para guardarlo también
      const qrCodeBuffer = Buffer.from(qrCodeBase64.split(",")[1], "base64");

      // Subir archivos
      [pdfUrl, qrCodeUrl] = await Promise.all([
        subirBuffer(pdfBuffer, `certificados/${solicitudId}`, `${folio}.pdf`, "application/pdf"),
        subirBuffer(qrCodeBuffer, `certificados/${solicitudId}`, `${folio}-qr.png`, "image/png"),
      ]);
    } catch (error: unknown) {
      console.error("❌ Error subiendo archivos:", error);
      const errorMessage =
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido";
      return NextResponse.json(
        {
          error: "Error al subir archivos del certificado",
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // Calcular datos consolidados
    const tratamientos =
      tipoTratamiento !== "No especificado"
        ? [
            {
              tipo: tipoTratamiento,
              peso: solicitud.pesoReal || solicitud.pesoTotalEstimado || 0,
            },
          ]
        : [];

    const categorias: string[] = [];
    if (solicitud.categoriaA_cantidad > 0) {
      categorias.push("A");
    }
    if (solicitud.categoriaB_cantidad > 0) {
      categorias.push("B");
    }

    // Crear certificado en base de datos
    let certificado;
    try {
      certificado = await prisma.certificado.create({
        data: {
          folio,
          solicitudId,
          gestorId: session.user.id,
          sistemaGestionId: solicitud.generadorId,
          pesoValorizado: solicitud.pesoReal || solicitud.pesoTotalEstimado || 0,
          cantidadUnidades: solicitud.cantidadReal || solicitud.cantidadTotal || 0,
          categorias,
          tratamientos: tratamientos as Prisma.InputJsonValue,
          fechaEmision: new Date(),
          pdfUrl,
          qrCode: qrCodeUrl,
          tokenVerificacion,
          estado: "emitido",
        },
      });
    } catch (error: unknown) {
      console.error("❌ Error creando certificado en BD:", error);
      const errorMessage =
        error instanceof Error
          ? error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : String(error)
          : "Error desconocido";
      const errorStack =
        error instanceof Error ? (error as ReturnType<typeof JSON.parse>).stack : undefined;
      return NextResponse.json(
        {
          error: "Error al guardar certificado en base de datos",
          details: errorMessage,
          stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      certificado,
      mensaje: "Certificado generado exitosamente",
    });
  } catch (error: unknown) {
    console.error("❌ Error generando certificado:", error);
    const errorMessage =
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: errorMessage,
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).stack
            : undefined,
      },
      { status: 500 }
    );
  }
}

async function generarFolioSecuencial(anio: number): Promise<string> {
  const certificadoModel = prisma.secuenciaFolio;

  // Verificar si el modelo existe
  if (!certificadoModel) {
    throw new Error("Modelo SecuenciaFolio no está disponible. Ejecuta: npx prisma generate");
  }

  // Usar transacción para asegurar atomicidad
  const result = await prisma.$transaction(async (tx) => {
    // Obtener o crear registro de secuencia para el año
    let secuencia = await tx.secuenciaFolio.findUnique({
      where: { anio },
    });

    if (!secuencia) {
      secuencia = await tx.secuenciaFolio.create({
        data: {
          anio,
          secuencia: 1,
          id: "folio-certificados",
        },
      });
    } else {
      // Incrementar secuencia
      secuencia = await tx.secuenciaFolio.update({
        where: { anio },
        data: { secuencia: secuencia.secuencia + 1 },
      });
    }

    // Formatear folio: CERT-YYYY-XXXX
    const numeroSecuencial = secuencia.secuencia.toString().padStart(4, "0");
    return `CERT-${anio}-${numeroSecuencial}`;
  });

  return result;
}

async function generarCertificadoPDF(
  solicitud: ReturnType<typeof JSON.parse>,
  tipoTratamiento: string,
  fechaInicioTratamiento: string,
  ubicacionTratamiento: string,
  folio: string,
  qrCodeBase64: string,
  destino?: string,
  productoFinal?: string
): Promise<Buffer> {
  const fechaEmision = new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const pesoValorizado = solicitud.pesoReal || solicitud.pesoTotalEstimado || 0;

  // Determinar categoría
  let categoriaTexto = "N/A";
  if (solicitud.categoriaA_cantidad > 0 && solicitud.categoriaB_cantidad > 0) {
    categoriaTexto = "A y B - Neumáticos de vehículo liviano y pesado";
  } else if (solicitud.categoriaA_cantidad > 0) {
    categoriaTexto = "A - Neumáticos de vehículo liviano";
  } else if (solicitud.categoriaB_cantidad > 0) {
    categoriaTexto = "B - Neumáticos de vehículo pesado";
  }

  const autorizacion = `RES-REP-${new Date().getFullYear()}-${folio.split("-")[2]}`;
  const verifUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verificar/${folio}`;

  // Generar HTML para el certificado
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificado de Valorización - ${folio}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          margin: 0;
          padding: 50px;
          color: #2b3b4c;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #003d82;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #224b3c;
          margin-bottom: 8px;
          letter-spacing: 2px;
        }
        .subtitle {
          font-size: 12px;
          color: #666;
          margin-bottom: 3px;
        }
        .title {
          font-size: 22px;
          font-weight: bold;
          text-align: center;
          color: #2b3b4c;
          margin: 25px 0;
          padding-bottom: 15px;
          border-bottom: 2px solid #459e60;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          color: #2b3b4c;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-row {
          display: flex;
          margin-bottom: 8px;
          font-size: 11px;
        }
        .info-label {
          font-weight: bold;
          min-width: 140px;
          color: #2b3b4c;
        }
        .info-value {
          flex: 1;
          color: #333;
        }
        .qr-container {
          position: absolute;
          bottom: 50px;
          right: 50px;
          text-align: center;
        }
        .qr-code {
          width: 80px;
          height: 80px;
          margin-bottom: 5px;
        }
        .qr-text {
          font-size: 8px;
          color: #666;
        }
        .footer {
          position: absolute;
          bottom: 20px;
          left: 50px;
          right: 50px;
          font-size: 8px;
          color: #666;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
        }
        .legal-note {
          font-size: 8px;
          color: #666;
          font-style: italic;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">TRAZAMBIENTAL</div>
        <div class="subtitle">Sistema Nacional de Gestión de Neumáticos</div>
        <div class="subtitle">Ley REP - Gestión Ambiental</div>
      </div>

      <div class="title">CERTIFICADO DE VALORIZACIÓN</div>

      <div class="section">
        <div class="section-title">DATOS DEL CERTIFICADO</div>
        <div class="info-row">
          <span class="info-label">Folio:</span>
          <span class="info-value">${folio}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Fecha de Emisión:</span>
          <span class="info-value">${fechaEmision}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Tipo de Tratamiento:</span>
          <span class="info-value">${tipoTratamiento}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">GENERADOR</div>
        <div class="info-row">
          <span class="info-label">Nombre:</span>
          <span class="info-value">${solicitud.generador?.name || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">RUT:</span>
          <span class="info-value">${solicitud.generador?.rut || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Dirección:</span>
          <span class="info-value">${solicitud.direccionRetiro || "N/A"}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">INFORMACIÓN DEL TRATAMIENTO</div>
        <div class="info-row">
          <span class="info-label">Peso Valorizado:</span>
          <span class="info-value">${pesoValorizado.toLocaleString("es-CL")} kg</span>
        </div>
        <div class="info-row">
          <span class="info-label">Categoría:</span>
          <span class="info-value">${categoriaTexto}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ubicación:</span>
          <span class="info-value">${ubicacionTratamiento}</span>
        </div>
        ${
          destino
            ? `
        <div class="info-row">
          <span class="info-label">Destino Material:</span>
          <span class="info-value">${destino}</span>
        </div>
        `
            : ""
        }
        ${
          productoFinal
            ? `
        <div class="info-row">
          <span class="info-label">Producto Obtenido:</span>
          <span class="info-value">${productoFinal}</span>
        </div>
        `
            : ""
        }
        ${
          fechaInicioTratamiento
            ? `
        <div class="info-row">
          <span class="info-label">Fecha de Inicio:</span>
          <span class="info-value">${fechaInicioTratamiento}</span>
        </div>
        `
            : ""
        }
      </div>

      <div class="section">
        <div class="section-title">GESTOR AUTORIZADO</div>
        <div class="info-row">
          <span class="info-label">Nombre:</span>
          <span class="info-value">${solicitud.gestor?.name || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">RUT:</span>
          <span class="info-value">${solicitud.gestor?.rut || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Autorización:</span>
          <span class="info-value">${autorizacion}</span>
        </div>
      </div>

      <div class="qr-container">
        <img src="${qrCodeBase64}" alt="QR Code" class="qr-code" />
        <div class="qr-text">Verificar Certificado</div>
      </div>

      <div class="footer">
        <div>Verificación Digital: ${verifUrl}</div>
        <div class="legal-note">
          Este certificado acredita que los neumáticos detallados fueron valorizados según D.S. N°8 de Neumáticos bajo la Ley REP (Ley 20.920).
        </div>
      </div>
    </body>
    </html>
  `;

  // Generar PDF usando Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    return Buffer.from(pdfBuffer);
  } catch (error: unknown) {
    await browser.close();
    throw error;
  }
}

/**
 * Sube un buffer directamente a S3 o almacenamiento local
 */
async function subirBuffer(
  buffer: Buffer,
  folder: string,
  fileName: string,
  contentType: string
): Promise<string> {
  const STORAGE_TYPE = process.env.STORAGE_TYPE || "local";

  // Verificar si hay credenciales de S3 configuradas
  const hasS3Config =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID !== "" &&
    process.env.AWS_SECRET_ACCESS_KEY !== "";

  // Si no hay S3 configurado, usar almacenamiento local
  if (STORAGE_TYPE === "local" || !hasS3Config) {
    return subirBufferLocal(buffer, folder, fileName);
  }

  // Intentar subir a S3
  try {
    const fileExtension = fileName.split(".").pop() || "";
    const uniqueFileName = `${randomUUID()}.${fileExtension}`;
    const key = `${folder}/${uniqueFileName}`;

    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "traza-ambiental-bucket",
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return url;
  } catch (error: unknown) {
    console.warn(
      "⚠️ Error subiendo a S3, usando almacenamiento local:",
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido"
    );
    return subirBufferLocal(buffer, folder, fileName);
  }
}

/**
 * Sube un buffer al almacenamiento local
 */
async function subirBufferLocal(buffer: Buffer, folder: string, fileName: string): Promise<string> {
  try {
    const uploadsDir = join(process.cwd(), "public", "uploads", folder);

    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const uniqueFileName = `${randomUUID()}-${fileName}`;
    const filePath = join(uploadsDir, uniqueFileName);

    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${folder}/${uniqueFileName}`;
    // Log de guardado local eliminado
    return url;
  } catch (error: unknown) {
    console.error("❌ Error en almacenamiento local:", error);
    throw new Error(
      `Error al guardar el archivo localmente: ${(error instanceof Error ? (error as ReturnType<typeof JSON.parse>).message : String(error)) || "Error desconocido"}`
    );
  }
}
