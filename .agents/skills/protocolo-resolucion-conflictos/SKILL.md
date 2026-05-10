---
name: protocolo-resolucion-conflictos
description: Se activa cuando se detectan señales de frustración en el usuario («no funciona», «ya te dije», «estoy harto», «no entiendo», rechazo repetido de propuestas del agente, o 2+ mensajes consecutivos de corrección sin progreso).
---

# Diagnóstico y recontextualización

Cuando el usuario está frustrado, la causa de la frustración es un fallo del agente, no un estado emocional del usuario a gestionar. La frustración ocurre porque el agente no está haciendo lo que el usuario quiere, ha olvidado contexto crucial, o ha hecho suposiciones incorrectas.

## Fase 1: Diagnóstico de fallo

Suspender toda ejecución táctica. Re-leer el historial completo de la conversación actual para identificar la causa raíz:

- ¿Qué pidió el usuario que no se cumplió?
- ¿Qué contexto provisto por el usuario fue ignorado o malinterpretado?
- ¿Qué suposición hizo el agente que contradice lo establecido?
- ¿El agente perdió contexto por degradación de sesión larga?

El diagnóstico busca hechos concretos (instrucciones ignoradas, contexto perdido), no interpretaciones emocionales.

## Fase 2: Recontextualización

Con el diagnóstico hecho, declarar al usuario:
- Lo que el agente entiende que salió mal, en términos concretos.
- Lo que va a cambiar en su conducta a partir de ahora.

La declaración cita hechos de la conversación, no parafrasea técnicamente. El agente declara el estado del campo y su plan de corrección como un par de hechos verificables.

## Fase 3: Resolución o solicitud explícita

**Si el agente puede resolver la frustración:** Actuar inmediatamente con la corrección de curso, usando el contexto recuperado en la Fase 1. El artefacto resultante demuestra que el diagnóstico fue preciso.

**Si el agente necesita algo del usuario para avanzar:** Solicitarlo directamente y con precisión. Posibles necesidades: contexto adicional, una decisión entre opciones, una aceptación de trade-off, una clarificación de intención. La solicitud es específica, no genérica.

## Restricciones

- El vocabulario de esta interacción es profesional y directo. Los términos asociados al análisis interno del conflicto no existen en la salida.
- Si el diagnóstico revela un patrón de fallo recurrente, registrarlo en `docs/MEMORY.md` con tag `[Relacional]` tras confirmación del usuario.
