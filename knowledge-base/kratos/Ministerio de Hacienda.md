---
estado: borrador
tipo: factor_externo
vigencia: por_verificar
depende_de: 
se_descompone_en: ["[[SICEX]]", "[[Servicio de Impuestos Internos]]", "[[Servicio Nacional de Aduanas]]"]
se_relaciona_con: []
cssclasses: [kb-node]
---

# Ministerio de Hacienda

## Qué dice

Órgano del Estado de Chile encargado de la administración financiera, tributaria y aduanera del país. En el contexto de Trazambiental, agrupa las instituciones que controlan la cadena de importación de neumáticos (Aduanas, SICEX) y la trazabilidad tributaria (SII) que el ecosistema REP exige como respaldo documental.

## Por qué existe

Esta es una institución autónoma de primer nivel. No se deriva de ningún otro concepto porque representa un ministerio cuya existencia es un hecho externo. Su relevancia para el MVP es doble: primero, el Servicio Nacional de Aduanas controla el punto de entrada de neumáticos al país y exige acreditación de pertenencia a un Sistema de Gestión (DS 8); segundo, el SII provee la infraestructura de documentos tributarios electrónicos (DTE) que la Resolución 2084 exige como respaldo de toda operación de manejo de residuos. Sin estas instituciones, la trazabilidad ambiental carecería de su ancla financiera y aduanera.

## Lógica de descomposición

Se descompone en tres conceptos: [[SICEX]] (la plataforma aduanera de control de importaciones de neumáticos), [[Servicio de Impuestos Internos]] (la institución que emite los DTEs y donde se concilia la trazabilidad financiera con la ambiental), y [[Servicio Nacional de Aduanas]] (el brazo operativo que ejecuta en frontera las exigencias del DS 8). Los tres cubren dominios institucionales distintos — aduanero-plataforma, tributario y aduanero-operativo — sin solapamiento.

## Relaciones Horizontales

Este concepto no posee relaciones horizontales directas modeladas en el sistema.

## Fuente original

Arquitectura Institucional de Chile.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque no se ha verificado contra fuentes primarias y el campo de evidencia está vacío. Para avanzar a `verificado` se requiere documentar la relación institucional formal entre el ministerio y sus servicios dependientes.
