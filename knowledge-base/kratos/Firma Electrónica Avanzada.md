---
estado: borrador
tipo: norma_legal
vigencia: por_verificar
depende_de: "[[Ley 19.799]]"
se_descompone_en: []
se_relaciona_con: ["[[Servicio de Impuestos Internos]]", "[[Gestor]]", "[[Resolución Exenta 144]]", "[[Ley 21.719 - Artículo 13]]"]
cssclasses: [kb-node]
---

# Firma Electrónica Avanzada

## Qué dice

La legislación otorga a la Firma Electrónica Avanzada (FEA) un reconocimiento y protección jurídica equivalente a los actos celebrados en papel con firma manuscrita. Su uso garantiza la identificación inequívoca del autor y la integridad del documento, haciéndolo irrepudiable en entornos probatorios.

**[ALUCINACIÓN PURGADA]** Se afirmaba que la FEA era de uso obligatorio para reportes al MMA (SISREP/SINADER). La verificación contra la Resolución Exenta 2084 y los manuales de SINADER confirma que **NO es obligatoria**. La normativa ambiental chilena no exige el uso de FEA para la presentación de informes al SISREP ni al SINADER. El mecanismo de autenticación oficial y vinculante es el acceso validado mediante ClaveÚnica y el Identificador de Establecimiento (ID) a través del portal de la Ventanilla Única del RETC. Las cargas masivas de información (planillas Excel) se validan contra la sesión autenticada del usuario en el portal, no mediante un certificado criptográfico embebido en el archivo.

Lo que SÍ es verificable: la FEA es indispensable para la emisión de DTEs en el portal del [[Servicio de Impuestos Internos]], y para la validez de contratos de suministro entre generadores y valorizadores. Las firmas utilizadas deben provenir de Prestadores Acreditados activos en la Subsecretaría de Economía de Chile. Se excluye explícitamente la necesidad de FEA para la operación cotidiana de subrogancia: los operadores de patio y personal base pueden operar legítimamente usando credenciales estándar y Listas de Control de Acceso (ACL) delegadas por el Representante Legal. Forzar FEA a nivel operario constituye sobreingeniería.

## Por qué existe

Este concepto se deriva de [[Ley 19.799]] porque la Firma Electrónica Avanzada es el concepto central regulado por dicha ley. La FEA es relevante para Trazambiental en dos ámbitos concretos: (1) la emisión de DTEs ante el SII, y (2) la validación de contratos entre actores de la cadena. Su uso NO es requerido para los reportes ambientales al SISREP o SINADER.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Servicio de Impuestos Internos]]: **Base Tecnológica del DTE:** La emisión del DTE en el portal del SII es tecnológicamente imposible sin el uso de certificados FEA.
- [[Gestor]]: **Exención Operativa:** El personal base de un Gestor está eximido de utilizar FEA para la trazabilidad cotidiana. El mandato de subrogancia se satisface administrativamente mediante ACL delegadas por el Representante Legal.
- [[Resolución Exenta 144]]: **Confirmación de No-Obligatoriedad:** La Res. 144 establece ClaveÚnica como mecanismo exclusivo de autenticación para el RETC, confirmando que la FEA no es parte del flujo de reportabilidad ambiental.
- [[Ley 21.719 - Artículo 13]]: **Interacción Indirecta vía DTEs:** El Art. 13 letra b) permite tratar datos sin consentimiento bajo obligación legal. Cuando los datos del folio DTE (emitido con FEA ante el SII) se indexan en la trazabilidad ambiental, ambos conceptos operan bajo la misma base de licitud. La biometría fue descartada del MVP (UD-017).

## Fuente original

Ley 19.799, "Sobre Documentos Electrónicos, Firma Electrónica y Servicios de Certificación de Dicha Firma".

## Evidencia

https://www.bcn.cl/leychile/navegar?idNorma=201668
https://www.bcn.cl/leychile/navegar?idNorma=1199515 (Res. 2084 — confirma ausencia de requisito FEA)
https://vu.mma.gob.cl/manuals/sinader/MANUAL_SISTEMA_SINADER_LODOS_PTAS.pdf (Manual SINADER — autenticación vía ClaveÚnica)

## Justificación de estado

Permanece en `borrador` porque, si bien la alucinación sobre obligatoriedad para reportes al MMA fue purgada mediante verificación contra fuentes primarias, el texto completo de la Ley 19.799 aún no ha sido verificado exhaustivamente. Para avanzar a `verificado` se requiere confirmar que no existan otros artículos de la ley con implicaciones para el MVP.
