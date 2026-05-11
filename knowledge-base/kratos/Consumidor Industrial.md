---
estado: verificado
tipo: regla_de_negocio
vigencia: vigente
depende_de: '[[Generador]]'
se_descompone_en: []
se_relaciona_con:
- '[[SISREP]]'
- '[[Sistema de Gestión]]'
- '[[Planilla REP Consumidores Industriales]]'
- '[[Decreto Supremo 8]]'
cssclasses:
- kb-node
---

# Consumidor Industrial

## Qué dice

Establecimientos de gran escala (predominantemente faenas mineras, puertos, o flotas logísticas masivas) que deciden gestionar y valorizar sus propios residuos de productos prioritarios sin delegar la operación enteramente en un Sistema de Gestión tradicional. Su delimitación jurídica, de acuerdo a la Ley REP, depende de la calificación urbanística del establecimiento como "industrial" según la Ordenanza General de Urbanismo y Construcciones (D.S. 22/2024 MINVU).

A nivel de fiscalización pública, existe un factor externo crítico: la total carencia de transparencia activa por parte de la SMA sobre quiénes son exactamente estos actores. No existen registros públicos nominales verificables que expongan el catálogo de Consumidores Industriales autorizados (sea el total país o por nicho, como mineras).

El Consumidor Industrial anula la dependencia logística y certificación de un Gestor externo para los tonelajes procesados internamente, emitiendo su propia acreditación directamente al Estado sin generar Certificados de Valorización tradicionales.
## Por qué existe

Este concepto se deriva de [[Generador]] porque el Consumidor Industrial es una especialización del concepto de Generador. Mientras el Generador genérico delega la gestión de sus NFU a un Sistema de Gestión, el Consumidor Industrial retiene la capacidad de gestionar y valorizar autónomamente. Esta distinción es relevante para Trazambiental porque los Consumidores Industriales tienen canales de reporte diferenciados (formularios cifrados en Google Forms vía SISREP, no SINADER estándar) y sus toneladas valorizadas deben imputarse a las metas de los productores a través de convenios con Sistemas de Gestión.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SISREP]]: **Fricción de Reportería.** La SMA exige a los Consumidores Industriales que acrediten su gestión directamente llenando la "Planilla Neumáticos", remitida de forma cifrada (Google Forms) independiente de los Sistemas de Gestión generales.
- [[Sistema de Gestión]]: **Convenios de Asociación.** En su matriz operativa, el Consumidor Industrial debe declarar con qué Sistemas de Gestión mantiene convenios vigentes (ej. Neuvol, Valora Más) para que sus toneladas valorizadas in-situ se imputen a las metas de los productores.
- [[Planilla REP Consumidores Industriales]]: **Diccionario de datos para flujos CI:** Las planillas (CIA0, CIB1, CIB2) constituyen el formato exacto en el cual este actor debe vaciar sus operaciones ante el Estado.
- [[Decreto Supremo 8]]: **Relación Bidireccional:** Vínculo estructurado para mantener la simetría del grafo.


## Fuente original

Resolución Exenta N° 2.084 y Decreto Supremo 8.

## Evidencia



## Justificación de estado

Está en `verificado` porque su contenido factual y relaciones horizontales fueron validados durante las sesiones de población de Kratos. La distinción entre Consumidor Industrial y Generador genérico fue confirmada, así como los canales diferenciados de reporte. El campo de evidencia permanece vacío pendiente de enlazar la Resolución Exenta 2084 y el DS 8 desde la BCN.
