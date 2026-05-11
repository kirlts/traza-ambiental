---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: "[[SINADER]]"
se_descompone_en: []
se_relaciona_con: ["[[SINADER - Declaración Masiva Mensual]]"]
cssclasses: [kb-node]
---

# SINADER - Declaración Masiva Anual

## Qué dice

Mecanismo de ingesta de datos obligatoria para el cierre estadístico consolidado (Arts. 26, 27 y 28 del Reglamento del RETC). Rige a nivel nacional. La matriz de carga anual contiene exactamente 6 columnas de tipado estricto: ID (correlativo), LER (con espacios), RUT (con guion, sin espacios ni puntos), TRATAMIENTO, CANTIDAD (toneladas, empleando estrictamente coma para decimales) y ESTABLECIMIENTO. Se pueden procesar archivos en formato .xlsx o .csv.

## Por qué existe

Este concepto se deriva de [[SINADER]] porque es un mecanismo de declaración dentro de la plataforma SINADER. La declaración masiva anual es el cierre estadístico que permite a la SMA verificar el cumplimiento de las metas del DS 8 al finalizar el período. Para Trazambiental, este es uno de los documentos clave que el módulo de generación de documentos debe producir en el formato exacto que la plataforma acepta.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SINADER - Declaración Masiva Mensual]]: **Regímenes Alternativos:** Ambos son mecanismos de ingesta de la misma plataforma, pero difieren en cobertura territorial (Nacional vs RM) y en las columnas exigidas (6 vs 9).

## Fuente original

Manual de Carga Masiva para SINADER (Ministerio del Medio Ambiente).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque el formato exacto de las columnas y los tipos de archivo aceptados no han sido verificados contra el manual oficial de carga masiva y la evidencia está vacía. Para avanzar se requiere obtener el manual oficial del SINADER.
