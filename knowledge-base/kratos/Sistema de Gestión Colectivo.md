---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Sistema de Gestión]]"
se_descompone_en: []
se_relaciona_con: ["[[Productor]]", "[[Generador]]", "[[Registro Público de Sistemas de Gestión]]", "[[Delegado de Protección de Datos]]"]
cssclasses: [kb-node]
---

# Sistema de Gestión Colectivo

## Qué dice

Modalidad de sistema de gestión en la que varios productores se agrupan para cumplir colectivamente sus obligaciones de recolección y valorización bajo la Ley REP. Conocido operativamente como GRANSIC (Gran Sistema Colectivo). Coordina la cadena logística entre generadores y gestores, consolida la reportabilidad ante SISREP y SINADER, y responde directamente ante la SMA por el cumplimiento de las metas del [[Decreto Supremo 8]]. Opera para Cat A (obligatoriamente) y Cat B (opcionalmente).

## Por qué existe

Este concepto se deriva de [[Sistema de Gestión]] porque es una de las dos modalidades legales que la Ley 20.920 establece para dar cumplimiento a la REP. La modalidad colectiva es la más relevante operativamente para el MVP porque Cat A solo puede operar bajo sistema colectivo, y porque los Sistemas de Gestión Colectivos son los clientes B2B con mayor volumen de datos (miles de generadores afiliados, múltiples gestores, consolidación de reportes).

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Productor]]: **Adhesión Obligatoria:** El Productor (importador/fabricante) debe acreditar adhesión formal a un Sistema de Gestión Colectivo para operar en el mercado (exigido en frontera por [[Resolución Exenta 134]]).
- [[Generador]]: **Coordinación Logística:** El Sistema de Gestión Colectivo coordina con su red de generadores afiliados los retiros de NFU, operando como intermediario logístico entre el generador y los gestores de la cadena.
- [[Registro Público de Sistemas de Gestión]]: **Habilitación Operativa:** El Sistema de Gestión Colectivo debe estar inscrito en el Registro Público de la SMA como condición previa para operar y ser reconocido por SISREP.
- [[Delegado de Protección de Datos]]: **Mitigación de Riesgos:** Al procesar información de miles de actores, un Sistema de Gestión Colectivo se convierte en un procesador a gran escala bajo la Ley 21.719, haciendo vital la designación de un DPO.

## Fuente original

Ley N° 20.920 (Artículo 3, numeral 27) y Decreto Supremo 8.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia primaria no ha sido enlazada y las diferencias operativas exactas entre SG colectivo e individual (en cuanto a plazos de entrega, formatos de reporte, escalas) requieren verificación contra el texto legal.
