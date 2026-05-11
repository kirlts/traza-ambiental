---
cssclasses: [kb-node]
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Trazabilidad detallada]]", "[[Soporte a Sistemas de Gestión]]"]
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
| Generador Cat B | Descargar matriz pre-poblada para SINADER (declaraciones individuales) | [[Resolución Exenta 2084]], [[SINADER]] |
| Consumidor Industrial (Cat B) | Descargar planilla pre-poblada para SISREP (Google Forms cifrado) | [[Planilla REP Consumidores Industriales]], [[SISREP]] |
| Sistemas de Gestión | Descargar matrices consolidadas para SINADER (Cat A + Cat B afiliados) y para SISREP | [[Resolución Exenta 2084]], [[SINADER]], [[SISREP]] |
| Trazambiental (Sistema) | Validar que el Establecimiento destino posea Código de Establecimiento registrado en SINADER antes de generar archivo | [[SINADER]], [[Secretaría Regional Ministerial de Salud]] |
| Trazambiental (Sistema) | Emitir reportes sin exigir FEA a operarios; autenticación vía ClaveÚnica en Ventanilla Única (solo Representante Legal firma DTEs con FEA) | [[Firma Electrónica Avanzada]], [[Validación de Identidad por Buena Fe]] |
| Trazambiental (Sistema) | Formatear datos según estándares del MMA | [[Resolución Exenta 2084]], [[SINADER]], [[SISREP]] |
| Trazambiental (Sistema) | Aplicar cronología del "penúltimo mes" para alertas y vencimientos de generación de documentos | [[Regla del Penúltimo Mes]] |
| Trazambiental (Sistema) | Soportar versionado de documentos generados para rectificaciones iterativas hasta el informe final anual | [[Rectificabilidad de Reportes Mensuales]] |
| Trazambiental (Sistema) | Adaptar plantillas de generación cuando la SMA modifique los formatos de Anexo (actualización gobernada por el Administrador) | [[Formato Dinámico Anexo Neumáticos]], [[Monitoreo Manual de Plataformas Estatales]] |
| Administrador del Sistema | Monitorear manualmente y actualizar los formatos exigidos por el MMA | [[Rol Operativo de Administrador del Sistema]], [[Monitoreo Manual de Plataformas Estatales]] |

## Relaciones Horizontales

- [[Trazabilidad detallada]]: **Extracción de Datos:** El módulo generador de documentos carece de datos transaccionales propios. Actúa como un motor de formateo que hace un query al módulo de trazabilidad para extraer los pesajes, fechas y actores, estructurándolos en los anexos legales.
- [[Soporte a Sistemas de Gestión]]: **Destinatario Principal:** Los Sistemas de Gestión (colectivos e individuales) son los consumidores primarios de las matrices consolidadas generadas por este módulo, necesitándolas para la carga en SINADER y SISREP.



## Se descompone en



## Qué falta

**Hipótesis de vacíos operativos (MVP):**
1. **Definición de Formatos Exactos:** Se necesita validar el formato y el conjunto exacto de insumos y anexos que deben subirse por ventanilla y canales pertinentes. Kratos lista SINADER y SISREP, pero el esquema técnico de las columnas no está mapeado aún.
2. **Carga Retroactiva Masiva (Etapa 3 CI):** La [[Habilitación Etapa 3 Consumidores Industriales]] está activa desde junio 2025, con obligación de regularización retroactiva vigente. El módulo debe poder generar documentos para períodos históricos acumulados (casi un año de deuda potencial), lo que implica formatos potencialmente distintos a los vigentes.
3. **Versionado de Rectificaciones:** Aunque se soporta la rectificabilidad, no está definido si el sistema debe mantener un log visible al usuario de todas las versiones previas de un documento generado.



## Justificación de estado

Avanza a `con_vacios` porque la tabla de compromisos está completamente vinculada a conceptos factuales (normativas y regla de monitoreo manual). Se mantiene en este estado porque requiere resolver el mapeo técnico exacto de las columnas de los anexos del MMA.
