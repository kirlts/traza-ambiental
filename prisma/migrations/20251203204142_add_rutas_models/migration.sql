-- CreateEnum
CREATE TYPE "EstadoRuta" AS ENUM ('PLANIFICADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "rutas" (
    "id" TEXT NOT NULL,
    "transportistaId" TEXT NOT NULL,
    "vehiculoId" TEXT,
    "nombre" TEXT NOT NULL,
    "fechaPlanificada" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoRuta" NOT NULL DEFAULT 'PLANIFICADA',
    "distanciaTotal" DOUBLE PRECISION,
    "tiempoEstimado" INTEGER,
    "optimizada" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rutas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ruta_solicitudes" (
    "id" TEXT NOT NULL,
    "rutaId" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "horaEstimada" TIMESTAMP(3),

    CONSTRAINT "ruta_solicitudes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rutas_transportistaId_idx" ON "rutas"("transportistaId");

-- CreateIndex
CREATE INDEX "rutas_vehiculoId_idx" ON "rutas"("vehiculoId");

-- CreateIndex
CREATE INDEX "rutas_estado_idx" ON "rutas"("estado");

-- CreateIndex
CREATE INDEX "rutas_fechaPlanificada_idx" ON "rutas"("fechaPlanificada");

-- CreateIndex
CREATE INDEX "ruta_solicitudes_rutaId_idx" ON "ruta_solicitudes"("rutaId");

-- CreateIndex
CREATE INDEX "ruta_solicitudes_solicitudId_idx" ON "ruta_solicitudes"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "ruta_solicitudes_rutaId_solicitudId_key" ON "ruta_solicitudes"("rutaId", "solicitudId");

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_transportistaId_fkey" FOREIGN KEY ("transportistaId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruta_solicitudes" ADD CONSTRAINT "ruta_solicitudes_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "rutas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruta_solicitudes" ADD CONSTRAINT "ruta_solicitudes_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_retiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
