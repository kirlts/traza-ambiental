---
estado: borrador
tipo: factor_externo
vigencia: por_verificar
depende_de: "[[Ministerio de Salud]]"
se_descompone_en: []
se_relaciona_con: ["[[Gestor]]", "[[SINADER]]"]
cssclasses: [kb-node]
---

# Secretaría Regional Ministerial de Salud

## Qué dice

Autoridad sanitaria regional con potestad fiscalizadora concurrente en NFU por el riesgo epidemiológico (acopio de NFU como criadero de vectores como el mosquito Aedes aegypti). Puede prohibir traslado y recolección sin autorización previa, realizar inspecciones inopinadas, dictar sumarios sanitarios, aplicar multas y clausurar temporal o definitivamente instalaciones. Cabe destacar que las clausuras por parte de esta autoridad se ejecutan de forma física y material (candados y timbres en terreno), por lo que tecnológicamente solo exigen al sistema un bloqueo lógico o administrativo interno, no la provisión de un "kill switch" nativo o algorítmico directo para el Estado.

## Por qué existe

Este concepto se deriva de [[Ministerio de Salud]] porque las SEREMIs de Salud son el brazo regional de dicho ministerio. Su relevancia para Trazambiental es operativa: la SEREMI es la entidad que otorga las autorizaciones sanitarias sin las cuales un gestor no puede operar, y el SINADER rechaza declaraciones de establecimientos que carecen de estas autorizaciones. Es un regulador paralelo al MMA cuyo cumplimiento es condición previa para la operación de la cadena NFU.

## Lógica de descomposición

Este concepto es atómico y no requiere mayor descomposición.

## Relaciones Horizontales

- [[Gestor]]: **Dependencia Operativa y Clausura Física:** Un Gestor no puede operar físicamente instalaciones sin RCA y permisos otorgados por la SEREMI de Salud. En caso de inhabilitación o clausura, la acción de la SEREMI es material; respecto al software, la inhabilitación del gestor se gestiona mediante un bloqueo lógico estándar de credenciales operado internamente, sin requerir control estatal directo sobre la base de datos.
- [[SINADER]]: **Fricción de Habilitación:** El SINADER realiza validaciones cruzadas. Carecer de Autorización Sanitaria impide el registro y declaración en la plataforma.

## Fuente original

Secretaría Regional Ministerial de Salud (SEREMI).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la evidencia primaria está vacía y las potestades fiscalizadoras no han sido verificadas contra el Código Sanitario o sus reglamentos. Para avanzar se requiere enlazar fuentes oficiales.
