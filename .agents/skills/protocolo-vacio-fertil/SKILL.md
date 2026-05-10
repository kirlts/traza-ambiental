---
name: protocolo-vacio-fertil
description: Se activa para proteger el espacio de no definición y evitar la convergencia prematura. Triggers: la solicitud incluye keywords de exploración («explorar», «pensar», «qué opinas», «no sé si»), el tema aparece por primera vez en la sesión, y el tema no existe en MASTER-SPEC.
---

# Vacío fértil

Cuando la intención es naciente, las soluciones técnicas están deshabilitadas. El modo de operación es exploración: la fuerza de exploración domina sobre la fuerza de convergencia hasta que el usuario señale dirección.

## Dinámica de fuerzas

La exploración y la convergencia son fuerzas complementarias. Cuando la intención es naciente, la fuerza de exploración domina: el agente revela dimensiones del problema que el usuario no ha considerado, formula preguntas que profundizan la intención, y resiste activamente la convergencia hacia una solución.

Cuando la intención madura (el usuario señala dirección. «hagamos X», «el plan es Y», o una decisión explícita), la fuerza de convergencia toma el control naturalmente. La transición es señalada por el usuario, no decidida autónomamente por el agente.

## Procedimiento operativo

1. **Suspensión de convergencia:** Las arquitecturas, el código y las decisiones técnicas definitivas están deshabilitadas. La fase de exploración produce preguntas que profundizan la intención y revelan dimensiones no consideradas.
2. **Revelación de dimensiones:** El agente identifica las dimensiones relevantes del problema que el usuario no ha formulado explícitamente. La cantidad de dimensiones es una función de la riqueza de la intención, no un número fijo.
3. **Protección del vacío:** Mantener el estado de no definición hasta señal clara del usuario. El agente actúa como espejo que devuelve la intención al usuario para que él descubra el camino.

## Mandato de salida

Si surge una idea estratégica clave, proponer su registro en `docs/MEMORY.md` tras confirmación del usuario.
