---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: "[[SINADER]]"
se_descompone_en: []
se_relaciona_con: ["[[SINADER - Declaración Masiva Anual]]"]
cssclasses: [kb-node]
---

# SINADER - Declaración Masiva Mensual

## Qué dice

Mecanismo de ingesta de datos obligatoria para el seguimiento logístico recurrente. Esta declaración es exclusiva para establecimientos ubicados en la Región Metropolitana (amparada por la Resolución N° 5.081/1993 de SESMA). Exige una matriz rígida de 9 columnas, sumando a las 6 de la declaración anual tres vectores clave: RUT TRANSPORTISTA, PATENTE y FECHA MOVIMIENTO. Esta última exige estrictamente el formato exacto `dd/mm/yyyy`, debiendo forzar el formato de celda "Personalizado" (`dd"/"mm"/"yyyy`) en el software de ofimática para evitar que Excel corrompa la fecha silenciosamente y provoque rechazos.

## Por qué existe

Este concepto se deriva de [[SINADER]] porque es un mecanismo de declaración dentro de la plataforma SINADER. La declaración mensual provee seguimiento granular de los movimientos logísticos, incorporando datos del transportista y del vehículo que la declaración anual no exige. Para Trazambiental, este formato de 9 columnas es el más exigente técnicamente y el que el módulo de generación de documentos debe producir con mayor cuidado, especialmente por las restricciones de formato de fecha que causan rechazos silenciosos.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SINADER - Declaración Masiva Anual]]: **Regímenes Alternativos:** Ambos son mecanismos de ingesta de la misma plataforma, pero difieren en cobertura territorial (Nacional vs RM) y en las columnas exigidas (6 vs 9).

## Fuente original

Manual de Carga Masiva para SINADER (Ministerio del Medio Ambiente).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque el formato de 9 columnas y la restricción territorial (solo RM) no han sido verificados contra el manual oficial y la evidencia está vacía. Para avanzar se requiere obtener y verificar contra el manual de carga masiva del SINADER.
