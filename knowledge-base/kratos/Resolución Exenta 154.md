---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Servicio de Impuestos Internos]]"
se_descompone_en: []
se_relaciona_con: ["[[Transportista]]"]
cssclasses: [kb-node]
---

# Resolución Exenta 154

## Qué dice

La Resolución Exenta N° 154 de 2025 del SII fija exigencias sobre las guías de despacho. Dicta que:
1. En caso de rechazo de un gestor de destino (modificación del traslado), se debe anular el documento o emitir una nueva guía por "Devolución de mercaderías" (Código 2.6).
2. En zonas sin conectividad, autoriza portar representación impresa y remitir el XML al servidor del SII retroactivamente al recuperar la red.
3. Prohíbe estrictamente la consolidación de cargas de múltiples orígenes en un solo documento general; exige una Guía de Despacho electrónica única y separada por cada origen.

## Por qué existe

Este concepto se deriva de [[Servicio de Impuestos Internos]] porque es un dictamen directo de la autoridad tributaria. Para Trazambiental, esta norma condiciona el diseño de la aplicación móvil de recolección: obliga a operar bajo el principio Offline-First en zonas oscuras y prohíbe las guías consolidadas para las rutas compartidas (lecheras).

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Transportista]]: **Imposición Documental en Tránsito:** La resolución exige al transportista emitir un DTE independiente por origen o portar la guía pre-impresa en zonas oscuras, impidiendo que consolide manifiestos libremente.

## Fuente original

Resolución Exenta N° 154 de 2025 del SII.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque el enlace oficial al documento del SII no ha sido cargado en el campo Evidencia y debe validarse el contenido contra el original.
