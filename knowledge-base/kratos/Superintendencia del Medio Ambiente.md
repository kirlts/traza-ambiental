---
estado: borrador
tipo: factor_externo
vigencia: por_verificar
depende_de: null
se_descompone_en:
- '[[Ley 20.417]]'
- '[[Jurisprudencia SMA]]'
- '[[Resolución Exenta 2084]]'
- '[[Límite de Jurisdicción SMA sobre Middlewares]]'
- '[[Inexistencia de Tolerancia de Merma Ambiental]]'
- '[[Planilla REP Consumidores Industriales]]'
- '[[Resolución Exenta 2279]]'
se_relaciona_con:
- '[[Agencia de Protección de Datos Personales]]'
- '[[Ministerio del Medio Ambiente]]'
- '[[Decreto Supremo 1 - Artículo 28]]'
cssclasses:
- kb-node
---

# Superintendencia del Medio Ambiente

## Qué dice

Entidad estatal chilena con potestad fiscalizadora y sancionadora en materia ambiental, encargada de vigilar el cumplimiento de los instrumentos de gestión ambiental, incluyendo la Ley REP.

## Por qué existe

Esta es una institución autónoma de primer nivel. La SMA no se deriva de ningún otro concepto porque es una entidad estatal autónoma cuya existencia es un hecho externo. Su relevancia para Trazambiental radica en que es el brazo fiscalizador y sancionador del ecosistema REP: la SMA define cómo se demuestra el cumplimiento (SISREP), qué información deben reportar los regulados (Res 2084), y qué consecuencias enfrentan por incumplimiento (multas de hasta 10.000 UTA). Los usuarios del MVP de Trazambiental operan bajo la vigilancia directa de esta entidad.

## Lógica de descomposición

Se descompone en cinco conceptos que cubren los instrumentos del brazo fiscalizador relevantes para el MVP: [[Ley 20.417]] (la norma que crea y define las potestades de la SMA), [[Jurisprudencia SMA]] (los precedentes de aplicación de sanciones), [[Resolución Exenta 2084]] (instrumento metodológico para fiscalización REP mediante SISREP), y dos vacíos documentados: [[Límite de Jurisdicción SMA sobre Middlewares]] y la [[Inexistencia de Tolerancia de Merma Ambiental]]. Juntos representan la base legal, aplicación práctica, mecanismo operativo y los límites de la fiscalización ambiental. Además, incluye a [[Planilla REP Consumidores Industriales]]. Además, incluye a [[Resolución Exenta 2279]].


## Relaciones Horizontales

- [[Ministerio del Medio Ambiente]]: **Separación de Poderes (Fricción):** El MMA emite la norma (DS 8) y opera el SINADER; la SMA fiscaliza (Res 2084) basándose en los datos del MMA. Son órganos independientes con plataformas separadas.
- [[Agencia de Protección de Datos Personales]]: **Doble Jurisdicción Sancionatoria:** Una vulneración en la plataforma que impida declarar y además filtre datos activa simultáneamente multas ambientales y de privacidad.
- [[Decreto Supremo 1 - Artículo 28]]: **Infracciones Formales:** La SMA sanciona directamente las omisiones y los reportes retroactivos/extemporáneos realizados en Ventanilla Única en contravención a este artículo.

## Fuente original

Arquitectura Institucional de Chile.

## Evidencia



## Justificación de estado

Permanece en `borrador` porque la vigencia institucional no ha sido verificada contra fuentes primarias y el campo de evidencia está vacío. Para avanzar a `verificado` se requiere enlazar evidencia real sobre la creación y atribuciones de la SMA (Ley 20.417).
