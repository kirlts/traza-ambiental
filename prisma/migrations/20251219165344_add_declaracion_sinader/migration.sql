-- CreateEnum
CREATE TYPE "LegalStatus" AS ENUM ('PENDIENTE', 'EN_REVISION', 'VERIFICADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "TratamientoTipo" AS ENUM ('RECAUCHAJE', 'RECICLAJE_MATERIAL', 'CO_PROCESAMIENTO', 'VALORIZACION_ENERGETICA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoAutorizacion" AS ENUM ('VIGENTE', 'VENCIDA', 'REVOCADA', 'SUSPENDIDA');

-- CreateTable
CREATE TABLE "carrier_legal_profiles" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "retcId" TEXT,
    "sanitaryResolution" TEXT,
    "resolutionDate" TIMESTAMP(3),
    "baseOperations" TEXT,
    "retcFileUrl" TEXT,
    "resolutionFileUrl" TEXT,
    "sinaderFileUrl" TEXT,
    "isRetcVerified" BOOLEAN NOT NULL DEFAULT false,
    "isResolutionVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSinaderVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "LegalStatus" NOT NULL DEFAULT 'PENDIENTE',
    "rejectionReason" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrier_legal_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manager_legal_profiles" (
    "id" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "retcId" TEXT,
    "retcFileUrl" TEXT,
    "isRetcVerified" BOOLEAN NOT NULL DEFAULT false,
    "resolutionNumber" TEXT,
    "resolutionFileUrl" TEXT,
    "authorizedCapacity" DOUBLE PRECISION,
    "isResolutionVerified" BOOLEAN NOT NULL DEFAULT false,
    "hasRepModule" BOOLEAN NOT NULL DEFAULT false,
    "gransicPartner" TEXT,
    "status" "LegalStatus" NOT NULL DEFAULT 'PENDIENTE',
    "rejectionReason" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manager_legal_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autorizaciones_sanitarias" (
    "id" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "numeroResolucion" TEXT NOT NULL,
    "autoridadEmisora" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "tratamientosAutorizados" "TratamientoTipo"[],
    "capacidadAnualTn" DOUBLE PRECISION NOT NULL,
    "categoriasResiduos" TEXT[],
    "estado" "EstadoAutorizacion" NOT NULL DEFAULT 'VIGENTE',
    "observaciones" TEXT,
    "registradoPor" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "autorizaciones_sanitarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capacidad_utilizada" (
    "id" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "tratamiento" "TratamientoTipo" NOT NULL,
    "toneladasUtilizadas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capacidad_utilizada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declaraciones_sinader" (
    "id" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "archivoUrl" TEXT NOT NULL,
    "folioSinader" TEXT,
    "fechaCarga" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "declaraciones_sinader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guias_despacho" (
    "id" TEXT NOT NULL,
    "numeroGuia" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaSalida" TIMESTAMP(3),
    "fechaLlegada" TIMESTAMP(3),
    "vehiculoPatente" TEXT NOT NULL,
    "conductorNombre" TEXT NOT NULL,
    "conductorRut" TEXT NOT NULL,
    "descripcionCarga" TEXT NOT NULL,
    "categoriaNeumatico" TEXT NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "cantidadUnidades" INTEGER NOT NULL,
    "residuosPeligrosos" BOOLEAN NOT NULL DEFAULT true,
    "pdfUrl" TEXT,
    "qrCodeUrl" TEXT,
    "hashIntegridad" TEXT,
    "versionDocumento" INTEGER NOT NULL DEFAULT 1,
    "generadoPor" TEXT NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guias_despacho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secuencias_guia" (
    "id" TEXT NOT NULL DEFAULT 'folio-guia-despacho',
    "anio" INTEGER NOT NULL,
    "secuencia" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secuencias_guia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retc_establecimientos" (
    "id" TEXT NOT NULL,
    "retcId" TEXT NOT NULL,
    "razonSocial" TEXT,
    "direccion" TEXT,
    "comuna" TEXT,
    "region" TEXT,
    "rubro" TEXT,
    "estado" TEXT,
    "fuenteDatos" TEXT,
    "fechaImportacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retc_establecimientos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carrier_legal_profiles_carrierId_key" ON "carrier_legal_profiles"("carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "manager_legal_profiles_managerId_key" ON "manager_legal_profiles"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "autorizaciones_sanitarias_numeroResolucion_key" ON "autorizaciones_sanitarias"("numeroResolucion");

-- CreateIndex
CREATE INDEX "autorizaciones_sanitarias_gestorId_idx" ON "autorizaciones_sanitarias"("gestorId");

-- CreateIndex
CREATE INDEX "autorizaciones_sanitarias_fechaVencimiento_idx" ON "autorizaciones_sanitarias"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "autorizaciones_sanitarias_estado_idx" ON "autorizaciones_sanitarias"("estado");

-- CreateIndex
CREATE INDEX "capacidad_utilizada_gestorId_idx" ON "capacidad_utilizada"("gestorId");

-- CreateIndex
CREATE INDEX "capacidad_utilizada_anio_idx" ON "capacidad_utilizada"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "capacidad_utilizada_gestorId_anio_tratamiento_key" ON "capacidad_utilizada"("gestorId", "anio", "tratamiento");

-- CreateIndex
CREATE UNIQUE INDEX "declaraciones_sinader_gestorId_anio_mes_key" ON "declaraciones_sinader"("gestorId", "anio", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "guias_despacho_numeroGuia_key" ON "guias_despacho"("numeroGuia");

-- CreateIndex
CREATE UNIQUE INDEX "guias_despacho_solicitudId_key" ON "guias_despacho"("solicitudId");

-- CreateIndex
CREATE INDEX "guias_despacho_numeroGuia_idx" ON "guias_despacho"("numeroGuia");

-- CreateIndex
CREATE INDEX "guias_despacho_solicitudId_idx" ON "guias_despacho"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "secuencias_guia_anio_key" ON "secuencias_guia"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "retc_establecimientos_retcId_key" ON "retc_establecimientos"("retcId");

-- CreateIndex
CREATE INDEX "retc_establecimientos_retcId_idx" ON "retc_establecimientos"("retcId");

-- CreateIndex
CREATE INDEX "retc_establecimientos_razonSocial_idx" ON "retc_establecimientos"("razonSocial");

-- AddForeignKey
ALTER TABLE "carrier_legal_profiles" ADD CONSTRAINT "carrier_legal_profiles_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manager_legal_profiles" ADD CONSTRAINT "manager_legal_profiles_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorizaciones_sanitarias" ADD CONSTRAINT "autorizaciones_sanitarias_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autorizaciones_sanitarias" ADD CONSTRAINT "autorizaciones_sanitarias_registradoPor_fkey" FOREIGN KEY ("registradoPor") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capacidad_utilizada" ADD CONSTRAINT "capacidad_utilizada_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declaraciones_sinader" ADD CONSTRAINT "declaraciones_sinader_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guias_despacho" ADD CONSTRAINT "guias_despacho_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_retiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guias_despacho" ADD CONSTRAINT "guias_despacho_generadoPor_fkey" FOREIGN KEY ("generadoPor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
