---
estado: borrador
tipo: requisito_tecnico
vigencia: por_verificar
depende_de: "[[RETC]]"
se_descompone_en: ["[[SINADER - Declaración Masiva Anual]]", "[[SINADER - Declaración Masiva Mensual]]", "[[Inexistencia de Protocolo Ambiental para Rechazos]]", "[[Inexistencia de Diccionarios OpenAPI de SINADER]]"]
se_relaciona_con: ["[[Decreto Supremo 148]]", "[[Generador]]", "[[Gestor]]", "[[Registro Público de Sistemas de Gestión]]", "[[SICEX]]", "[[Secretaría Regional Ministerial de Salud]]", "[[Valorización]]", "[[Decreto Supremo 1]]"]
cssclasses: [kb-node]
---

# SINADER

## Qué dice

Sistema Nacional de Declaración de Residuos. Es un subsistema sectorial incrustado en el RETC del MMA. Se utiliza para el registro estadístico continuo del movimiento físico de los pasivos. Los gestores autorizados están obligados a declarar tipo material (usando codificación LER 2025), cantidad métrica, costos operativos, georreferenciación y destino final. Exige Autorizaciones Sanitarias y RCA previas para habilitarse.

Adicionalmente, su uso exige autenticación vía ClaveÚnica. El sistema exige utilizar códigos de tratamiento rígidos y realiza una validación cruzada en tiempo real: el código declarado debe estar expresamente habilitado en la RCA del "Establecimiento" destinatario, o el archivo será rechazado. 

Códigos aplicables a NFU:
- **47 (Pretratamiento - Centro de Acopio):** Acondicionamiento para transporte (no reciclaje definitivo).
- **46 (Reciclaje):** Valorización material (ej. polvo de caucho).
- **23 (Co-procesamiento):** Valorización energética (hornos cementeros).
- **7 (Preparación para Reutilización):** Recauchaje.
Para disposición final se utilizan los códigos 11 o 33. Para la declaración masiva mensual, el ciclo opera sobre el mes cronológico anterior cerrado; asimismo, el carecer de un Código de Establecimiento (ID) previo en Ventanilla Única provoca el rechazo total del archivo cargado.

Adicionalmente, el SINADER exige reportar exclusivamente en Kilogramos (KG), lo que genera un choque algorítmico frente a los sistemas que miden m3 o UN. Otra limitante crítica es la inmutabilidad de los folios enviados: tras su inyección, el usuario es privado del acceso directo a funciones de sobrescritura, forzando a crear un ticket vía OIRS o esperar procesos anuales de rectificación para enmendar errores operativos.

## Por qué existe

Este concepto se deriva de [[RETC]] porque el SINADER es un subsistema técnico incrustado dentro de la plataforma del RETC. Su relevancia para Trazambiental es operativa y directa: es la plataforma donde los gestores declaran formalmente el destino de los residuos NFU, cerrando la cadena de trazabilidad. El MVP debe generar archivos compatibles con los formatos rígidos del SINADER (códigos LER, códigos de tratamiento, validaciones cruzadas contra RCA) para que sus usuarios puedan declarar sin errores.

## Lógica de descomposición

Se descompone en cuatro conceptos: [[SINADER - Declaración Masiva Anual]] y [[SINADER - Declaración Masiva Mensual]] (los dos mecanismos de declaración masiva con formatos y plazos distintos), junto a dos vacíos tecnológicos críticos: [[Inexistencia de Diccionarios OpenAPI de SINADER]] e [[Inexistencia de Protocolo Ambiental para Rechazos]].


## Relaciones Horizontales

- [[SICEX]]: **Fricción Metrológica:** El SINADER exige reportes en Toneladas Métricas, mientras que el control primario de ingreso en SICEX exige la unidad Kilogramos Netos (KN).
- [[Gestor]]: **Obligación Operativa:** Los gestores de residuos son los actores responsables de inyectar la data final de valorización o disposición en la plataforma SINADER, cerrando la trazabilidad.
- [[Secretaría Regional Ministerial de Salud]]: **Fricción de Habilitación:** El SINADER realiza validaciones cruzadas. Carecer de Autorización Sanitaria impide el registro y declaración en la plataforma.
- [[Registro Público de Sistemas de Gestión]]: **Filtro de Ingreso:** SINADER rechaza cualquier archivo de declaración si el RUT o Código de Establecimiento no está empadronado formalmente en el Registro de la SMA.
- [[Decreto Supremo 148]]: **Frontera de Peligrosidad:** El DS 148 determina si un NFU incendiado cruza la línea a residuo peligroso, obligando a retirarlo de SINADER y reportarlo en SIDREP.
- [[Valorización]]: **Materialización Jurídica:** La acción de reciclar no tiene validez legal hasta que no es inyectada y aprobada algorítmicamente en SINADER.
- [[Generador]]: **Obligación de Declaración:** El punto origen de la recolección física tiene la obligación normativa de declarar sus despachos en SINADER.
- [[Decreto Supremo 1]]: **Reglamento base habilitante:** El D.S. 1/2013 gobierna de forma exclusiva las atribuciones y validez jurídica del reporte al SINADER/RETC.

## Fuente original

Sistema Nacional de Declaración de Residuos (SINADER).

## Evidencia



## Justificación de estado

Permanece en `borrador` porque si bien el contenido factual y las relaciones horizontales están bien desarrollados (7 relaciones descritas), la evidencia primaria está vacía y debe ser reemplazada por fuentes reales (URL del portal SINADER, manuales oficiales). Además, los códigos de tratamiento y las validaciones cruzadas no han sido verificados contra la documentación oficial vigente. Para avanzar a `verificado` se requiere confirmar la información contra el sitio oficial del RETC.
