---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ministerio de Hacienda]]"
se_descompone_en: ["[[Oficio Ordinario 606]]", "[[Resolución Exenta 154]]"]
se_relaciona_con: ["[[Firma Electrónica Avanzada]]", "[[SISREP]]", "[[Resolución Exenta 2084]]", "[[Sistema de Gestión]]", "[[Ingreso Manual de Folio DTE]]"]
cssclasses: [kb-node]
---

# Servicio de Impuestos Internos

## Qué dice

Institución del Estado de Chile encargada de la administración y fiscalización tributaria. En el contexto de Trazambiental, el SII es el emisor de los Documentos Tributarios Electrónicos (DTE) cuyo folio la Resolución Exenta 2084 exige como respaldo de toda operación de manejo de residuos. La conciliación entre datos ambientales y tributarios es una exigencia ineludible del SISREP.

## Por qué existe

Este concepto se deriva de [[Ministerio de Hacienda]] porque es un servicio público dependiente de dicho ministerio. Su relevancia para Trazambiental es directa: el SISREP exige que cada operación de manejo de residuos reporte el costo exacto en CLP y el folio del DTE emitido por el SII, creando un acoplamiento forzoso entre la trazabilidad ambiental y la trazabilidad tributaria. El MVP debe interoperar con los datos del SII para generar reportes completos.

## Lógica de descomposición

Se descompone en dos conceptos: [[Oficio Ordinario 606]], que contiene un dictamen relevante del SII sobre la tributación de las actividades de gestión de residuos, y [[Resolución Exenta 154]], que regula la emisión de facturas y guías de despacho.


## Relaciones Horizontales

- [[Firma Electrónica Avanzada]]: **Base Tecnológica del DTE:** La emisión del DTE en el portal del SII es tecnológicamente imposible sin el uso de certificados FEA.
- [[SISREP]]: **Acoplamiento Tributario-Ambiental:** El SISREP exige el costo exacto en pesos chilenos y el folio del DTE, obligando a calzar la contabilidad financiera con la trazabilidad ambiental.
- [[Resolución Exenta 2084]]: **Conciliación Financiera:** El anexo de la Res 2084 exige explícitamente reportar "Costo CLP" y "Folio DTE SII".
- [[Sistema de Gestión]]: **Desacoplamiento de ERP y Trazabilidad:** Para propósitos de la Ley REP, no se exige que el software de trazabilidad ambiental de un Sistema de Gestión opere simultáneamente como el ERP financiero de recaudación homologado por el SII. Es jurídicamente válido mantener sistemas desacoplados, siempre que se garantice la trazabilidad vincular inter-transaccional mediante la indexación del folio DTE en los registros de toneladas.
- [[Ingreso Manual de Folio DTE]]: **Desacoplamiento Operativo:** Esta decisión del CEO materializa la separación entre la trazabilidad ambiental y el ERP tributario. El folio DTE se ingresa como campo de texto libre en el MVP, funcionando como clave foránea manual que vincula ambos mundos sin requerir integración técnica con los sistemas del SII.

## Fuente original

Servicio de Impuestos Internos de Chile.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia primaria está vacía y la relación institucional con el Ministerio de Hacienda no ha sido verificada formalmente. Para avanzar se requiere enlazar fuentes oficiales.
