#!/bin/bash
cat << 'PRISMA' >> prisma/schema.prisma

enum TipoEstablecimiento {
  GENERADOR
  IRAR
  PRETRATAMIENTO
  VALORIZADOR
  DISPOSICION_FINAL
}

enum TipoOperacion {
  VALORIZACION
  ELIMINACION
  REUTILIZACION
}

model EmpresaTitular {
  id               String            @id @default(cuid())
  rutEmpresa       String            @unique
  razonSocial      String
  establecimientos Establecimiento[]
  solicitudes      SolicitudRetiro[] @relation("TitularSolicitudes")
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  @@map("empresas_titulares")
}

model Establecimiento {
  id                  String              @id @default(cuid())
  empresaId           String
  codigoVU            String              @unique
  nombre              String
  direccion           String
  comuna              String?
  region              String?
  georreferencia      String?
  tipoEstablecimiento TipoEstablecimiento
  empresa             EmpresaTitular      @relation(fields: [empresaId], references: [id])
  solicitudesOrigen   SolicitudRetiro[]   @relation("EstablecimientoOrigen")
  fraccionesDestino   Fraccion[]          @relation("DestinoTecnico")
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  @@index([empresaId])
  @@map("establecimientos")
}

model Fraccion {
  id                 String          @id @default(cuid())
  solicitudId        String
  codigoLER          String
  peso               Float
  tipoOperacion      TipoOperacion
  destinoTecnicoId   String
  solicitud          SolicitudRetiro @relation(fields: [solicitudId], references: [id], onDelete: Cascade)
  destinoTecnico     Establecimiento @relation("DestinoTecnico", fields: [destinoTecnicoId], references: [id])
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  @@index([solicitudId])
  @@index([destinoTecnicoId])
  @@map("fracciones")
}

model BitacoraAuditoria {
  id              String          @id @default(cuid())
  solicitudId     String
  timestamp_utc   DateTime        @default(now())
  actorId         String
  rolEjecutor     String
  estadoAnterior  EstadoSolicitud?
  estadoNuevo     EstadoSolicitud
  evidenciaRef    String?
  solicitud       SolicitudRetiro @relation(fields: [solicitudId], references: [id], onDelete: Cascade)

  @@index([solicitudId])
  @@map("bitacoras_auditoria")
}
PRISMA
