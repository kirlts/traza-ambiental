# USER-DECISIONS: Memoria Operativa del Humano

> Registro de soberanía del humano sobre el sistema. Antigravity DEBE leer este documento
> al inicio de toda sesión y consultarlo antes de escalar vacíos al humano.
>
> Este documento registra: decisiones tomadas, decisiones aplazadas, y preferencias operativas.
> Es la memoria que sobrevive entre sesiones caóticas, paralelas y sin cierre formal.

| Símbolo | Significado |
|---|---|
| 💡 | Decisión activa |
| ⏸️ | Decisión aplazada |
| ⚙️ | Preferencia operativa |

> **Nota arquitectónica:** Las decisiones fundacionales sobre la estructura de Kratos/Khaos y la gobernanza de Antigravity (UD-001 a UD-008, UD-010 y UD-011) han sido consolidadas en `docs/MASTER-SPEC.md` y `.agents/rules/` para aligerar esta memoria. Solo se conservan aquí las decisiones operativas, estratégicas y aplazadas sobre el MVP en curso.

---

## [UD-009] 💡 La planificación del MVP arranca por el eje Khaos

**Fecha:** 2026-05-10
**Contexto:** Discusión sobre por dónde comenzar: ¿estructurar Kratos primero (el dump crudo) o desplegar Khaos primero (las responsabilidades del MVP)?
**Decisión:** Comenzar por Khaos. El humano define las responsabilidades del MVP en conversación. Los vacíos de Khaos revelarán qué hechos de Kratos son necesarios, lo cual guiará la estructuración selectiva del dump crudo en vez de procesarlo completo sin saber qué es relevante.
**Condiciones de reversión:** Si el humano necesita una visión completa de Kratos antes de diseñar Khaos.

---

## [UD-012] ⏸️ Deseables del MVP no son obligatorios

**Fecha:** 2026-05-10
**Contexto:** El humano declaró en el dump de la cartulina que existen funcionalidades deseables pero no obligatorias para el MVP.
**Decisión aplazada:** Las siguientes funcionalidades son deseables, no comprometidas:
- Integraciones API con MMA o Aduanas
- Capas de personalización por cliente (monetización vía cargos extra)
- Soporte a sistemas de gestión REP para encontrar residuos huérfanos
**Condiciones de reapertura:** Cuando el MVP comprometido esté planificado y se evalúe la extensión del alcance.

---

## [UD-013] ⏸️ KPIs específicos aún no definidos

**Fecha:** 2026-05-10
**Contexto:** El humano declaró que el sistema ofrecerá KPIs ambientales, de eficiencia interna y de operaciones, pero los KPIs específicos no están definidos.
**Decisión aplazada:** La definición de los KPIs concretos y sus mecanismos de oferta queda pendiente.
**Condiciones de reapertura:** Cuando el humano aporte la lista de KPIs específicos o cuando se estructure en Kratos la normativa que los determina.

---

## [UD-014] ⏸️ Diferenciadores adicionales para Cat B (y A) pendientes

**Fecha:** 2026-05-10
**Contexto:** El humano declaró que se necesitan elementos diferenciadores adicionales para fortalecer la propuesta de valor del MVP NFU, especialmente para Cat B.
**Decisión aplazada:** La identificación y definición de diferenciadores adicionales queda como espacio en blanco declarado.
**Condiciones de reapertura:** Cuando el humano defina los diferenciadores o cuando el análisis competitivo los revele.

---

## [UD-015] 💡 Estrategia de población de Kratos: una sesión por informe de deep research

**Fecha:** 2026-05-10
**Contexto:** Kratos está vacío. Existen 9 informes de deep research en `info/` que contienen material crudo sobre el dominio legal y operativo.
**Decisión:** Poblar Kratos secuencialmente, una sesión de chat por cada informe de deep research. Cada sesión lee un informe, lo estructura en nodos Kratos atómicos, y al finalizar se cruza contra Khaos para identificar:
- Información que subsana brechas existentes (celdas de Sustento vacías)
- Inexactitudes en Khaos que requieran corrección
- Información que gatille nuevos nodos o descomposiciones
**Consecuencias:**
- El proceso requiere ~9 sesiones (una por informe) + sesiones de cruce.
- Kratos se construye con trazabilidad directa a las fuentes de investigación.
**Condiciones de reversión:** Si algún informe resulta irrelevante para el MVP, se omite esa sesión.

---

## [UD-016] 💡 Jerarquización Factual en Kratos

**Fecha:** 2026-05-10
**Contexto:** El usuario notó que los nodos de Kratos se estaban instanciando de forma completamente plana y aislada, perdiendo el contexto normativo de sus cuerpos legales e instituciones emisoras.
**Decisión:** Kratos debe anidarse orgánicamente mediante jerarquía padre/hijo. Los hechos no flotan de forma aislada; deben vincularse a su cuerpo normativo (ej. Ley), que a su vez se vincula a su institución emisora (ej. Ministerio). El campo `depende_de` apuntará al padre, y `se_descompone_en` listará a los hijos. Esta jerarquía facilita la legibilidad humana y asegura coherencia topológica.
**Condiciones de reversión:** Ninguna previsible. La topología es estricta.

---

## [UD-017] 💡 Base de Licitud y Firmas Biométricas (Ley 21.719)

**Fecha:** 2026-05-11
**Contexto:** Informe de deep research sobre la Ley de Protección de Datos (21.719). Se evaluó cómo justificar el tratamiento de datos de representantes legales en plataformas B2B de trazabilidad ambiental.
**Decisión:** 
1. **Base de Licitud:** Se utilizará exclusivamente la "Obligación Legal" (Art. 13 letra b) derivada de la Ley REP 20.920, descartando el uso de "Consentimiento" (que es revocable y pone en riesgo la inmutabilidad de la cadena de custodia ambiental). Ante solicitudes de supresión de datos, se aplicará un "Bloqueo" técnico para retener historial ambiental, no una eliminación física.
2. **Firmas Biométricas:** Se restringe el uso de firmas biométricas en el MVP, optando por firmas electrónicas criptográficas estándar, para evitar el tratamiento de "Datos Sensibles" (Art. 16 ter) que gatillarían requisitos prohibitivos (ej. EIPD obligatorias, o necesidad ineludible de consentimiento explícito).
**Condiciones de reversión:** Si la autoridad ambiental (SMA) impone normativamente el uso de validación biométrica en el futuro.

---

## [UD-018] 💡 Narrativas relacionales obligatorias en toda la KB

**Fecha:** 2026-05-11
**Contexto:** Al auditar la KB se detectó que el 100% de los conceptos carecen de justificaciones narrativas sobre sus relaciones. Los wikilinks en frontmatter proveen la topología mecánica, pero no explican *por qué* un concepto se deriva de otro, *cómo* se descompone, ni *por qué* tiene su estado actual. Esto hace que la KB sea opaca tanto para humanos no técnicos como para LLMs que necesitan razonar sobre la arquitectura del dominio. El lenguaje de las narrativas debe evitar terminología técnica de grafos ("nodo", "padre", "hijo", "hoja") y usar en su lugar lenguaje natural del dominio ("concepto", "se deriva de", "se descompone en", "concepto de primer nivel").
**Decisión:** Todo concepto de la KB (Kratos y Khaos) debe contener obligatoriamente cuatro narrativas en prosa, integradas en el body:
1. **Justificación de dependencia vertical (§ Por qué existe):** Párrafo explicando de dónde se deriva este concepto y por qué es relevante.
2. **Lógica de descomposición:** Párrafo explicando el criterio MECE por el cual se subdivide en los elementos listados en `se_descompone_en` (solo si se descompone).
3. **Descripción de relaciones horizontales:** Párrafo por cada elemento en `se_relaciona_con`, explicando la naturaleza y dirección de la conexión.
4. **Justificación de estado:** Párrafo explicando por qué tiene su `estado` actual y qué falta para avanzar al siguiente.
Las plantillas en `.agents/templates/` y las especificaciones en MASTER-SPEC §7.5 y §7.6 deben reflejar estas secciones obligatorias.
**Condiciones de reversión:** Ninguna previsible. La transparencia relacional es un requisito arquitectónico permanente.

---

## [UD-019] ⏳ Enlace de evidencia pendiente en todos los conceptos norma_legal

**Fecha:** 2026-05-11
**Contexto:** Tras la remediación UD-018, los 88 conceptos de Kratos tienen narrativas completas, pero ningún concepto de tipo `norma_legal` tiene el campo `Evidencia` poblado con URLs oficiales. Todos fueron reseteados a `borrador` / `por_verificar` precisamente porque no se ha contrastado su contenido contra los textos legales originales.
**Decisión aplazada:** Antes de promover cualquier concepto `norma_legal` a `verificado`, se debe ejecutar una fase de enlace profundo (deep linking) donde cada concepto se contrasta contra su fuente primaria (BCN, Diario Oficial, sitios del MMA, SMA, SII, Aduanas) y se popula el campo `Evidencia` con la URL oficial.
**Condiciones de activación:** Cuando el usuario decida iniciar la fase de verificación documental.

---

## [UD-020] ⏳ Evaluación de conceptos candidatos a fusión o eliminación

**Fecha:** 2026-05-11
**Contexto:** Durante la remediación UD-018 se identificaron conceptos con definiciones mínimas que podrían no aportar valor independiente al modelado del MVP: `Almacenamiento`, `Recolección`, y `Consumidor`. Sus justificaciones de estado documentan explícitamente su candidatura a fusión.
**Decisión aplazada:** Se debe evaluar si estos conceptos se fusionan con sus conceptos relacionados (ej. `Almacenamiento` → `Instalación de Recepción y Almacenamiento`, `Consumidor` → `Generador`) o se eliminan por irrelevancia para el scope NFU.
**Condiciones de activación:** Cuando el usuario lo considere oportuno, idealmente antes de la fase de verificación documental (UD-019).

---

## [UD-021] ⏳ Promoción individual de conceptos a verificado

**Fecha:** 2026-05-11
**Contexto:** Con la regla de factualidad establecida en esta sesión, ningún concepto `norma_legal` puede estar en `verificado` sin evidencia enlazada. La promoción debe ser individual, concepto por concepto, tras contrastar contra la fuente primaria.
**Decisión aplazada:** La promoción de `borrador` a `verificado` se ejecutará individualmente tras completar UD-019 (enlace de evidencia). No se harán promociones masivas sin contraste documental.
**Condiciones de activación:** Posterior a UD-019.

---

## [UD-022] ⏸️ Chatbot Conversacional de IA diferido para v1.1 o posterior

**Fecha:** 2026-05-11
**Contexto:** Revisión pragmática del MVP contra la fecha límite de lanzamiento de Agosto de 2026. Se determinó que el Chatbot RAG introduce un Scope Creep peligroso debido a la complejidad técnica (mitigación de alucinaciones legales).
**Decisión aplazada:** Excluir el Chatbot conversacional del MVP inicial.
**Condiciones de reapertura:** Tras el lanzamiento y estabilización del MVP transaccional core.

---

## [UD-024] 💡 Identidad Legal asume Buena Fe (Términos y Condiciones)

**Fecha:** 2026-05-11
**Contexto:** Se consultó si el middleware tiene responsabilidad legal de validar el poder de representación de un usuario.
**Decisión:** No es responsabilidad del software. Bastará con un check de "Acepto Términos y Condiciones".
**Condiciones de reversión:** Exigencia legal explícita.

---

## [UD-025] 💡 Trazambiental es un Generador de Insumos, no un Transmisor

**Fecha:** 2026-05-11
**Contexto:** Riesgo de colapso de SINADER (uptime) en fechas de declaración.
**Decisión:** El software funciona como un generador de insumos (archivos descargables listos para subir). No se intentarán reconexiones asíncronas con el Estado porque no existen APIs. Trazambiental se exime totalmente de responsabilidad por caídas de las plataformas externas.
**Condiciones de reversión:** El Estado habilita APIs públicas que requieran transmisión síncrona.

---

## [UD-026] 💡 Monitoreo Manual de SLAs de SINADER

**Fecha:** 2026-05-11
**Contexto:** El Estado cambia los formatos Excel sin avisar mediante SLAs formales.
**Decisión:** El Administrador de Trazambiental será el responsable operativo de monitorear manualmente los canales del Estado y actualizar los formatos de generación en el sistema.
**Condiciones de reversión:** El MMA implementa un feed de notificaciones para desarrolladores.
