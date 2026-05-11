---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Resolución Exenta 2279]]"
se_descompone_en: []
se_relaciona_con: ["[[SISREP]]"]
cssclasses: [kb-node]
---

# Rectificabilidad de Reportes Mensuales

## Qué dice

La Resolución Exenta 2279 adiciona un inciso segundo al artículo 8 de la Resolución 2084, estableciendo que: "Hasta la remisión del informe final de cumplimiento al Registro de Emisiones y Transferencia de Contaminantes, el reporte mensual podrá ser rectificado o complementado tantas veces como sea necesario."

Esto significa que ningún registro mensual debe sellarse criptográficamente ni hacerse inmutable tras su primer envío. El sistema debe permitir sobreescribir y reenviar tramas de datos hacia el SISREP a lo largo del año calendario, manteniendo un rastro de auditoría de estas rectificaciones. Las rectificaciones solo se bloquean cuando se emite el Informe Final anual.

## Por qué existe

Este concepto se deriva de [[Resolución Exenta 2279]] porque es una modificación específica introducida por dicha resolución que alivia la rigidez operativa del régimen original. Para Trazambiental, esto impone un requisito de diseño: la base de datos debe implementar un control de versiones de datos (Data Versioning) robusto, no un sellado prematuro de registros mensuales.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SISREP]]: **Diseño de Versionado:** El SISREP permite rectificaciones iterativas hasta el informe final. El módulo de generación de documentos de Trazambiental debe reflejar esta permisividad, no asumir inmutabilidad prematura.

## Fuente original

Resolución Exenta N° 2.279, inciso segundo adicionado al artículo 8.

## Evidencia

https://www.bcn.cl/leychile/navegar?idNorma=1209251

## Justificación de estado

Permanece en `borrador` porque el texto exacto del inciso no ha sido verificado línea a línea contra la resolución oficial.
