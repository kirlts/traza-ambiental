---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Decreto Supremo 8]]"
se_descompone_en: []
se_relaciona_con: ["[[Declaración Jurada REP Neumáticos]]", "[[Convenio de Basilea - Anexo IX]]", "[[Decreto Supremo 29]]", "[[Sistema de Gestión Individual]]"]
cssclasses: [kb-node]
---

# Categorización de Neumáticos A y B

## Qué dice

El DS 8 distingue dos categorías de neumáticos: Categoría A (neumáticos de uso general: turismos, camionetas, camiones, buses) y Categoría B (neumáticos fuera de carretera OTR: minería, construcción, puertos). La distinción determina regímenes diferenciados de metas, plazos y canales de reporte.

## Por qué existe

Este concepto se deriva de [[Decreto Supremo 8]] porque la categorización A/B es una clasificación reglamentaria creada por dicho decreto. Para Trazambiental, esta distinción es fundacional: todo el MVP opera sobre la premisa de que Cat A y Cat B tienen flujos de trazabilidad diferenciados (volúmenes, actores, canales de reporte, metas de cumplimiento). El software debe modelar ambas categorías como entidades de dominio distintas.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Declaración Jurada REP Neumáticos]]: **Complementariedad Documental:** La Declaración Jurada REP debe especificar la categoría (A o B) del neumático importado, vinculando el instrumento aduanero con la clasificación del DS 8.
- [[Convenio de Basilea - Anexo IX]]: **Tipificación aduanera:** En sistemas aduaneros y para el comercio internacional, estas categorías (A o B) deben mapearse e integrarse bajo el código B3140 de no peligrosidad.
- [[Decreto Supremo 29]]: **Habilitación de Coprocesamiento (Cat B):** El DS 29 regula los parámetros de emisión bajo los cuales las plantas cementeras pueden coprocesar NFU Cat B como combustible alternativo (valorización energética).
- [[Sistema de Gestión Individual]]: **Restricción de Modalidad:** Solo Cat B puede operar bajo sistema de gestión individual. Cat A está obligado a operar bajo sistema colectivo, lo que hace de esta categorización el criterio determinante para la elegibilidad de modalidad.

## Fuente original

Decreto Supremo Nº 8.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque las definiciones exactas de las categorías no han sido verificadas contra el texto del decreto y la evidencia está vacía. Para avanzar se requiere confirmar los criterios de clasificación contra el DS 8 oficial.
