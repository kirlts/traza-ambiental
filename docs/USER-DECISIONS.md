# USER-DECISIONS

Este archivo registra todas las decisiones que el usuario haya tomado o las correcciones que haya hecho durante el desarrollo del proyecto, asegurando la trazabilidad de las decisiones de diseño, arquitectura y requerimientos.

## Plantilla de Decisión

## [ADR-001] Arquitectura Documental Bimodal (Post-OpenTech)

- **Contexto:** Auditoría y Consolidación masiva de la Documentación OpenTech.
- **Decisión:** Implementar una arquitectura documental bifurcada: 4 documentos monolíticos limpios para la capa activa y resguardar el historial completo del legacy en una capa pasiva (`docs/archive-opentech`). Purgar documentos "fantasma" que describen características no implementadas.
- **Alternativas Descartadas:** Mantener la estructura original (demasiado ruidosa) o borrar todo el legacy (pérdida de contexto legal/RETC).
- **Consecuencias:** Mayor velocidad de onboarding y eliminación de errores técnicos por asunciones falsas. Dependencia de la IA para mantener la coherencia entre capas.
- **Condiciones de Reversión:** Si la Ley REP cambia drásticamente y los manuales activos quedan obsoletos sin tiempo para su actualización inmediata.

---

## [ADR-002] Purga Técnica y Sellado de Tipos

- **Contexto:** Auditoría y purga técnica del Root (Nivel 2) y entorno Next.js.
- **Decisión:** Eliminar residuales (Vite, SQLite legacy) y forzar la severidad de TypeScript/ESLint en `next.config.ts`. Congelar temporalmente los tests legacy.
- **Alternativas Descartadas:** Mantener el modo laxo para acelerar el desarrollo inmediato (acumula deuda técnica invisible).
- **Consecuencias:** El build de CI/CD fallará ante cualquier error de tipos. Detección temprana de bugs estructurales.
- **Condiciones de Reversión:** Solo si un bloqueo técnico crítico en producción requiere un hotfix inmediato que el linter impide desplegar (temporal).

---

## [ADR-003] Soberanía Operativa: Docker-Only y Middleware Opt-Out

- **Contexto:** Auditoría de Código Exhaustiva Kairós y Diseño de Infraestructura base.
- **Decisión:**
  1. Estándar Docker-Only para toda dependencia.
  2. Middleware "Opt-Out" (denegar por defecto) para rutas API.
  3. Diferir refactorizaciones N+1 de Prisma para priorizar `AuditLog`.
- **Alternativas Descartadas:** Instalaciones locales manuales (caos de versiones). Middleware "Opt-In" (riesgo de seguridad por omisión).
- **Consecuencias:** Entorno de desarrollo reproducible 100%. Seguridad perimetral robusta. Aceptación temporal de deuda técnica controlada.
- **Condiciones de Reversión:** Migración a un PaaS que prohíba Docker (poco probable) o requerimientos de latencia extrema que obliguen a abandonar el middleware de Next.

---

## [ADR-005] Redención de Deuda y Purgado Documental

- **Contexto:** Finalización de la EPIC-005 (Sanación del Core 2026).
- **Decisión:** Se eliminó físicamente el archivo `docs/DEUDA-TECNICA.md` tras resolver los 3 puntos críticos de deuda (tipado estricto en frontend, contratos de API y optimización N+1). Aceptar `any` residuales en áreas no críticas (logs, crons) para evitar sobre-ingeniería.
- **Alternativas Descartadas:** Mantener el archivo de deuda abierto para ítems menores (genera ruido cognitivo). Erradicar el 100% de los `any` (costo/beneficio desequilibrado en esta fase).
- **Consecuencias:** Documentación alineada con la realidad material del código. "Build Verde" certificado.
- **Condiciones de Reversión:** Si la acumulación de `any` en áreas secundarias empieza a degradar la mantenibilidad del sistema.

---

## [ADR-006] Sanación Integral de Tipos y Bypass de Linter

- **Contexto:** Detección de errores circulares en ESLint 9 y uso extensivo de `any` en contratos de API y Sesiones.
- **Decisión:**
  1. Extender `next-auth.d.ts` para cubrir `role`, `roles` y `rut` nativamente, eliminando la necesidad de casteos manuales.
  2. Implementar configuración de ESLint v9 mediante bypass directo a reglas críticas para romper recursión en NextAuth v5 / Next 16.
  3. Forzar tipado en API Routes mediante `Prisma.WhereInput`.
- **Alternativas Descartadas:** Mantener los `@ts-ignore` (degrada la calidad del sistema de tipos). Intentar arreglar `FlatCompat` (bloqueo externo de la librería).
- **Consecuencias:** Eliminación de ruido en logs de compilación. Autocompletado robusto en el frontend. Linter operativo para reglas críticas de React Hooks.
- **Condiciones de Reversión:** Si Next.js publica una guía oficial de soporte nativo para ESLint 9 que resuelva el error circular de forma transparente.

---

## [ADR-007] Purificación de Arquitectura UI (React 19)

- **Contexto:** Detección de ~2000 advertencias de ESLint relacionadas con la pureza y el orden de hooks heredados.
- **Decisión:**
  1. Erradicar el uso de `useEffect` para sincronización de estados editables.
  2. Adoptar el patrón de componente interno con `key` para reinicio de formularios.
  3. Forzar determinismo en la generación de coordenadas y timestamps durante el render.
- **Alternativas Descartadas:** Silenciar las advertencias del linter (mantiene la fragilidad estructural). Intentar refactorizar con `useEffect` complejos (aumenta la deuda cognitiva).
- **Consecuencias:** Estabilidad absoluta de la UI. Cumplimiento total del estándar ESLint 2026. Mejora del rendimiento al reducir renders redundantes.
- **Condiciones de Reversión:** Incompatible con arquitecturas legacy que no soporten la destrucción/re-creación rápida de componentes (no aplicable en React 19).

---

## [ADR-008] Certificación de Integridad de Diamante (Cierre de Deuda)

- **Contexto:** Última iteración de saneamiento técnico (/fix) tras Fase 11.
- **Decisión:** Elevar el rigor de ESLint (`any`, `unused-vars`) a nivel de `error` de forma permanente y purgar el 100% de los residuos (logs, `any`, `TODOs`). Marcar la EPIC-005 como COMPLETADA.
- **Alternativas Descartadas:** Mantener los residuos menores para agilizar (contradice el Norte Estético de Kairós).
- **Consecuencias:** Repositorio 100% limpio y validado por `tsc`. Blindaje total contra la entropía técnica.
- **Condiciones de Reversión:** Ninguna. Este es el estándar base innegociable.

---

## [ADR-009] Aislamiento Criptográfico de la Capa Pasiva y Purga Efímera

- **Contexto:** Iniciación del seguimiento de versiones (Git) y consolidación post-Fase de Sanación Integral.
- **Decisión:** 
  1. Integrar el directorio `docs/archive-opentech/` al `.gitignore` y desenlazarlo del árbol de validación de Git.
  2. Borrar permanente y sistemáticamente todos los reportes sueltos, historiales y scripts de automatización temporal (`*.txt`, `*_errors.json`, `fix-*`), reduciendo la entropía a nivel de entorno base.
- **Alternativas Descartadas:** Borrar completamente el archivo `archive-opentech` (rechazado por pérdida de memoria institucional original de OpenTech), o subirlo al repo (genera enorme ruido en commits y code reviews).
- **Consecuencias:** Se establece una base de código "verde" impoluta. La historia legal/administrativa del backend reside en las computadoras locales sin ensuciar la cadena de ramas y _Code Review_ de otros desarrolladores.
- **Condiciones de Reversión:** Si en el futuro surge la necesidad de auditar públicamente los documentos legacy a través de GitHub/GitLab, se debe re-indexar la carpeta.

---

## [ADR-010] Motor de Renderizado DOM Pixel-Perfect para Infografías Cliente

- **Contexto:** Constante truncamiento de texto y fallos de Bounding-Box en herramientas de diagramado declarativo como D2 y Mermaid, inaceptable para entregables a Stakeholders no técnicos.
- **Decisión:** 
  1. Abandonar frameworks declarativos ligeros para entregables UI/UX.
  2. Implementar motor basado en DOM real (`render_diagrams.js`) que renderiza HTML + TailwindCSS y toma capturas de pantalla exactas utilizando Puppeteer.
- **Alternativas Descartadas:** Seguir iterando scripts automatizados de post-procesamiento para D2; tolerar entregables con texto ininteligible; pagar licencias restrictivas de software propietario de diagramación.
- **Consecuencias:** Creación de imágenes PNG con fidelidad absoluta al esquema original de interfaz gráfica, garantizando cero recortes de texto. Documentabilidad procedural estricta en el nuevo pipeline.
- **Condiciones de Reversión:** Si surge un motor declarativo open-source que solucione radicalmente el truncamiento de texto complejo en nodos estáticos.
