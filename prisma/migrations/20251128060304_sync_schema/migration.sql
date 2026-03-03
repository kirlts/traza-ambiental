-- CreateEnum
CREATE TYPE "EstadoVerificacionUsuario" AS ENUM ('PENDIENTE_VERIFICACION', 'DOCUMENTOS_CARGADOS', 'EN_REVISION', 'VERIFICADO', 'RECHAZADO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('AUTORIZACION_SANITARIA_TRANSPORTE', 'PERMISO_CIRCULACION', 'REVISION_TECNICA', 'CERTIFICADO_ANTECEDENTES', 'AUTORIZACION_SANITARIA_PLANTA', 'RCA', 'REGISTRO_GESTOR_MMA', 'CERTIFICADO_INSTALACION_ELECTRICA', 'CERTIFICADO_VIGENCIA_PODERES', 'PATENTE_MUNICIPAL');

-- CreateEnum
CREATE TYPE "EstadoValidacion" AS ENUM ('PENDIENTE', 'EN_REVISION', 'APROBADO', 'RECHAZADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "NivelAlertaVencimiento" AS ENUM ('VIGENTE', 'ALERTA', 'CRITICO', 'VENCIDO');

-- DropForeignKey
ALTER TABLE "vehiculos" DROP CONSTRAINT "vehiculos_transportistaId_fkey";

-- DropIndex
DROP INDEX "vehiculos_estado_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "capacidadProcesamiento" DOUBLE PRECISION,
ADD COLUMN     "documentosCausantesSuspension" TEXT[],
ADD COLUMN     "estadoSuspension" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "estadoVerificacion" "EstadoVerificacionUsuario" NOT NULL DEFAULT 'PENDIENTE_VERIFICACION',
ADD COLUMN     "fechaSuspension" TIMESTAMP(3),
ADD COLUMN     "fechaVerificacion" TIMESTAMP(3),
ADD COLUMN     "motivoRechazo" TEXT,
ADD COLUMN     "motivoSuspension" TEXT,
ADD COLUMN     "tipoEmpresa" TEXT,
ADD COLUMN     "tipoPlanta" TEXT,
ADD COLUMN     "verificadoPorId" TEXT;

-- AlterTable
ALTER TABLE "vehiculos" ALTER COLUMN "capacidadKg" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "categorias_producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "medidas" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventarios" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "stockMinimo" INTEGER NOT NULL DEFAULT 5,
    "ubicacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" TEXT NOT NULL,
    "inventarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "motivo" TEXT,
    "fechaMovimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_verificacion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "categoria" TEXT,
    "numeroFolio" TEXT,
    "fechaEmision" TIMESTAMP(3),
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "archivoUrl" TEXT NOT NULL,
    "archivoNombre" TEXT NOT NULL,
    "archivoTamano" INTEGER NOT NULL,
    "archivoTipo" TEXT NOT NULL,
    "estadoValidacion" "EstadoValidacion" NOT NULL DEFAULT 'PENDIENTE',
    "validadoPorId" TEXT,
    "fechaValidacion" TIMESTAMP(3),
    "notasValidacion" TEXT,
    "validadoContraPortal" BOOLEAN NOT NULL DEFAULT false,
    "portalVerificado" TEXT,
    "fechaVerificacionPortal" TIMESTAMP(3),
    "nivelAlerta" "NivelAlertaVencimiento" NOT NULL DEFAULT 'VIGENTE',
    "alertaEnviada30d" BOOLEAN NOT NULL DEFAULT false,
    "fechaAlerta30d" TIMESTAMP(3),
    "alertaEnviada15d" BOOLEAN NOT NULL DEFAULT false,
    "fechaAlerta15d" TIMESTAMP(3),
    "alertaVencido" BOOLEAN NOT NULL DEFAULT false,
    "fechaAlertaVencido" TIMESTAMP(3),
    "vehiculoPatente" TEXT,
    "vehiculoId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "documentoAnteriorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creadoPor" TEXT,

    CONSTRAINT "documentos_verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_validacion" (
    "id" TEXT NOT NULL,
    "documentoId" TEXT NOT NULL,
    "usuarioValidadorId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "motivo" TEXT,
    "estadoAnterior" "EstadoValidacion" NOT NULL,
    "estadoNuevo" "EstadoValidacion" NOT NULL,
    "ipAdministrador" TEXT,
    "navegador" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_validacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas_vencimiento" (
    "id" TEXT NOT NULL,
    "documentoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipoAlerta" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "emailLeido" BOOLEAN NOT NULL DEFAULT false,
    "usuarioResponde" BOOLEAN NOT NULL DEFAULT false,
    "fechaRespuesta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_vencimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorias_producto_nombre_key" ON "categorias_producto"("nombre");

-- CreateIndex
CREATE INDEX "productos_categoriaId_idx" ON "productos"("categoriaId");

-- CreateIndex
CREATE INDEX "productos_activo_idx" ON "productos"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "productos_marca_modelo_medidas_key" ON "productos"("marca", "modelo", "medidas");

-- CreateIndex
CREATE INDEX "inventarios_productoId_idx" ON "inventarios"("productoId");

-- CreateIndex
CREATE INDEX "movimientos_inventario_inventarioId_idx" ON "movimientos_inventario"("inventarioId");

-- CreateIndex
CREATE INDEX "movimientos_inventario_fechaMovimiento_idx" ON "movimientos_inventario"("fechaMovimiento");

-- CreateIndex
CREATE INDEX "documentos_verificacion_usuarioId_idx" ON "documentos_verificacion"("usuarioId");

-- CreateIndex
CREATE INDEX "documentos_verificacion_tipoDocumento_idx" ON "documentos_verificacion"("tipoDocumento");

-- CreateIndex
CREATE INDEX "documentos_verificacion_estadoValidacion_idx" ON "documentos_verificacion"("estadoValidacion");

-- CreateIndex
CREATE INDEX "documentos_verificacion_fechaVencimiento_idx" ON "documentos_verificacion"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "documentos_verificacion_nivelAlerta_idx" ON "documentos_verificacion"("nivelAlerta");

-- CreateIndex
CREATE INDEX "documentos_verificacion_vehiculoPatente_idx" ON "documentos_verificacion"("vehiculoPatente");

-- CreateIndex
CREATE INDEX "logs_validacion_documentoId_idx" ON "logs_validacion"("documentoId");

-- CreateIndex
CREATE INDEX "logs_validacion_usuarioValidadorId_idx" ON "logs_validacion"("usuarioValidadorId");

-- CreateIndex
CREATE INDEX "logs_validacion_createdAt_idx" ON "logs_validacion"("createdAt");

-- CreateIndex
CREATE INDEX "alertas_vencimiento_documentoId_idx" ON "alertas_vencimiento"("documentoId");

-- CreateIndex
CREATE INDEX "alertas_vencimiento_usuarioId_idx" ON "alertas_vencimiento"("usuarioId");

-- CreateIndex
CREATE INDEX "alertas_vencimiento_fechaEnvio_idx" ON "alertas_vencimiento"("fechaEnvio");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_verificadoPorId_fkey" FOREIGN KEY ("verificadoPorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_transportistaId_fkey" FOREIGN KEY ("transportistaId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias_producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "inventarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_verificacion" ADD CONSTRAINT "documentos_verificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_verificacion" ADD CONSTRAINT "documentos_verificacion_validadoPorId_fkey" FOREIGN KEY ("validadoPorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_verificacion" ADD CONSTRAINT "documentos_verificacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_verificacion" ADD CONSTRAINT "documentos_verificacion_documentoAnteriorId_fkey" FOREIGN KEY ("documentoAnteriorId") REFERENCES "documentos_verificacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_validacion" ADD CONSTRAINT "logs_validacion_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "documentos_verificacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_validacion" ADD CONSTRAINT "logs_validacion_usuarioValidadorId_fkey" FOREIGN KEY ("usuarioValidadorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_vencimiento" ADD CONSTRAINT "alertas_vencimiento_documentoId_fkey" FOREIGN KEY ("documentoId") REFERENCES "documentos_verificacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_vencimiento" ADD CONSTRAINT "alertas_vencimiento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
