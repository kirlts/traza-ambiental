# Documento Exhaustivo de Enmiendas Forenses y Reducción de Scope Creep

**Basado en el Informe:** `docs/research/informes/08-fixes.md` y Análisis de Scrubbing Cruzado
**Fecha de Emisión:** 11 de Abril de 2026
**Fecha de Aplicación:** 2026-04-11T23:11 (todas las órdenes A-D ejecutadas)
**Estatus:** APLICADO - Enmiendas incorporadas en PRD, Reporte de Brechas, MASTER-SPEC y Registro Factual

## 1. Veredicto Ejecutivo
El escrutinio pericial y jurídico de la normativa (Ley 20.920, D.S. N° 8, resoluciones de SMA/RETC y D.S. 9/2017) cruzado con el total de la biblioteca de investigación de TrazaAmbiental (Informes 01 al 07) **ha revelado que la arquitectura del sistema sufrió una severa infección de "Scope Creep"**. 

Las exigencias ideales (transparencia activa, cierres de gobierno remotos, mandatos con firma electrónica delegada, y monolitos ERP financieros) no provienen de la ley, sino de **extrapolaciones y alucinaciones arquitectónicas que mutaron en nuestros documentos de diseño internos**, específicamente contagiando al `reporte-brecha-conceptual.md` y cristalizándose como mandatos técnicos dentro de `PRD-TRAZAAMBIENTAL.md`. Por el contrario, el `registro-factual.md` se ha mantenido hermético y limpio, demostrando ser el único custodio de la verdad.

A continuación, se detallan las brechas factuales confirmadas y las directrices quirúrgicas para amputar esta burocracia imaginaria de nuestro eje documental.

---

## 2. Catálogo de Alucinaciones y Scope Creep Confirmado

1. **La Ficción de Datos Abiertos (CKAN):** Se asume erróneamente que la plataforma del Sistema de Gestión está sujeta a la Ley de Transparencia 20.285. **Realidad:** El software es privado, protegido por secreto comercial. Exponer APIs CKAN públicas para escrutinio ciudadano es una extralimitación sin mandato.
2. **El "Kill Switch" Sanitario (Root Override):** Se asumía la obligación de proveer a la SEREMI un botón de cierre algorítmico nativo en caso de clausura. **Realidad:** El Estado clausura con candados y timbres materiales, no en la base de datos de un SaaS. La inhabilitación del proveedor en el maestro de sistema es gestión interna (bloqueo lógico), no exigencia algorítmica de la SEREMI.
3. **El SKU Fraccional de Depreciación (Extrapolación Parcial):** El sistema asumía el control de desgaste unitario SKU durante toda la cadena logística de residuo. **Realidad:** Falso para la logística de patio; la métrica de recolección es exclusivamente la "tonelada métrica consolidada" (OIML R76-1). Sin embargo, es **VERDADERO** y exigido para la etapa de *Introducción al Mercado* de neumáticos nuevos (Productores/Importadores), donde el Anexo Neumáticos sí requiere la tabla de equivalencias SKU ↔ peso.
4. **El ERP y la "Eco-Tasa" Monolítica:** Pretender que el middleware opere tributariamente y recaude. **Realidad:** No hay exigencia legal. Es perfectamente lícito usar un ERP de terceros (Defontana, Nubox, SAP). El único mandato es **referenciar el folio DTE tributario** a la tonelada ambiental.
5. **El Mandato de Subrogancia mediante FEA:** Exigir Firma Electrónica Avanzada (Ley 19.799) a empleados para operar el software internamente. **Realidad:** Las credenciales y el ACL que delega el Representante Legal son suficientes. La FEA se reserva exclusivamente para reportes finales a la SMA. Forzar FEA a nivel operario es sobreingeniería extrema.
6. **El Workflow Internacional del PIC (Basilea):** Modelar flujos interactivos diplomáticos en el software. **Realidad:** Esas comunicaciones operan de **Estado a Estado** (VUCE/SICEX). Al SaaS privado solo le compete recibir el "Certificado de Cierre o Eliminación" en PDF.

*(Nota: El modelo tipo "Uber Freight" logístico ha sido reclasificado fuera de las obligaciones legales y promovido a "Mandato Comercial Vertical", respetando la orden estratégica de Negocios).*

---

## 3. Autopsia Cruzada: La Infección del Eje Documental Interno

Tras re-evaluar el corpus documental `docs/prd` y `docs/research`, se confirma que el virus de la sobre-arquitectura infectó documentos específicos con gravedad variable:

* **`registro-factual.md` [ESTADO: LIMPIO]**: El documento base es aséptico. Identifica el CKAN como obligación exclusiva del Estado (Línea 361) y la clausura como acción física de la SEREMI (Línea 254). 
* **`reporte-brecha-conceptual.md` [ESTADO: INFECTADO SEVERO]**: El documento fue redactado bajo hiper-escrutinio teórico (tono pedagógico). Trata erróneamente el uso de tokens FEA inter-compañía para mandatos subordinados como una obligación de la Ley 19.799. Asume requerimientos monolíticos que ahogan el desarrollo.
* **`PRD-TRAZAAMBIENTAL.md` [ESTADO: INFECTADO ESTRUCTURAL]**: El documento maestro codificó el "Scope Creep". 
  - **Infección CKAN:** (Línea 938) Exige provisionar datos exportables formato CKAN para cumplir Ley 20.285. 
  - **Infección Eco-Tasa:** (Línea 1312) Delega al sistema completo el módulo `billing` para recaudación de eco-tasas y compensaciones.
  - **Infección Kill-Switch:** (Línea 858) Define la cláusula "Kill Switch Regulatorio" como feature nativa de gobierno.
  - **Error Omisivo en SKU:** Extrapola los SKU de introducción (Línea 773) hacia componentes de UI móviles innecesarios para conductores de chatarra (NFU fraccionado).

---

## 4. Órdenes de Enmienda Documental (Purga)

### A. Para el PRD (`docs/prd/PRD-TRAZAAMBIENTAL.md`)
**Mandato:** Ejecutar amputación de bloques infectados.
1. **Purgar Módulo de Transparencia Activa:** Eliminar la línea 938 y toda referencia a CKAN o portales públicos de datos abiertos.
2. **Amputar el Módulo Financiero Nativo:** Purgar el diseño del módulo `billing` (Línea 1312) y reescribirlo como `IngestaDTE`: "Módulo de vinculación de tonelaje a Folio DTE procesado externamente".
3. **Erradicar el "Kill Switch" Gubernamental:** Refactorizar la Línea 858. El administrador pausa gestores (bloqueo lógico estándar), pero **no se entrega un override directo al Minsal o SEREMI**.
4. **Desdoblar SKU:** Modificar la arquitectura del Catálogo de SKU. Exigirlo estrictamente en el submódulo de *Importadores/Productores*. Prohibir el campo SKU en las interfaces móviles de pesaje de *Recicladores* (usar solo el total volumétrico masificado por Categoría A/B).

### B. Para el Reporte de Brechas (`docs/research/reporte-brecha-conceptual.md`)
No se destruirá por su inmenso valor reflexivo-analítico, pero se convertirá en un "Edicto Histórico Degradado".
1. **Inyectar Header de Prevención:** Colocar en la línea 1: `> [!WARNING] ALERTA FORENSE: Gran parte del Scope de este documento ha sido degradado en auditoría cruzada ("Scope Creep"). Leer en conjunto con 08-fixes.md y 09-enmiendas-forenses.md.`
2. **Acotar Actor Delegado (Actor 8):** Eliminar o marcar como obsoleto el requisito de Firma Electrónica Avanzada para los operadores base. El RBAC normal es suficiente.

### C. Para el Checklist (MASTER-SPEC §8 y Validaciones)
1. Extraer los test de stress de firmas FEA para usuarios rasos. Solo el Representante Legal requiere FEA en la certificación anual.
2. Reducir los tests de Comercio Exterior a la simple subida del Documento PDF "Certificado PIC final", sin workflow diplomático.

### D. Para el Registro Factual (`docs/prd/registro-factual.md`)
1. Al final del documento, añadir una sección de "**Axiomas de Limitación (Anti Scope Creep)**" que referencie este documento, blindando al proyecto contra futuras dudas, recalcando que el Estado recauda la transparencia (CKAN), que las clausuras son con candados y que el sistema NO ES un ERP de tributación.

---
**Consideración Estratégica Final:** Al aplicar esta purga directamente sobre el código del PRD, Traza Ambiental retornará a su verdadero "Peso Operativo Mínimo Viable". El esfuerzo de ingeniería se recortará en más del 60%. Construiremos exclusivamente lo que la Ley exige y el Mercado paga. Ni una coma de código más.
