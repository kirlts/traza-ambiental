---
estado: borrador
tipo: regla_de_negocio
vigencia: por_verificar
depende_de: "[[Decreto Supremo 8]]"
se_descompone_en: []
se_relaciona_con: ["[[Productor]]"]
cssclasses: [kb-node]
---

# Equivalencia SKU-Peso

## Qué dice

La normativa requiere mantener una tabla de equivalencias estricta entre el SKU (Stock Keeping Unit) fraccional de cada neumático y su peso exacto. Esta exigencia es verdadera y aplicable exclusivamente para la etapa de Introducción al Mercado de neumáticos nuevos (Productores/Importadores) bajo el Anexo Neumáticos. Es completamente falso e innecesario extrapolar este nivel de granularidad fraccional hacia la logística de patio y transporte de recicladores, donde la métrica obligatoria es la tonelada métrica consolidada (OIML R76-1).

## Por qué existe

Este concepto se deriva de [[Decreto Supremo 8]] porque operativiza las métricas exigidas en el Anexo Neumáticos para la declaración de productos introducidos al mercado. Sirve para delimitar el alcance tecnológico del sistema: acota el requerimiento de alta granularidad (manejo de catálogos de SKUs) únicamente al módulo de Productores/Importadores, evitando el "scope creep" o sobreingeniería que supondría exigir pesajes y registros a nivel de unidad a los operadores de patio o conductores de transporte de chatarra.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Productor]]: **Obligación Específica de Introducción:** Es el actor Productor (o importador) quien debe cumplir con reportar esta tabla de equivalencias SKU-peso durante su declaración de introducción al mercado, siendo este el único punto de la cadena que requiere dicha granularidad.

## Fuente original

Decreto Supremo N° 8 (Anexo Neumáticos).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la tabla de equivalencias y la sección específica del Anexo Neumáticos no han sido verificadas contra el texto oficial del DS 8. Para avanzar a `verificado` se requiere enlazar el anexo normativo oficial que demanda esta equivalencia.
