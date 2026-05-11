---
cssclasses: [kb-node]
estado: con_vacios
depende_de:
se_descompone_en:
  - "[[Catastro de empresas generadoras de NFU]]"
  - "[[KPIs por actor]]"
  - "[[Trazabilidad detallada]]"
  - "[[Trazabilidad circular hasta valorización]]"
  - "[[Generación de documentos para ventanilla única]]"
  - "[[Restricciones operativas por empresa]]"
se_relaciona_con: []
---

# Trazambiental MVP

## Qué es

Trazambiental es un middleware de cumplimiento normativo SaaS para la gestión de residuos en Chile. Su propósito general es llevar un control ordenado de los residuos para empresas sujetas a normativas de la Seremi y el Ministerio del Medio Ambiente, incluyendo — pero no limitado a — la Ley REP.

Representa el MVP: acotado a generadores de Neumáticos Fuera de Uso (NFU), Categorías A y B, bajo la Ley REP. Las funcionalidades aquí descompuestas aplican exclusivamente a este alcance.

## Por qué existe

Esta es la responsabilidad raíz del software. No se deriva de ninguna otra responsabilidad porque representa la totalidad del producto planificado. Su existencia responde a una necesidad de mercado concreta: los generadores de NFU en Chile enfrentan un ecosistema regulatorio complejo (Ley 20.920, DS 8, múltiples plataformas gubernamentales como SINADER y SISREP) sin herramientas de software integradas que simplifiquen su cumplimiento. Trazambiental nace para cerrar esa brecha, operando como intermediario digital entre los actores regulados y las obligaciones normativas que la base factual documenta.

## Lógica de descomposición

El MVP se descompone en seis responsabilidades que cubren de forma mutuamente exclusiva y colectivamente exhaustiva las capacidades comprometidas del producto. El criterio de división responde a dominios funcionales distinguibles: (1) **Catastro** aborda el registro y descubrimiento de actores, (2) **KPIs** aborda la medición y visualización de desempeño, (3) **Trazabilidad detallada** aborda el seguimiento del ciclo de vida bajo sistemas de gestión, (4) **Trazabilidad circular** extiende ese seguimiento hasta la valorización final como diferenciador competitivo, (5) **Generación de documentos** aborda la producción de entregables normativos, y (6) **Restricciones operativas** aborda la comunicación de condiciones logísticas entre actores. Cada responsabilidad opera sobre un dominio funcional distinto y ninguna se solapa con otra.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador (Ley REP) Cat A | Declarar generación de residuos e iniciar ciclo logístico | [[Generador]] |
| Sistemas Colectivos | Operar como mecanismo instrumental de cumplimiento de metas | [[Sistema de Gestión]] |
| Importadores/Fabricantes | Introducir producto prioritario y financiar recolección | [[Productor]] |
| Transportistas | Ejecutar movimiento físico y registrar discrepancias de pesaje | [[Transportista]] |
| Disposiciones Finales | Cerrar trazabilidad mediante eliminación certificada | [[Gestor]] |
| Centros de Valorización | Cerrar trazabilidad mediante transformación certificada | [[Gestor]] |
| Generador (Ley REP) Cat B | Declarar generación y gestionar valorización in-situ (Consumidor Industrial) | [[Generador]], [[Consumidor Industrial]] |
| Sistemas Individuales | Operar como mecanismo de cumplimiento autónomo | [[Sistema de Gestión]] |
| Trazambiental (Sistema) | Trazar el ciclo de vida del NFU desde generación hasta disposición final | [[Ley 20.920]], [[Decreto Supremo 8]] |
| Trazambiental (Sistema) | Intermediar el cumplimiento normativo de actores regulados | [[Ley 20.920]] |
| Trazambiental (Sistema) | Gestionar datos estructurados de actores y residuos de forma desacoplada del ERP | [[Resolución Exenta 2084]], [[Servicio de Impuestos Internos]] |
| Trazambiental (Sistema) | Asumir mandato válido y representación de la empresa bajo buena fe electrónica | [[Validación de Identidad por Buena Fe]] |
| Trazambiental (Sistema) | Operar como SaaS web multiactor | [[Estrategia Comercial B2B]] |
| Administrador del Sistema | Definir e iterar el modelo de monetización (suscripciones) | [[Estrategia Comercial B2B]] |

## Relaciones Horizontales

Este concepto no posee relaciones horizontales directas modeladas en el sistema.

## Se descompone en

- [[Catastro de empresas generadoras de NFU]]
- [[KPIs por actor]]
- [[Trazabilidad detallada]]
- [[Trazabilidad circular hasta valorización]]
- [[Generación de documentos para ventanilla única]]
- [[Restricciones operativas por empresa]]

## Qué falta



## Justificación de estado

Avanza a `con_vacios` porque su tabla de compromisos está completamente vinculada a Kratos y sus propios vacíos estructurales directos han sido resueltos (como la eximición de responsabilidad de uptime y la jurisdicción de la SMA). Sin embargo, según MASTER-SPEC, no puede avanzar a `completo` porque hereda el estado `con_vacios` de sus responsabilidades hijas (ej. Trazabilidad detallada) que aún poseen hipótesis operativas sin resolver.
