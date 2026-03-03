import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isGestor } from "@/lib/auth-helpers";
import { uploadFile, validateImageFile } from "@/lib/storage";
import { z } from "zod";

interface DiscrepanciaData {
  tipo: "peso" | "cantidad" | "categoria";
  valorTransportista: string;
  valorGestor: string;
  porcentajeDiferencia: number | null;
  notasGestor: string | null;
}

// Schema de validación para los datos del formulario
const validarRecepcionSchema = z.object({
  pesoRomana: z.number().positive("El peso debe ser mayor a 0").max(10000, "Peso máximo 10.000 kg"),
  cantidadVerificada: z
    .number()
    .int()
    .positive("La cantidad debe ser mayor a 0")
    .max(2000, "Cantidad máxima 2.000 unidades"),
  categoriaVerificada: z
    .array(z.enum(["A", "B"]))
    .min(1, "Debe seleccionar al menos una categoría"),
  observacionesGestor: z.string().optional(),
});

/**
 * POST /api/solicitudes/[id]/validar-recepcion
 *
 * Registra la validación del gestor y actualiza el estado de la solicitud.
 * Maneja subida de archivos (guía de despacho y fotos).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 401 });
    }

    if (!isGestor(session)) {
      return NextResponse.json({ error: "No autorizado - Requiere rol gestor" }, { status: 403 });
    }

    // Parsear el form data (multipart/form-data)
    const formData = await request.formData();

    // PRIMERO: Extraer todos los campos de texto ANTES de procesar archivos
    const pesoRomanaStr = formData.get("pesoRomana") as string | null;
    const cantidadVerificadaStr = formData.get("cantidadVerificada") as string | null;
    const categoriaVerificadaStr = formData.get("categoriaVerificada") as string | null;
    const observacionesGestor = (formData.get("observacionesGestor") as string) || null;

    // Extraer archivos para validación posterior
    // Usar getAll() para obtener todos los valores y filtrar archivos
    const guiaDespachoFile = formData.get("guiaDespacho") as File | null;
    const fotoFiles: File[] = [];

    // Recopilar todas las fotos - buscar desde foto0 hasta foto10
    for (let i = 0; i <= 10; i++) {
      const fotoFile = formData.get(`foto${i}`) as File | null;
      if (fotoFile && fotoFile instanceof File) {
        fotoFiles.push(fotoFile);
      }
    }

    // Debug: Log todos los campos recibidos eliminado

    // Validar que los archivos sean instancias válidas de File
    if (guiaDespachoFile && !(guiaDespachoFile instanceof File)) {
      console.error("❌ guiaDespacho no es una instancia válida de File:", typeof guiaDespachoFile);
      return NextResponse.json(
        { error: "El archivo de guía de despacho no es válido" },
        { status: 400 }
      );
    }

    for (let i = 0; i < fotoFiles.length; i++) {
      if (!(fotoFiles[i] instanceof File)) {
        console.error(`❌ Foto ${i} no es una instancia válida de File:`, typeof fotoFiles[i]);
        return NextResponse.json(
          { error: `La foto ${i + 1} no es un archivo válido` },
          { status: 400 }
        );
      }
    }

    // Log de tipos eliminado

    // Validar que los campos requeridos existan
    if (!pesoRomanaStr || (typeof pesoRomanaStr === "string" && pesoRomanaStr.trim() === "")) {
      console.error("❌ Validación fallida: pesoRomana está vacío o es null");
      return NextResponse.json(
        { error: "El peso es requerido", received: { pesoRomanaStr } },
        { status: 400 }
      );
    }

    if (
      !cantidadVerificadaStr ||
      (typeof cantidadVerificadaStr === "string" && cantidadVerificadaStr.trim() === "")
    ) {
      console.error("❌ Validación fallida: cantidadVerificada está vacío o es null");
      return NextResponse.json(
        { error: "La cantidad es requerida", received: { cantidadVerificadaStr } },
        { status: 400 }
      );
    }

    if (
      !categoriaVerificadaStr ||
      (typeof categoriaVerificadaStr === "string" && categoriaVerificadaStr.trim() === "")
    ) {
      console.error("❌ Validación fallida: categoriaVerificada está vacío o es null");
      return NextResponse.json(
        { error: "Debe seleccionar al menos una categoría", received: { categoriaVerificadaStr } },
        { status: 400 }
      );
    }

    // Convertir valores numéricos (asegurarse de que son strings)
    const pesoRomanaValue =
      typeof pesoRomanaStr === "string" ? pesoRomanaStr.trim() : String(pesoRomanaStr || "");
    const cantidadVerificadaValue =
      typeof cantidadVerificadaStr === "string"
        ? cantidadVerificadaStr.trim()
        : String(cantidadVerificadaStr || "");

    const pesoRomana = parseFloat(pesoRomanaValue);
    const cantidadVerificada = parseInt(cantidadVerificadaValue, 10);

    // Log de conversiones eliminado

    // Validar conversiones numéricas
    if (isNaN(pesoRomana) || pesoRomana <= 0) {
      console.error("❌ Validación fallida: pesoRomana no es un número válido", {
        pesoRomanaValue,
        pesoRomana,
      });
      return NextResponse.json(
        {
          error: "El peso debe ser un número válido mayor a 0",
          received: pesoRomanaValue,
          parsed: pesoRomana,
        },
        { status: 400 }
      );
    }

    if (isNaN(cantidadVerificada) || cantidadVerificada <= 0) {
      console.error("❌ Validación fallida: cantidadVerificada no es un número válido", {
        cantidadVerificadaValue,
        cantidadVerificada,
      });
      return NextResponse.json(
        {
          error: "La cantidad debe ser un número entero válido mayor a 0",
          received: cantidadVerificadaValue,
          parsed: cantidadVerificada,
        },
        { status: 400 }
      );
    }

    // Parsear categorías
    const categoriaVerificadaValue =
      typeof categoriaVerificadaStr === "string"
        ? categoriaVerificadaStr.trim()
        : String(categoriaVerificadaStr || "");
    let categoriaVerificada: string[] = [];

    try {
      // Intentar parsear como JSON primero
      const parsed = JSON.parse(categoriaVerificadaValue);
      categoriaVerificada = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Si no es JSON válido, intentar como string separado por comas
      categoriaVerificada = categoriaVerificadaValue
        .split(",")
        .map((c: ReturnType<typeof JSON.parse>) => c.trim())
        .filter(Boolean);
    }

    // Validar que sea un array válido
    if (!Array.isArray(categoriaVerificada) || categoriaVerificada.length === 0) {
      console.error("❌ Validación fallida: categorías no es un array válido", {
        categoriaVerificada,
      });
      return NextResponse.json(
        {
          error: "Debe seleccionar al menos una categoría válida (A o B)",
          received: categoriaVerificadaValue,
          parsed: categoriaVerificada,
        },
        { status: 400 }
      );
    }

    // Validar que las categorías sean válidas
    const categoriasValidas = categoriaVerificada.every(
      (cat: ReturnType<typeof JSON.parse>) => cat === "A" || cat === "B"
    );
    if (!categoriasValidas) {
      console.error("❌ Validación fallida: categorías inválidas", { categoriaVerificada });
      return NextResponse.json(
        { error: "Las categorías deben ser A o B", received: categoriaVerificada },
        { status: 400 }
      );
    }

    // Los logs de depuración fueron eliminados preventivamente.

    // Validar datos del formulario con Zod
    // Los metadatos de validación fueron eliminados preventivamente.

    const validationResult = validarRecepcionSchema.safeParse({
      pesoRomana,
      cantidadVerificada,
      categoriaVerificada,
      observacionesGestor: observacionesGestor || undefined,
    });

    if (!validationResult.success) {
      console.error("❌ Validación Zod fallida:", validationResult.error.issues);
      const errorMessages = validationResult.error.issues
        .map((issue) => {
          return `${issue.path.join(".")}: ${issue.message}`;
        })
        .join(", ");

      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: errorMessages,
          details: validationResult.error.issues,
          received: {
            pesoRomana,
            cantidadVerificada,
            categoriaVerificada,
            observacionesGestor,
          },
        },
        { status: 400 }
      );
    }

    // Obtener la solicitud con validación de permisos
    const solicitud = await prisma.solicitudRetiro.findUnique({
      where: { id },
      include: {
        generador: { select: { name: true, email: true } },
        transportista: { select: { name: true, email: true } },
      },
    });

    if (!solicitud) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    // Verificar permisos
    if (solicitud.gestorId !== session.user.id) {
      return NextResponse.json(
        { error: "No autorizado - No eres el gestor asignado" },
        { status: 403 }
      );
    }

    if (solicitud.estado !== "ENTREGADA_GESTOR") {
      return NextResponse.json(
        { error: "La solicitud no está en estado correcto para validación" },
        { status: 400 }
      );
    }

    // Calcular discrepancias
    const _discrepancias = calcularDiscrepanciasEnvio(
      solicitud,
      pesoRomana,
      cantidadVerificada,
      categoriaVerificada
    );

    // Manejar subida de archivos (DESPUÉS de validar todos los campos de texto)
    const archivosUrls: string[] = [];

    // Procesar guía de despacho (opcional)
    if (guiaDespachoFile) {
      try {
        // Validar archivo
        validateImageFile(guiaDespachoFile);
        // Subir archivo
        await uploadFile(guiaDespachoFile, `solicitudes/${id}/validacion`);
        // La URL no se guarda actualmente en modelo DB
      } catch (error: unknown) {
        console.error(`❌ Error procesando guía de despacho:`, error);
        const errorMessage =
          error instanceof Error
            ? (error as ReturnType<typeof JSON.parse>).message
            : "Error desconocido";
        return NextResponse.json(
          { error: `Error procesando guía de despacho`, message: errorMessage },
          { status: 400 }
        );
      }
    }

    // Procesar fotos (opcionales)
    for (let i = 0; i < fotoFiles.length; i++) {
      const foto = fotoFiles[i];
      try {
        // Validar archivo
        validateImageFile(foto);
        // Subir archivo
        const url = await uploadFile(foto, `solicitudes/${id}/validacion`);
        archivosUrls.push(url);
      } catch (error: unknown) {
        console.error(`❌ Error procesando foto ${i + 1}:`, error);
        return NextResponse.json({ error: `Error procesando foto ${i + 1}` }, { status: 400 });
      }
    }

    // Iniciar transacción para actualizar solicitud
    const resultado = await prisma.$transaction(async (tx) => {
      // Actualizar solicitud
      const solicitudActualizada = await tx.solicitudRetiro.update({
        where: { id },
        data: {
          estado: "RECIBIDA_PLANTA",
          pesoReal: pesoRomana,
          cantidadReal: cantidadVerificada,
          fechaRecepcionPlanta: new Date(),
        },
      });

      // Crear cambio de estado
      await tx.cambioEstado.create({
        data: {
          solicitudId: id,
          estadoAnterior: solicitud.estado,
          estadoNuevo: "RECIBIDA_PLANTA",
          realizadoPor: session.user.id,
          notas: `Recepción validada. Peso: ${pesoRomana} kg, Cantidad: ${cantidadVerificada}.`,
        },
      });

      // Calcular discrepancias
      const discrepanciasCreadas = calcularDiscrepanciasEnvio(
        solicitud,
        pesoRomana,
        cantidadVerificada,
        categoriaVerificada
      );

      return {
        solicitud: solicitudActualizada,
        discrepancias: discrepanciasCreadas,
      };
    });

    return NextResponse.json({
      success: true,
      solicitud: resultado.solicitud,
      discrepancias: resultado.discrepancias,
      message: "Recepción validada exitosamente",
    });
  } catch (error: unknown) {
    console.error("Error en validar-recepcion:", error);
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

/**
 * Calcula las discrepancias entre los datos del transportista y del gestor
 */
function calcularDiscrepanciasEnvio(
  solicitud: ReturnType<typeof JSON.parse>,
  pesoRomana: number,
  cantidadVerificada: number,
  categoriaVerificada: string[]
): DiscrepanciaData[] {
  const discrepancias = [];

  // Discrepancia de peso
  if (solicitud.pesoReal) {
    const porcentajePeso = ((pesoRomana - solicitud.pesoReal) / solicitud.pesoReal) * 100;
    if (Math.abs(porcentajePeso) > 1) {
      discrepancias.push({
        tipo: "peso" as const,
        valorTransportista: solicitud.pesoReal?.toString() || "0",
        valorGestor: pesoRomana.toString(),
        porcentajeDiferencia: porcentajePeso,
        notasGestor: Math.abs(porcentajePeso) > 10 ? "Requiere explicación" : null,
      });
    }
  }

  // Discrepancia de cantidad
  if (solicitud.cantidadReal) {
    const porcentajeCantidad =
      ((cantidadVerificada - solicitud.cantidadReal) / solicitud.cantidadReal) * 100;
    if (Math.abs(porcentajeCantidad) > 0) {
      discrepancias.push({
        tipo: "cantidad" as const,
        valorTransportista: solicitud.cantidadReal?.toString() || "0",
        valorGestor: cantidadVerificada.toString(),
        porcentajeDiferencia: porcentajeCantidad,
        notasGestor: Math.abs(porcentajeCantidad) > 25 ? "Requiere explicación" : null,
      });
    }
  }

  // Discrepancia de categoría
  const categoriaTransportista = [
    ...(solicitud.categoriaA_cantidad > 0 ? ["A"] : []),
    ...(solicitud.categoriaB_cantidad > 0 ? ["B"] : []),
  ];

  const categoriasDiferentes =
    categoriaTransportista.some(
      (cat: ReturnType<typeof JSON.parse>) => !categoriaVerificada.includes(cat)
    ) ||
    categoriaVerificada.some(
      (cat: ReturnType<typeof JSON.parse>) => !categoriaTransportista.includes(cat)
    );

  if (categoriasDiferentes) {
    discrepancias.push({
      tipo: "categoria" as const,
      valorTransportista: categoriaTransportista.join(", "),
      valorGestor: categoriaVerificada.join(", "),
      porcentajeDiferencia: null,
      notasGestor: "Categorías verificadas difieren de las declaradas",
    });
  }

  return discrepancias;
}
