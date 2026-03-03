-- AlterTable: Agregar generadorId a inventarios
-- Primero agregamos la columna como nullable temporalmente
ALTER TABLE "inventarios" ADD COLUMN "generadorId" TEXT;

-- Si hay datos existentes, los eliminamos (ya que no tienen generador asociado)
DELETE FROM "movimientos_inventario" WHERE "inventarioId" IN (SELECT "id" FROM "inventarios" WHERE "generadorId" IS NULL);
DELETE FROM "inventarios" WHERE "generadorId" IS NULL;

-- Ahora hacemos la columna NOT NULL
ALTER TABLE "inventarios" ALTER COLUMN "generadorId" SET NOT NULL;

-- Agregar foreign key constraint
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_generadorId_fkey" FOREIGN KEY ("generadorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Crear índice para generadorId
CREATE INDEX "inventarios_generadorId_idx" ON "inventarios"("generadorId");

-- Crear constraint única para generadorId + productoId
CREATE UNIQUE INDEX "inventarios_generadorId_productoId_key" ON "inventarios"("generadorId", "productoId");

-- AlterTable: Agregar campos faltantes a movimientos_inventario
ALTER TABLE "movimientos_inventario" ADD COLUMN "cantidadPrevia" INTEGER;
ALTER TABLE "movimientos_inventario" ADD COLUMN "cantidadNueva" INTEGER;
ALTER TABLE "movimientos_inventario" ADD COLUMN "referencia" TEXT;
ALTER TABLE "movimientos_inventario" ADD COLUMN "notas" TEXT;

-- Actualizar registros existentes (si los hay) con valores por defecto
UPDATE "movimientos_inventario" SET "cantidadPrevia" = 0 WHERE "cantidadPrevia" IS NULL;
UPDATE "movimientos_inventario" SET "cantidadNueva" = "cantidad" WHERE "cantidadNueva" IS NULL;

-- Hacer los campos NOT NULL
ALTER TABLE "movimientos_inventario" ALTER COLUMN "cantidadPrevia" SET NOT NULL;
ALTER TABLE "movimientos_inventario" ALTER COLUMN "cantidadNueva" SET NOT NULL;

