---
estado: verificado
tipo: decision_del_humano
vigencia: vigente
depende_de: ""
se_descompone_en: []
se_relaciona_con: ["[[OIML R76-1]]"]
cssclasses: [kb-node]
---

# Límite de Tolerancia de Merma (5%)

## Qué dice

Establece operativamente que el sistema tolerará una discrepancia de peso del 5% entre el punto de origen (Generador) y el punto de destino (Valorización/Acopio) sin disparar alertas de fraude o rechazo de carga, asumiendo este margen como merma logística natural.

## Por qué existe

Esta es una regla de negocio operativa (Decisión del CEO). Ante el vacío normativo del Estado respecto a un porcentaje legal exacto de merma medioambiental, el sistema necesita parametrizar un margen de error duro (hardcoded) para que los flujos logísticos no queden bloqueados matemáticamente debido al desgaste normal de los neumáticos durante el traslado.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[OIML R76-1]]: **Complementariedad Práctica:** Mientras OIML establece tolerancias técnicas de pesaje en básculas, esta decisión impone el límite volumétrico-logístico global que el software aceptará como válido.

## Fuente original

Decisión del CEO (11 de mayo 2026).

## Evidencia



## Justificación de estado

Permanece en `verificado` porque refleja una decisión ejecutiva en firme del fundador.
