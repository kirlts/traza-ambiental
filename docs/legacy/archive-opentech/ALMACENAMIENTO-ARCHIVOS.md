# 📁 Almacenamiento de Archivos - Configuración y Funcionamiento

## Resumen Ejecutivo

**IMPORTANTE**: Los archivos físicos **NO se guardan en PostgreSQL**. PostgreSQL solo almacena:

- La URL del archivo (`archivoUrl`)
- Metadatos del archivo (nombre, tamaño, tipo MIME)

El archivo físico se guarda en:

- **Almacenamiento Local** (por defecto): `/public/uploads/` en el servidor
- **AWS S3** (opcional): Si está configurado con credenciales

---

## 🗂️ Arquitectura de Almacenamiento

### 1. Ubicación de la Configuración

La configuración del almacenamiento está en:

```
src/lib/storage.ts
```

### 2. Flujo de Almacenamiento

```
1. Usuario sube archivo (Frontend)
   ↓
2. Backend recibe archivo (API Route)
   ↓
3. Validación del archivo (tipo, tamaño)
   ↓
4. Subida del archivo físico:
   ├─ Opción A: Almacenamiento Local → /public/uploads/
   └─ Opción B: AWS S3 (si está configurado)
   ↓
5. Guardado de URL en PostgreSQL:
   └─ Tabla: documentos_verificacion
      Campo: archivoUrl (String)
```

---

## ⚙️ Configuración Actual

### Almacenamiento Local (Por Defecto)

El sistema está configurado para usar **almacenamiento local por defecto**.

**Ubicación**: `/public/uploads/` en el servidor

**Configuración en `src/lib/storage.ts`**:

```typescript
export async function uploadFile(file: File, folder: string): Promise<string> {
  const STORAGE_TYPE = process.env.STORAGE_TYPE || "local"; // Por defecto: 'local'

  // Si no hay credenciales de S3, usar local
  const hasS3Config =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME;

  if (STORAGE_TYPE === "local" || !hasS3Config) {
    return uploadFileLocal(file, folder); // ← USA ESTO POR DEFECTO
  }
  // ... resto del código para S3
}
```

**Ventajas del almacenamiento local**:

- ✅ No requiere servicios externos
- ✅ Más rápido para desarrollo y pruebas
- ✅ Sin costos adicionales
- ✅ Funciona inmediatamente sin configuración

**Desventajas**:

- ⚠️ No escalable para producción con alta carga
- ⚠️ Requiere backup manual del directorio `/public/uploads/`

---

### AWS S3 (Opcional)

Para usar AWS S3, necesitas configurar variables de entorno en `.env`:

```env
# Tipo de almacenamiento
STORAGE_TYPE=s3

# Credenciales AWS S3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET_NAME=nombre-del-bucket
AWS_REGION=us-east-1
```

**Ubicación del código S3**:

```12:15:src/lib/storage.ts
// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
```

---

## 💾 Base de Datos PostgreSQL

### Tabla: `documentos_verificacion`

PostgreSQL **solo almacena la URL** del archivo, no el archivo físico:

```607:625:prisma/schema.prisma
model DocumentoVerificacion {
  id                String   @id @default(cuid())

  // RELACIÓN CON USUARIO
  usuarioId         String
  usuario           User     @relation("DocumentosUsuario", fields: [usuarioId], references: [id], onDelete: Cascade)

  // TIPO Y CATEGORÍA
  tipoDocumento     TipoDocumento
  categoria         String?

  // DATOS DEL DOCUMENTO
  numeroFolio       String?
  fechaEmision      DateTime?
  fechaVencimiento  DateTime
  archivoUrl        String
  archivoNombre     String
  archivoTamano     Int
  archivoTipo       String
```

**Campos relacionados con archivos**:

- `archivoUrl` (String): URL del archivo (ej: `/uploads/documentos-verificacion/user-id/file-uuid.pdf`)
- `archivoNombre` (String): Nombre original del archivo
- `archivoTamano` (Int): Tamaño en bytes
- `archivoTipo` (String): MIME type (ej: `application/pdf`)

---

## 📝 Ejemplo de Uso

### Subida de Archivo

```typescript
// 1. Subir archivo físico (retorna URL)
const archivoUrl = await uploadFile(archivo, `documentos-verificacion/${userId}`);
// Retorna: "/uploads/documentos-verificacion/user-id/uuid.pdf"

// 2. Guardar URL en PostgreSQL
const documento = await prisma.documentoVerificacion.create({
  data: {
    usuarioId: userId,
    archivoUrl, // ← Solo la URL, no el archivo
    archivoNombre: archivo.name,
    archivoTamano: archivo.size,
    archivoTipo: archivo.type,
    // ... otros campos
  },
});
```

**Código real en `src/app/api/user/documentos/route.ts`**:

```207:225:src/app/api/user/documentos/route.ts
    // Subir archivo
    const archivoUrl = await uploadFile(archivo, `documentos-verificacion/${session.user.id}`)

    // Crear registro en la base de datos
    const documento = await prisma.documentoVerificacion.create({
      data: {
        usuarioId: session.user.id,
        tipoDocumento: validationResult.data.tipoDocumento,
        categoria: validationResult.data.categoria,
        numeroFolio: validationResult.data.numeroFolio,
        fechaEmision: validationResult.data.fechaEmision ? new Date(validationResult.data.fechaEmision) : null,
        fechaVencimiento: new Date(validationResult.data.fechaVencimiento),
        archivoUrl,
        archivoNombre: archivo.name,
        archivoTamano: archivo.size,
        archivoTipo: archivo.type,
        vehiculoPatente: validationResult.data.vehiculoPatente,
        vehiculoId
      }
    })
```

---

## 🔄 Cambiar entre Local y S3

### Para usar almacenamiento local (actual, por defecto):

No necesitas hacer nada. El sistema ya está configurado para usar almacenamiento local si:

- No hay variables de entorno de AWS configuradas
- `STORAGE_TYPE` no está definido o está en `'local'`

### Para usar AWS S3:

1. Configura las variables de entorno en `.env`:

```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET_NAME=nombre-del-bucket
AWS_REGION=us-east-1
```

2. Reinicia el servidor:

```bash
npm run dev
```

3. El sistema intentará usar S3 primero, y si falla, volverá a almacenamiento local automáticamente.

---

## 📂 Estructura de Directorios (Almacenamiento Local)

```
public/
  uploads/
    documentos-verificacion/
      user-id-1/
        uuid-1.pdf
        uuid-2.jpg
      user-id-2/
        uuid-3.pdf
    solicitudes/
      solicitud-id/
        validacion/
          uuid-guia.pdf
          uuid-foto-1.jpg
          uuid-foto-2.jpg
```

**Nota**: Next.js sirve automáticamente archivos estáticos desde `/public/`, por lo que:

- Archivo guardado en: `/public/uploads/documentos-verificacion/user-id/file.pdf`
- URL accesible en: `http://localhost:3000/uploads/documentos-verificacion/user-id/file.pdf`

---

## ✅ Estado Actual

**El sistema está configurado para usar almacenamiento local por defecto**, lo cual es ideal para:

- Desarrollo
- Pruebas
- Entornos locales
- Producción pequeña/mediana con backup manual

**No es necesario configurar S3** a menos que:

- Tengas una carga muy alta de archivos
- Necesites distribución global (CDN)
- Requieras alta disponibilidad automática
- Tengas políticas corporativas que lo exijan

---

## 🔍 Verificación

### Verificar qué tipo de almacenamiento está usando:

1. Revisa los logs del servidor cuando subes un archivo:
   - `📁 Usando almacenamiento local (S3 no configurado)` = Local
   - `☁️ Intentando subir a S3...` = S3

2. Verifica la URL guardada en PostgreSQL:
   - URL local: `/uploads/...`
   - URL S3: `https://bucket-name.s3.amazonaws.com/...`

3. Revisa el directorio `/public/uploads/` en el servidor (si es local)

---

## 📚 Referencias

- **Código de almacenamiento**: `src/lib/storage.ts`
- **Modelo de base de datos**: `prisma/schema.prisma` (modelo `DocumentoVerificacion`)
- **Ejemplo de uso**: `src/app/api/user/documentos/route.ts`
- **Validación de recepción**: `src/app/api/solicitudes/[id]/validar-recepcion/route.ts`

---

**Última actualización**: 2025-01-06
**Estado**: Sistema configurado para almacenamiento local por defecto
