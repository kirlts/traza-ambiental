# MASTER-SPEC: Traza Ambiental

## 1. Propósito Guía

Plataforma integral para la gestión de productos prioritarios bajo la Ley REP Chile.

## 2. Usuarios y Roles

- Generadores (Productores)
- Transportistas
- Gestores
- Administradores de Sistema

## 3. Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), TailwindCSS, TypeScript. Construcción y bundling vía Turbopack. Opciones de estado asíncrono gestionadas a través de TanStack Query.
- **Backend**: API Routes, Prisma. Generación de PDFs integrada con Puppeteer y PDFKit. Background jobs mediante cron nativo para notificaciones/vencimientos.
- **Base de Datos**: PostgreSQL.
- **Autenticación**: NextAuth.js v5.

## 4. Restricciones Técnicas

- Cero errores programáticos (TypeScript + ESLint).
- Prohibición del uso de `any` sin justificación extrema.
- Cumplimiento estricto de accesibilidad e integridad de datos.
- **Restricción Dura de Auditoría (Reporte Brecha Conceptual)**: El reporte macro DEBE contener un mínimo absoluto de **20.000 palabras** en total. Cada reporte o bloque por actor DEBE tener un mínimo innegociable de **2.000 palabras**. Cualquier bloque o tarea que no cumpla esta cuota es nula e invalida la entrega.

## 5. Arquitectura de Datos y Autenticación

- **Seguridad y RBAC (Role-Based Access Control)**: Centralizada al nivel del `middleware.ts`. La validación de rutas y operaciones críticas evita validaciones de cliente redundantes inyectándose a nivel top-level.
- **Modelo de Sesión Explicita**: El token JWT y la sesión transmiten de manera integral campos clave como `rol`, `roles`, y `rut`, permitiendo un control granular de autorizaciones y consultas de dominio.

## 6. Foco Estratégico Actual: Módulo Minería (Modo Demo)

El desarrollo a corto plazo (próximo mes) se centra exclusivamente en la vertical "Minería". Se prioriza la construcción de un **"Modo Demo"** puramente visual para que el Stakeholder valide la experiencia de usuario (UX) de los 5 roles base y el ciclo de vida del residuo.

- Regla FrontEnd: Las pantallas Demo (`/demo/*`) deben operar mediante funciones Mock/bypass de NextAuth.
- Criterio Kairós §6: Se exige estética premium (cero slop) al construir las vistas.

## 7. Procedimientos Adicionales (Checklist de Integridad Kairós)

Cualquier bloque de ejecución que demande alteraciones en arquitectura o core-logic DEBE estar precedido por:

- Declaración de una Checklist de Integridad (en `implementation_plan.md` si es planning).
- Sincronización continua de progreso en `TODO.md` respetando estructura `[EPIC-nnn] / [TASK-nnn]`.
- En caso de nuevos workflows, actualizar `MASTER-SPEC.md` §4 (Restricciones).

## 8. Checklist de Verificación

> Checks derivados para guiar la redacción del Reporte de Brecha Conceptual de 20K palabras.

### Generador (Obligado REP)
- `[GENERADOR-AV-001]` Intentar acceder a panel de "Declaración SINADER" → UI redirecciona a "Mi Perfil".
- `[GENERADOR-AV-002]` Navegar al histórico de solicitudes de retiro → Vista en blanco o no interactiva.
- `[GENERADOR-FN-003]` Presionar "Nueva Solicitud" completando datos de Neumáticos A y B → Ausencia de llamada a BD o error en form.
- `[GENERADOR-FN-004]` Adjuntar fotos de evidencia in situ → Falla de integración de storage.
- `[GENERADOR-CR-005]` Ingresar peso promedio disparatado (ej. 1 Neumático = 500Kg) → Sistema no alerta inconsistencia.
- `[GENERADOR-CR-006]` Guardar solicitud sin fotos como "Borrador" → No genera un Folio Temporal.
- `[GENERADOR-IN-007]` Comparar User ID con ID de Establecimiento → Relación tabular quebrada en vista.
- `[GENERADOR-IN-008]` Observar estado después de que el Transportista acepte carga → La UI Generador sigue en "PENDIENTE".
- `[GENERADOR-RS-009]` Simular error 500 al guardar borrador → Pantalla blanca sin feedback UX.
- `[GENERADOR-RS-010]` Recargar página de creación de caso → Se pierden todos los inputs del state.

### Transportista
- `[TRANSPORTISTA-AV-011]` Acceder a panel "Rutas y Asignaciones" → No existe y devuelve al Home.
- `[TRANSPORTISTA-AV-012]` Visualizar módulo de Tracking GPS activo → UI carece de hooks y soporte geográfico.
- `[TRANSPORTISTA-FN-013]` Interceptar/Aceptar solicitud pública del generador → No hay botón de intercepción.
- `[TRANSPORTISTA-FN-014]` Editar cantidad de "Kilo Real" en ruta → Formulario móvil de Romana no existe.
- `[TRANSPORTISTA-CR-015]` Alterar kilos a un 30% por sobre lo estimado → Sistema acepta sin disparar "RegistroDiscrepancia".
- `[TRANSPORTISTA-CR-016]` Transicionar de "EN_CAMINO" a "RECOLECTADA" → Timestamp registrado con valor null.
- `[TRANSPORTISTA-IN-017]` Vencer Documento de Circulación → Transportista no sufre "Suspensión Automática".
- `[TRANSPORTISTA-IN-018]` Consultar sobreescritura estadística → El Kilo Real no reemplaza al base en las métricas de backend.
- `[TRANSPORTISTA-RS-019]` Perder señal (offline) durante "Confirmación de Retiro" → Falla post y crashea la app.
- `[TRANSPORTISTA-RS-020]` Ingresar datos inválidos en la guía → Cierre súbito sin advertencias Joi/Zod.

### Gestor / Valorizador
- `[GESTOR-AV-021]` Verificar acceso al módulo de "Tratamiento en Planta" → Dependencia de "Mi Perfil" u otra sección equívoca.
- `[GESTOR-AV-022]` Visualizar la zona de generación de Certificados Inmutables → Link no implementado.
- `[GESTOR-FN-023]` Registrar recepción física de Transportista y pesaje en Romana → UI omite flujo verificador.
- `[GESTOR-FN-024]` Subdividir material a Valorización, Reciclaje y Disposición Final → No hay bifurcación en el caso (Trazabilidad lineal pura).
- `[GESTOR-CR-025]` Registrar Discrepancia > 5% entre Gestor y Transportista → UI no genera Alerta Administrativa.
- `[GESTOR-CR-026]` Sumar componentes para emitir el certificado → Falla aritmética o falta de "PesoTotalValorizado".
- `[GESTOR-IN-027]` Ordenar anulación de Certificado cerrado → Admin elimina fichero físicamente en lugar de flag `.anulado`.
- `[GESTOR-IN-028]` Imprimir QR de Certificado → Redirecciona a componente público NotFound (404).
- `[GESTOR-RS-029]` Superar el Vencimiento de Autorización Sanitaria MINSAL → El sistema no revoca permiso de emisión documental.
- `[GESTOR-RS-030]` Carga de un Archivo de Respaldo corrupto → El input file provoca cuelgue del browser.

### Sistema de Gestión (GRANSIC)
- `[GRANSIC-AV-031]` Ingresar como Sistema de Gestión a ver dashboard consolidado → Vista arroja error 403 o no existe roles asociados.
- `[GRANSIC-AV-032]` Revisar alarmas de metas obligadas → Blandeador visual no encontrado.
- `[GRANSIC-FN-033]` Agregar Productores (Generadores) a su cartera de socios → UI carente de multi-tenancy.
- `[GRANSIC-FN-034]` Exportar matriz en consolidado local para cargar en SINADER (CSV) → Botón export ausente.
- `[GRANSIC-CR-035]` Sumar Meta Anual de Valorización → Dato de certificado no se propaga a la Meta del Productor vinculado.
- `[GRANSIC-CR-036]` Romper barrera de 90% en la meta → No se enciende Semáforo Rojo en el Header.
- `[GRANSIC-IN-037]` Disparar crontab "Cierre Anual 31/12" → No se bloquea ni archiva el estado.
- `[GRANSIC-IN-038]` Visualizar folios sin pertenencer a la misma red → Fallo en aislar scope UUID.
- `[GRANSIC-RS-039]` Productor abandona el GRANSIC → Dashboard crashea intentando renderizar IDs huérfanos.
- `[GRANSIC-RS-040]` Cargar millones de filas para gráfico meta → UI bloqueada más de 30s sin un Suspense/Skeleton apropiado.

### Administrador de Plataforma
- `[ADMIN-AV-041]` Cargar panel principal "God Mode" de Trazabilidad → Redirección a perfil genérico.
- `[ADMIN-AV-042]` Encontrar el listado de Certificados Anulados → No se distingue zona de logs especiales.
- `[ADMIN-FN-043]` Intervenir Solicitud rechazada por Discrepancia Transporte/Gestor → No existen botones de Override Administrativo.
- `[ADMIN-FN-044]` Forzar suspensión temporal de Actores Obligados → Toggle Switch bloqueado (mock).
- `[ADMIN-CR-045]` Verificar gatillo de "verificarVencimientosDocumentos()" cron → Admin panel no reporta bloqueos de -15 días.
- `[ADMIN-CR-046]` Verificar Bitácora de Acciones Logueadas → Carece del payload u origen del movimiento.
- `[ADMIN-IN-047]` Editar bitácora log audit → Prisma permite modificar/delete entradas de bitácora en Admin (Vulnerabilidad).
- `[ADMIN-IN-048]` Inspeccionar datos del JWT en sesión admin → Falla de JWT no arrastra roles avanzados permanentemente.
- `[ADMIN-RS-049]` Dejar inactiva la sesión de Admin → Token no expira provocando brechas físicas.
- `[ADMIN-RS-050]` Buscar un rut dentro de 10.000 log records → Input freeza la aplicación web 100%.

### Fiscalizador (MMA/SMA/Seremi)
- `[FISCAL-AV-051]` Entrar usando credenciales del Estado → Mapeo redirige a una vista no read-only.
- `[FISCAL-AV-052]` Ingresar a link de verificación `/verificar-certificado` → Path arroja 404 router en Next.js.
- `[FISCAL-FN-053]` Consultar historial por RUT fiscalizado general → Cuadro de búsqueda Global ausente.
- `[FISCAL-FN-054]` Consultar certificados que no pertenecen a mi Seremi → Excepción o error en permisos territoriales.
- `[FISCAL-CR-055]` Inspeccionar diseño de QR → Omitidos Número de Resolución y Folio D.S. 8 legal en el documento PDF/Vistas.
- `[FISCAL-CR-056]` Abrir Certificado Anulado → Sello "ANULADO" no es visualmente abrumador, se puede confundir.
- `[FISCAL-IN-057]` Click derecho o inspeccionar payload del rol "Observer" → Descubre botones POST ocultos en DOM.
- `[FISCAL-IN-058]` Validar firma digital e integridad hash → No hay verificación hash on-the-fly en la vista pública.
- `[FISCAL-RS-059]` Exportar sábanas de todo el territorio nacional → Fetch excede timeout y colapsa Node.
- `[FISCAL-RS-060]` API / OpenData endpoint → Carencia total de webhooks fiscales de solo-lectura.

### Representante Legal
- `[RL-AV-061]` Identificar todos los establecimientos asignados a su RUT → Redirige a UI sin contexto local "Mi Perfil".
- `[RL-AV-062]` Panel documental constitutivo de empresa → UI no expone carpeta de acreditaciones legales.
- `[RL-FN-063]` Designar a un "Delegado" mediante firma/botón → UX de Alta carente de validaciones o firma electrónica.
- `[RL-FN-064]` Validar la Declaración Jurada Anual (DJA) → Workflow ausente dentro de su panel principal.
- `[RL-CR-065]` Designar 2 representantes legales simultáneos → Backend lo asimila violando regla de VU.
- `[RL-CR-066]` Consultar multas cruzadas de SMA → Panel carente de notificaciones sancionatorias.
- `[RL-IN-067]` Evaluar desvinculación (Offboarding general) → Imposibilidad UI de transferir la empresa a un tercero.
- `[RL-IN-068]` Jerarquía con el Encargado de Establecimiento → Problemas de herencia JWT al ingresar y ver datos del subalterno.
- `[RL-RS-069]` Estado externo de Ventanilla Única rechaza la sesión Oauth → La app lo marca validado localmente a perpetuidad.
- `[RL-RS-070]` Carga de un mandato notarial pesado (20MB) → UI revienta en Base64 parser.

### Delegado
- `[DEL-AV-071]` Transicionar entre Múltiples Sucursales Autorizadas → UI bloquea al usuario en el primer local registrado.
- `[DEL-AV-072]` Centro de notificaciones mensuales → Ausencia de campana que de recordatorios base.
- `[DEL-FN-073]` Llenar el registro de declaración SIDREP mensual → Sección omitida de toda la arquitectura app.
- `[DEL-FN-074]` Conceder sub-acceso a "Encargados" → Gestión de usuarios vacía.
- `[DEL-CR-075]` Declaración de SIDREP fuera del plazo de Octubre → UI no bloquea o notifica la advertencia legal.
- `[DEL-CR-076]` Modificar peso recepcionado de un transportista asignado → Input Box no está en modo read-only.
- `[DEL-IN-077]` Acceso a declaración RESPEL → Delegado con rol de residuo común abre manifiestos Peligrosos.
- `[DEL-IN-078]` Visivilidad de carpetas Importador → Ve opciones de comercio exterior sin serlo.
- `[DEL-RS-079]` Manipular sub-accesos después de ser destituido por RL → El token local de Delegado nunca falla.
- `[DEL-RS-080]` Bulk upload de hojas excel para declarar lotes masivos → Parser colapsa si falta una columna requerida.

### Encargado de Establecimiento
- `[ENC-AV-081]` Vista "Local" de Patio Logístico del Establecimiento → Carga data consolidada nacional.
- `[ENC-AV-082]` Imprimir tickets tipo Guías de Despacho Operativas → Modal de impresión tira página HTML vacía.
- `[ENC-FN-083]` Despachar Lote Activo (Preparar traslado) → Falla el request a Backend y trunca el caso.
- `[ENC-FN-084]` Handshake de Código QR entre Encargado y Transportista → Scan en App omite evento Handshake.
- `[ENC-CR-085]` Superar cota de 12 Toneladas Mensuales → UI omite advertirle que ya califica como Obligado SINADER.
- `[ENC-CR-086]` Selección LER (Lista Europea Residuos) en un nuevo lote → Combobox omite los LER correctos para Minería.
- `[ENC-IN-087]` Intentar ver manifiestos de otro establecimiento del mismo RUT → Aislamiento roto permite curiosear.
- `[ENC-IN-088]` Intentar fragmentar un lote → UI solo permite enviar el 100% o 0% en origen de carga.
- `[ENC-RS-089]` Uso de la app bajo "Modo Tablet" en terreno → Grid de Next.js se traslapa y rompe layout responsive.
- `[ENC-RS-090]` Registrar ingreso en el instante en que pierde token JWT → Queda Lote Zombi bloqueando la fila.

### Importador
- `[IMP-AV-091]` Acceder a panel exclusivo de Importación Frontal / D.S. 8 → No existe separación UI con Productor Nacional.
- `[IMP-AV-092]` Visualizar cuotas tributables REP Internacionales → Dashboard ciego de la proporción.
- `[IMP-FN-093]` Acreditar Productos Prioritarios internados → Fallo en encadenamiento a "Código Tributario del Producto".
- `[IMP-FN-094]` Anexar Documento de Saldo aduanero o Checklist externo → Dropzone bloquea todo formato.
- `[IMP-CR-095]` Declarar internación en Marzo 2026 pero liberada en Diciembre 2025 → Cronología temporal legal genera alertas erróneas.
- `[IMP-CR-096]` Acumulación de "Peso Internado" hacia el Productor Asignado REP → Data no se arrastra al umbral exigible anual.
- `[IMP-IN-097]` Fuga de visibilidad → Actores ajenos a rol ComercioExterior visualizan su panel de D.A.I.
- `[IMP-IN-098]` Respaldo del Manifiesto Aduanero inalterable → Documento subido a S3 no persistido o perdido.
- `[IMP-RS-099]` Marcar recepción fraccionada por paralización de aduanas → Imposibilidad de marcar UI como recepcionParcial.
- `[IMP-RS-100]` Petición webHooks silenciosa a SMA por tráfico atípico (voluminoso) → Fallo 500 por mala conexión externa de SMA.

### Exportador
- `[EXP-AV-101]` Intentar acceder a panel exclusivo "Extranjero / Convenio de Basilea" → Seccion omita (404/Empty).
- `[EXP-AV-102]` Abrir Instructivo y base de datos SEREMI sobre Basilea → Documentos de ayuda no localizables ni presentes.
- `[EXP-FN-103]` Despachar Residuo Prioritario a valorizador internacional → Selector de "Destino" exige obligatoriamente solo Regiones Chilenas.
- `[EXP-FN-104]` Generar empaquetado / ZIP documental para el dossier exportación → Falla de compresión en backend.
- `[EXP-CR-105]` Certificar que exportación cuenta con Visto Bueno MMA/Seremi → Carece de checkbox legal exigible "Manejo Ambientalmente Racional".
- `[EXP-CR-106]` Intentar exportar Neumáticos a gestor sin RUT chileno → El validador rechaza el formato extranjero de Identificación del Gestor Internacional.
- `[EXP-IN-107]` Trazabilidad Circular transfronteriza → La ramificación corta de golpe el track una vez sale del país sin certificar cierre.
- `[EXP-IN-108]` Validar permisos de Exportador ad-hoc vs General → Rol no diferenciado.
- `[EXP-RS-109]` Pausa aduanera / Timeout de Autorización de País Destino → Falta el estado "EN_HOLD" asumiéndolo siempre cancelado si falla tiempo de respuesta.
- `[EXP-RS-110]` Falla de redacción de PDF del Documento Movimiento (Basilea Form) → Plantillas no compilan PDF en Node y sueltan JSON.

### Autoridad Sectorial (Aduanas/DGA)
- `[SEC-AV-111]` Cargar Dashboard consolidado de Autorizaciones Multi-sector → Módulo no está diseñado, dependen de la misma vista genérica MMA.
- `[SEC-AV-112]` Cargar reportabilidad Semestral o descargas Excel base del sector → En blanco u ommited.
- `[SEC-FN-113]` Emparejar Volumen Importado REP vs CIF en app → Vista especializada omite totalmente la cuota económica vs peso.
- `[SEC-FN-114]` Acreditar / Anexar Visto Bueno del recurso hídrico o logístico externo → El Documento de Resolución Integral ni siquiera tiene campo BD.
- `[SEC-CR-115]` Modificar o anular transacciones logísticas internas de Traza Ambiental → Rol "Observer" (Aduanas) puede erróneamente intervenir despachos locales.
- `[SEC-CR-116]` Mostrar Hash Criptográfico del Visto Bueno Sectorial → Pantalla de resolución no muestra token de auditoría en la UI.
- `[SEC-IN-117]` Control de sesión IAM Sectorial → Un logueo DGA termina dentro del rol de SMA / Admin sin advertencia.
- `[SEC-IN-118]` Visibilidad de Lotes Transfronterizos → Sectores sin jurisdicción en Aduana ven los tracks de barcos, fuga en Row Level Security.
- `[SEC-RS-119]` Solicitar consolidado histórico interanual (1M registros) → Petición cuelga la memoria impidiendo el rol del auditor.
- `[SEC-RS-120]` Previsualizar PDF adjunto de aduanas pesando 15MB dentro del navegador embebido → Elemento object colapsa React DOM.
