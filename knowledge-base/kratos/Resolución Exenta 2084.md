---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Superintendencia del Medio Ambiente]]"
se_descompone_en: ["[[SISREP]]", "[[Formato Dinámico Anexo Neumáticos]]"]
se_relaciona_con: ["[[Decreto Supremo 8]]", "[[Servicio de Impuestos Internos]]", "[[Resolución Exenta 2279]]"]
cssclasses: [kb-node]
---

# Resolución Exenta 2084

## Qué dice

Establece una detallada y estricta instrucción general sobre la trazabilidad de datos, instituyendo el marco metodológico para los reportes mensuales y el contenido de los informes de cumplimiento final. Crea y hace obligatorio el Sistema de Reporte de la Responsabilidad Extendida del Productor (SISREP).

La centralización de los reportes transaccionales de los Sistemas de Gestión recae en la matriz "REP_ConsolidadoNeumaticos.xlsx". Esta matriz exige el uso exclusivo de la coma como separador decimal y una conciliación financiera ineludible. Sin embargo, no exige ni demanda el ingreso del número de serie o el "Catálogo SKU" del neumático desechado en la operación logística (lo cual solo aplica a Productores en la introducción al mercado).

Adicionalmente, el Artículo 14 impone la obligación draconiana de retención de datos: los regulados deben conservar la documentación de respaldo y trazabilidad financiera-logística (costo y DTE) de manera inmutable por un período continuo de 6 años para efectos de fiscalización. En caso de discrepancias entre los datos del anexo Excel y el informe PDF, prevalecen los datos entregados en el anexo.

La resolución también faculta a la SMA para requerir que los informes de cumplimiento sean certificados por un auditor externo. **Brecha técnica:** La estructura fina de las columnas del Anexo Neumáticos no se publica estáticamente en el Diario Oficial; la resolución establece que la SMA pondrá a disposición un formato de anexo, el cual será publicado oportunamente en la página web institucional. El modelo de datos de la SMA es dinámico y discrecional.

## Por qué existe

Este concepto se deriva de [[Superintendencia del Medio Ambiente]] porque es una resolución exenta emitida por la SMA en ejercicio de sus facultades fiscalizadoras. Mientras el DS 8 establece las metas de cumplimiento, la Res 2084 establece *cómo* los regulados deben demostrar ese cumplimiento: qué reportar, en qué formato, con qué frecuencia, y durante cuánto tiempo conservar los registros. Para Trazambiental, esta resolución define los requisitos técnicos exactos que los documentos generados por el software deben satisfacer.

## Lógica de descomposición

Se descompone en: [[SISREP]] (el sistema de reporte que esta resolución crea y hace obligatorio) y [[Formato Dinámico Anexo Neumáticos]] (el hecho de que la estructura técnica del anexo es publicada dinámicamente por la SMA, no estáticamente en ley). El SISREP materializa las exigencias metodológicas de la resolución; el formato dinámico documenta la brecha tecnológica que impone vigilancia activa.

## Relaciones Horizontales

- [[Decreto Supremo 8]]: **Complementariedad Regulatoria:** Actúa como el instrumento metodológico operativo que hace auditable el cumplimiento de las metas dictadas por el DS 8.
- [[Servicio de Impuestos Internos]]: **Conciliación Financiera:** El anexo exige explícitamente reportar "Costo CLP" y "Folio DTE SII", amarrando la trazabilidad ambiental a la trazabilidad tributaria validada.
- [[Resolución Exenta 2279]]: **Modificación de Plazos:** La Resolución 2279 modificó de manera crítica los plazos y escalonamientos originales dictados por la 2084.

## Fuente original

Resolución Exenta Núm. 2.084 (Superintendencia del Medio Ambiente, publicada el 27 de diciembre de 2023).

## Evidencia

https://www.bcn.cl/leychile/navegar?idNorma=1199515
https://portal.sma.gob.cl/index.php/ley-rep/instructivo-y-reporte/ (Portal SMA — formatos de reporte dinámicos)


## Justificación de estado

Permanece en `borrador` porque la evidencia primaria (texto oficial de la resolución) no ha sido enlazada y los detalles técnicos del formato Excel (campos, validaciones, separador decimal) no han sido verificados contra el documento oficial. Para avanzar a `verificado` se requiere obtener y enlazar la resolución original desde el sitio de la SMA.
