---
cssclasses: [kb-node]
estado: borrador
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]", "[[Soporte a Sistemas de Gestión]]"]
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
- [[Soporte a Sistemas de Gestión]]: **Vista de Gestión:** Los KPIs del Sistema de Gestión (avance de metas, tonelajes recolectados vs comprometidos, tasa de valorización) se alimentan de la telemetría de trazabilidad y se visualizan en el dashboard del coordinador.

## Se descompone en



## Qué falta

**Hipótesis de vacíos operativos:**
1. **KPIs Específicos No Definidos (UD-013):** La lista concreta de métricas no ha sido proporcionada por el humano. Sin ellas, es imposible definir las queries de agregación, los umbrales de alerta, o la granularidad temporal de los dashboards.
2. **KPIs Regulatorios vs Comerciales:** No está claro si los KPIs deben incluir métricas impuestas por la [[Resolución Exenta 2084]] (ej. % de avance de meta de recolección) o si son puramente comerciales (valor diferenciador). Si son regulatorios, deben derivarse de compromisos factuales en Kratos.
3. **Acceso del Sistema de Gestión Colectivo:** El [[Sistema de Gestión Colectivo]] como coordinador necesita una vista agregada de KPIs de todos sus generadores afiliados. No está definido si esto requiere un dashboard separado o una capa de permisos sobre el existente.



## Justificación de estado

Permanece en `borrador` por dos razones. Primera: los KPIs específicos aún no han sido definidos por el humano (decisión aplazada UD-013), lo que impide llenar las celdas de Sustento con referencias a métricas concretas en Kratos. Segunda: no se ha determinado si este concepto requiere descomposición en sub-responsabilidades por tipo de KPI (ambiental, eficiencia, operaciones). Para avanzar se requiere que UD-013 se reabra con la lista concreta de KPIs.
