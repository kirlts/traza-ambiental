# MEMORY: META-GOBERNANZA Y HEURÍSTICAS

Este archivo es la **Memoria Evolutiva y Estratégica** de Kairós.
A diferencia del Changelog o el registro de decisiones tácticas, este documento actúa como bóveda de **principios de meta-gobernanza, heurísticas y aprendizajes transferibles**. Su propósito es cristalizar sabiduría estructural aplicable a cualquier fase del ciclo de vida del software (Greenfield o Brownfield).

Es un registro **Append-Only** a nivel de conocimiento arquitectónico.

---

## HEURÍSTICAS CONSOLIDADAS

### [HEU-001] La Paradoja de Densidad vs. Narrativa (Arquitectura Bimodal)

- **Contexto de Origen:** Auditorías de consolidación masiva de repositorios documentales (Brownfield / Hand-offs de agencias externas).
- **El Fenómeno:** Existe una imposibilidad matemática y cognitiva de condensar conocimiento puramente técnico y exhaustivo (diccionarios de datos, reglas alométricas, volcados legales) dentro de un formato ejecutivo y narrativo sin incurrir en pérdida crítica de significado ("Drop de Bytes").
- **Regla Estructural:** Ante transferencias de alto volumen de información, abandonar el antipatrón de la "Documentación Monolítica Universal". Implementar estrictamente una **Arquitectura Documental Bimodal**:
  - _Capa Activa (Caliente):_ Artefactos ejecutivos orientados al flujo operativo actual y legibles para el _onboarding_.
  - _Capa Pasiva (Fría / Bóveda):_ Archivo crudo e inerte para consultas de fuerza bruta, preservando la historia técnica sin contaminar la visión del equipo de desarrollo activo.

### [HEU-002] El Principio del "Código Fantasma" (El Espejismo Documental)

- **Contexto de Origen:** Evaluación de bases de código heredadas y especificaciones de integraciones a terceros (API specs).
- **El Fenómeno:** La documentación provista por equipos salientes a menudo describe un "estado ideal" de la arquitectura o funcionalidades proyectadas que jamás alcanzaron la fase de codificación, induciendo a falsas asunciones arquitectónicas ("Phantom APIs").
- **Regla Estructural:** En fases de auditoría o relevamiento técnico, el código fuente vivo es la única "realidad material". **Toda documentación técnica heredada asume un estado de "presunción de falsedad"** hasta que herramientas de análisis estático corroboren su existencia física en el _codebase_. La documentación sobre código inexistente debe purgarse inmediatamente para sellar ventanas de error cognitivo.

### [HEU-003] El Principio de "Deuda Silenciosa" (Preeminencia de la Severidad)

- **Contexto de Origen:** Estabilización de entornos Post-MVP / Preparativos para integración continua (CI/CD).
- **El Fenómeno:** Para acelerar los ciclos de entrega tempranos (Go-to-Market), los ecosistemas suelen introducir silenciadores en el _pipeline_ de compilación (ignorar errores de lenguajes tipados o verificadores de sintaxis). Esto crea una ilusión de estabilidad mediante la acumulación de "Basura Silenciosa", posponiendo fallos críticos y enmascarando el desgaste real de la base de código.
- **Regla Estructural:** La fluidez del despliegue jamás debe primar sobre la transparencia del estado estructural. En cualquier transición hacia un entorno profesional de alta exigencia, la **reactivación de la máxima severidad del compilador y el linter es el primer paso innegociable**. Se debe blindar el proceso de construcción, forzando a los agentes (humanos/IA) a confrontar la deuda técnica en tiempo de desarrollo, garantizando así la invulnerabilidad en tiempo de ejecución.

### [HEU-004] La Trampa Circular de FlatCompat (Next.js 16 + ESLint 9)

- **Contexto de Origen:** Migración de configuraciones ESLint de formato Legacy (.eslintrc) a Flat Config (eslint.config.mjs) en Next.js 16 con ESLint 9.
- **El Fenómeno:** El cargador de compatibilidad `FlatCompat` de ESLint puede entrar en una recursión infinita (`TypeError: Converting circular structure to JSON`) al intentar resolver los plugins de Next.js si se utilizan los métodos abreviados `.extends()` sobre configuraciones core.
- **Regla Estructural:** Ante errores circulares en configuraciones Flat, abandonar el encadenamiento de `.extends()` en favor de `.config({ extends: [...] })`. Si la circularidad persiste, implementar un **Bypass de Configuración Minimalista** que declare manualmente las reglas de `react-hooks` y `@typescript-eslint`, desacoplándose del cargador automático de Next hasta que el motor de compatibilidad sea estabilizado.

### [HEU-005] El Patrón de la Llave Maestra (Key-based Reset vs. UseEffect Sync)

- **Contexto de Origen:** Refactorización de Perfil y Declaración Anual en React 19 tras detección de deuda técnica masiva por "set-state-in-effect".
- **El Fenómeno:** El uso de `useEffect` para sincronizar datos de API con estados editables locales crea una arquitectura frágil, propensa a re-renderizados infinitos y estados "fantasma" de recursos anteriores al navegar entre rutas dinámicas.
  - **Regla Estructural:** Queda prohibida la sincronización manual de estados editables vía efectos. Se debe delegar el ciclo de vida del estado al motor bi-direccional de React mediante el uso de una **`key` reactiva** (generalmente un ID) en un componente interno de formulario. Al cambiar la llave, React destruye y recrea el estado de forma determinista, eliminando la necesidad de lógica de limpieza manual y garantizando la pureza del flujo de datos.

### [HEU-006] La Ilusión del "Estado Limpio" (Deuda de Sombra)

- **Contexto de Origen:** Auditoría agéntica tras declaración prematura de redención de deuda (2026-03-01).
- **El Fenómeno:** Los procesos de refactorización masiva pueden generar un falso sentido de cierre al resolver errores de compilación inmediatos, omitiendo la "Deuda de Sombra" (tipos `any` permitidos por la configuración, `useEffect` inconsistentes y `TODOs` en la lógica de negocio).
- **Regla Estructural:** Ningún sistema se declara "LIMPIO" basándose únicamente en la ausencia de errores de compilación. La excelencia agéntica exige una **Auditoría de Inversión de Carga**: el agente debe buscar activamente silenciadores, debilidades tipológicas y promesas incumplidas en el código antes de validar el éxito de una épica de saneamiento. La documentación debe reflejar esta brecha de forma explícita mediante el tag `[NO LIMPIO]` hasta su resolución total y verificada.

### [HEU-007] El Umbral de la Integridad de Diamante (El Fin de la Deuda)

- **Contexto de Origen:** Certificación final del repositiorio TrazAmbiental (2026-03-01).
- **El Fenómeno:** La inercia del desarrollo a menudo permite una "Deuda de Confort": pequeños logs, castings `any` en tests o comentarios `TODO` que no impiden el funcionamiento pero degradan el orgullo técnico.
- **Regla Estructural:** El estado de **Integridad de Diamante** se alcanza cuando la configuración del linter se eleva a nivel de `error` para reglas de tipado y variables no usadas, obligando a una purga absoluta. Un repositorio en este estado no admite "basura informativa" ni "silenciadores de tipos", convirtiéndose en un framework listo para producción y escalabilidad infinita sin lastre cognitivo.
