---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 20.920]]"
se_descompone_en: ["[[Producto Prioritario]]", "[[Residuo]]", "[[Valorización]]", "[[Gestor]]", "[[Sistema de Gestión]]", "[[Productor]]", "[[Generador]]", "[[Instalación de Recepción y Almacenamiento]]"]
se_relaciona_con: []
cssclasses: [kb-node]
---

# Ley 20.920 - Artículo 3

## Qué dice

Establece las definiciones fundamentales y la taxonomía legal de los actores, elementos y procesos que componen el ecosistema de la responsabilidad extendida del productor.

## Por qué existe

Este concepto se deriva de [[Ley 20.920]] porque es un artículo específico dentro de dicha ley. El Artículo 3 es el pilar definitorio de todo el ecosistema REP: sin estas definiciones legales, los conceptos de "generador", "productor", "gestor", "residuo" y "valorización" serían ambiguos y sujetos a interpretación. Para Trazambiental, este artículo establece la taxonomía que el software debe modelar como entidades de su dominio.

## Lógica de descomposición

Se descompone en ocho conceptos que representan cada definición legal relevante para el MVP de NFU: [[Producto Prioritario]], [[Residuo]], [[Valorización]], [[Gestor]], [[Sistema de Gestión]], [[Productor]], [[Generador]], e [[Instalación de Recepción y Almacenamiento]]. Cada concepto derivado es un concepto legal atómico con una definición independiente dentro del artículo. La descomposición es exhaustiva respecto a las definiciones que impactan el modelado de datos del MVP.

## Relaciones Horizontales

Este concepto no posee relaciones horizontales directas modeladas en el sistema.

## Fuente original

Ley N° 20.920, Artículo 3.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque si bien la descomposición en definiciones se ha realizado, algunos conceptos derivados (Almacenamiento, Recolección, Instalación de Recepción y Almacenamiento) están subdesarrollados y podrían requerir fusión o eliminación. Además, no se ha verificado que la lista de conceptos derivados sea exhaustiva respecto a todas las definiciones del artículo relevantes para NFU. Para avanzar se requiere una revisión cruzada contra el texto original del artículo.
