---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 21.719]]"
se_descompone_en: []
se_relaciona_con: ["[[SISREP]]", "[[Guía Práctica Ley 21.719]]"]
cssclasses: [kb-node]
---

# Registro de Actividades de Tratamiento

## Qué dice

Inventario formal que todo responsable de tratamiento debe mantener, detallando: categorías de datos tratados, finalidades, bases de licitud, destinatarios, plazos de conservación, medidas de seguridad implementadas y transferencias internacionales. Debe estar disponible para inspección por la Agencia.

Adicionalmente, ante la inoperatividad actual de la Agencia, la Secretaría de Gobierno Digital ha establecido un estándar de facto consistente en un formato con 16 variables o vectores obligatorios que componen la matriz de información del catálogo de tratamiento.
## Por qué existe

Este concepto se deriva de [[Ley 21.719]] porque el Registro de Actividades de Tratamiento (RAT) es una obligación creada por dicha ley. Para Trazambiental, el RAT es un documento operativo obligatorio que debe mapear todos los flujos de datos personales del sistema: desde la captura de RUT y patentes hasta su retención por 6 años para cumplimiento REP. La ingesta del SISREP (costos, DTEs, RUTs) debe quedar mapeada dentro del RAT.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SISREP]]: **Inventario de Flujos:** El SISREP obliga a recopilar rutas, costos y RUTs. Esta ingesta debe quedar mapeada dentro del RAT exigido por la Ley de Privacidad.
- [[Guía Práctica Ley 21.719]]: **Estándar operativo de facto:** Ante la ausencia de una Agencia operativa, la Guía de la SGD establece el estándar de las 16 variables que conforman legalmente este registro.

## Fuente original

Ley 21.719.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque no se ha verificado contra el texto legal y el RAT aún no ha sido elaborado para Trazambiental. Para avanzar se requiere confirmar los campos obligatorios del RAT contra la ley.
