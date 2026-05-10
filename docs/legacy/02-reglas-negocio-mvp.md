# 02 - REGLAS DE NEGOCIO, FLUJOS OPERATIVOS Y NÚCLEO REP

> **Documento de Transición Técnico - Equipo Interno Traza Ambiental**
> **Versión Refactorizada:** 1.0 (Febrero 2026)
> **Contexto Operativo (Documentación Activa):** Este documento está redactado intencionalmente como una guía rápida y ejecutiva para orientar al nuevo equipo de desarrollo. Su objetivo es la legibilidad y estructura. **NO busca reemplazar ni destruir** la granularidad algorítmica y técnica creada por el proveedor original (OpenTech). Para consultar tablas completas de QA, diccionarios exhaustivos o reglas matemáticas granulares, diríjase al repositorio pasivo en `docs/archive-opentech/`.

---

## Índice Temático

1. [Pipeline de Solicitudes y Retiros (Flujo Core)](#1-pipeline-de-solicitudes-y-retiros-flujo-core)
2. [Motor de Certificación Inmutable](#2-motor-de-certificacin-inmutable)
3. [Cumplimiento y Metas Anuales REP](#3-cumplimiento-y-metas-anuales-rep)
4. [Trazabilidad, Discrepancias y Alertas](#4-trazabilidad-discrepancias-y-alertas)
5. [Tutorial QA: Validación End-to-End de Generador](#5-tutorial-qa-validacin-end-to-end-de-generador)

---

## 1. Pipeline de Solicitudes y Retiros (Flujo Core)

La orquestación del flujo de recolección de Neumáticos Fuera de Uso (NFU) se gobierna bajo una máquina de estados determinista. Una solicitud nunca puede retroceder en su flujo excepto a estados de falla o cancelación justificada.

### 1.1 Creación e Inserción Inicial (`RN-SOL-001` y `RN-SOL-002`)

- **Actor Exclusivo:** _Generador_ (Con cuenta aprobada, sesión y credenciales listas).
- **Tipología Base:** Obliga a separar estadísticamente los neumáticos introducidos/devueltos en `Categoría A` y/o `Categoría B`. Se asume validación si `Cantidad > 0`, obligando a que `Peso_Estimado > 0`.
  - **Fricción Operacional:** Si la relación $(PesoEstA / CantidadA) > 100$ Kg o $(PesoEstB / CantidadB) > 150$ Kg, salta alertamiento ("Warning: Peso Promedio Irracional").
- **Folio Serializado:** El folio (ID Público) en la BD asume obligatoriamente el patrón: `SOL-[YYYY][MM][DD]-[sequence]` (ej. SOL-20251125-0012).
- **Guardado y Borradores:** Si la solicitud carece de fotos o datos (`esBorrador=true`), se le concede un "Folio Temporal" y es omitida de la cola pública.

### 1.2 Transición Lógica (Mercado Abierto -> Transportista -> Gestor)

- **`RN-SOL-003` (Asignación):** Un `Transportista` válidamente certificado asume el compromiso (`Estado PENDIENTE -> ACEPTADA`). Si un bulto no ha sido interceptado en 48 hrs, notifica silenciosamente al administrador.
- **`RN-SOL-004` (Tracking y Entrega):** Al momento de transitar (`EN_CAMINO -> RECOLECTADA`), el Transportista _sobreescribe estadísticamente_ los kilos reportados por el Generador con el Kilo **Real** en su báscula transportable. Se tolera una discrepancia de peso versus lo publicado de hasta un 20%. Si $> 20\%$, se flaggea el registro como sospechoso o de mal pesaje.
- **`RN-SOL-005` y `006` (Hand-off al Gestor):**
  - Generación subyacente de "Guía de Despacho" (Orígen -> Planta en destino).
  - El `Gestor` (Centro de reciclaje) toma posesión de la carga (`ENTREGADA_GESTOR -> RECIBIDA_PLANTA`). Aquí es donde la Ley 20.920 muerde más profundo: El Gestor re-calcula sus propios Kilos con pesaje de Romana.
  - **Diferencia de Custodia:** Discrepancias entre Peso_Transportista y Peso_Gestor $> 5\%$ abren perentoriamente una instancia de "RegistroDiscrepancia". El sistema detiene silencios e inyecta avisos tanto al transportista como al Gestor para subsanación.

---

## 2. Motor de Certificación Inmutable (`RN-CERT`)

Cuando una Solicitud alcanza el estado `TRATADA` en la terminal del `Gestor`, el sistema enciende el autómata de certificación (RN-CERT-001 a 003).

- **Ejecución Transaccional (TypeScript - `generarCertificadoAutomatico()`):**
  1. Se totalizan todos los folios y balanzas parciales de la Solicitud ($PesoTotalValorizado$).
  2. Indexa el folio al formato interanual: `CERT-YYYY-000N`.
  3. Comprime el String JSON completo del ciclo de vida y construye un Vector visual `QR` incrustado en Headless Chrome (`Puppeteer`) devolviendo el Buffer PDF inmutable.
  4. Sube este certificado al S3 y notifica en Push/Email al Generador subyacente, dando por cumplida su labor frente a la fiscalización del Estado.

- **Cadena de Preservación:**
  - El Certificado posee una directiva `No-Delete`. **Es sagrado.**
  - Incluso bajo hackeo o rol `Admin`, el certificado solo expone el estado `.anulado = true` y no desaparece jamás físicamente del sistema si fue visado por una autoridad.
  - La Verificación Pública es de Acceso Libre. Su ruta `/verificar-certificado?codigo=...` o lectura de Hash expone inmediatamente al Fiscalizador (Especialista MMA o Auditor), sin necesidad de loguearse en el portal.

---

## 3. Cumplimiento y Metas Anuales REP (`RN-META`)

El cálculo en tiempo real que mide el pulso del Negocio: Las "Metas" dictaminadas por el Estado y el Grado de Logro real medido en Toneladas.

- **`RN-META-001/002` (Asignación y Gatillos):**
  Al crearse la Meta `ANIO + SISTEMA GESTIÓN / PRODUCTOR` se le evalúa si corresponde a _Recolección_ (Movimiento de caucho) o _Valorización_ (El caucho convertido energéticamente).
  - Cada vez que un certificado es blindado (Motor de certificación concluido), se ejecuta la función `actualizarMetaREP()`. El $PesoValorizado$ escala del nivel `Solicitud` al contenedor General Anual sumando el avance métrico de la empresa.
  - Alerta Temprana Temible: Al traspasar $>90\%$, el Admin obtiene Notificadores para festejar o prepararse para el fin de cuatrimestre.

- **`RN-META-003` (Cierre Cron Causal - "The Doomsday Clock"):**
  Agendado para el **31 de Diciembre a las 23:59**, el sistema mapea el país entero. Si las empresas productoras no superaron estadísticamente su umbral (100% o parcialidad permitida según categoría), emite sendos reportes `INCUMPLIDA` en exportación CSV, aptos para subida al "Sistema Nacional de Declaración de Residuos (SINADER)".

---

## 4. Trazabilidad, Discrepancias y Alertas Generales

**Auditoría de Documentos Operacionales (`RN-DOC` y `RN-NOTIF`):**

Como las empresas (Gestores y Transportistas) transan residuos peligrosos, el equipo OpenTech levantó un candado perimetral férreo con CRON JOBS que no solo verifica permisos de Next.js (`Middleware`), sino papeles legales subidos al S3:

1. **Documentos MINSAL / Permisos de Circulación.**
2. **CronJob Diario (08:00 AM):** Despierta a `verificarVencimientosDocumentos()`. Escanea perfiles legales.
   - Notifica faltan $30 \, días$.
   - Envío de Panic Mail faltan $15 \, días$.
   - **Vencimiento + 3 Días = SUSPENSIÓN AUTOMÁTICA**. El Gestor cae, el Transportista pierde rutas activas hasta que el Admin vise la renovación (RN-DOC-002).

---

## 5. Tutorial QA: Validación End-to-End de Generador

> _Nota: Extraído del documento de pruebas heurísticas de OpenTech (`GUIA-VALIDACION-PROCESO-GENERADOR.md`), sirve para reproducir un testeo manual idóneo si fallase Playwright._

### Setup Local Prístino

```bash
# Para evitar historiales rotos en base, reiniciar:
npx prisma migrate reset
npx prisma db seed
npm run dev
```

### Paso 1: Interacción de FrontEnd - Generador

1. Ingresa a `http://localhost:3000` con `generador@trazambiental.com` (`generador123`).
2. Evaluar Dashboard: "KPI: 0 Solicitudes".
3. **Trigger:** `Nueva Solicitud`. (Rellenar con Neumáticos aro 13 y Camioneta para forzar balance).
4. Guardar. El folio será `SOL-202X...` -> Estado `PENDIENTE`.

### Paso 2: Interacción Logística (Traspaso Transportista -> Planta)

1. Cambio de Login hacia `transportista@...`. Debe saltar la asignación y geolocalizarlo al instante de presionar 'Confirmar Carga'. El estado vira a `RECOLECTADA`.
2. Cambio de Login hacia `gestor@...`. Ir al Panel "Entrantes". Hacer click en "Recepción". Discrepar deliberadamente kilos $>5\%$. Visualiza la campana de Alerta en rojo en el header de Admin.

### Paso 3: Consolidación (Documento Inmutable)

1. Con `gestor@...`, finalizado el paso anterior, ir a Módulo Tratamiento. Subir PDF Falso "SINADER.pdf". Guardar.
2. Certificado emitido (`CERT-YYYY-0001`). Verifica que haya sido deducido de la campana de Metas Anuales REP del Productor en tiempo real.

_Cualquier desviación a este flujo describe un Error de Producción Bloqueante (SEV-1)._
