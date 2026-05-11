---
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]", "[[Generación de documentos para ventanilla única]]", "[[KPIs por actor]]"]
cssclasses: [kb-node]
---

# Soporte a Sistemas de Gestión

## Qué es

Responsabilidad del MVP de soportar a los Sistemas de Gestión (colectivos e individuales) como coordinadores logísticos y de cumplimiento de metas REP, incluyendo la consolidación de reportes, la gestión de sus redes de generadores/gestores, y la visibilidad del avance de metas anuales.

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque los Sistemas de Gestión son el mecanismo instrumental (Ley 20.920, Art. 3 numeral 27) a través del cual los productores dan cumplimiento a la REP. Son usuarios de primer nivel del MVP: coordinan la cadena logística entre generadores y gestores, operan como ente consolidador de reportes ante SISREP y SINADER, y responden directamente ante la SMA por el cumplimiento de las metas del [[Decreto Supremo 8]]. Sin esta responsabilidad, el MVP carecería de la funcionalidad necesaria para su cliente B2B principal.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor                                  | Acción en el sistema                                                                          | Sustento                                                                                                                  |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Sistema de Gestión Colectivo           | Consolidar y reportar métricas de avance de metas de recolección y valorización ante SISREP   | [[Sistema de Gestión Colectivo]], [[SISREP]], [[Decreto Supremo 8]]                                                       |
| Sistema de Gestión Colectivo           | Coordinar y supervisar la red de gestores y transportistas afiliados                          | [[Sistema de Gestión Colectivo]], [[Ley 20.920 - Artículo 26]]                                                            |
| Sistema de Gestión Colectivo           | Generar matrices consolidadas de declaración masiva para SINADER (Cat A + Cat B afiliados)    | [[SINADER]], [[Resolución Exenta 2084]], [[SINADER - Declaración Masiva Anual]], [[SINADER - Declaración Masiva Mensual]] |
| Sistema de Gestión Individual          | Operar como mecanismo de cumplimiento autónomo para un solo productor (solo Cat B)            | [[Sistema de Gestión Individual]], [[Categorización de Neumáticos A y B]]                                                 |
| Sistema de Gestión (ambos)             | Entregar informes de avance (30 sept) e informe final auditado (31 mayo del año subsiguiente) | [[Resolución Exenta 2084]], [[Decreto Supremo 8 - Artículo 15]]                                                           |
| Sistema de Gestión (ambos)             | Operar bajo la cronología del "penúltimo mes" para el reporte mensual                         | [[Regla del Penúltimo Mes]], [[SISREP]]                                                                                   |
| Sistema de Gestión (ambos)             | Rectificar reportes mensuales iterativamente hasta la emisión del informe final anual         | [[Rectificabilidad de Reportes Mensuales]]                                                                                |
| Sistema de Gestión Colectivo           | Mantener registro en el Registro Público de la SMA como condición de operación                | [[Registro Público de Sistemas de Gestión]]                                                                               |
| Trazambiental (Sistema)                | Proveer dashboard de cumplimiento de metas REP anuales con vista consolidada de tonelajes     | [[Decreto Supremo 8]], [[Estrategia Comercial B2B]]                                                                       |
| Trazambiental (Sistema)                | No exigir integración ERP; indexar folio DTE como campo manual                                | [[Ingreso Manual de Folio DTE]], [[Servicio de Impuestos Internos]]                                                       |
| Trazambiental (Sistema)                | Delegar autenticación ambiental al usuario vía ClaveÚnica en RETC (sin FEA)                   | [[Resolución Exenta 144]], [[Firma Electrónica Avanzada]], [[Validación de Identidad por Buena Fe]]                       |

## Relaciones Horizontales

- [[Trazabilidad detallada]]: **Proveedor de Datos Transaccionales:** La trazabilidad registra los eventos logísticos atómicos (pesajes, despachos, recepciones) que el Sistema de Gestión necesita consolidar para demostrar cumplimiento de metas. Sin este módulo, el SG no tendría datos que reportar.
- [[Generación de documentos para ventanilla única]]: **Consumidor de Documentos Formateados:** El SG requiere matrices pre-formateadas (SINADER, SISREP) que genera este módulo, listas para descarga y carga manual en la Ventanilla Única.
- [[KPIs por actor]]: **Vista de Gestión:** Los KPIs del SG (avance de metas, tonelajes recolectados vs comprometidos, tasa de valorización) se alimentan de la telemetría de trazabilidad y se visualizan en el dashboard del coordinador.

## Se descompone en



## Qué falta

**Hipótesis de vacíos estructurales y operativos:**
1. **Gestión de Conflictos de Adhesión:** Kratos no especifica el protocolo cuando un generador se desafilia de un Sistema de Gestión Colectivo a mitad de año. ¿Cómo se transfieren los tonelajes ya reportados? ¿Quién asume la meta parcial?
2. **Visibilidad Inter-SG:** Si un generador Cat B opera simultáneamente bajo sistema individual y colectivo (¿es siquiera legal?), el MVP no tiene definida la lógica de partición de tonelajes entre ambos regímenes.
3. **Auditor Externo:** La [[Resolución Exenta 2084]] exige que el informe final anual sea auditado por un tercero independiente certificado por la SMA. El MVP no contempla actualmente un flujo de workflow para el auditor externo (¿requiere acceso de solo lectura? ¿exportación especial?).
4. **Habilitación Etapa 3 CI (activa desde junio 2025):** La [[Habilitación Etapa 3 Consumidores Industriales]] ya está operativa con obligación de regularización retroactiva. El SG que coordine a CIs debe absorber un volumen de carga histórica acumulada (casi un año) para el cual el MVP no tiene definido un flujo de ingesta masiva retroactiva.

## Justificación de estado

Avanza a `con_vacios` porque su tabla de compromisos está densamente sustentada en Kratos (12 referencias cruzadas a nodos factuales) y cubre las responsabilidades operativas del SG como usuario del MVP. Mantiene este estado por los 4 vacíos operativos identificados, especialmente la gestión de desafiliación, la visibilidad del auditor externo, y la carga retroactiva de la Etapa 3 CI.
