---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Sistema de Gestión]]"
se_descompone_en: []
se_relaciona_con: ["[[Consumidor Industrial]]", "[[Categorización de Neumáticos A y B]]"]
cssclasses: [kb-node]
---

# Sistema de Gestión Individual

## Qué dice

Modalidad de sistema de gestión en la que un solo productor opera autónomamente para cumplir sus obligaciones de recolección y valorización bajo la Ley REP. Solo está permitido para neumáticos Categoría B (OTR). El productor que opta por esta modalidad asume individualmente toda la responsabilidad logística y de reportabilidad, sin compartir metas ni infraestructura con otros productores.

## Por qué existe

Este concepto se deriva de [[Sistema de Gestión]] porque es la segunda modalidad legal contemplada por la Ley 20.920. Su relevancia para el MVP es específica a Cat B: los productores de neumáticos OTR (minería, puertos) pueden optar por gestionar individualmente sus obligaciones, lo que implica flujos de trazabilidad más simples pero con requerimientos de reportabilidad propios. Los [[Consumidor Industrial|Consumidores Industriales]] típicamente operan bajo convenios con un Sistema de Gestión Individual de su mismo productor.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Consumidor Industrial]]: **Vía de Cumplimiento Autónomo:** El Consumidor Industrial que valoriza in-situ típicamente se asocia a un Sistema de Gestión Individual para imputar sus tonelajes a las metas del productor.
- [[Categorización de Neumáticos A y B]]: **Restricción de Modalidad:** Solo Cat B puede operar bajo sistema individual. Cat A está obligado a operar bajo sistema colectivo.

## Fuente original

Ley N° 20.920 (Artículo 3, numeral 27) y Decreto Supremo 8.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque las condiciones exactas bajo las cuales un productor puede optar por la modalidad individual (vs. la colectiva) requieren verificación contra el texto legal, y la evidencia está vacía.
