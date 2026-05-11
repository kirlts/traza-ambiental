---
cssclasses: [kb-node]
estado: borrador
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]"]
---

# KPIs por actor

## Qué es

Visualización de indicadores clave de rendimiento operativos y comerciales, segmentados por el rol del actor en el sistema.

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque el usuario no solo necesita cumplir con la ley, sino también entender su operación. Los KPIs actúan como el panel de control del usuario, consolidando los datos crudos generados por la trazabilidad en métricas de rendimiento (ej. toneladas recolectadas vs metas, tiempos de respuesta). Es un diferenciador comercial que aumenta el valor percibido del software más allá del mero cumplimiento normativo.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador | Visualizar KPIs de recolección y cumplimiento | [[Estrategia Comercial B2B]] |
| Transportista | Visualizar KPIs logísticos | [[Estrategia Comercial B2B]] |
| Disposición Final | Visualizar KPIs de recepción | [[Estrategia Comercial B2B]] |
| Usuario (por Rol) | Visualizar indicadores clave de rendimiento por actor | [[Estrategia Comercial B2B]] |

## Relaciones Horizontales

- [[Trazabilidad detallada]]: **Consumo de datos:** Toma los eventos logísticos brutos de la trazabilidad para calcular métricas de rendimiento y cumplimiento en tiempo real.

## Se descompone en



## Qué falta



## Justificación de estado

Permanece en `borrador` por dos razones. Primera: los KPIs específicos aún no han sido definidos por el humano (decisión aplazada UD-013), lo que impide llenar las celdas de Sustento con referencias a métricas concretas en Kratos. Segunda: no se ha determinado si este concepto requiere descomposición en sub-responsabilidades por tipo de KPI (ambiental, eficiencia, operaciones). Para avanzar se requiere que UD-013 se reabra con la lista concreta de KPIs.
