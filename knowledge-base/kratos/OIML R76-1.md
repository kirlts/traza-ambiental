---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: '[[Instituto Nacional de Normalización]]'
se_descompone_en: []
se_relaciona_con:
- '[[Transportista]]'
- '[[SISREP]]'
- '[[Límite de Tolerancia de Merma (5%)]]'
cssclasses:
- kb-node
---

# OIML R76-1

## Qué dice

Norma metrológica internacional (Organización Internacional de Metrología Legal, Recomendación 76-1) que establece las tolerancias legales para balanzas de pesaje no automático. En Chile, el INN adopta esta norma como referencia para determinar si una discrepancia de pesaje es tolerable o constituye una irregularidad. Para NFU, la tolerancia típica oscila en torno al ±0,5% del peso neto declarado.

## Por qué existe

Esta norma se integra en la KB a través del [[Instituto Nacional de Normalización]] porque es el organismo que la administra en Chile. Para Trazambiental, la OIML R76-1 es operativamente relevante porque las discrepancias de pesaje entre el punto de origen (generador) y el destino (gestor) son una fuente persistente de conflictos en la cadena de custodia de NFU. El software necesita conocer las tolerancias legales para determinar si una discrepancia debe ser flaggeada como alerta o aceptada como error metrológico dentro del rango permitido.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Transportista]]: **Divergencia de Pesaje:** El transportista asume un rol crítico en la cadena de custodia física donde suelen surgir discrepancias volumétricas ("pesaje estimativo" en origen vs. "pesaje legal" certificado en planta).
- [[SISREP]]: **Respaldo Metrológico Legal:** Las romanas calibradas bajo esta norma constituyen el único mecanismo de acreditación válido para el ingreso de toneladas consolidadas macroscópicas al portal SISREP, desplazando interpretaciones teóricas sobre depreciación metrológica o registros atómicos por SKU.
- [[Límite de Tolerancia de Merma (5%)]]: **Relación Bidireccional:** Vínculo estructurado para mantener la simetría del grafo.


## Fuente original

OIML R76-1 (Organización Internacional de Metrología Legal).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la tolerancia de ±0,5% no ha sido verificada contra la norma oficial y la evidencia está vacía. Para avanzar se requiere confirmar la tolerancia aplicable contra la norma OIML R76-1 adoptada por el INN.
