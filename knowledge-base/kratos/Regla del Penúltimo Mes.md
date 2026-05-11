---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Resolución Exenta 2279]]"
se_descompone_en: []
se_relaciona_con: ["[[SISREP]]", "[[Consumidor Industrial]]"]
cssclasses: [kb-node]
---

# Regla del Penúltimo Mes

## Qué dice

La Resolución Exenta 2279 interviene el artículo 8 de la Resolución 2084, reemplazando la frase "mes anterior" por "penúltimo mes contado desde la fecha del reporte". Bajo la instrucción originaria, los Sistemas de Gestión y Consumidores Industriales debían reportar las operaciones del "mes anterior". La Res. 2279 introduce un desfase adicional de un mes.

A modo de ejemplo: durante el mes de marzo, el sistema no debe exigir la consolidación de los datos de febrero, sino que debe alertar sobre el cierre y envío obligatorio de las operaciones ocurridas en enero.

## Por qué existe

Este concepto se deriva de [[Resolución Exenta 2279]] porque es una modificación específica introducida por dicha resolución al régimen temporal de reportes. Para Trazambiental, este cambio impacta directamente los cronómetros internos del software (cron jobs y schedulers) que generan notificaciones push de alerta a los usuarios: las ventanas de declaración deben desplazarse un mes adicional.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SISREP]]: **Recalibración de Plazos:** Los plazos de entrega de reportes mensuales al SISREP deben reflejar esta nueva regla temporal, no la original de la Res. 2084.
- [[Consumidor Industrial]]: **Aplicabilidad:** La regla aplica tanto a Sistemas de Gestión como a Consumidores Industriales que reportan al SISREP.

## Fuente original

Resolución Exenta N° 2.279, numeral 3.

## Evidencia

https://www.bcn.cl/leychile/navegar?idNorma=1209251

## Justificación de estado

Permanece en `borrador` porque el texto exacto del numeral no ha sido verificado línea a línea contra la resolución oficial.
