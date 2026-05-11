---
cssclasses: [kb-node]
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]"]
---

# Generación de documentos para ventanilla única

## Qué es

Módulo encargado de autogenerar la documentación estructurada y pre-formateada que el usuario debe subir manualmente a las plataformas del Estado (SINADER/SISREP).

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque las plataformas estatales chilenas (SINADER/SISREP) carecen de APIs públicas para la ingesta directa de datos. Los usuarios están obligados a cargar archivos Excel (CSV) con formatos estrictos. Trazambiental actúa exclusivamente como un generador de insumos "offline"; el usuario hace clic en "Descargar" y el sistema crea la matriz exacta que el usuario debe subir manualmente a la Ventanilla Única, eximiendo al software de responsabilidad por el uptime de la plataforma estatal.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador | Descargar matriz de Excel pre-poblada para SINADER | [[Resolución Exenta 2084]], [[SINADER]], [[SISREP]] |
| Sistemas de Gestión | Descargar matrices consolidadas para reportabilidad | [[Resolución Exenta 2084]], [[SINADER]], [[SISREP]] |
| Trazambiental (Sistema) | Emitir reportes exentos de validación biométrica/FEA para operarios (solo Representante Legal) | [[Firma Electrónica Avanzada]], [[Ley 21.719 - Artículo 14 sexies]] |
| Trazambiental (Sistema) | Formatear datos según estándares del MMA | [[Resolución Exenta 2084]], [[SINADER]], [[SISREP]] |
| Administrador del Sistema | Monitorear manualmente y actualizar los formatos exigidos por el MMA | [[Monitoreo Manual de Plataformas Estatales]] |

## Relaciones Horizontales

- [[Trazabilidad detallada]]: **Extracción de Datos:** El módulo generador de documentos carece de datos transaccionales propios. Actúa como un motor de formateo que hace un query al módulo de trazabilidad para extraer los pesajes, fechas y actores, estructurándolos en los anexos legales.



## Se descompone en



## Qué falta

**Hipótesis de vacíos operativos (MVP):**
1. **Definición de Formatos Exactos:** Se necesita validar el formato y el conjunto exacto de insumos y anexos que deben subirse por ventanilla y canales pertinentes. Kratos lista SINADER y SISREP, pero el esquema técnico de las columnas no está mapeado aún.



## Justificación de estado

Avanza a `con_vacios` porque la tabla de compromisos está completamente vinculada a conceptos factuales (normativas y regla de monitoreo manual). Se mantiene en este estado porque requiere resolver el mapeo técnico exacto de las columnas de los anexos del MMA.
