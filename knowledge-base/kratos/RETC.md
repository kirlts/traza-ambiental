---
estado: borrador
tipo: factor_externo
vigencia: por_verificar
depende_de: "[[Ministerio del Medio Ambiente]]"
se_descompone_en: ["[[SINADER]]", "[[Inexistencia de Validación de Identidad en Middlewares]]", "[[Inexistencia de SLA de Disponibilidad RETC]]", "[[Inexistencia de Política de Change Management RETC]]"]
se_relaciona_con: ["[[Decreto Supremo 1]]", "[[Ley 19.799]]"]
cssclasses: [kb-node]
---

# RETC

## Qué dice

Registro de Emisiones y Transferencias de Contaminantes. Es el registro central administrado por el Ministerio del Medio Ambiente, accesible vía el Portal de Ventanilla Única. Es la instancia encargada de recibir, evaluar y aprobar los Planes de Gestión de los Sistemas de Gestión colectivos (GRANSIC) en su etapa inicial, antes de que pasen al control operativo de la SMA.

La plataforma adolece de una carencia absoluta de interfaces transaccionales públicas (API). Esto imposibilita a los sistemas de software privados interactuar sincrónicamente mediante integraciones Máquina a Máquina (M2M) para inyectar declaraciones directamente en sus bases de datos, forzando la ingesta de datos asíncrona mediante plantillas u operadores.

## Por qué existe

Este concepto se deriva de [[Ministerio del Medio Ambiente]] porque el RETC es una plataforma estatal operada directamente por el MMA. Su relevancia para Trazambiental es crítica y restrictiva: la ausencia de APIs significa que el MVP no puede automatizar la declaración de residuos; debe generar documentos en el formato exacto que la plataforma acepta para que el usuario los suba manualmente. Esta limitación técnica es una restricción de diseño fundamental que condiciona la arquitectura del módulo de generación de documentos.

## Lógica de descomposición

Se descompone en cuatro conceptos: [[SINADER]], el subsistema sectorial de declaración de residuos incrustado dentro del RETC, y tres hechos operativos críticos: [[Inexistencia de SLA de Disponibilidad RETC]], [[Inexistencia de Política de Change Management RETC]], e [[Inexistencia de Validación de Identidad en Middlewares]].


## Relaciones Horizontales

- [[Decreto Supremo 1]]: **Reglamento base habilitante:** El D.S. 1/2013 es el instrumento jurídico que aprueba el reglamento del RETC, dotándolo de facultades exclusivas de recolección estadística.
- [[Ley 19.799]]: **Delegación Operativa sin FEA:** El modelo de delegación del RETC permite la gestión de accesos (Agentes, Encargados) mediante asignación de roles directos por el Representante Legal (RBAC), sin que la normativa exija el uso de Firmas Electrónicas Avanzadas a los digitadores operativos para la carga mensual de planillas.

## Fuente original

Registro de Emisiones y Transferencias de Contaminantes (RETC).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia primaria sobre la plataforma (URL del portal, documentación técnica oficial) no ha sido enlazada y la vigencia de las restricciones técnicas (ausencia de API) no ha sido verificada formalmente. Para avanzar se requiere confirmar el estado actual de la plataforma contra el sitio oficial del RETC.
