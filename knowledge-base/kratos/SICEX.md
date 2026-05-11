---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: "[[Ministerio de Hacienda]]"
se_descompone_en: []
se_relaciona_con: ["[[SINADER]]", "[[Decreto Supremo 9]]", "[[Convenio de Basilea]]"]
cssclasses: [kb-node]
---

# SICEX

## Qué dice

Sistema Integrado de Comercio Exterior. Es la Ventanilla Única aduanera. Al igual que el RETC, carece de interfaces de programación abiertas (API) para integraciones M2M en tiempo real. La inyección de datos debe realizarse a través de plataformas EDI cerradas de agentes de aduana o digitación manual en formularios web. Además, la jurisprudencia reciente de Aduanas obliga a ingresar en el campo de "Observaciones" de la DIN/DIPS una Declaración Jurada con descriptores técnicos específicos sobre el peso y categorización del neumático.

## Por qué existe

Este concepto se deriva de [[Ministerio de Hacienda]] porque el SICEX es una plataforma estatal administrada bajo la órbita del ministerio a través del Servicio Nacional de Aduanas. Su relevancia para Trazambiental radica en que es el punto de entrada digital donde se registra la importación de neumáticos al país, constituyendo la "Línea Base" financiera (toneladas introducidas) que luego debe rendirse estadísticamente en SINADER. La ausencia de APIs obliga al MVP a operar en la capa documental, no en la transaccional.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[SINADER]]: **Fricción Metrológica:** El SINADER exige reportes en Toneladas Métricas, mientras que el control primario de ingreso en SICEX exige la unidad Kilogramos Netos (KN). Esta divergencia obliga a conversiones que pueden introducir errores de redondeo.
- [[Decreto Supremo 9]]: **Integración logística y documental:** El D.S. 9 dicta las normativas para autorizar importación/exportación de residuos y su integración aduanera.
- [[Convenio de Basilea]]: **Flujo Soberano Estado a Estado:** Para el Consentimiento Fundamentado Previo (PIC) que exige este convenio, la interacción aduanera y diplomática transcurre primariamente en plataformas estatales centralizadas como SICEX, restringiendo integraciones algorítmicas directas con sistemas privados SaaS.

## Fuente original

Sistema Integrado de Comercio Exterior (SICEX).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la información sobre ausencia de APIs y formatos de DIN no ha sido verificada contra fuentes oficiales de Aduanas y la evidencia está vacía. Para avanzar se requiere confirmar las restricciones técnicas contra documentación oficial del SICEX.
