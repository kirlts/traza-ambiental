---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 19.799]]"
se_descompone_en: []
se_relaciona_con: ["[[Ley 21.719 - Artículo 13]]", "[[Servicio de Impuestos Internos]]", "[[Gestor]]"]
cssclasses: [kb-node]
---

# Firma Electrónica Avanzada

## Qué dice

La legislación otorga a la Firma Electrónica Avanzada (FEA) un reconocimiento y protección jurídica equivalente a los actos celebrados en papel con firma manuscrita. Su uso garantiza la identificación inequívoca del autor y la integridad del documento, haciéndolo irrepudiable en entornos probatorios.

En el marco ambiental, la FEA es de uso obligatorio para expedientes, anexos de reportabilidad final y acreditación de metas frente al MMA. Las firmas utilizadas deben provenir obligatoriamente de Prestadores Acreditados activos en la Subsecretaría de Economía de Chile (E-CERTCHILE, ACEPTA, E-SIGN, CERTINET, BPO, THOMAS SIGNE, ABANCERT, DOX PSC, E-DIGITAL PKI, MICROSYSTEM y CERTIFICADORA DEL SUR). Las firmas procedentes de emisores transnacionales no inscritos (ej. CertiSign) carecen de validez funcional para efectos del Estado. Se excluye explícitamente la necesidad de FEA para la operación cotidiana de subrogancia: los operadores de patio y personal base pueden operar legítimamente usando credenciales estándar y Listas de Control de Acceso (ACL) delegadas por el Representante Legal. Forzar FEA a nivel operario constituye sobreingeniería.

## Por qué existe

Este concepto se deriva de [[Ley 19.799]] porque la Firma Electrónica Avanzada es el concepto central regulado por dicha ley. La FEA es un pilar tecnológico para el MVP de Trazambiental: sin ella, los documentos generados por el software (anexos de reportabilidad, informes de cumplimiento) no tendrían validez legal ante el MMA ni ante el SII. La restricción de que solo prestadores acreditados chilenos pueden emitir FEA válida impacta directamente las opciones de integración tecnológica del software.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Ley 21.719 - Artículo 13]]: **Complementariedad Técnica:** La Ley 21.719 exige una Base de Licitud para tratar datos sensibles (ej. biometría en terreno); el uso de FEA provee el soporte legal de no repudio requerido.
- [[Servicio de Impuestos Internos]]: **Base Tecnológica del DTE:** La emisión del DTE en el portal del SII es tecnológicamente imposible sin el uso de certificados FEA.
- [[Gestor]]: **Exención Operativa:** El personal base de un Gestor está eximido de utilizar FEA para la trazabilidad cotidiana. El mandato de subrogancia se satisface administrativamente mediante ACL delegadas por el Representante Legal, reservando la criptografía dura solo para las declaraciones finales consolidadas.

## Fuente original

Ley 19.799, "Sobre Documentos Electrónicos, Firma Electrónica y Servicios de Certificación de Dicha Firma".

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la lista de prestadores acreditados no ha sido verificada contra el registro oficial vigente de la Subsecretaría de Economía, y la evidencia primaria está vacía. Para avanzar a `verificado` se requiere confirmar la lista de prestadores y enlazar la ley 19.799 desde la BCN.
