---
name: investigacion-estandar
description: Se activa cuando el agente está a punto de recomendar un framework, herramienta, práctica técnica o metodología que podría estar desactualizada o sobre la que el modelo podría tener data obsoleta. Se activa también dentro de /fix (Fase 3).
---

# Investigación de estándares

Los datos de entrenamiento del modelo tienen un corte de fecha. En tecnología, un desfase de 12-18 meses puede significar deprecación o cambio radical de mejores prácticas. Las recomendaciones tecnológicas se basan exclusivamente en fuentes fechadas y verificadas. Los datos de entrenamiento del modelo son insuficientes para recomendaciones de stack.

## Procedimiento

### 1. Declaración de ignorancia controlada (interna)

Antes de recomendar, declarar internamente: «Mi conocimiento de [tema] tiene fecha de corte estimada. Debo verificar.». Este es un trigger cognitivo silencioso. No comunicar al usuario.

### 2. Búsquedas obligatorias

**Búsqueda 1 (actualidad):**
`"[tecnología/práctica] best practices [año actual]"`

**Búsqueda 2 (comparativa):**
`"[tecnología] vs [alternativas] [año actual] [contexto del proyecto]"`

**Búsqueda 3 (crítica):**
`"[tecnología] problems issues deprecated [año actual]"`

**Búsqueda 4 (migración, si aplica):**
`"[tecnología actual] migration to [alternatives] [año actual]"`

### 3. Calidad de fuentes

**Aceptadas (en orden de preferencia):**
1. Documentación oficial y changelogs (date stamp requerido)
2. Engineering blogs reconocidos (Stripe, Shopify, GitHub, Cloudflare), últimos 12 meses
3. State of JS/CSS/DB (surveys anuales)
4. Threads de HackerNews o Reddit r/programming con fecha verificable
5. Artículos de Medium/Dev.to solo si tienen fecha y engagement alto verificable

**Rechazadas:**
- Conocimiento interno sin verificación externa
- Fuentes sin fecha verificable
- Fuentes con >24 meses de antigüedad para temas de evolución rápida

### 4. Triangulación

La investigación triangula mínimo 2 fuentes independientes fechadas en los últimos 12 meses. Si dos fuentes contradicen, declarar la contradicción explícitamente: «Fuente A dice [X], Fuente B dice [Y]. La contradicción surge de [razón]. Para este contexto, recomiendo [X] porque [justificación].»

### 5. Presentación

La investigación se presenta en el formato que mejor sirva la intención expresada por el usuario. El dato fijo, independientemente del formato de presentación: cada fuente lleva URL con fecha de acceso. Si no se encontraron fuentes recientes: «No encontré fuentes de los últimos 12 meses. Mi recomendación se basa en conocimiento con desfase de [X meses]. Verificar manualmente antes de implementar.»

## Límites de activación

- Para preguntas puramente conceptuales (no de herramientas) puede omitirse
- Para tecnologías maduras y estables (SQL básico, HTTP) puede reducirse a 1 búsqueda de validación
