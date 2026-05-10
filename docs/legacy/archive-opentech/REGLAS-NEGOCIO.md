# Reglas de Negocio - TrazAmbiental.com

> **Propósito**: Documentación detallada de todas las reglas de negocio del sistema para el equipo técnico.

---

## ÍNDICE

1. [Gestión de Solicitudes](#1-gestión-de-solicitudes)
2. [Certificados Digitales](#2-certificados-digitales)
3. [Metas y Cumplimiento REP](#3-metas-y-cumplimiento-rep)
4. [Validación Documental](#4-validación-documental)
5. [Notificaciones](#5-notificaciones)
6. [Cálculos y Fórmulas](#6-cálculos-y-fórmulas)

---

## 1. GESTIÓN DE SOLICITUDES

### RN-SOL-001: Creación de Solicitud

**Condiciones previas**:

- Usuario debe tener rol "Generador"
- `user.cuentaAprobada === true`
- Usuario debe estar autenticado

**Validaciones**:

```typescript
// Paso 1: Información de Retiro
- direccionRetiro: string(10-200 caracteres)
- region: string(existe en tabla Region)
- comuna: string(existe en tabla Comuna y pertenece a region)
- fechaPreferida: Date
  * >= hoy
  * <= hoy + 30 días
  * no puede ser feriado (opcional)
- horarioPreferido: enum('MANANA' | 'TARDE')

// Paso 2: Detalles NFU
- categoriaA_cantidad: integer >= 0
- categoriaA_pesoEst: float > 0 (si cantidad > 0)
- categoriaB_cantidad: integer >= 0
- categoriaB_pesoEst: float > 0 (si cantidad > 0)
- RESTRICCIÓN: (categoriaA_cantidad > 0 OR categoriaB_cantidad > 0)

// Validación peso razonable
if (categoriaA_pesoEst / categoriaA_cantidad > 100) {
  warning("Peso promedio muy alto para Categoría A")
}
if (categoriaB_pesoEst / categoriaB_cantidad > 150) {
  warning("Peso promedio muy alto para Categoría B")
}

// Paso 3: Contacto e Instrucciones
- nombreContacto: string(3-100 caracteres)
- telefonoContacto: regex(/^\+56\s?9\s?\d{4}\s?\d{4}$/)
- instrucciones: string(max 500 caracteres, opcional)
- fotos: array(max 5 elementos)
  * cada foto: max 5MB
  * formatos: image/jpeg, image/png, image/webp
```

**Proceso de creación**:

```typescript
1. Validar datos con Zod schema
2. Generar folio único:
   folio = `SOL-${YYYY}${MM}${DD}-${sequence}`
   donde sequence = última solicitud del día + 1 (padding 4 dígitos)
3. Calcular totales:
   pesoTotalEstimado = categoriaA_pesoEst + categoriaB_pesoEst
   cantidadTotal = categoriaA_cantidad + categoriaB_cantidad
4. Crear registro en base de datos:
   estado = 'PENDIENTE'
   esBorrador = false
   generadorId = usuario autenticado
5. Subir fotos a storage (AWS S3):
   ruta = `solicitudes/${folio}/fotos/${timestamp}_${filename}`
6. Crear CambioEstado:
   estadoAnterior = null
   estadoNuevo = 'PENDIENTE'
   realizadoPor = generadorId
7. Enviar notificaciones:
   - Email al generador con confirmación
   - Notificación a administradores
8. Registrar en AuditLog
9. Retornar solicitud creada + folio
```

### RN-SOL-002: Guardar como Borrador

**Regla**: Generador puede guardar solicitud incompleta como borrador.

**Comportamiento**:

- `esBorrador = true`
- No requiere validaciones completas (solo campos básicos)
- No genera folio definitivo (folio temporal)
- No envía notificaciones
- Usuario puede completar y enviar después
- Borrador se puede eliminar sin registro de auditoría

**Conversión borrador → solicitud**:

```typescript
1. Validar que datos estén completos
2. esBorrador = false
3. Generar folio definitivo
4. Cambiar estado a PENDIENTE
5. Enviar notificaciones
6. Registrar en AuditLog
```

### RN-SOL-003: Asignación de Transportista

**Condiciones**:

- Usuario tiene rol "Transportista"
- `user.cuentaAprobada === true`
- `user.estadoVerificacion === 'VERIFICADO'`
- `user.estadoSuspension === false`
- Solicitud en estado PENDIENTE
- Transportista tiene al menos 1 vehículo registrado

**Proceso**:

```typescript
POST /api/solicitudes/:id/aceptar
Body: {
  vehiculoId: string,
  fechaEstimadaRecoleccion: Date
}

1. Verificar permisos y condiciones
2. Actualizar solicitud:
   transportistaId = usuario.id
   vehiculoId = vehiculo seleccionado
   estado = 'ACEPTADA'
   fechaAceptacion = now()
   fechaEstimadaRecoleccion = fecha enviada
3. Crear CambioEstado
4. Notificar generador
5. Registrar en AuditLog
```

**Regla de tiempo**: Si solicitud PENDIENTE > 48 horas sin asignación:

- Sistema notifica a administradores
- Se puede reasignar manualmente

### RN-SOL-004: Recolección (Transportista)

**Transiciones de estado**:

```
ACEPTADA → EN_CAMINO (transportista inicia viaje)
EN_CAMINO → RECOLECTADA (carga completada)
```

**EN_CAMINO**:

```typescript
PATCH /api/solicitudes/:id/estado
Body: {
  estado: 'EN_CAMINO',
  ubicacionGPS: { lat, lng },
  notas: string (opcional)
}

1. Verificar ownership (transportistaId === usuario.id)
2. Actualizar estado
3. Registrar ubicación GPS inicial
4. Notificar generador (email/SMS: "Transportista en camino")
5. Crear CambioEstado
```

**RECOLECTADA**:

```typescript
POST /api/solicitudes/:id/recoleccion
Body: {
  pesoReal: float,
  cantidadReal: integer,
  categoriaA_pesoReal?: float,
  categoriaB_pesoReal?: float,
  fotosEvidencia?: string[],
  observaciones?: string
}

Validaciones:
- pesoReal > 0
- cantidadReal > 0
- fotosEvidencia: max 10 fotos

Proceso:
1. Verificar ownership
2. Actualizar solicitud:
   pesoReal = peso ingresado
   cantidadReal = cantidad ingresada
   estado = 'RECOLECTADA'
   fechaRecoleccion = now()
3. Calcular discrepancia:
   discrepanciaPeso = abs(pesoReal - pesoTotalEstimado)
   discrepanciaCantidad = abs(cantidadReal - cantidadTotal)
   if (discrepanciaPeso > pesoTotalEstimado * 0.2) {
     flag: "Discrepancia significativa de peso"
   }
4. Subir fotos evidencia
5. Notificar generador
6. Crear CambioEstado
```

### RN-SOL-005: Entrega a Gestor

```typescript
POST /api/solicitudes/:id/entrega-gestor
Body: {
  gestorId: string,
  ubicacionEntrega: { lat, lng },
  fotosEntrega?: string[],
  observaciones?: string
}

Validaciones:
- Gestor existe y tiene rol 'Gestor'
- Gestor.cuentaAprobada === true
- Gestor.estadoVerificacion === 'VERIFICADO'
- Gestor.estadoSuspension === false
- solicitud.estado === 'RECOLECTADA'

Proceso:
1. Verificar ownership (transportista)
2. Actualizar solicitud:
   gestorId = gestor seleccionado
   estado = 'ENTREGADA_GESTOR'
   fechaEntregaGestor = now()
3. Crear GuiaDespacho (opcional):
   origen = punto de recolección
   destino = planta del gestor
   transportistaId = usuario.id
   gestorId = gestor seleccionado
   peso = pesoReal
   cantidad = cantidadReal
4. Notificar gestor
5. Crear CambioEstado
```

### RN-SOL-006: Recepción en Planta (Gestor)

```typescript
POST /api/solicitudes/:id/recepcion
Body: {
  pesoRecibido: float,
  cantidadRecibida: integer,
  tieneDiscrepancia: boolean,
  motivoDiscrepancia?: string,
  fotosRecepcion?: string[]
}

Validaciones:
- Gestor.id === solicitud.gestorId
- solicitud.estado === 'ENTREGADA_GESTOR'
- pesoRecibido > 0
- cantidadRecibida > 0

Proceso:
1. Verificar ownership (gestor)
2. Calcular discrepancia con transportista:
   discrepancia = abs(pesoRecibido - solicitud.pesoReal)
   if (discrepancia > solicitud.pesoReal * 0.05) {
     // Discrepancia > 5% requiere justificación
     tieneDiscrepancia = true
     motivoDiscrepancia = requerido
   }
3. Actualizar solicitud:
   pesoRecibidoGestor = pesoRecibido
   cantidadRecibidaGestor = cantidadRecibida
   estado = 'RECIBIDA_PLANTA'
   fechaRecepcionPlanta = now()
4. Si hay discrepancia:
   - Crear RegistroDiscrepancia
   - Notificar transportista y admin
5. Crear CambioEstado
6. Crear lote de procesamiento (preparación para tratamiento)
```

### RN-SOL-007: Cancelación

**Reglas**:

- Solo Generador puede cancelar
- Solo si estado === 'PENDIENTE'
- Requiere motivo

```typescript
PATCH /api/solicitudes/:id/cancelar
Body: {
  motivo: string
}

Validaciones:
- usuario.id === solicitud.generadorId
- solicitud.estado === 'PENDIENTE'
- motivo.length >= 10

Proceso:
1. Verificar ownership
2. Actualizar solicitud:
   estado = 'CANCELADA'
   motivoCancelacion = motivo
3. Crear CambioEstado
4. Notificar admin
5. NO eliminar registro (trazabilidad)
```

---

## 2. CERTIFICADOS DIGITALES

### RN-CERT-001: Generación Automática

**Trigger**: Estado solicitud cambia a 'TRATADA'

**Condiciones previas**:

- Solicitud tiene todos los tratamientos registrados
- Peso total tratado > 0
- Gestor válido asignado

**Proceso automático**:

```typescript
// Se ejecuta al finalizar tratamiento
async function generarCertificadoAutomatico(solicitudId: string) {
  const solicitud = await prisma.solicitudRetiro.findUnique({
    where: { id: solicitudId },
    include: {
      generador: true,
      gestor: true,
      tratamientos: true,
    },
  });

  // 1. Validar condiciones
  if (solicitud.estado !== "TRATADA") {
    throw new Error("Solicitud debe estar en estado TRATADA");
  }

  // 2. Calcular peso total valorizado
  const pesoTotalValorizado = solicitud.tratamientos.reduce((sum, t) => sum + t.pesoTratado, 0);

  // 3. Generar código único
  const anio = new Date().getFullYear();
  const ultimoCertificado = await prisma.certificado.findFirst({
    where: { codigo: { startsWith: `CERT-${anio}-` } },
    orderBy: { createdAt: "desc" },
  });

  let secuencia = 1;
  if (ultimoCertificado) {
    const match = ultimoCertificado.codigo.match(/CERT-\d{4}-(\d{4})/);
    secuencia = match ? parseInt(match[1]) + 1 : 1;
  }

  const codigo = `CERT-${anio}-${String(secuencia).padStart(4, "0")}`;

  // 4. Generar código QR
  const qrData = JSON.stringify({
    codigo,
    generador: solicitud.generador.rut,
    gestor: solicitud.gestor.rut,
    peso: pesoTotalValorizado,
    fecha: new Date().toISOString(),
  });
  const codigoQR = await generarQR(qrData);

  // 5. Crear certificado
  const certificado = await prisma.certificado.create({
    data: {
      codigo,
      solicitudId,
      generadorId: solicitud.generadorId,
      gestorId: solicitud.gestorId,
      sistemaGestionId: solicitud.generador.sistemaGestionId, // Si tiene
      pesoTotalValorizado,
      tipoTratamiento: solicitud.tratamientos[0].tipo, // Tratamiento principal
      codigoQR,
      fechaEmision: new Date(),
      // Metadata
      metadata: JSON.stringify({
        folio: solicitud.folio,
        tratamientos: solicitud.tratamientos,
        direccionRetiro: solicitud.direccionRetiro,
        fechaRecoleccion: solicitud.fechaRecoleccion,
      }),
    },
  });

  // 6. Generar PDF
  const pdfUrl = await generarPDFCertificado(certificado);
  await prisma.certificado.update({
    where: { id: certificado.id },
    data: { urlPDF: pdfUrl },
  });

  // 7. Actualizar meta REP (si aplica)
  await actualizarMetaREP(certificado);

  // 8. Notificar generador
  await enviarEmailCertificado(certificado);

  // 9. Registrar en auditoría
  await prisma.auditLog.create({
    data: {
      userId: solicitud.gestorId,
      action: "certificado.emitido",
      entityType: "Certificado",
      entityId: certificado.id,
      description: `Certificado ${codigo} emitido automáticamente`,
    },
  });

  return certificado;
}
```

### RN-CERT-002: Inmutabilidad

**Regla**: Certificados NO se pueden editar ni eliminar una vez emitidos.

**Razones**:

- Cumplimiento normativo
- Trazabilidad legal
- Integridad de datos ambientales
- Auditorías MMA

**Excepción**: Solo Administrador puede marcar como "anulado" con justificación:

```typescript
PATCH /api/certificados/:codigo/anular
Auth: Admin only
Body: {
  motivo: string (mínimo 50 caracteres),
  autorizadoPor: string (nombre autoridad MMA)
}

Proceso:
1. Verificar rol Admin
2. Crear registro AnulacionCertificado:
   certificadoId = certificado.id
   motivo = motivo
   anuladoPor = usuario.id
   autorizadoPor = autoridad
   fecha = now()
3. Marcar certificado:
   anulado = true
   fechaAnulacion = now()
4. NO eliminar de BD
5. Notificar generador, gestor, MMA
6. Certificado sigue visible pero marcado "ANULADO"
```

### RN-CERT-003: Verificación Pública

**Regla**: Cualquier persona puede verificar certificado con código o QR.

```typescript
GET /api/certificados/:codigo/verificar
Auth: None (público)

Response:
{
  valido: boolean,
  certificado: {
    codigo,
    fechaEmision,
    generador: { nombre, rut },
    gestor: { nombre, rut },
    pesoTotalValorizado,
    tipoTratamiento
  },
  anulado: boolean,
  motivoAnulacion?: string
}
```

**Página pública**:

- URL: `/verificar-certificado?codigo=CERT-2025-0001`
- No requiere login
- Muestra información pública del certificado
- Código QR escaneable
- Botón descargar PDF (si no está anulado)

---

## 3. METAS Y CUMPLIMIENTO REP

### RN-META-001: Configuración de Metas

**Actores**: Sistema de Gestión, Generador (Rol Unificado)

**Regla**: Metas se configuran anualmente por tipo.

```typescript
POST /api/metas
Auth: Sistema Gestión, Generador
Body: {
  anio: number,
  tipo: 'recoleccion' | 'valorizacion',
  metaToneladas: float,
  origen: 'manual' | 'declaracion',
  declaracionId?: string,
  desgloses?: DesgloseMeta[]
}

Validaciones:
- anio >= año actual
- metaToneladas > 0
- No duplicar (unique: sistemaGestionId + anio + tipo)

Proceso:
1. Validar permisos
2. Crear meta:
   estado = 'activa'
   avanceToneladas = 0
   porcentajeAvance = 0
   cumplida = false
3. Si tiene desgloses:
   - Por región
   - Por tipo de tratamiento
   - Por categoría de neumático
4. Calcular ritmo requerido:
   ritmoMensual = metaToneladas / 12
5. Configurar alertas:
   - Si avance < ritmoEsperado → alerta mensual
6. Registrar auditoría con justificación
```

### RN-META-002: Actualización Automática de Avance

**Trigger**: Certificado emitido

**Proceso**:

```typescript
async function actualizarMetaREP(certificado: Certificado) {
  const anio = certificado.fechaEmision.getFullYear();

  // Buscar metas activas del generador/sistema para ese año
  const metas = await prisma.meta.findMany({
    where: {
      OR: [
        { productorId: certificado.generador.id }, // Mapeado al ID del usuario Generador
        { sistemaGestionId: certificado.sistemaGestionId },
      ],
      anio,
      estado: "activa",
    },
  });

  for (const meta of metas) {
    // Filtrar según tipo de meta
    let contribuye = false;

    if (meta.tipo === "recoleccion") {
      // Todo certificado contribuye a recolección
      contribuye = true;
    } else if (meta.tipo === "valorizacion") {
      // Solo si tratamiento es valorización
      contribuye = ["RECICLAJE_MATERIAL", "VALORIZACION_ENERGETICA", "REUTILIZACION"].includes(
        certificado.tipoTratamiento
      );
    }

    if (!contribuye) continue;

    // Actualizar avance
    const nuevoAvance = meta.avanceToneladas + certificado.pesoTotalValorizado / 1000; // kg a ton
    const porcentaje = (nuevoAvance / meta.metaToneladas) * 100;
    const cumplida = porcentaje >= 100;

    await prisma.meta.update({
      where: { id: meta.id },
      data: {
        avanceToneladas: nuevoAvance,
        porcentajeAvance: porcentaje,
        cumplida,
        fechaCumplimiento: cumplida && !meta.cumplida ? new Date() : meta.fechaCumplimiento,
      },
    });

    // Notificar si se alcanzó 90% o 100%
    if (porcentaje >= 90 && meta.porcentajeAvance < 90) {
      await notificar({
        userId: meta.sistemaGestionId,
        tipo: "meta.avance",
        mensaje: `Meta de ${meta.tipo} ${anio} alcanzó ${porcentaje.toFixed(1)}%`,
      });
    }
  }
}
```

### RN-META-003: Cierre Anual

**Fecha**: 31 de diciembre de cada año

**Proceso automático** (cron job):

```typescript
// Se ejecuta: 31-dic 23:59
async function cerrarMetasAnuales() {
  const anioActual = new Date().getFullYear();

  const metas = await prisma.meta.findMany({
    where: {
      anio: anioActual,
      estado: "activa",
    },
  });

  for (const meta of metas) {
    let estadoFinal: string;

    if (meta.porcentajeAvance >= 100) {
      estadoFinal = "cumplida";
    } else if (meta.porcentajeAvance >= 90) {
      estadoFinal = "cumplida_parcial"; // 90-99%
    } else {
      estadoFinal = "incumplida";
    }

    await prisma.meta.update({
      where: { id: meta.id },
      data: {
        estado: estadoFinal,
        fechaCierre: new Date(),
      },
    });

    // Generar reporte anual automático
    if (meta.productorId) {
      // Referencia a usuario Generador
      await generarReporteAnualAutomatico(meta);
    }

    // Notificar MMA si incumplida
    if (estadoFinal === "incumplida") {
      await notificarMMAIncumplimiento(meta);
    }
  }
}
```

---

## 4. VALIDACIÓN DOCUMENTAL

### RN-DOC-001: Documentos Obligatorios

**Transportista**:

1. **Autorización Sanitaria Transporte** (MINSAL)
   - Obligatorio: Sí
   - Vencimiento: Sí
   - Validación externa: Portal MINSAL
2. **Permiso Circulación** (por vehículo)
   - Obligatorio: Sí
   - Vencimiento: 31 de marzo anual
   - Validación externa: Registro Civil
3. **Revisión Técnica** (por vehículo)
   - Obligatorio: Sí
   - Vencimiento: Según antigüedad (6 meses o 1 año)
   - Validación externa: Portal MT

**Gestor**:

1. **Autorización Sanitaria Planta** (MINSAL)
   - Obligatorio: Sí
   - Vencimiento: Sí
   - Validación externa: Portal MINSAL
2. **Inscripción Registro Gestores** (MMA)
   - Obligatorio: Sí
   - Vencimiento: No
   - Validación externa: SINADER
3. **RCA** (SEA) - si aplica
   - Obligatorio: Depende del tipo de planta
   - Vencimiento: No
   - Validación externa: Portal SEA

### RN-DOC-002: Proceso de Validación

```typescript
POST /api/admin/documentos/:id/validar
Auth: Admin
Body: {
  aprobado: boolean,
  fechaVencimiento?: Date, // Si documento vence
  numeroResolucion?: string,
  observaciones?: string,
  motivoRechazo?: string
}

Proceso si APROBADO:
1. Actualizar documento:
   estado = 'APROBADO'
   fechaValidacion = now()
   validadoPorId = admin.id
   fechaVencimiento = fecha ingresada
2. Verificar si todos los documentos obligatorios están aprobados:
   const todosAprobados = usuario.documentos.every(
     doc => doc.obligatorio ? doc.estado === 'APROBADO' : true
   )
3. Si todos aprobados:
   usuario.estadoVerificacion = 'VERIFICADO'
   usuario.cuentaAprobada = true
   usuario.fechaVerificacion = now()
4. Programar alerta de vencimiento:
   if (fechaVencimiento) {
     crearAlerta({
       usuarioId: usuario.id,
       documentoId: documento.id,
       fecha30Dias: fechaVencimiento - 30 días,
       fecha15Dias: fechaVencimiento - 15 días,
       fechaVencimiento: fechaVencimiento
     })
   }
5. Notificar usuario: "Documento aprobado"

Proceso si RECHAZADO:
1. Actualizar documento:
   estado = 'RECHAZADO'
   motivoRechazo = motivo ingresado
   fechaValidacion = now()
2. usuario.estadoVerificacion = 'RECHAZADO'
3. Notificar usuario con detalle del rechazo
4. Permitir reenvío de documento
```

### RN-DOC-003: Alertas de Vencimiento

**Sistema automático** (cron job diario):

```typescript
// Se ejecuta diariamente a las 08:00
async function verificarVencimientosDocumentos() {
  const hoy = new Date();
  const en30Dias = addDays(hoy, 30);
  const en15Dias = addDays(hoy, 15);

  // Documentos que vencen en 30 días
  const proximos30 = await prisma.documentoVerificacion.findMany({
    where: {
      fechaVencimiento: {
        gte: hoy,
        lte: en30Dias,
      },
      estado: "APROBADO",
      alertaEnviada30Dias: false,
    },
    include: { usuario: true },
  });

  for (const doc of proximos30) {
    await enviarEmail({
      to: doc.usuario.email,
      subject: "⚠️ Documento próximo a vencer",
      template: "alerta-vencimiento-30",
      data: {
        nombreDoc: doc.tipo,
        fechaVencimiento: doc.fechaVencimiento,
        diasRestantes: differenceInDays(doc.fechaVencimiento, hoy),
      },
    });

    await prisma.documentoVerificacion.update({
      where: { id: doc.id },
      data: { alertaEnviada30Dias: true },
    });
  }

  // Documentos que vencen en 15 días (crítico)
  const proximos15 = await prisma.documentoVerificacion.findMany({
    where: {
      fechaVencimiento: {
        gte: hoy,
        lte: en15Dias,
      },
      estado: "APROBADO",
      alertaEnviada15Dias: false,
    },
    include: { usuario: true },
  });

  for (const doc of proximos15) {
    // Email al usuario
    await enviarEmail({
      to: doc.usuario.email,
      subject: "🔴 URGENTE: Documento próximo a vencer",
      template: "alerta-vencimiento-15",
      data: { ...doc, diasRestantes: differenceInDays(doc.fechaVencimiento, hoy) },
    });

    // Notificar admin
    await notificarAdmins({
      tipo: "documento.vencimiento_critico",
      mensaje: `Usuario ${doc.usuario.name} tiene documento ${doc.tipo} venciendo en ${differenceInDays(doc.fechaVencimiento, hoy)} días`,
    });

    await prisma.documentoVerificacion.update({
      where: { id: doc.id },
      data: { alertaEnviada15Dias: true },
    });
  }
}
```

### RN-DOC-004: Suspensión Automática

**Trigger**: Documento vencido + 3 días de gracia

```typescript
// Cron job diario
async function suspenderUsuariosPorDocumentosVencidos() {
  const hace3Dias = addDays(new Date(), -3);

  const documentosVencidos = await prisma.documentoVerificacion.findMany({
    where: {
      fechaVencimiento: { lt: hace3Dias },
      estado: "APROBADO",
      obligatorio: true,
    },
    include: { usuario: true },
  });

  for (const doc of documentosVencidos) {
    const usuario = doc.usuario;

    // Verificar si ya está suspendido
    if (usuario.estadoSuspension) continue;

    // Suspender usuario
    await prisma.user.update({
      where: { id: usuario.id },
      data: {
        estadoSuspension: true,
        fechaSuspension: new Date(),
        motivoSuspension: `Documento ${doc.tipo} vencido desde ${doc.fechaVencimiento}`,
        documentosCausantesSuspension: [doc.id],
      },
    });

    // Notificar usuario
    await enviarEmail({
      to: usuario.email,
      subject: "🔒 Cuenta suspendida - Documentos vencidos",
      template: "suspension-documentos",
      data: {
        nombreUsuario: usuario.name,
        documentosVencidos: [doc],
        instrucciones: "Debe actualizar sus documentos para reactivar su cuenta",
      },
    });

    // Notificar admins
    await notificarAdmins({
      tipo: "usuario.suspendido",
      mensaje: `Usuario ${usuario.name} (${usuario.email}) suspendido por documento ${doc.tipo} vencido`,
    });

    // Auditoría
    await prisma.auditLog.create({
      data: {
        userId: usuario.id,
        action: "usuario.suspendido_automaticamente",
        entityType: "User",
        entityId: usuario.id,
        description: `Suspensión automática por documento vencido: ${doc.tipo}`,
      },
    });
  }
}
```

---

## 5. NOTIFICACIONES

### RN-NOTIF-001: Canales de Notificación

El sistema usa **2 canales**:

1. **Email** (vía Mailgun/SMTP) - Para todas las notificaciones
2. **In-App** (tabla Notificacion) - Para notificaciones en dashboard

### RN-NOTIF-002: Eventos que Generan Notificaciones

| Evento                     | Destinatarios     | Email | In-App |
| -------------------------- | ----------------- | ----- | ------ |
| Solicitud creada           | Generador, Admins | ✅    | ✅     |
| Solicitud aceptada         | Generador         | ✅    | ✅     |
| Transportista en camino    | Generador         | ✅    | ✅     |
| Recolección completada     | Generador         | ✅    | ✅     |
| Entregada a gestor         | Gestor            | ✅    | ✅     |
| Certificado emitido        | Generador         | ✅    | ✅     |
| Documento vence en 30 días | Usuario           | ✅    | ✅     |
| Documento vence en 15 días | Usuario, Admins   | ✅    | ✅     |
| Usuario suspendido         | Usuario, Admins   | ✅    | ✅     |
| Meta 90% alcanzada         | Sistema Gestión   | ✅    | ✅     |
| Meta cumplida 100%         | Sistema Gestión   | ✅    | ✅     |
| Solicitud sin asignar 48h  | Admins            | ✅    | ✅     |

### RN-NOTIF-003: Estructura de Notificación

```typescript
interface Notificacion {
  id: string
  userId: string
  tipo: string // 'solicitud.creada', 'certificado.emitido', etc.
  titulo: string
  mensaje: string
  referencia?: string // ID de la entidad relacionada
  leida: boolean
  createdAt: Date
}

// Ejemplo
{
  userId: "user-123",
  tipo: "solicitud.aceptada",
  titulo: "Solicitud Aceptada",
  mensaje: "El transportista Juan Pérez aceptó tu solicitud SOL-20251113-0001",
  referencia: "solicitud-id-456",
  leida: false,
  createdAt: new Date()
}
```

---

## 6. CÁLCULOS Y FÓRMULAS

### RN-CALC-001: Peso Total Estimado

```typescript
pesoTotalEstimado = categoriaA_pesoEst + categoriaB_pesoEst;
```

### RN-CALC-002: Cantidad Total

```typescript
cantidadTotal = categoriaA_cantidad + categoriaB_cantidad;
```

### RN-CALC-003: Discrepancia Peso

```typescript
// Entre estimado y real
discrepanciaPeso = abs(pesoReal - pesoTotalEstimado);
porcentajeDiscrepancia = (discrepanciaPeso / pesoTotalEstimado) * 100;

// Alerta si > 20%
if (porcentajeDiscrepancia > 20) {
  flag: "Discrepancia significativa";
}
```

### RN-CALC-004: Discrepancia Recepción

```typescript
// Entre transportista y gestor
discrepanciaRecepcion = abs(pesoRecibidoGestor - pesoReal);
porcentajeDiscrepancia = (discrepanciaRecepcion / pesoReal) * 100;

// Requiere justificación si > 5%
if (porcentajeDiscrepancia > 5) {
  requiereJustificacion = true;
}
```

### RN-CALC-005: Avance Meta REP

```typescript
// Avance en toneladas
avanceToneladas = SUM(certificados.pesoTotalValorizado / 1000)
WHERE certificados.fechaEmision.year = meta.anio
  AND certificados.tipoTratamiento IN meta.tiposAceptados

// Porcentaje de avance
porcentajeAvance = (avanceToneladas / metaToneladas) * 100

// Ritmo esperado (mensual)
mesActual = new Date().getMonth() + 1
ritmoEsperado = (metaToneladas / 12) * mesActual
ritmoReal = avanceToneladas

// Proyección fin de año
proyeccion = (ritmoReal / mesActual) * 12
```

### RN-CALC-006: Días Hábiles

```typescript
// Para fechas de recolección
function calcularDiasHabiles(fechaInicio: Date, fechaFin: Date): number {
  let dias = 0;
  let fecha = new Date(fechaInicio);

  while (fecha <= fechaFin) {
    const diaSemana = fecha.getDay();
    // 0 = domingo, 6 = sábado
    if (diaSemana !== 0 && diaSemana !== 6) {
      // Verificar si es feriado (opcional)
      if (!esFeriado(fecha)) {
        dias++;
      }
    }
    fecha = addDays(fecha, 1);
  }

  return dias;
}
```

---

**Última actualización**: 13 de noviembre de 2025  
**Versión**: 1.0.0

---

## 📝 NOTAS FINALES

- **TODAS** las reglas de negocio deben respetarse estrictamente
- **NO** omitir validaciones (datos ambientales son críticos)
- **SIEMPRE** registrar en AuditLog acciones importantes
- **SIEMPRE** notificar a usuarios afectados
- **NUNCA** eliminar registros (solo marcar como inactivo/anulado)
- **Cálculos deben ser exactos** (no redondear hasta el final)
- **Fechas en UTC** siempre
- **Transacciones de BD** para operaciones críticas
