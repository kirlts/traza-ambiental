-- CreateEnum
CREATE TYPE "MotivoRechazo" AS ENUM ('FUERA_DE_ZONA', 'CARGA_NO_COMPATIBLE', 'CAPACIDAD_EXCEDIDA', 'HORARIO_NO_DISPONIBLE', 'OTRO');

-- AlterTable
ALTER TABLE "solicitudes_retiro" ADD COLUMN     "detallesRechazo" TEXT,
ADD COLUMN     "fechaRechazo" TIMESTAMP(3),
ADD COLUMN     "motivoRechazo" "MotivoRechazo";

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "transportistaId" TEXT NOT NULL,
    "patente" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "capacidadKg" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_patente_key" ON "vehiculos"("patente");

-- CreateIndex
CREATE INDEX "vehiculos_transportistaId_idx" ON "vehiculos"("transportistaId");

-- CreateIndex
CREATE INDEX "vehiculos_estado_idx" ON "vehiculos"("estado");

-- AddForeignKey
ALTER TABLE "solicitudes_retiro" ADD CONSTRAINT "solicitudes_retiro_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_transportistaId_fkey" FOREIGN KEY ("transportistaId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
