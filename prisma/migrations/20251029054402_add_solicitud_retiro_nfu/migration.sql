-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'ACEPTADA', 'EN_CAMINO', 'RECOLECTADA', 'ENTREGADA_GESTOR', 'RECIBIDA_PLANTA', 'TRATADA', 'RECHAZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "rut" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "declaraciones_anuales" (
    "id" TEXT NOT NULL,
    "productorId" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "folio" TEXT,
    "totalUnidades" INTEGER NOT NULL DEFAULT 0,
    "totalToneladas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'borrador',
    "observaciones" TEXT,
    "fechaDeclaracion" TIMESTAMP(3),
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "declaraciones_anuales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_declaradas" (
    "id" TEXT NOT NULL,
    "declaracionId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "cantidadUnidades" INTEGER NOT NULL,
    "pesoToneladas" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_declaradas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL,
    "declaracionId" TEXT,
    "productorId" TEXT,
    "sistemaGestionId" TEXT,
    "anio" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "metaToneladas" DOUBLE PRECISION NOT NULL,
    "avanceToneladas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "porcentajeAvance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "origen" TEXT NOT NULL DEFAULT 'manual',
    "justificacionCambio" TEXT,
    "modificadoPor" TEXT,
    "cumplida" BOOLEAN NOT NULL DEFAULT false,
    "fechaCumplimiento" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_metas_rep" (
    "id" TEXT NOT NULL DEFAULT 'config-metas-rep',
    "porcentajes" TEXT NOT NULL,
    "ultimaActualizacion" TIMESTAMP(3) NOT NULL,
    "actualizadoPor" TEXT,

    CONSTRAINT "configuracion_metas_rep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "referencia" TEXT,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desgloses_meta" (
    "id" TEXT NOT NULL,
    "metaId" TEXT NOT NULL,
    "criterio" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "metaToneladas" DOUBLE PRECISION NOT NULL,
    "avanceToneladas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "porcentajeAvance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "desgloses_meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorias_configuracion" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNuevo" TEXT NOT NULL,
    "justificacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_registro_generador" (
    "id" TEXT NOT NULL,
    "rutEmpresa" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "comuna" TEXT,
    "region" TEXT,
    "telefono" TEXT,
    "rutRepresentante" TEXT NOT NULL,
    "nombresRepresentante" TEXT NOT NULL,
    "apellidosRepresentante" TEXT NOT NULL,
    "cargoRepresentante" TEXT,
    "emailRepresentante" TEXT NOT NULL,
    "telefonoRepresentante" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "motivoRechazo" TEXT,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaRevision" TIMESTAMP(3),
    "revisadoPor" TEXT,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_registro_generador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_retiro" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "generadorId" TEXT NOT NULL,
    "direccionRetiro" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,
    "fechaPreferida" TIMESTAMP(3) NOT NULL,
    "horarioPreferido" TEXT NOT NULL,
    "categoriaA_cantidad" INTEGER NOT NULL DEFAULT 0,
    "categoriaA_pesoEst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "categoriaB_cantidad" INTEGER NOT NULL DEFAULT 0,
    "categoriaB_pesoEst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pesoTotalEstimado" DOUBLE PRECISION NOT NULL,
    "cantidadTotal" INTEGER NOT NULL,
    "nombreContacto" TEXT NOT NULL,
    "telefonoContacto" TEXT NOT NULL,
    "instrucciones" TEXT,
    "fotos" TEXT[],
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "esBorrador" BOOLEAN NOT NULL DEFAULT false,
    "transportistaId" TEXT,
    "vehiculoId" TEXT,
    "gestorId" TEXT,
    "pesoReal" DOUBLE PRECISION,
    "cantidadReal" INTEGER,
    "fechaAceptacion" TIMESTAMP(3),
    "fechaRecoleccion" TIMESTAMP(3),
    "fechaEntregaGestor" TIMESTAMP(3),
    "fechaRecepcionPlanta" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_retiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cambios_estado" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "estadoAnterior" "EstadoSolicitud",
    "estadoNuevo" "EstadoSolicitud" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "realizadoPor" TEXT NOT NULL,
    "notas" TEXT,

    CONSTRAINT "cambios_estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regiones" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunas" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_rut_key" ON "users"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "declaraciones_anuales_folio_key" ON "declaraciones_anuales"("folio");

-- CreateIndex
CREATE INDEX "declaraciones_anuales_productorId_idx" ON "declaraciones_anuales"("productorId");

-- CreateIndex
CREATE INDEX "declaraciones_anuales_anio_idx" ON "declaraciones_anuales"("anio");

-- CreateIndex
CREATE INDEX "declaraciones_anuales_estado_idx" ON "declaraciones_anuales"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "declaraciones_anuales_productorId_anio_key" ON "declaraciones_anuales"("productorId", "anio");

-- CreateIndex
CREATE INDEX "categorias_declaradas_declaracionId_idx" ON "categorias_declaradas"("declaracionId");

-- CreateIndex
CREATE INDEX "metas_productorId_idx" ON "metas"("productorId");

-- CreateIndex
CREATE INDEX "metas_sistemaGestionId_idx" ON "metas"("sistemaGestionId");

-- CreateIndex
CREATE INDEX "metas_anio_idx" ON "metas"("anio");

-- CreateIndex
CREATE INDEX "metas_estado_idx" ON "metas"("estado");

-- CreateIndex
CREATE INDEX "notificaciones_userId_leida_idx" ON "notificaciones"("userId", "leida");

-- CreateIndex
CREATE INDEX "notificaciones_createdAt_idx" ON "notificaciones"("createdAt");

-- CreateIndex
CREATE INDEX "desgloses_meta_metaId_idx" ON "desgloses_meta"("metaId");

-- CreateIndex
CREATE INDEX "auditorias_configuracion_usuarioId_idx" ON "auditorias_configuracion"("usuarioId");

-- CreateIndex
CREATE INDEX "auditorias_configuracion_entidad_entidadId_idx" ON "auditorias_configuracion"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "auditorias_configuracion_createdAt_idx" ON "auditorias_configuracion"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_registro_generador_rutEmpresa_key" ON "solicitudes_registro_generador"("rutEmpresa");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_registro_generador_email_key" ON "solicitudes_registro_generador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_registro_generador_usuarioId_key" ON "solicitudes_registro_generador"("usuarioId");

-- CreateIndex
CREATE INDEX "solicitudes_registro_generador_estado_idx" ON "solicitudes_registro_generador"("estado");

-- CreateIndex
CREATE INDEX "solicitudes_registro_generador_fechaSolicitud_idx" ON "solicitudes_registro_generador"("fechaSolicitud");

-- CreateIndex
CREATE UNIQUE INDEX "solicitudes_retiro_folio_key" ON "solicitudes_retiro"("folio");

-- CreateIndex
CREATE INDEX "solicitudes_retiro_generadorId_idx" ON "solicitudes_retiro"("generadorId");

-- CreateIndex
CREATE INDEX "solicitudes_retiro_estado_idx" ON "solicitudes_retiro"("estado");

-- CreateIndex
CREATE INDEX "solicitudes_retiro_transportistaId_idx" ON "solicitudes_retiro"("transportistaId");

-- CreateIndex
CREATE INDEX "solicitudes_retiro_gestorId_idx" ON "solicitudes_retiro"("gestorId");

-- CreateIndex
CREATE INDEX "solicitudes_retiro_fechaPreferida_idx" ON "solicitudes_retiro"("fechaPreferida");

-- CreateIndex
CREATE INDEX "cambios_estado_solicitudId_idx" ON "cambios_estado"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "regiones_codigo_key" ON "regiones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "comunas_codigo_key" ON "comunas"("codigo");

-- CreateIndex
CREATE INDEX "comunas_regionId_idx" ON "comunas"("regionId");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declaraciones_anuales" ADD CONSTRAINT "declaraciones_anuales_productorId_fkey" FOREIGN KEY ("productorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_declaradas" ADD CONSTRAINT "categorias_declaradas_declaracionId_fkey" FOREIGN KEY ("declaracionId") REFERENCES "declaraciones_anuales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_declaracionId_fkey" FOREIGN KEY ("declaracionId") REFERENCES "declaraciones_anuales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_productorId_fkey" FOREIGN KEY ("productorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_sistemaGestionId_fkey" FOREIGN KEY ("sistemaGestionId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desgloses_meta" ADD CONSTRAINT "desgloses_meta_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "metas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias_configuracion" ADD CONSTRAINT "auditorias_configuracion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_registro_generador" ADD CONSTRAINT "solicitudes_registro_generador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_retiro" ADD CONSTRAINT "solicitudes_retiro_generadorId_fkey" FOREIGN KEY ("generadorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_retiro" ADD CONSTRAINT "solicitudes_retiro_transportistaId_fkey" FOREIGN KEY ("transportistaId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_retiro" ADD CONSTRAINT "solicitudes_retiro_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cambios_estado" ADD CONSTRAINT "cambios_estado_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_retiro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cambios_estado" ADD CONSTRAINT "cambios_estado_realizadoPor_fkey" FOREIGN KEY ("realizadoPor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunas" ADD CONSTRAINT "comunas_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
