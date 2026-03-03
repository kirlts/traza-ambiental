import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import csv from "csv-parser";
import { Readable } from "stream";

const prisma = new PrismaClient();

// Configurar límite de tamaño de cuerpo si es necesario en next.config.js,
// pero aquí procesaremos stream.

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userRoles = session?.user?.roles || [];
    const isAdmin = userRoles.some((role: string) => role === "ADMINISTRADOR" || role === "ADMIN");
    if (!session || !isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    // ...

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ error: "El archivo debe ser un CSV" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Detectar delimitador: intentar primero con punto y coma, luego con coma
    const textContent = buffer.toString("utf-8");
    const firstLine = textContent.split("\n")[0] || "";
    const hasSemicolon = firstLine.includes(";");
    const hasComma = firstLine.includes(",");
    const separator = hasSemicolon ? ";" : hasComma ? "," : ";";

    // Detectar columnas disponibles en la primera línea
    const headers = firstLine.split(separator).map((h) => h.trim().toUpperCase());

    const stream = Readable.from(buffer);

    interface RetcRecord {
      retcId: string;
      razonSocial: string;
      direccion: string;
      comuna: string;
      region: string;
      rubro: string;
      estado: string;
      fuenteDatos: string;
    }

    const records: RetcRecord[] = [];
    let processed = 0;
    let errors = 0;
    let skippedRows = 0;
    const errorDetails: string[] = [];

    // Promesa para parsear el CSV
    await new Promise<void>((resolve, reject) => {
      let rowCount = 0;
      stream
        .pipe(csv({ separator }))
        .on("data", (data: ReturnType<typeof JSON.parse>) => {
          rowCount++;
          try {
            // Normalizar nombres de columnas (case-insensitive)
            const normalizedData: Record<string, string> = {};
            Object.keys(data).forEach((key) => {
              normalizedData[key.toUpperCase().trim()] = data[key];
            });

            const record = {
              retcId:
                normalizedData.ID ||
                normalizedData.ID_RETC ||
                normalizedData.VU_ID ||
                normalizedData["ID VU"] ||
                normalizedData["VU ID"],
              razonSocial:
                normalizedData.RAZON_SOCIAL ||
                normalizedData.NOMBRE_EMPRESA ||
                normalizedData.RAZÓN_SOCIAL ||
                normalizedData.EMPRESA,
              direccion:
                normalizedData.DIRECCION ||
                normalizedData.CALLE ||
                normalizedData.DIRECCIÓN ||
                normalizedData.DIRECCION_COMPLETA,
              comuna: normalizedData.COMUNA,
              region: normalizedData.REGION || normalizedData.REGIÓN,
              rubro: normalizedData.RUBRO || normalizedData.CIIU || normalizedData.ACTIVIDAD,
              estado: normalizedData.ESTADO || "ACTIVO",
              fuenteDatos: `Carga Manual Admin: ${file.name}`,
            };

            if (record.retcId && record.retcId.trim()) {
              records.push(record);
            } else {
              skippedRows++;
              if (skippedRows <= 5) {
                errorDetails.push(
                  `Fila ${rowCount}: No se encontró ID del establecimiento. Columnas disponibles: ${Object.keys(normalizedData).join(", ")}`
                );
              }
            }
          } catch (e: unknown) {
            skippedRows++;
            errors++;
            if (errorDetails.length < 5) {
              const errorMessage =
                e instanceof Error
                  ? (e as ReturnType<typeof JSON.parse>).message
                  : "Error al procesar";
              errorDetails.push(`Fila ${rowCount}: ${errorMessage}`);
            }
          }
        })
        .on("end", () => {
          resolve();
        })
        .on("error", (err: unknown) => {
          console.error("Error parseando CSV:", err);
          reject(
            new Error(`Error al parsear CSV: ${(err as ReturnType<typeof JSON.parse>).message}`)
          );
        });
    });

    // Procesar inserción en lotes
    // Nota: Para archivos muy grandes (>10MB), esto debería ser un Background Job.
    // Para MVP interactivo, lo hacemos aquí con cuidado.

    const BATCH_SIZE = 50;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (rec) => {
          try {
            await prisma.retcEstablecimiento.upsert({
              where: { retcId: rec.retcId },
              update: {
                razonSocial: rec.razonSocial,
                direccion: rec.direccion,
                comuna: rec.comuna,
                region: rec.region,
                rubro: rec.rubro,
                estado: rec.estado,
                fuenteDatos: rec.fuenteDatos,
                fechaImportacion: new Date(),
              },
              create: {
                retcId: rec.retcId,
                razonSocial: rec.razonSocial,
                direccion: rec.direccion,
                comuna: rec.comuna,
                region: rec.region,
                rubro: rec.rubro,
                estado: rec.estado,
                fuenteDatos: rec.fuenteDatos,
              },
            });
          } catch {
            errors++;
          }
        })
      );
      processed += batch.length;
    }

    // Validar que se encontraron registros
    if (records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontraron registros válidos en el archivo",
          details:
            errorDetails.length > 0
              ? errorDetails
              : [
                  "El archivo CSV no contiene registros con ID de establecimiento válido.",
                  `Columnas detectadas: ${headers.join(", ")}`,
                  "Verifique que el archivo tenga las columnas requeridas (ID, ID_RETC o VU_ID).",
                ],
          detectedColumns: headers,
          delimiter: separator,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Importación completada",
      stats: {
        total: records.length,
        processed,
        errors,
        skipped: skippedRows,
      },
      warnings: errorDetails.length > 0 ? errorDetails.slice(0, 5) : undefined,
    });
  } catch (error: unknown) {
    console.error("Error importando CSV:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el archivo" },
      { status: 500 }
    );
  }
}
