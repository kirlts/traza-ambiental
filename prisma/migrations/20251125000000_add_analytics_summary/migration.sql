-- CreateTable
CREATE TABLE "analytics_daily_summary" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "totalSolicitudes" INTEGER NOT NULL DEFAULT 0,
    "totalPesoRecolectado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPesoValorizado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCertificados" INTEGER NOT NULL DEFAULT 0,
    "metaRecoleccionAnual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avanceRecoleccionAnual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metaValorizacionAnual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avanceValorizacionAnual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "desglosePorRegion" JSONB,
    "desglosePorTratamiento" JSONB,
    "desglosePorGestor" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_daily_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "analytics_daily_summary_fecha_key" ON "analytics_daily_summary"("fecha");

-- CreateIndex
CREATE INDEX "analytics_daily_summary_fecha_idx" ON "analytics_daily_summary"("fecha");

