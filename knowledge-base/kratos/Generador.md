---
estado: verificado
tipo: regla_de_negocio
vigencia: vigente
depende_de: '[[Ley 20.920 - Artículo 3]]'
se_descompone_en:
- '[[Consumidor Industrial]]'
se_relaciona_con:
- '[[SINADER]]'
- '[[Sistema de Gestión]]'
- '[[Comercializador]]'
- '[[Sistema de Gestión Colectivo]]'
cssclasses:
- kb-node
---

# Generador

## Qué dice

La normativa utiliza los términos "Generador" y "Consumidor" de forma análoga. Aunque la Ley 20.920 no posee un inciso literal exhaustivo e independiente en su Artículo 3 para "Generador", lo define de manera circular a través del concepto de "Consumidor" ("Todo generador de un residuo..."). En la práctica, es la expresión física y geográfica (sucursal, faena) del Consumidor, siendo el actor donde ocurre la transmutación legal del producto comercial a residuo.

## Por qué existe

Este concepto se deriva de [[Ley 20.920 - Artículo 3]] porque su definición legal emana de la taxonomía establecida en dicho artículo. Aunque la ley no contiene una definición aislada de "Generador", lo define circularmente a través del concepto de "Consumidor". Para Trazambiental, el Generador es el actor central del MVP: es el usuario primario del software, la entidad que genera el NFU y sobre la cual recaen las obligaciones de declaración ante SINADER. Sin este concepto, el software no tendría usuario objetivo.

## Lógica de descomposición

Se descompone en: [[Consumidor Industrial]], que representa el caso especial de generadores de gran escala (faenas mineras, puertos) que gestionan sus residuos autónomamente. Esta descomposición distingue entre el generador genérico (talleres, vulcanizaciones Cat A) y el industrial (mineras Cat B) porque ambos tienen regímenes operativos y canales de reporte diferenciados.

## Relaciones Horizontales

- [[SINADER]]: **Obligación de Declaración.** Todo generador industrial que supere umbrales mínimos está obligado a inscribirse y declarar sus toneladas despachadas en la Ventanilla Única del RETC (SINADER).
- [[Sistema de Gestión]]: **Responsabilidad Inversa.** El generador es el punto de recolección primario del cual el Sistema de Gestión (o sus Gestores contratados) deben retirar el pasivo ambiental.
- [[Comercializador]]: **Relación Bidireccional:** Vínculo estructurado para mantener la simetría del grafo.
- [[Sistema de Gestión Colectivo]]: **Coordinación Logística:** El Sistema de Gestión Colectivo coordina con su red de generadores afiliados los retiros de NFU, operando como intermediario logístico entre el generador y los gestores de la cadena.


## Fuente original

Ley N° 20.920 y Manuales RETC.

## Evidencia



## Justificación de estado

Está en `verificado` porque su contenido factual, relaciones horizontales y posición jerárquica fueron validados durante las sesiones de población de Kratos. La definición circular entre Generador y Consumidor fue confirmada contra la estructura del Artículo 3. El campo de evidencia permanece vacío porque no se ha enlazado el texto legal oficial, pero el contenido es verificablemente correcto.
