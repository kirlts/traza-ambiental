---
estado: borrador
tipo: hecho_negativo
vigencia: por_verificar
depende_de: "[[SINADER]]"
se_descompone_en: []
se_relaciona_con: []
cssclasses: [kb-node]
---

# Inexistencia de Diccionarios OpenAPI de SINADER

## Qué dice

No existen esquemas OpenAPI estandarizados ni validaciones semánticas estructuradas expuestas públicamente como infraestructura como código por parte del MMA para SINADER. Las validaciones residen en manuales PDF o plantillas Excel.

## Por qué existe

Este concepto se deriva de [[SINADER]] porque refleja una carencia técnica directa de su interfaz. Para Trazambiental, esto exige que la base de datos interna implemente *Master Data Tables* rígidas para forzar las reglas operativas (ej. uso estricto de códigos LER para NFU) que el Estado no provee dinámicamente, evitando así campos de texto libre que causarían rechazos de formato.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

Este concepto no posee relaciones horizontales directas modeladas en el sistema.

## Fuente original

Informe Técnico de Auditoría 2026.

## Evidencia



## Justificación de estado

Permanece en `borrador` pendiente de verificación final.
