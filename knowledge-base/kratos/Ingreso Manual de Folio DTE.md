---
estado: verificado
tipo: decision_del_humano
vigencia: vigente
depende_de: ""
se_descompone_en: []
se_relaciona_con: ["[[Servicio de Impuestos Internos]]", "[[Validación de Identidad por Buena Fe]]"]
cssclasses: [kb-node]
---

# Ingreso Manual de Folio DTE

## Qué dice

Establece que el folio del Documento Tributario Electrónico (DTE) se ingresa como dato manual por el usuario en el flujo transaccional del sistema. No se requiere integración directa con el ERP del cliente ni con los sistemas del SII para el MVP. El sistema acepta el número de folio bajo principio de buena fe, análogo a la validación de identidad.

## Por qué existe

Esta es una decisión estratégica del CEO para el MVP. La [[Resolución Exenta 2084]] exige que cada operación de manejo reporte el "Folio DTE SII", lo que genera un acoplamiento entre la trazabilidad ambiental y la trazabilidad tributaria. Sin esta decisión, el sistema dependería de una integración con el ERP del cliente (que puede no existir) o con los sistemas del [[Servicio de Impuestos Internos]] (que excede el scope del MVP). Al aceptar el folio como campo de texto libre, se elimina esa dependencia externa y se mantiene el principio de mínima fricción para el onboarding, coherente con la [[Validación de Identidad por Buena Fe]].

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Servicio de Impuestos Internos]]: **Desacoplamiento Operativo:** Esta decisión materializa el desacoplamiento entre el software de trazabilidad ambiental y el ERP tributario. El folio DTE actúa como clave foránea manual que vincula ambos mundos sin requerir integración técnica.
- [[Validación de Identidad por Buena Fe]]: **Coherencia de Principio:** Ambas decisiones aplican el mismo principio de buena fe electrónica: el sistema confía en la declaración del usuario y delega la responsabilidad de veracidad mediante Términos y Condiciones.

## Fuente original

Decisión del CEO (11 de mayo 2026).

## Evidencia



## Justificación de estado

Permanece en `verificado` porque refleja una decisión ejecutiva en firme del fundador.
