---
estado: borrador
tipo: hecho_negativo
vigencia: por_verificar
depende_de: '[[RETC]]'
se_descompone_en: []
se_relaciona_con:
- '[[Monitoreo Manual de Plataformas Estatales]]'
cssclasses:
- kb-node
---

# Inexistencia de SLA de Disponibilidad RETC

## Qué dice

La infraestructura digital del Estado (RETC, Ventanilla Única, SINADER) no cuenta con un Acuerdo de Nivel de Servicio (SLA) de disponibilidad preestablecido en el marco normativo. En caso de colapso de los servidores estatales en fechas límite, no existe un mecanismo jurídico que exima automáticamente al regulado de responsabilidad. El MMA solo puede publicar resoluciones exentas de prórroga reactivas.

## Por qué existe

Este concepto se deriva de [[RETC]] porque es una limitante directa de su infraestructura. Para Trazambiental, la falta de un SLA estatal obliga a implementar arquitecturas de mensajería asíncrona (colas de reintentos) y retención de logs de error (ej. HTTP 503) para proveer defensa técnica al Generador frente a la imposibilidad de declarar por caída del sistema público.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Monitoreo Manual de Plataformas Estatales]]: **Relación Bidireccional:** Vínculo estructurado para mantener la simetría del grafo.


## Fuente original

Informe Técnico de Auditoría 2026.

## Evidencia



## Justificación de estado

Permanece en `borrador`. Como hecho negativo, su evidencia permanecerá vacía a menos que se cite un oficio que ratifique esta carencia.
