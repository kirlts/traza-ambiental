---
cssclasses: [kb-node]
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]"]
---

# Trazabilidad circular hasta valorización

## Qué es

Trazabilidad del residuo más allá de su disposición, abarcando su descomposición y transformación en nuevos subproductos valorizados.

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque aunque la responsabilidad legal termina en la valorización (Fin de Condición de Residuo), Trazambiental vende la trazabilidad completa. El sistema continuará trazando el subproducto (ej. polvo de caucho) hasta que alcance a entes que no están registrados en la plataforma, permitiendo al generador primario revisar esta trazabilidad hasta donde llegue.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador Cat B | Trazar el subproducto generado post-valorización | [[Trazabilidad Extendida Post-Valorización]] |
| Trazambiental (Sistema) | Trazar descomposición volumétrica (Valorizado vs Merma/Eliminado) | [[Estrategia Comercial B2B]] |
| Trazambiental (Sistema) | Extender la trazabilidad más allá del fin de la responsabilidad legal (Fin de Condición de Residuo) hacia compradores de subproductos | [[Estrategia Comercial B2B]] |

## Relaciones Horizontales

- [[Trazabilidad detallada]]: **Extensión de Flujo:** Este módulo es una extensión natural del flujo principal de trazabilidad normativa, tomando el relevo en el punto exacto donde la disposición final ocurre para comenzar el seguimiento de los subproductos.

## Se descompone en



## Qué falta

**Hipótesis de vacíos operativos:**
1. **Diferenciadores Cat B (UD-014):** Los diferenciadores adicionales para Cat B están aplazados, lo que impide mapear la totalidad de las funcionalidades avanzadas de valorización comercial.

## Justificación de estado

Avanza a `con_vacios` porque las celdas de Sustento ya están vinculadas correctamente a las decisiones del CEO en Kratos, documentando formalmente la extensión post-valorización. Mantiene estado `con_vacios` debido a que la profundidad de los flujos de Cat B permanece aplazada (UD-014).
