---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 19.799]]"
se_descompone_en: []
se_relaciona_con: []
cssclasses: [kb-node]
---

# Requisitos Prestador de Servicios de Certificación

## Qué dice

Establece las condiciones que deben cumplir los prestadores de servicios de certificación de firma electrónica para ser acreditados en Chile. Incluye requisitos de solvencia, infraestructura tecnológica, procedimientos de verificación de identidad, y obligaciones de custodia de claves criptográficas.

**Registro verificado de Prestadores de Servicios de Certificación (PSC) acreditados a mayo 2026:**
- **VIGENTES (11):** E-CERTCHILE, ACEPTA.COM, E-SIGN, CERTINET, BPO ADVISORS (IDOK), THOMAS SIGNE CHILE, ABANCERT, DOX PSC, E-DIGITAL PKI (FIRMAKI), MICROSYSTEM, CERTIFICADORA DEL SUR.
- **REVOCADA (1):** TOC S.A. (acreditación R.A.EX. 202100976, junio 2021).
- **SIN EFECTO por cese voluntario (1):** E-Partners (R.A.EX. 20220379, marzo 2022).

**Lógica de validación temporal:** Un documento firmado por TOC S.A. *antes* de la revocación gozaba de presunción de validez al momento de la firma. Documentos con fecha posterior deben ser rechazados. El software no puede realizar un chequeo binario "activo/inactivo" sin considerar el timestamp de la firma original.

## Por qué existe

Este concepto se deriva de [[Ley 19.799]] porque los requisitos de los prestadores están regulados directamente por dicha ley. Su relevancia para Trazambiental radica en que los DTEs (facturas, guías de despacho) que el SISREP exige como respaldo documental son firmados con FEA emitida por estos prestadores acreditados. El software no integra FEA directamente, pero debe conocer el universo de PSC vigentes para validar la procedencia de documentos firmados que ingresan al sistema como respaldo tributario.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

Este concepto no posee relaciones horizontales directas modeladas en el sistema.

## Fuente original

Ley N° 19.799 y su reglamento.

## Evidencia

https://www.entidadacreditadora.gob.cl/entidades/


## Justificación de estado

Permanece en `borrador` porque, si bien la lista de PSC ha sido verificada contra el portal oficial de la Entidad Acreditadora (mayo 2026), los requisitos técnicos específicos de acreditación no han sido contrastados línea a línea contra el reglamento de la Ley 19.799. Para avanzar se requiere esa verificación detallada.
