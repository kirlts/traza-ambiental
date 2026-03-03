import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { join } from "path";

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "traza-ambiental-bucket";

/**
 * Valida que un archivo sea una imagen válida
 * @param file Archivo a validar
 * @throws Error si el archivo no es válido
 */
export function validateImageFile(file: File): void {
  // Verificar tamaño máximo (5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error("El archivo es demasiado grande. Tamaño máximo: 5MB");
  }

  // Verificar tipo de archivo
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP) y PDF"
    );
  }

  // Verificar extensión del archivo
  const fileName = file.name.toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"];
  const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!hasValidExtension) {
    throw new Error("Extensión de archivo no válida");
  }
}

/**
 * Sube un archivo a AWS S3 o almacenamiento local según configuración
 * @param file Archivo a subir
 * @param folder Carpeta destino
 * @returns URL del archivo subido
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
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
    return uploadFileLocal(file, folder);
  }

  // Intentar subir a S3
  try {
    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${randomUUID()}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    // Convertir File a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Subir a S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Hacer el archivo público
      ACL: "public-read",
    });

    await s3Client.send(command);

    // Retornar URL del archivo
    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return url;
  } catch {
    // Fallback a almacenamiento local si S3 falla
    return uploadFileLocal(file, folder);
  }
}

/**
 * Sube un archivo al almacenamiento local (filesystem)
 * @param file Archivo a subir
 * @param folder Carpeta destino relativa a /public/uploads
 * @returns URL del archivo subido
 */
async function uploadFileLocal(file: File, folder: string): Promise<string> {
  try {
    // Crear estructura de carpetas en /public/uploads
    const uploadsDir = join(process.cwd(), "public", "uploads", folder);

    // Crear directorio si no existe
    try {
      await fs.access(uploadsDir);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convertir File a Buffer y escribir en disco
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Retornar URL relativa que Next.js servirá desde /public
    const url = `/uploads/${folder}/${fileName}`;
    return url;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? (error as ReturnType<typeof JSON.parse>).message
        : "Error desconocido";
    throw new Error(`Error al guardar el archivo localmente: ${message}`);
  }
}

/**
 * Valida que un archivo sea un documento válido (PDF, imágenes)
 * @param file Archivo a validar
 * @throws Error si el archivo no es válido
 */
export function validateDocumentFile(file: File): void {
  // Verificar tamaño máximo (10MB para documentos)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error("El archivo es demasiado grande. Tamaño máximo: 10MB");
  }

  // Verificar tipo de archivo
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Tipo de archivo no permitido. Solo se permiten imágenes, PDF, Word y Excel");
  }
}
