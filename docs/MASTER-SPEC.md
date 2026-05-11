# MASTER-SPEC: traza-ambiental v0.1.0

> Sistema de planificación exhaustiva del MVP de Trazambiental, estructurado como una Knowledge Base determinista (Kratos/Khaos) operada por IA.

---

## §1. Identidad del Proyecto

**Propósito:** Construir la planificación exhaustiva y definitiva del MVP del software "Trazambiental" mediante un método de gestión de conocimiento determinista. Este repositorio no contiene código ejecutable del MVP; contiene la Knowledge Base (KB) que estructura el dominio legal-operativo (Kratos) y el diseño conceptual del software (Khaos) como una red jerárquica de nodos Markdown, operada y auditada por una IA (Antigravity).

**Nombre:** traza-ambiental (repositorio de planificación)

**Dominio:** Gestión de Conocimiento / Planificación de Software asistida por IA

**Problema que resuelve:** La planificación de un SaaS de cumplimiento normativo requiere manejar simultáneamente información legal densa, reglas de negocio, decisiones estratégicas y diseño de software. Sin una estructura determinista, esta información permanece dispersa, incompleta y no auditable. Este sistema ataca esa dispersión convirtiendo todo el conocimiento en nodos atómicos interconectados que la IA puede parsear, auditar y sobre los cuales puede detectar lagunas automáticamente.

**Beneficiario directo:** El equipo fundador de Trazambiental, que necesita una planificación de MVP completa, auditable y sin lagunas ocultas antes de iniciar la construcción.

**Beneficiario indirecto:** Cualquier stakeholder futuro (desarrolladores, inversores, asesores legales) que requiera comprender la arquitectura y los fundamentos del MVP a partir de una fuente de verdad estructurada.

**Lo que NO es:**
- No es el repositorio donde se construye el MVP de Trazambiental. Aquí se planifica; allí se codifica.
- No es un wiki genérico ni un volcado de documentos. Es una estructura de nodos diseñada para parseo determinista por IA.
- No contiene código ejecutable, APIs, ni servicios desplegables.

---

## §2. Arquitectura

**Tipo:** Knowledge Base de texto plano (Markdown) operada por un backend de IA (Antigravity), sin componentes ejecutables propios.

**Diagrama de Componentes:**

```
[Usuario]
    │
    │ texto / contexto / archivos / imágenes
    ▼
[Antigravity (Backend IA)] ──── Orquestador
    │
    ├── Camino A: Interacción Profunda
    │       │
    │       ▼
    │   [Knowledge Base]
    │       ├── /kratos/  ← Hechos, ley, reglas de negocio (inmutable)
    │       └── /khaos/   ← Diseño y planificación del MVP (construible)
    │
    └── Camino B: Respuesta Rápida (sin acceso a KB)
```

**Flujo de Datos Principal:**

1. El usuario aporta información (textos legales, reglas de negocio, decisiones, requerimientos) a Antigravity.
2. Antigravity clasifica la intención: ¿requiere acceso a la KB o es una consulta conversacional?
3. **Si requiere KB:** Antigravity accede a `knowledge-base/`, ejecuta la acción correspondiente (estructurar en Kratos, instanciar en Khaos, auditar vacíos, cruzar información) y sintetiza una respuesta trazable.
4. **Si no requiere KB:** Antigravity responde analíticamente con su razonamiento base y el contexto de la sesión.
5. Periódicamente, Antigravity ejecuta auditorías estructurales recorriendo Khaos para detectar campos vacíos que exigen vinculación con Kratos.

---

## §3. Stack Técnico

| Capa | Tecnología | Justificación |
| --- | --- | --- |
| Orquestación IA | Antigravity (backend) | Único punto de interacción humano-IA; clasifica intenciones, opera sobre la KB, ejecuta auditorías |
| Almacenamiento de conocimiento | Markdown (texto plano) | Parseo determinista por LLM; versionable con Git; sin dependencias propietarias |
| Estructura de nodos | Plantillas Markdown autorreplicables | Cada entidad (módulo, épica, historia, modelo) se instancia como nodo atómico estandarizado, revelando lagunas por diseño |
| Visualización humana | Obsidian | Renderizado nativo de grafos de dependencias usando wikilinks y enlaces relativos, sin API adicional |
| Control de versiones | Git | Trazabilidad de cambios en la KB; historial auditable de la planificación |
| Gobernanza del repo | Kairós (.agents/) | Framework de reglas, workflows y templates que rige la operación del agente IA sobre este repositorio |

---

## §4. Restricciones (Límites Inviolables)

> Estas restricciones prevalecen sobre cualquier otra decisión. Son las líneas que no deben cruzarse.

1. **Scope de planificación, no de implementación:** Este repositorio produce artefactos de planificación (nodos Markdown). No se escribe código ejecutable del MVP aquí.
2. **Scope NFU exclusivo para el MVP planificado:** La planificación cubre estrictamente el MVP de Trazambiental delimitado a Neumáticos Fuera de Uso (NFU), Categorías A y B, bajo la Ley REP de Chile.
3. **Factualidad 100% en Kratos:** Todo registro en `/knowledge-base/kratos/` debe ser verificable contra fuentes normativas o decisiones explícitas del humano. No se almacenan interpretaciones ni suposiciones.
4. **Compliance by Design en Khaos:** Todo nodo en `/knowledge-base/khaos/` que requiera sustento factual debe exhibir explícitamente el campo de dependencia. Una celda vacía en la tabla de compromisos es una señal de auditoría, no un error tolerable: obliga a buscar y vincular la información faltante en Kratos.
5. **Separación estricta Kratos / Khaos:** Los hechos inmutables residen exclusivamente en `kratos/`. El diseño del software reside exclusivamente en `khaos/`. La contaminación cruzada está prohibida.
6. **Estándar Markdown puro:** Toda la KB se construye sobre texto plano Markdown. No se introducen formatos binarios, bases de datos ni dependencias propietarias.
7. **Interdependencia estructural:** La plantilla autorreplicable de Khaos induce obligatoriamente artefactos (tablas, matrices de trazabilidad) y principios (MECE) que fuerzan la revelación de lagunas de información conforme se construye el árbol.
8. **Separación inviolable Construcción / Auditoría:** La instanciación de nodos Khaos (Fase 1) y la auditoría de vacíos (Fase 2) son operaciones independientes. En Fase 1, Antigravity estructura exclusivamente la información aportada por el humano dentro de la plantilla. Todo campo sin información permanece **estructuralmente vacío** — esto significa celda vacía, sección sin contenido, o lista sin ítems. Está explícitamente prohibido: texto placeholder (ej. `[Por definir]`, `[Vacío]`, `TBD`), preguntas embebidas (ej. `¿Se requiere validación?`), sugerencias (ej. `Considerar X`), o cualquier contenido no aportado por el humano. Los vacíos son el producto diseñado del sistema. En Fase 2, Antigravity recorre los vacíos y busca resolución en Kratos.
9. **Mutabilidad estructural gobernada:** La estructura de Khaos es un árbol vivo, no un documento congelado. Nueva información puede crear, fusionar, dividir o eliminar nodos, y modificar relaciones padre/hijo. Toda mutación queda registrada en Git con un motivo trazable. La mutación es el comportamiento esperado, no una excepción.
10. **Khaos solo referencia Kratos:** Los nodos en `khaos/` solo pueden referenciar nodos en `kratos/` como sustento factual. No pueden referenciar documentos fuera de la KB (`docs/`, `Docs/`, archivos externos). Las referencias internas entre nodos Khaos (padre/hijo) son permitidas.
11. **Compatibilidad nativa con Obsidian:** Toda referencia entre nodos usa wikilinks (`[[Nombre del Nodo]]`). Obsidian resuelve wikilinks por nombre de archivo globalmente dentro del vault. **Bajo ninguna circunstancia se deben envolver los wikilinks en backticks (ej. `[[Nodo]]`)**, ya que esto formatea el texto como código en línea y desactiva el ruteo del grafo. Cuando se necesiten enlaces estándar Markdown, se usan rutas relativas (`../kratos/nombre.md`), nunca absolutas. `kratos/` y `khaos/` son directorios hermanos dentro de `knowledge-base/`. Todo nodo KB incluye `cssclasses: [kb-node]` en su frontmatter YAML para activar el snippet CSS que renderiza texto justificado sin hyphenation. El vault de Obsidian apunta a `knowledge-base/`.
12. **Fuente de verdad exclusiva en la KB:** Solo `knowledge-base/kratos/` y `knowledge-base/khaos/` contienen información autorizada. Los directorios `info/`, `work/`, y cualquier otro archivo fuera de `knowledge-base/` son **material crudo no verificado**. La IA no puede: (a) citar contenido de estos directorios como hecho verificado, (b) copiar texto directamente desde ellos a un nodo KB sin reestructuración, (c) tratar informes de deep research como fuente factual — primero deben pasar por el workflow `/estructurar-kratos` con confirmación humana, ni (d) citar informes de investigación (deep research) como `evidencia` en ningún nodo Kratos. Si no existe una fuente o evidencia REAL verificable (ley, decreto, web oficial), el campo `evidencia` DEBE quedar explícitamente en blanco.
> Nota: Las restricciones aquí registradas se duplican defensivamente en `.agents/rules/05-constraints.md` para sobrevivir a la degradación de contexto en sesiones largas.

---

## §5. Trade-offs Acordados

> Decisiones donde se sacrificó una cualidad en favor de otra, con la razón explícita.

| Trade-off | A favor de | En contra de | Justificación |
| --- | --- | --- | --- |
| Estructura LLM-First vs. legibilidad humana casual | Parseo determinista por IA | Lectura directa sin herramientas | Los nodos están diseñados para que Antigravity los recorra y analice sin alucinaciones. La legibilidad humana se recupera abriendo la KB en Obsidian. |
| Planificación exhaustiva antes de codificar vs. prototipado rápido | Completitud y auditabilidad de la planificación | Velocidad de entrega de código | El MVP no se construye hasta que Khaos esté completamente estructurado y auditado contra Kratos, eliminando retrabajo. |
| Nodos atómicos Markdown vs. documentos largos tradicionales | Granularidad, trazabilidad y detección automática de vacíos | Comodidad de lectura lineal | Cada nodo contiene una porción atómica de la lógica del software; la IA puede recorrer el enjambre y detectar dependencias rotas o información faltante. |

---

## §6. UI y Experiencia de Usuario

> Este repositorio no tiene interfaz de usuario propia. La interacción ocurre a través de Antigravity y la visualización a través de Obsidian.

**Atmósfera de referencia:** No aplica — no hay interfaz visual construida en este repo.

**Flujo principal del usuario:**

1. El usuario aporta información cruda (textos legales, reglas de negocio, decisiones del CEO, requerimientos de actores NFU) a Antigravity.
2. **Acción: Estructurar Kratos** — Antigravity procesa el volcado y lo transforma en nodos atómicos estandarizados dentro de `/knowledge-base/kratos/`.
3. **Acción: Desplegar Khaos** — Con base en la información de Kratos, el usuario y Antigravity instancian iterativamente las plantillas autorreplicables en `/knowledge-base/khaos/`, construyendo el diseño del MVP.
4. **Acción: Auditoría Estructural** — Antigravity recorre el árbol de Khaos, detecta campos vacíos (ej. `Base_Legal_Requerida: [Vacío]`) y exige que se vinculen con registros factuales en Kratos o que se busque la información faltante.
5. El usuario abre `/knowledge-base/` en Obsidian para visualizar la topología: grafos de dependencias, nodos de software huérfanos de sustento legal, artículos normativos no abordados, complejidad estructural de cada módulo.

**Componentes de interfaz:** No aplica.

---

## §7. Especificaciones de Módulos

> Detalle de cada componente estructural del sistema de planificación.

### 7.1. Kratos — El Reino de los Hechos y la Ley

**Propósito:** Fuente de verdad inmutable, factual, legal y de dominio. Contiene las reglas del juego que el MVP de Trazambiental debe obedecer. No diseña software; solo almacena hechos verificables.

**Ubicación:** `/knowledge-base/kratos/`

**Estado actual:** Volcado de información cruda en `external-research/` (9 documentos de investigación + datasets de referencia). Pendiente de estructuración en nodos atómicos mediante la plantilla de §7.6.

**Contenido exclusivo (a estructurar):**
- Textos legales y normativas (Ley REP, decretos asociados)
- Reglas prácticas de negocio
- Decisiones del CEO
- Definiciones inmutables de actores del ecosistema NFU (generadores, sistemas de gestión, gestores, disposición final — por definir explícitamente)
- Requerimientos técnicos y reglamentarios de plataformas gubernamentales

**Dependencias:** Ninguna. Kratos es autosuficiente.

---

### 7.2. Khaos — El Reino de la Planificación y Construcción del MVP

**Propósito:** Motor de diseño, arquitectura y gestión del proyecto de software. Representa cómo Trazambiental resuelve las obligaciones impuestas por Kratos, estructurado como una red jerárquica de conceptos Markdown bajo un paradigma de gestión de conocimiento determinista.

**Ubicación:** `/knowledge-base/khaos/`

**Estado actual:** Vacío. Lienzo de trabajo principal para la ideación del SaaS.

**Paradigma estructural:**
- **Red jerárquica de responsabilidades MECE:** Cada concepto representa exactamente una responsabilidad concreta y distinguible del MVP frente al dominio. La descomposición es jerárquica: una responsabilidad se descompone en sub-responsabilidades que son mutuamente exclusivas entre sí y colectivamente exhaustivas respecto a la responsabilidad de la cual se derivan.
- **Criterio de frontera:** Información nueva se agrega (append) a un concepto existente cuando elabora, restringe o clarifica la misma responsabilidad. Un nuevo concepto se crea cuando aparece una responsabilidad distinguible que no cabe en ningún concepto existente sin romper la exclusividad mutua. La falla de exhaustividad colectiva (la suma de las responsabilidades derivadas no cubre a la responsabilidad de origen) señala responsabilidades faltantes.
- **Nomenclatura legible por humanos:** Los conceptos se nombran en español, en lenguaje natural autoexplicativo (ej. `Declaración de NFU por Generador`). En Obsidian, el nombre del archivo es el wikilink: `[[Declaración de NFU por Generador]]`. No se utilizan identificadores crípticos.
- **Optimización LLM-First:** La estructura está diseñada para que Antigravity pueda parsear, analizar y predecir el árbol de relaciones sin alucinaciones, utilizando el formato Markdown que maximiza la fidelidad de adherencia del mecanismo de atención.
- **Plantilla autorreplicable:** Independiente del nivel de anidación. La misma estructura sirve para una responsabilidad de alto nivel y una responsabilidad atómica. Definición completa en §7.5.
- **Revelación orgánica de lagunas:** La plantilla no detecta vacíos — los induce. Su estructura fuerza la existencia de campos que deben contener información. Si el humano no la proporcionó, los campos quedan vacíos. Esos vacíos son el producto diseñado del sistema, no un defecto.
- **Interdependencia por diseño:** Si un concepto requiere sustento legal, la plantilla fuerza el campo correspondiente. Un campo vacío activa la Fase 2 (auditoría), que busca resolución en Kratos.

**Dependencias:** `/knowledge-base/kratos/` (dependencia estructural obligatoria por diseño).

---

### 7.3. Antigravity — Orquestador IA

**Propósito:** Backend inteligente que opera como único punto de interacción entre el humano y la Knowledge Base. Clasifica intenciones, ejecuta acciones sobre Kratos y Khaos, y mantiene la integridad estructural del sistema de planificación.

**Interfaz:**

```
Inputs:  texto | contexto (historial/estado del sistema) | archivos | imágenes
Outputs: nodos Markdown estructurados | respuestas factuales trazables | reportes de auditoría
```

**Acciones operativas:**

| Acción | Descripción | Workflow |
| --- | --- | --- |
| Estructurar Kratos | Procesar información factual cruda → nodos atómicos estandarizados en `/kratos/` | `.agents/workflows/estructurar-kratos.md` |
| Desplegar Khaos | Instanciar o mutar nodos de responsabilidad en `/khaos/` a partir de la conversación con el humano | `.agents/workflows/desplegar-khaos.md` |
| Auditar Vacíos | Recorrer Khaos, filtrar aplazamientos (USER-DECISIONS), buscar resolución en Kratos | `.agents/workflows/auditar-vacios.md` |
| Registrar Decisiones | Proponer entradas en `USER-DECISIONS.md` cuando el humano toma, aplaza o revierte decisiones | (protocolo en `04-documentation.md`) |

**Dependencias:** `/knowledge-base/kratos/`, `/knowledge-base/khaos/`, `docs/USER-DECISIONS.md`

---

### 7.4. Visualización — Compatibilidad Obsidian

**Propósito:** Permitir al usuario humano visualizar la topología del MVP planificado sin herramientas adicionales al ecosistema Markdown.

**Mecanismo:** La red de nodos utiliza el formato de enlazado estándar que Obsidian lee nativamente:
- Wikilinks: `[[Ley REP - Artículo 24 - Obligaciones del Generador]]`
- Enlaces relativos: `[Texto](./ruta/archivo.md)`

**Capacidades de visualización:**
- Grafos de red que revelan la topología del MVP.
- Nodos de software huérfanos de sustento legal.
- Artículos normativos no abordados por ningún nodo de diseño.
- Complejidad estructural de cada módulo planificado.

**Dependencias:** Estructura de `/knowledge-base/` con enlaces Markdown en formato estándar.

---

### 7.5. Plantilla Autorreplicable de Nodos Khaos

**Propósito:** Definir la estructura estandarizada que todo nodo de Khaos utiliza, independientemente de su nivel jerárquico. La plantilla sirve simultáneamente a tres consumidores: el humano (legibilidad ejecutiva en Obsidian), Antigravity (parseo determinista y auditoría), y el grafo de Obsidian (enlazado nativo por wikilinks).

#### 7.5.1. Ontología del Nodo

Un nodo Khaos no es un documento ni una especificación técnica. Es una **unidad de responsabilidad del MVP**, expresada en lenguaje natural. Cada nodo responde a: *"¿De qué se hace cargo esta parte del sistema?"*

**Criterio MECE para gestión de nodos:**
- **Nuevo nodo:** Cuando aparece una responsabilidad distinguible que no pertenece a ningún nodo existente (Mutuamente Exclusiva).
- **Append a nodo existente:** Cuando la información elabora, restringe o clarifica una responsabilidad ya representada.
- **Señal de vacío CE:** Cuando la suma de las responsabilidades derivadas no cubre la responsabilidad de la cual se derivan (falla de Exhaustividad Colectiva), el sistema identifica responsabilidades faltantes.

**Nomenclatura:** Cada nodo se nombra en español, en lenguaje natural autoexplicativo. El nombre del archivo Markdown es el wikilink de Obsidian: `[[Declaración de NFU por Generador]]`. No se utilizan identificadores crípticos.

#### 7.5.2. Estructura de la Plantilla

Secciones obligatorias. Los nombres de campo son en español y autoexplicativos:

| Sección | Propósito | Consumidor principal |
|---|---|---|
| `que_es` | Descripción ejecutiva en una frase de la responsabilidad | Humano |
| `por_que_existe` | Párrafo narrativo explicando de dónde se deriva esta responsabilidad y por qué es relevante. No es solo un wikilink: es la justificación causal de la relación vertical | Humano + Grafo |
| `logica_de_descomposicion` | Párrafo explicando el criterio MECE por el cual esta responsabilidad se subdivide en los elementos listados en `se_descompone_en`. Vacío si no se descompone | Humano + Antigravity |
| `compromisos` | Tabla de compromisos verificables: Actor · Acción en el sistema · Sustento (wikilink a Kratos — puede ser norma legal, decisión del humano, regla de negocio, requisito técnico o factor externo) | Humano + Antigravity |
| `relaciones_horizontales` | Párrafo por cada elemento en `se_relaciona_con`, explicando la naturaleza de la conexión (flujo de datos, dependencia temporal, fricción, complementariedad) | Humano + Antigravity |
| `que_falta` | Sección siempre presente. Registra lagunas detectadas durante la auditoría (Fase 2). Vacía hasta que la auditoría la popule | Antigravity |
| `se_descompone_en` | Wikilinks a sub-responsabilidades derivadas | Grafo |
| `se_relaciona_con` | Wikilinks a responsabilidades transversales (flujos de datos/dependencias) | Grafo |
| `depende_de` | Wikilink a la responsabilidad de la cual se deriva | Grafo |
| `estado` | `borrador` · `con_vacios` · `completo` · `validado` | Antigravity |
| `justificacion_de_estado` | Párrafo explicando por qué tiene su `estado` actual y qué falta para avanzar al siguiente | Humano + Antigravity |

**Mecánica de compromisos:** La plantilla fuerza las **columnas** de la tabla (Actor, Acción, Sustento). El humano llena las **filas** con la información que posee. Las celdas sin información permanecen vacías. La auditoría CE verifica si las filas existentes cubren la totalidad de la responsabilidad del nodo.

#### 7.5.3. Operación en Dos Fases

La instanciación y la auditoría son operaciones **independientes e inviolablemente separadas**.

**Fase 1 — Construcción:**
El humano aporta información. Antigravity la transcribe dentro de la estructura de la plantilla. La IA actúa como escriba: no especula, no sugiere, no llena vacíos con contenido generado. Todo campo sin información del humano queda estructuralmente vacío.

**Fase 2 — Auditoría de Vacíos:**
Antigravity recorre los nodos de Khaos buscando campos vacíos. **Antes de escalar cualquier vacío al humano**, consulta `docs/USER-DECISIONS.md`:
- Si el vacío está cubierto por un aplazamiento vigente (⏸️) cuya condición de reapertura no se ha cumplido → lo registra silenciosamente, no lo re-plantea.
- Si la condición de reapertura se ha cumplido → lo re-plantea con contexto.
- Si no hay aplazamiento relacionado → procede con el protocolo normal.

Para cada vacío no aplazado, busca en Kratos información que pueda resolverlo:

| Resultado de la búsqueda en Kratos | Acción de Antigravity |
|---|---|
| Información precisa y suficiente | Rellena el vacío con referencia trazable a Kratos |
| Información parcial | Rellena lo disponible, señala lo que aún falta |
| Contradicción con el nodo Khaos | Auditoría profunda: enmienda automática si hay datos suficientes (puede afectar padre/hijos), o escalamiento al humano |
| Sin información | Informa al humano que Kratos carece de los datos necesarios |

#### 7.5.4. Mutabilidad Estructural

El árbol de Khaos es una estructura viva. Nueva información (conversaciones con el humano, nueva normativa, decisiones estratégicas) puede requerir:

- **Crear** nodos (nueva responsabilidad identificada)
- **Fusionar** nodos (dos responsabilidades que resultaron ser una sola)
- **Dividir** nodos (una responsabilidad que debe descomponerse)
- **Eliminar** nodos (responsabilidades descartadas del scope del MVP)
- **Reparentar** nodos (una responsabilidad que pertenece a otro padre)

Toda mutación queda registrada en Git con un mensaje que vincula el cambio a su causa. La mutación no requiere autorización previa; es el comportamiento esperado del sistema conforme la planificación madura. El criterio MECE gobierna la validez de toda mutación: el árbol resultante debe mantener exclusividad mutua entre hermanos y exhaustividad colectiva respecto al padre.

**Dependencias:** Kratos (fuente de verdad para auditoría), Obsidian (visualización para el humano).

---

### 7.6. Plantilla Autorreplicable de Nodos Kratos

**Propósito:** Definir la estructura estandarizada para registros factuales en Kratos. Optimizada para almacenar hechos verificables provenientes de cualquier fuente (leyes, decretos, decisiones del humano, reglas de negocio, requisitos técnicos, factores externos). Las fuentes pueden ser texto, imágenes, PDFs o sitios web.

#### 7.6.1. Ontología del Nodo

Un nodo Kratos es una **unidad de hecho verificable**. No interpreta, no infiere, no diseña. Registra lo que una fuente autoritativa afirma como verdadero.

**Criterio MECE para gestión de nodos:**
- **Nuevo nodo:** Cuando aparece un hecho distinguible que no pertenece a ningún nodo existente (distinta fuente, distinto alcance, o distinta autoridad).
- **Append a nodo existente:** Cuando nueva información elabora o precisa un hecho ya registrado, proveniente de la misma fuente y con el mismo alcance.
- **Jerarquía factual:** Los hechos pueden descomponerse jerárquicamente (ej. una ley contiene artículos, un artículo contiene incisos). Los conceptos derivados son ME entre sí y CE respecto al concepto del cual se derivan.

**Nomenclatura:** Lenguaje natural autoexplicativo en español, evitando prefijar el nombre del concepto de origen en los conceptos derivados para mantener wikilinks limpios (anti-solapamiento). Ejemplo: `[[Obligaciones del Generador]]` (en lugar de `Ley REP - Artículo 24 - Obligaciones del Generador`). **Excepción:** Los conceptos estructurales genéricos (ej. Artículos, Capítulos) sí deben incluir el prefijo de su cuerpo normativo para garantizar unicidad global en Obsidian (ej. `[[Ley 20.920 - Artículo 3]]`, nunca `[[Artículo 3]]`).

#### 7.6.2. Estructura de la Plantilla

| Sección | Propósito | Consumidor principal |
|---|---|---|
| `que_dice` | El hecho expresado en lenguaje natural. No es la cita textual de la fuente (eso va en `evidencia`), sino una síntesis legible | Humano |
| `por_que_existe` | Párrafo narrativo explicando de dónde se deriva este concepto y por qué es relevante para Trazambiental. Si es un concepto de primer nivel (institución, ley matriz), explicar su existencia autónoma | Humano + Antigravity |
| `logica_de_descomposicion` | Párrafo explicando el criterio MECE por el cual este concepto se subdivide en los elementos listados en `se_descompone_en`. Vacío si no se descompone | Humano + Antigravity |
| `relaciones_horizontales` | Párrafo por cada elemento en `se_relaciona_con`, explicando la naturaleza de la conexión (fricción normativa, complementariedad regulatoria, dependencia operativa) | Humano + Antigravity |
| `tipo` | Categoría del hecho: `norma_legal` · `decision_del_humano` · `regla_de_negocio` · `requisito_tecnico` · `factor_externo` | Antigravity |
| `fuente_original` | Identificación de la fuente: nombre de la ley, número de decreto, fecha de decisión, URL | Humano |
| `evidencia` | Enlace a la fuente REAL (URL oficial, ley, decreto). IMPORTANTE: NINGÚN concepto Kratos debe citar informes de investigación internos (ej. deep research) ni directa ni indirectamente. Si no hay fuente real, el campo DEBE quedar en blanco. | Antigravity + Humano |
| `vigencia` | Estado temporal del hecho: `vigente` · `derogado` · `por_verificar` | Antigravity |
| `depende_de` | Wikilink al concepto del cual se deriva (para hechos jerárquicos) | Grafo |
| `se_descompone_en` | Wikilinks a conceptos derivados | Grafo |
| `se_relaciona_con` | Wikilinks a conceptos transversales (conexiones horizontales/fricciones) | Grafo |
| `estado` | `borrador` · `verificado` · `obsoleto` | Antigravity |
| `justificacion_de_estado` | Párrafo explicando por qué tiene su `estado` actual y qué falta para avanzar al siguiente | Humano + Antigravity |

**Mecánica de evidencia:** La evidencia es el ancla de verificabilidad del nodo. Un nodo Kratos sin evidencia es equivalente a un campo vacío en Khaos — un vacío que la auditoría debe resolver. La regla de factualidad 100% (§4.3) exige que toda afirmación en `que_dice` tenga respaldo en `evidencia`.

#### 7.6.3. Operación en Dos Fases (Kratos)

**Fase 1 — Estructuración:**
El humano aporta material crudo (textos legales, PDFs, imágenes de documentos, URLs, decisiones verbales). Antigravity lo transcribe dentro de la plantilla: extrae el hecho, clasifica el tipo, registra la fuente, almacena o referencia la evidencia. No interpreta el alcance ni las implicaciones del hecho — eso pertenece a Khaos.

**Fase 2 — Verificación de Integridad:**
Antigravity recorre Kratos buscando:
- Nodos sin evidencia (afirmaciones no respaldadas)
- Nodos con vigencia `por_verificar` (hechos que podrían haber cambiado)
- Nodos referenciados por Khaos que no existen (dependencias rotas — señal de que falta información factual)
- Contradicciones entre nodos (dos hechos del mismo dominio que se oponen)

#### 7.6.4. Mutabilidad Factual

Los hechos en Kratos pueden cambiar: leyes se derogan, decisiones se revierten, reglas de negocio evolucionan. Cuando un hecho muta:
- El nodo original se marca como `obsoleto` (no se elimina — el historial importa)
- Se crea un nodo nuevo con el hecho actualizado
- Antigravity detecta que nodos Khaos dependen del nodo obsoleto y dispara re-auditoría de esos nodos

**Dependencias:** Fuentes externas (leyes, normativas, decisiones). Khaos (como consumidor de hechos).

---

### 7.7. Workflows Operativos

**Propósito:** Automatizar las tres acciones de Antigravity (§7.3) como procesos algorítmicos reproducibles. A diferencia de los workflows Kairós estándar (invocados por el humano con `/comando`), estos workflows son **activados por Antigravity** según el contexto conversacional.

**Ubicación:** `.agents/workflows/`

**Principio de Clasificación (Fase 0 — precede todo workflow):**

Antes de ejecutar cualquier workflow, Antigravity clasifica cada unidad de información de la conversación:

| Clasificación | Señal | Workflow |
|---|---|---|
| **Hecho** | Afirmación verificable sobre el dominio (ley, regla, dato, requisito) | estructurar-kratos |
| **Responsabilidad** | Lo que el MVP debe hacer, resolver o soportar | desplegar-khaos |
| **Decisión** | Elección estratégica, aplazamiento o preferencia del humano | USER-DECISIONS |
| **Ambigua** | No se puede determinar con certeza | Solicitar clarificación al humano |

**Reglas de clasificación:**
- Si una entrada contiene múltiples categorías (ej. "los generadores deben declarar anualmente según la Ley REP" contiene hecho + responsabilidad), se descompone y cada parte se procesa con su workflow correspondiente, en orden de dependencia: Kratos primero, Khaos después.
- Si la clasificación es ambigua, Antigravity presenta las opciones al humano y espera confirmación. La misclasificación es más costosa que una pregunta de clarificación.
- Ante la duda, preguntar. Nunca asumir.

**Patrón Working / Deliverable (para operaciones extensas):**

Cuando un workflow procesa volúmenes grandes de información (ej. estructurar un dump completo, desplegar una rama extensa de Khaos), Antigravity genera:
- Un **documento de trabajo** (`[contexto]_working.md`) que rastrea el progreso: qué fuentes se procesaron, qué nodos se crearon, qué queda pendiente, qué preguntas surgieron.
- Los **deliverables** son los propios nodos Markdown instanciados en `knowledge-base/`.

El documento de trabajo es efímero (vive en el directorio de artefactos de la sesión). Los nodos son permanentes.

#### 7.7.1. Estructurar Kratos

**Archivo:** `.agents/workflows/estructurar-kratos.md`

**Trigger:** El humano aporta información factual cruda (texto legal, PDF, imagen, URL, decisión verbal, regla de negocio).

**Fases:**
1. **Clasificación:** Identificar el tipo de hecho (`norma_legal`, `decision_del_humano`, `regla_de_negocio`, `requisito_tecnico`, `factor_externo`).
2. **Evaluación MECE:** ¿Existe un nodo Kratos que cubra este hecho? → Append. ¿Es distinguible? → Nuevo nodo. ¿Descompone un nodo padre? → Nodo hijo.
3. **Instanciación:** Copiar plantilla `.agents/templates/kratos-nodo.md`. Llenar campos con la información aportada. Vincular evidencia. No interpretar alcance ni implicaciones.
4. **Gate:** ¿`que_dice` refleja fielmente la información aportada? ¿Evidencia vinculada? ¿Tipo correcto? ¿Nomenclatura legible?

#### 7.7.2. Desplegar Khaos

**Archivo:** `.agents/workflows/desplegar-khaos.md`

**Trigger:** El humano describe una responsabilidad del MVP (funcionalidad, módulo, capacidad, actor, flujo).

**Fases:**
1. **Extracción:** Identificar la responsabilidad descrita en la conversación.
2. **Evaluación MECE:** ¿Existe un nodo Khaos que cubra esta responsabilidad? → Append. ¿Es distinguible? → Nuevo nodo. ¿Subdivide una existente? → Nodo hijo + actualizar padre.
3. **Instanciación:** Copiar plantilla `.agents/templates/khaos-nodo.md`. Llenar solo campos con información explícita del humano. Columnas de compromisos presentes; filas vacías si no se proporcionó información.
4. **Filtro USER-DECISIONS:** ¿Algún campo toca un tema aplazado? → Dejarlo vacío sin escalar.
5. **Gate:** ¿El nodo refleja exclusivamente lo que el humano dijo? ¿Hay contenido especulativo? → Eliminar.

#### 7.7.3. Auditar Vacíos

**Archivo:** `.agents/workflows/auditar-vacios.md`

**Trigger:** El humano solicita auditoría, o Antigravity detecta masa crítica de nodos sin auditar.

**Fases:**
1. **Recorrido:** Traversar todos los nodos Khaos. Listar campos vacíos por nodo.
2. **Filtro de aplazamientos:** Leer USER-DECISIONS. Eliminar del listado vacíos cubiertos por aplazamientos vigentes.
3. **Búsqueda en Kratos:** Para cada vacío restante, aplicar protocolo de resolución (§7.5.3): información precisa → rellenar; parcial → rellenar + señalar; contradicción → auditoría profunda; sin información → informar al humano.
4. **Verificación CE:** Para cada nodo padre, verificar que la suma de hijos cubra su responsabilidad. Señalar fallas de exhaustividad colectiva.
5. **Reporte:** Tabla de vacíos con estado (resuelto / parcial / contradicción / sin información / aplazado).
6. **Gate:** ¿Se propuso registro en USER-DECISIONS para decisiones que surgieron? ¿Se respetaron todos los aplazamientos?

#### 7.7.4. Ciclo de Planificación

Los tres workflows operan en un ciclo continuo:

```
Sesión → REPOMAP → USER-DECISIONS → Conversación
                                         │
                    ┌────────────────────┬┴┬─────────────────────┐
                    ▼                    ▼                       ▼
            ¿Hecho factual?    ¿Responsabilidad MVP?    ¿Decisión/Preferencia?
                    │                    │                       │
          estructurar-kratos    desplegar-khaos         USER-DECISIONS
                    │                    │                       │
                    └────────────────────┴───────────────────────┘
                                         │
                              ┌──── Periódicamente ────┐
                              ▼                        │
                       auditar-vacios                   │
                              │                        │
                    Revela lagunas → Preguntas al humano ┘

    Condición de salida: todos los nodos Khaos nivel 1 en estado `validado`
                         + auditoría CE sin fallas
```
