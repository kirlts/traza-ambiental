---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: "[[Superintendencia del Medio Ambiente]]"
se_descompone_en: []
se_relaciona_con: ["[[Sistema de Gestión]]", "[[Consumidor Industrial]]"]
cssclasses: [kb-node]
---

# Planilla REP Consumidores Industriales

## Qué dice

Formulario que los Consumidores Industriales deben completar para acreditar su gestión autónoma de residuos ante la SMA. Contiene pestañas de Diccionario y General. Su entrega se realiza a través de un formulario cifrado en Google Forms, independiente de los canales de reporte de los Sistemas de Gestión.

La estructura técnica de declaración opera mediante tres vectores o "planillas" distintas de reporte: la planilla CIA0, la planilla CIB1 y la planilla CIB2. Estas representan las rutas de ingesta de datos para las obligaciones de los Consumidores Industriales.

Este canal de reporte anula la obligación de presentar Certificados de Valorización externos. La valorización in-situ se auto-declara asumiendo responsabilidad legal directa por la información proporcionada bajo fe de juramento.
## Por qué existe

Este instrumento emana de la [[Superintendencia del Medio Ambiente]] porque es la SMA quien diseñó y administra este canal de reporte específico para Consumidores Industriales. Para Trazambiental, esta planilla documenta el canal paralelo de cumplimiento para mineras y grandes generadores que valorizan in-situ: el software debe conocer su formato para generar datos compatibles y orientar a sus usuarios Cat B sobre cómo completarla.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Sistema de Gestión]]: **Crédito de Tonelajes:** Interacción donde la valorización lograda autónomamente por un Consumidor Industrial puede asociarse legalmente a un GRANSIC para imputar tonelajes a las metas del productor.
- [[Consumidor Industrial]]: **Diccionario de datos para flujos CI:** Es el instrumento normativo rígido a través del cual este actor en particular rinde cuenta de sus operaciones in-situ.

## Fuente original

Formulario de la Superintendencia del Medio Ambiente para Consumidores Industriales.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque el formulario no ha sido verificado contra la fuente oficial de la SMA y la evidencia está vacía. Para avanzar se requiere obtener la planilla oficial y verificar su formato.
