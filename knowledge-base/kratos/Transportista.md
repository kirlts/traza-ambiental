---
estado: borrador
tipo: regla_de_negocio
vigencia: por_verificar
depende_de: "[[Decreto Supremo 148]]"
se_descompone_en: []
se_relaciona_con: ["[[OIML R76-1]]", "[[Resolución Exenta 154]]", "[[Decreto Supremo 298]]"]
cssclasses: [kb-node]
---

# Transportista

## Qué dice

No posee definición propia aislada en la normativa REP (Ley 20.920 o D.S. 8) para neumáticos. En la práctica, opera como el actor logístico intermedio que se subordina a las normativas del Ministerio de Transportes y al Decreto Supremo N° 148 sobre manejo de residuos. 

## Por qué existe

Este concepto se deriva de [[Decreto Supremo 148]] porque las obligaciones del transportista de residuos en Chile emanan principalmente de este decreto, que regula el manejo de residuos y establece los requisitos para su transporte (guías de despacho, autorizaciones, condiciones del vehículo). Aunque la Ley REP no define al Transportista como actor formal, su rol es operativamente indispensable en la cadena de custodia del NFU: es quien mueve físicamente el residuo entre generador y gestor, y sus discrepancias de pesaje son una fuente persistente de conflictos.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[OIML R76-1]]: **Divergencia de Pesaje:** El transportista asume un rol crítico en la cadena de custodia física donde suelen surgir discrepancias volumétricas ("pesaje estimativo" en origen vs. "pesaje legal" certificado en planta).
- [[Resolución Exenta 154]]: **Restricción Tributaria:** Esta resolución prohíbe explícitamente consolidar manifiestos de múltiples orígenes en una sola Guía de Despacho general en ruta.
- [[Decreto Supremo 298]]: **Regulación de Transporte Peligroso:** Cuando los subproductos del procesamiento de NFU se clasifican como peligrosos, el transportista queda sujeto a este decreto que dicta las normas sobre transporte de cargas peligrosas por calles y caminos.

## Fuente original

Regla de negocio derivada de la falta de definición explícita en la Ley REP.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la ausencia de definición formal en la Ley REP hace que el contenido sea una regla de negocio inferida, no un hecho verificable directamente. La evidencia está vacía y la relación con el DS 148 no ha sido verificada contra el texto del decreto. Para avanzar se requiere confirmar las obligaciones de transporte contra el DS 148 y determinar si el Transportista merece un desarrollo más profundo para el MVP.
