---
estado: verificado
tipo: decision_del_humano
vigencia: vigente
depende_de: ""
se_descompone_en: []
se_relaciona_con: ["[[Inexistencia de SLA de Disponibilidad RETC]]", "[[Formato Dinámico Anexo Neumáticos]]", "[[Rol Operativo de Administrador del Sistema]]"]
cssclasses: [kb-node]
---

# Monitoreo Manual de Plataformas Estatales

## Qué dice

Establece que el Administrador de Trazambiental será el único responsable operativo de monitorear manualmente los canales del Estado (SINADER/SISREP) para detectar cambios en los formatos de las planillas Excel/CSV y actualizar los esquemas en el sistema.

## Por qué existe

Esta es una regla de negocio operativa. Ante la inexistencia de SLAs formales o un feed para desarrolladores por parte del Estado, el riesgo de que el autogenerador se rompa es alto. Esta regla asume dicho riesgo como un proceso humano manual, en lugar de intentar automatizar el scraping de cambios en ventanilla única.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Inexistencia de SLA de Disponibilidad RETC]]: **Mitigación Operativa:** Es la respuesta directa al vacío estatal sobre garantías de servicio técnico y notificaciones.
- [[Formato Dinámico Anexo Neumáticos]]: **Vigilancia de Formatos:** La naturaleza dinámica del formato del Anexo Neumáticos (publicado discrecionalmente en el portal web de la SMA) refuerza la necesidad de este monitoreo manual.
- [[Rol Operativo de Administrador del Sistema]]: **Responsabilidad Operativa:** El Administrador del Sistema es el ejecutor directo de esta tarea de monitoreo manual, formalizando la responsabilidad humana de mantener el software sincronizado con los cambios del Estado.

## Fuente original

Decisión del CEO (11 de mayo 2026).

## Evidencia



## Justificación de estado

Permanece en `verificado` porque refleja una decisión ejecutiva en firme del fundador.
