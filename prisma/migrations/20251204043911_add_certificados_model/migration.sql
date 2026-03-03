-- CreateTable
CREATE TABLE "certificados" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "gestorId" TEXT NOT NULL,
    "sistemaGestionId" TEXT,
    "pesoValorizado" DOUBLE PRECISION NOT NULL,
    "cantidadUnidades" INTEGER NOT NULL,
    "categorias" TEXT[],
    "tratamientos" JSONB NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "tokenVerificacion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'emitido',
    "motivoAnulacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secuencias_folio" (
    "id" TEXT NOT NULL DEFAULT 'folio-certificados',
    "anio" INTEGER NOT NULL,
    "secuencia" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secuencias_folio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificados_folio_key" ON "certificados"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_solicitudId_key" ON "certificados"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_tokenVerificacion_key" ON "certificados"("tokenVerificacion");

-- CreateIndex
CREATE INDEX "certificados_folio_idx" ON "certificados"("folio");

-- CreateIndex
CREATE INDEX "certificados_gestorId_idx" ON "certificados"("gestorId");

-- CreateIndex
CREATE INDEX "certificados_sistemaGestionId_idx" ON "certificados"("sistemaGestionId");

-- CreateIndex
CREATE INDEX "certificados_fechaEmision_idx" ON "certificados"("fechaEmision");

-- CreateIndex
CREATE INDEX "certificados_estado_idx" ON "certificados"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "secuencias_folio_anio_key" ON "secuencias_folio"("anio");

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_retiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_sistemaGestionId_fkey" FOREIGN KEY ("sistemaGestionId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
