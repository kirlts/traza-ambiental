---
cssclasses: [kb-node]
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: []
---

# Catastro de empresas generadoras de NFU

## Qué es

Directorio B2B estandarizado de actores del ecosistema (Generadores, Transportistas, Gestores). A nivel de código, es una tabla de perfiles de usuario enriquecida con metadatos legales.

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque el ecosistema REP carece de un directorio de acceso abierto (como se evidencia en la [[Inexistencia de Catastro Público de Generadores]]). Su inclusión en el MVP responde puramente a la [[Estrategia Comercial B2B]]: provee un "Network Effect" (efecto de red) vital para vender el software, al visibilizar a los actores del ecosistema entre sí. A nivel técnico es barato de construir, pero aporta un inmenso valor comercial inicial.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador Cat A | Consultar catastro de empresas generadoras | [[Estrategia Comercial B2B]] |
| Generador Cat B | Consultar catastro de empresas generadoras | [[Estrategia Comercial B2B]] |
| Trazambiental (Sistema) | Centralizar el acceso a actores relevantes del ecosistema de residuos | [[Trazambiental MVP]] |
| Administrador del Sistema | Mantener actualizado el catastro de empresas NFU | [[Estrategia Comercial B2B]] |
| Trazambiental (Sistema) | Ofrecer búsqueda y análisis sobre el catastro | [[Estrategia Comercial B2B]] |

## Relaciones Horizontales

Este concepto no posee relaciones horizontales directas modeladas en el sistema.

## Se descompone en

## Qué falta

**Hipótesis de vacíos operativos:**
1. **Actualización de Datos:** No está definido el mecanismo de actualización del catastro cuando un Generador cambia de categoría (A→B) o cuando un Gestor pierde su RCA. ¿Se actualiza automáticamente por integración con el [[Registro Público de Sistemas de Gestión]] o se mantiene manualmente?
2. **Privacidad de Datos:** La exposición pública de datos comerciales de empresas en el catastro B2B debe evaluarse contra la [[Ley 21.719]] para determinar qué campos pueden ser visibles sin consentimiento explícito del titular.

## Justificación de estado

Retrocede a `con_vacios` porque se identificaron hipótesis de vacíos operativos (actualización de datos de actores, evaluación de privacidad bajo Ley 21.719) que no habían sido consideradas previamente. Los compromisos siguen íntegramente sustentados en Kratos.
