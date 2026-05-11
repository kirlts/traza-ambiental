---
cssclasses: [kb-node]
estado: con_vacios
depende_de: "[[Trazambiental MVP]]"
se_descompone_en: []
se_relaciona_con: ["[[Restricciones operativas por empresa]]", "[[Generación de documentos para ventanilla única]]", "[[KPIs por actor]]", "[[Trazabilidad circular hasta valorización]]", "[[Soporte a Sistemas de Gestión]]"]
---

# Trazabilidad detallada

## Qué es

Trazabilidad detallada del ciclo de vida del NFU para sistemas individuales y colectivos de gestión. Inventarios exactos de residuos y seguimiento del cumplimiento de metas REP anuales. Cat A opera solo bajo sistema colectivo; Cat B acepta sistema individual y colectivo.

## Por qué existe

Esta responsabilidad nace de [[Trazambiental MVP]] porque la función nuclear de un middleware de trazabilidad ambiental es precisamente trazar el recorrido físico y documental del residuo. La Ley 20.920 y el DS 8 imponen metas de recolección y valorización que solo pueden demostrarse mediante un registro granular del ciclo de vida del NFU. Sin esta capacidad, el sistema carecería de su razón de ser: no podría demostrar cumplimiento ante la SMA ni proveer certeza operativa a los generadores sobre el destino de sus residuos.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Compromisos

| Actor | Acción en el sistema | Sustento |
|---|---|---|
| Generador Cat A | Seguir trazabilidad bajo sistema colectivo de gestión | [[Categorización de Neumáticos A y B]], [[Sistema de Gestión Colectivo]] |
| Generador Cat B | Seguir trazabilidad bajo sistema individual o colectivo | [[Categorización de Neumáticos A y B]], [[Sistema de Gestión Colectivo]], [[Sistema de Gestión Individual]] |
| Sistema de gestión (ambos) | Acreditar y reportar cumplimiento de metas operando como coordinador logístico | [[Sistema de Gestión Colectivo]], [[Sistema de Gestión Individual]] |
| Transportista | Registrar divergencia de pesaje logístico ("estimado" vs "certificado") | [[OIML R76-1]], [[Transportista]] |
| Trazambiental (Sistema) | Tolerancia sistémica para mermas logísticas de peso (Límite 5%) | [[Límite de Tolerancia de Merma (5%)]] |
| Trazambiental (Sistema) | Diferenciar operativamente el destino logístico (Centro de Acopio, Valorización o Eliminación) | [[Ley 20.920]] |
| Trazambiental (Sistema) | Modelar estado "Rechazado en Destino", derivando la resolución manual al Generador o Transportista | [[Gestor]], [[Generador]] |
| Trazambiental (Sistema) | Proveer inventarios exactos de residuos NFU | [[Resolución Exenta 2084]] |
| Trazambiental (Sistema) | Seguimiento de cumplimiento de metas REP anuales | [[Decreto Supremo 8]] |
| Trazambiental (Sistema) | Soporte a sistema individual de gestión (solo Cat B) | [[Categorización de Neumáticos A y B]], [[Sistema de Gestión Individual]] |
| Trazambiental (Sistema) | Soporte a sistema colectivo de gestión (Cat A y Cat B) | [[Categorización de Neumáticos A y B]], [[Sistema de Gestión Colectivo]] |
| Generador (o Gestor) | Ingresar folio DTE manualmente como campo de texto en cada operación de manejo | [[Ingreso Manual de Folio DTE]], [[Servicio de Impuestos Internos]] |
| Trazambiental (Sistema) | Aplicar la ventana de reporte del "penúltimo mes" para cierre de períodos y alertas de vencimiento | [[Regla del Penúltimo Mes]] |
| Trazambiental (Sistema) | Permitir rectificación iterativa de datos transaccionales hasta emisión del informe final anual (no hacer registros inmutables prematuramente) | [[Rectificabilidad de Reportes Mensuales]] |

## Relaciones Horizontales

- [[Restricciones operativas por empresa]]: **Condicionante de Flujo Logístico:** Antes de habilitar una orden de recolección en el sistema, la trazabilidad debe consultar este módulo para validar que el transportista asignado cumple con los protocolos de seguridad del sitio origen/destino.
- [[Generación de documentos para ventanilla única]]: **Proveedor de Datos Base:** La trazabilidad captura la data logística atómica (pesos, fechas, actores) que luego es extraída y formateada por la generación de documentos para crear las matrices Excel de SINADER.
- [[KPIs por actor]]: **Telemetría Operativa:** Los eventos de trazabilidad actúan como el flujo de datos transaccional que alimenta en tiempo real los cuadros de mando de los distintos actores.
- [[Trazabilidad circular hasta valorización]]: **Punto de Traspaso (End of Waste):** La trazabilidad circular toma la custodia de los datos exactamente en el punto final de la trazabilidad detallada (cuando el Gestor recibe el residuo y comienza su transformación física).
- [[Soporte a Sistemas de Gestión]]: **Consumidor de Consolidación:** El Sistema de Gestión consume los datos transaccionales de trazabilidad para consolidar reportes de cumplimiento de metas REP ante SISREP y SINADER.

## Se descompone en



## Qué falta

**Hipótesis de vacíos estructurales y operativos:**
1. **Sincronización Offline (Zonas oscuras):** La trazabilidad asume conexión, pero Kratos no especifica si la SMA permite "declaraciones en diferido" de la hoja de ruta cuando el transportista sale de una faena sin internet (Cat B).
2. **Declaraciones Retroactivas:** El sistema carece de una definición de negocio formal respecto al manejo de cargas de datos atrasados (si debe bloquear duramente la generación de documentos para meses vencidos, o si debe permitirlo delegando el riesgo de multa al generador). El [[Decreto Supremo 1 - Artículo 28]] sanciona directamente los reportes extemporáneos en Ventanilla Única, lo que provee sustento factual para esta decisión cuando se tome.
3. **Acopio Transitorio (Pausa Logística):** La trazabilidad asume rutas continuas, pero Kratos no define si las paradas en Patios de Acopio temporales exigen registros formales en Ventanilla Única o divisiones de la Guía de Despacho.
4. **Transporte de Carga Peligrosa (DS 298):** El [[Decreto Supremo 298]] regula las condiciones de transporte de sustancias peligrosas. Si un NFU incendiado cruza la línea de peligrosidad ([[Decreto Supremo 148]]), el transportista entra bajo el régimen del DS 298. El MVP no tiene definido cómo marcar este cambio de régimen en la trazabilidad.



## Justificación de estado

Avanza a `con_vacios` porque su tabla de compromisos está validada con sustentación plena en Kratos y todas sus acciones están definidas. Mantiene este estado debido a los vacíos operativos logísticos persistentes (manejo de zonas oscuras, declaraciones retroactivas y acopio transitorio) que deben ser definidos por el negocio.
