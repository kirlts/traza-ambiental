---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 20.920 - Artículo 3]]"
se_descompone_en: ["[[Sistema de Gestión Colectivo]]", "[[Sistema de Gestión Individual]]"]
se_relaciona_con: ["[[Consumidor Industrial]]", "[[Delegado de Protección de Datos]]", "[[Productor]]", "[[Planilla REP Consumidores Industriales]]", "[[Generador]]", "[[Decreto Supremo 8 - Artículo 15]]", "[[Comercializador]]", "[[Ley 20.920 - Artículo 26]]", "[[Ley 20.285]]", "[[Código Sanitario]]", "[[Servicio de Impuestos Internos]]", "[[Convenio de Basilea]]"]
cssclasses: [kb-node]
---

# Sistema de Gestión

## Qué dice

Es el mecanismo instrumental a través del cual los productores (ya sea de manera individual o colectiva) dan cumplimiento a las obligaciones impuestas por la responsabilidad extendida del productor, mediante la implementación de un plan de gestión.

La normativa exige una reportabilidad estricta a través de SINADER, imponiendo la entrega de informes de avance con fecha límite al 30 de septiembre del año en curso, y un informe final auditado por terceros independientes a más tardar el 31 de mayo del año subsiguiente.

## Por qué existe

Este concepto se deriva de [[Ley 20.920 - Artículo 3]] porque la definición legal del Sistema de Gestión emana del numeral 27 de dicho artículo. Es un concepto central del ecosistema REP: sin Sistemas de Gestión, los productores no tendrían un mecanismo para cumplir sus obligaciones de recolección y valorización. Para Trazambiental, los Sistemas de Gestión son actores clave que interactúan con la plataforma como coordinadores de la cadena logística entre generadores y gestores, y como responsables de la reportabilidad ante SINADER y SISREP.

## Lógica de descomposición

Se descompone en dos modalidades mutuamente exclusivas y colectivamente exhaustivas: [[Sistema de Gestión Colectivo]] (varios productores agrupados) y [[Sistema de Gestión Individual]] (un solo productor operando autónomamente, solo permitido para Cat B). La distinción es legal (Art. 3 numeral 27 de la Ley 20.920) y determina diferencias en escala, reportabilidad y coordinación logística.

## Relaciones Horizontales

- [[Productor]]: **Acoplamiento de Negocio:** El Productor no puede internar neumáticos al país si no acredita su adhesión formal a un Sistema de Gestión autorizado.
- [[Delegado de Protección de Datos]]: **Mitigación de Riesgos:** Al procesar información de miles de actores, un Sistema de Gestión Colectivo se convierte en un procesador a gran escala, haciendo vital la designación de un DPO.
- [[Consumidor Industrial]]: **Imputación de Metas:** La valorización lograda de forma autónoma por una minera puede y debe asociarse legalmente a un Sistema de Gestión Colectivo.
- [[Planilla REP Consumidores Industriales]]: **Crédito de Tonelajes:** Interacción indirecta donde la posesión o representación legal de los residuos fluye bidireccionalmente entre el SG y el Consumidor Industrial.
- [[Generador]]: **Responsabilidad Inversa:** El Sistema de Gestión debe retirar los NFU del punto de generación, estableciendo una relación operativa directa con cada generador de su red.
- [[Decreto Supremo 8 - Artículo 15]]: **Obligación institucional:** La ley impone mandatos ineludibles directos sobre el SG para la carga de convenios y métricas de avance ante el RETC.
- [[Comercializador]]: **Obligación de entrega de stock:** El comercializador debe entregar los residuos que acopió gratuitamente al Sistema de Gestión.
- [[Ley 20.920 - Artículo 26]]: **Obligación del Plan de Gestión:** Requisitos declarativos obligatorios que el SG debe contener en su plan de operaciones.
- [[Ley 20.285]]: **Exención de Transparencia Activa:** El software privado del SG no está sujeto a obligaciones de exponer datos vía portales abiertos (CKAN/API pública).
- [[Código Sanitario]]: **Inexistencia de Subordinación Algorítmica:** Ante clausuras de la SEREMI, el software del SG no requiere proveer un "Kill Switch" digital a la autoridad. La obligación se cumple bloqueando al proveedor infractor internamente en el ERP.
- [[Servicio de Impuestos Internos]]: **Desacoplamiento Tecnológico:** El software del SG no está obligado legalmente a operar centralizadamente como el ERP tributario. Basta con interoperar y registrar la trazabilidad vincular mediante la indexación del folio DTE emitido en el ERP financiero.
- [[Convenio de Basilea]]: **Límite de Responsabilidad Documental:** En exportaciones (PIC), el SG no requiere integrar interacciones algorítmicas con aduanas foráneas. Su obligación en el SaaS privado se reduce a registrar el Certificado de Eliminación final expedido en el extranjero.

## Fuente original

Ley N° 20.920 "Establece Marco Para La Gestión De Residuos..." (Artículo 3, numeral 27).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia está vacía, y los plazos de reportabilidad (30 de septiembre, 31 de mayo) requieren confirmación contra el texto oficial de la Res 2084. Para avanzar a `verificado` se requiere enlazar fuentes reales y confirmar datos operativos.
