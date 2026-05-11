---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Superintendencia del Medio Ambiente]]"
se_descompone_en: ["[[Regla del Penúltimo Mes]]", "[[Rectificabilidad de Reportes Mensuales]]", "[[Habilitación Etapa 3 Consumidores Industriales]]"]
se_relaciona_con: ["[[Resolución Exenta 2084]]"]
cssclasses: [kb-node]
---

# Resolución Exenta 2279

## Qué dice

Resolución de la SMA (fines de 2024) que modificó profundamente la cronología de reportes de la Resolución 2084. Introduce tres cambios sustantivos:

1. **Regla del "penúltimo mes":** Reemplaza la obligación de reportar operaciones del "mes anterior" por el "penúltimo mes contado desde la fecha del reporte". Esto significa que en marzo, el sistema no exige datos de febrero, sino de enero.
2. **Rectificabilidad iterativa:** Hasta la remisión del informe final de cumplimiento al RETC, el reporte mensual podrá ser rectificado o complementado tantas veces como sea necesario.
3. **Etapa 3 — Consumidores Industriales:** Habilita el catastro y la operatividad de reportes de Consumidores Industriales a partir de junio de 2025, con obligación de regularización retroactiva de los meses pendientes desde el inicio del año.

Adicionalmente, la resolución refrenda que los reportes deben entregarse por medio del formato actualizado establecido por la SMA, el cual será publicado oportunamente en la página web institucional (no estáticamente en el Diario Oficial).

## Por qué existe

Esta resolución emana de la [[Superintendencia del Medio Ambiente]] porque fue emitida por la SMA en ejercicio de sus facultades fiscalizadoras. Para Trazambiental, la Resolución 2279 altera fundamentalmente los cronómetros internos del software: las alertas de vencimiento, la lógica de sellado de registros y la retroactividad para Consumidores Industriales deben reflejar estos cambios.

## Lógica de descomposición

Se descompone en tres conceptos que representan cada modificación sustantiva introducida: [[Regla del Penúltimo Mes]] (cambio en la ventana temporal de declaración), [[Rectificabilidad de Reportes Mensuales]] (eliminación de la inmutabilidad prematura de registros), y [[Habilitación Etapa 3 Consumidores Industriales]] (cronología diferenciada para actores industriales). Los tres cubren dimensiones distintas — temporal, de versionado, y de actores — sin solapamiento.

## Relaciones Horizontales

- [[Resolución Exenta 2084]]: **Modificación de Plazos:** La Resolución 2279 modificó de manera crítica los plazos y escalonamientos originales dictados por la 2084.

## Fuente original

Resolución Exenta Nº 2.279 (Superintendencia del Medio Ambiente, fines de 2024).

## Evidencia

https://www.bcn.cl/leychile/navegar?idNorma=1209251

## Justificación de estado

Permanece en `borrador` porque, si bien los tres cambios sustantivos han sido identificados y documentados con evidencia primaria, los plazos específicos de cada modificación no han sido verificados línea a línea contra el texto oficial.
