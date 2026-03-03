import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generarHashGuia } from "@/lib/crypto";
import QRCode from "qrcode";
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import { join } from "path";

interface GuiaPDFData {
  folio: string;
  fechaEmision: Date;
  carga: {
    origen: string;
    destino: string;
    descripcion: string;
    peso: number;
    cantidad: number;
    categoria: string;
  };
  qrCode: string;
  generador: {
    name: string | null;
    rut: string | null;
    direccion: string | null;
    idRETC: string | null;
  };
  transportista: {
    name: string | null;
    rut: string | null;
  } | null;
  vehiculo: {
    patente: string;
  } | null;
  conductor: {
    nombre: string;
    rut: string;
  };
  hashIntegridad: string;
}

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: solicitudId } = await params;
    const body = await request.json(); // Esperamos pesoReal y cantidadReal si aplica

    // Verificar roles permitidos (Transportista)
    // Nota: Usamos verificación simple por ahora ya que el helper isTransportista puede no estar disponible
    // Idealmente: if (!isTransportista(session)) ...

    // Obtener la solicitud con todas las relaciones necesarias
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id: solicitudId },
      include: {
        generador: {
          select: {
            name: true,
            rut: true,
            email: true,
            direccion: true,
            comuna: true,
            region: true,
            idRETC: true, // Importante para la Guía
          },
        },
        transportista: {
          select: {
            id: true,
            name: true,
            rut: true,
            email: true,
            direccion: true,
          },
        },
        vehiculo: {
          select: {
            patente: true,
            tipo: true,
            capacidadKg: true,
          },
        },
        gestor: {
          select: {
            name: true,
            rut: true,
            direccion: true,
          },
        },
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // Verificar que el transportista sea el asignado
    if (solicitud.transportistaId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permisos sobre esta solicitud" },
        { status: 403 }
      );
    }

    // Verificar que no exista ya una guía

    if (!prisma.guiaDespacho) {
      return NextResponse.json(
        {
          error: "Modelo GuiaDespacho no está disponible. Por favor, regenera Prisma Client.",
          details: "Ejecuta: npx prisma generate",
        },
        { status: 500 }
      );
    }

    const guiaExistente = await prisma.guiaDespacho.findUnique({
      where: { solicitudId },
    });

    if (guiaExistente) {
      return NextResponse.json(
        {
          error: "Ya existe una Guía de Despacho para esta solicitud",
          guia: guiaExistente,
        },
        { status: 400 }
      );
    }

    // Datos del conductor (sacados de la sesión o del perfil del transportista por ahora)
    // En un sistema real, el conductor podría ser un usuario distinto al transportista empresa
    const conductorNombre = session.user.name || "Conductor No Identificado";
    const conductorRut = solicitud.transportista?.rut || "N/A";
    const vehiculoPatente = solicitud.vehiculo?.patente || "N/A";

    // Generar folio secuencial
    const anioActual = new Date().getFullYear();
    let folio: string;
    try {
      folio = await generarFolioGuia(anioActual);
    } catch (error: unknown) {
      console.error("❌ Error generando folio:", error);
      const message =
        error instanceof Error
          ? (error as ReturnType<typeof JSON.parse>).message
          : "Error desconocido";
      return NextResponse.json(
        {
          error: "Error al generar folio de la guía",
          details: message,
        },
        { status: 500 }
      );
    }

    // ===== HU-022: Generación de Hash de Integridad =====
    const hashIntegridad = generarHashGuia({
      folio,
      fechaEmision: new Date(),
      rutGenerador: solicitud.generador.rut || "N/A",
      rutTransportista: solicitud.transportista?.rut || "N/A",
      rutGestor: solicitud.gestor?.rut || "N/A",
      patente: solicitud.vehiculo?.patente || "N/A",
      pesoKg: (body.pesoReal as number) || solicitud.pesoTotalEstimado || 0,
    });
    // ====================================================

    // Generar código QR
    let qrCodeBase64: string;
    try {
      const qrCodeData = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verificar/guia/${folio}`;
      qrCodeBase64 = await QRCode.toDataURL(qrCodeData, {
        width: 200,
        margin: 2,
      });
    } catch {
      return NextResponse.json({ error: "Error generando QR" }, { status: 500 });
    }

    // Preparar datos para PDF
    const datosGuia: GuiaPDFData = {
      folio,
      fechaEmision: new Date(),
      carga: {
        origen: solicitud.direccionRetiro,
        destino: solicitud.gestor?.direccion || "Planta de Valorización",
        descripcion: `Retiro de NFU - Solicitud ${solicitud.folio}`,
        peso: (body.pesoReal as number) || solicitud.pesoTotalEstimado || 0,
        cantidad: (body.cantidadReal as number) || solicitud.cantidadTotal || 0,
        categoria:
          solicitud.categoriaA_cantidad > 0 && solicitud.categoriaB_cantidad > 0
            ? "Mixto (A y B)"
            : solicitud.categoriaA_cantidad > 0
              ? "Categoría A"
              : "Categoría B",
      },
      qrCode: qrCodeBase64,
      generador: {
        name: solicitud.generador.name,
        rut: solicitud.generador.rut,
        direccion: solicitud.generador.direccion,
        idRETC: solicitud.generador.idRETC,
      },
      transportista: solicitud.transportista
        ? {
            name: solicitud.transportista.name,
            rut: solicitud.transportista.rut,
          }
        : null,
      vehiculo: solicitud.vehiculo
        ? {
            patente: solicitud.vehiculo.patente,
          }
        : null,
      conductor: {
        nombre: conductorNombre,
        rut: conductorRut,
      },
      hashIntegridad,
    };

    // Generar PDF
    const pdfBuffer = await generarGuiaPDF(datosGuia);

    // Subir archivos
    const pdfUrl = `/uploads/guias/${solicitudId}/${folio}.pdf`;
    const qrUrl = `/uploads/guias/${solicitudId}/${folio}-qr.png`;

    await subirBuffer(pdfBuffer, `guias/${solicitudId}`, `${folio}.pdf`, "application/pdf");
    const qrBuffer = Buffer.from(qrCodeBase64.split(",")[1], "base64");
    await subirBuffer(qrBuffer, `guias/${solicitudId}`, `${folio}-qr.png`, "image/png");

    // Crear registro en BD
    const resultado = await prisma.$transaction(async (tx) => {
      const nuevaGuia = await tx.guiaDespacho.create({
        data: {
          numeroGuia: folio,
          solicitudId,
          fechaEmision: new Date(),
          vehiculoPatente: vehiculoPatente,
          conductorNombre: conductorNombre,
          conductorRut: conductorRut,
          descripcionCarga: datosGuia.carga.descripcion,
          categoriaNeumatico: datosGuia.carga.categoria,
          pesoKg: datosGuia.carga.peso || 0,
          cantidadUnidades: datosGuia.carga.cantidad || 0,
          pdfUrl: pdfUrl,
          qrCodeUrl: qrUrl,
          generadoPor: session.user.id,
          hashIntegridad: hashIntegridad, // HU-022
        },
      });

      // 2. Actualizar Solicitud a RECOLECTADA (si no lo estaba)
      const solicitudActualizada = await tx.solicitudRetiro.update({
        where: { id: solicitudId },
        data: {
          estado: "RECOLECTADA",
          fechaRecoleccion: new Date(),
          pesoReal: body.pesoReal || undefined, // Actualizar si vienen en el body
          cantidadReal: body.cantidadReal || undefined,
        },
      });

      // 3. Registrar Cambio de Estado
      await tx.cambioEstado.create({
        data: {
          solicitudId,
          estadoAnterior: solicitud.estado,
          estadoNuevo: "RECOLECTADA",
          realizadoPor: session.user.id,
          notas: `Recolección registrada y Guía de Despacho generada: ${folio}`,
        },
      });

      return { guia: nuevaGuia, solicitud: solicitudActualizada };
    });

    return NextResponse.json({
      success: true,
      data: resultado,
      message: "Guía de Despacho generada exitosamente",
    });
  } catch (error: unknown) {
    console.error("❌ Error en generación de guía:", error);
    const message =
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido";
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: message,
      },
      { status: 500 }
    );
  }
}

// Helpers (Duplicados o adaptados de certificados por ahora)

async function generarFolioGuia(anio: number): Promise<string> {
  if (!prisma.secuenciaGuia) throw new Error("Modelo SecuenciaGuia no disponible");

  return await prisma.$transaction(async (tx) => {
    let secuencia = await tx.secuenciaGuia.findUnique({ where: { anio } });
    if (!secuencia) {
      secuencia = await tx.secuenciaGuia.create({
        data: { anio, secuencia: 1, id: "folio-guia-despacho" },
      });
    } else {
      secuencia = await tx.secuenciaGuia.update({
        where: { anio },
        data: { secuencia: secuencia.secuencia + 1 },
      });
    }
    return `GD-${anio}-${secuencia.secuencia.toString().padStart(6, "0")}`;
  });
}

async function generarGuiaPDF(data: ReturnType<typeof JSON.parse>): Promise<Buffer> {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .folio { color: #cc0000; font-size: 18px; font-weight: bold; }
            .section { margin-bottom: 20px; border: 1px solid #ccc; padding: 10px; }
            .section-title { background-color: #eee; padding: 5px; font-weight: bold; margin: -10px -10px 10px -10px; border-bottom: 1px solid #ccc; }
            .row { display: flex; margin-bottom: 5px; }
            .label { width: 150px; font-weight: bold; }
            .value { flex: 1; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            .qr-code { position: absolute; top: 40px; right: 40px; width: 100px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">GUÍA DE DESPACHO ELECTRÓNICA</div>
            <div class="folio">Nº ${data.folio}</div>
            <div>Fecha Emisión: ${data.fechaEmision.toLocaleString("es-CL")}</div>
        </div>
        
        <img src="${data.qrCode}" class="qr-code" />

        <div class="section">
            <div class="section-title">ORIGEN (GENERADOR)</div>
            <div class="row"><span class="label">Razón Social:</span><span class="value">${data.generador?.name}</span></div>
            <div class="row"><span class="label">RUT:</span><span class="value">${data.generador?.rut}</span></div>
            <div class="row"><span class="label">Dirección:</span><span class="value">${data.carga.origen}</span></div>
            <div class="row"><span class="label">ID RETC:</span><span class="value">${data.generador?.idRETC || "N/A"}</span></div>
        </div>

        <div class="section">
            <div class="section-title">DESTINO (GESTOR)</div>
            <div class="row"><span class="label">Dirección Entrega:</span><span class="value">${data.carga.destino}</span></div>
        </div>

        <div class="section">
            <div class="section-title">TRANSPORTE</div>
            <div class="row"><span class="label">Transportista:</span><span class="value">${data.transportista?.name}</span></div>
            <div class="row"><span class="label">RUT Transportista:</span><span class="value">${data.transportista?.rut}</span></div>
            <div class="row"><span class="label">Vehículo:</span><span class="value">${data.vehiculo?.patente || "N/A"}</span></div>
            <div class="row"><span class="label">Conductor:</span><span class="value">${data.conductor?.nombre || "N/A"} (RUT: ${data.conductor?.rut || "N/A"})</span></div>
        </div>

        <div class="section">
            <div class="section-title">DETALLE DE LA CARGA</div>
            <div class="row"><span class="label">Descripción:</span><span class="value">${data.carga.descripcion}</span></div>
            <div class="row"><span class="label">Categoría:</span><span class="value">${data.carga.categoria}</span></div>
            <div class="row"><span class="label">Cantidad:</span><span class="value">${data.carga.cantidad} unidades</span></div>
            <div class="row"><span class="label">Peso Estimado:</span><span class="value">${data.carga.peso} kg</span></div>
        </div>

        <div class="footer">
            <p>Documento Generado Electrónicamente - Sistema de Trazabilidad Ambiental</p>
            <p>Verifique la autenticidad de este documento escaneando el código QR</p>
            <p style="font-family: monospace; font-size: 10px; margin-top: 10px;">Hash de Integridad: ${data.hashIntegridad}</p>
        </div>
    </body>
    </html>
    `;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();
    return Buffer.from(pdf);
  } catch (e: unknown) {
    await browser.close();
    throw e;
  }
}

async function subirBuffer(
  buffer: Buffer,
  folder: string,
  fileName: string,
  _contentType: string
): Promise<string> {
  const uploadsDir = join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${folder}/${fileName}`;
}
