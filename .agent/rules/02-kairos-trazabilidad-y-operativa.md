---
trigger: always_on
---

# Trazabilidad y operativa

Estas directivas son de cumplimiento obligatorio y anulan cualquier instrucción contraria. El incumplimiento de estos protocolos se considera un fallo de integridad del sistema.

## 0. Checklist de Integridad KAIRÓS

Cualquier bloque de ejecución que requiera modificar código o arquitectura DEBE iniciar con una sección titulada `## Checklist de Integridad Kairós` en el `implementation_plan.md`. Estas tareas deben sincronizarse obligatoriamente en el `task.md` de Antigravity.

## 1. El Sistema Documental MaC (Trazabilidad Estratégica)

Cada sesión Kairós debe consultar este tridente documental para garantizar Coherencia Vertical. Queda prohibida la retención de estado mental dinámico fuera de ellos.

1. **`MASTER-SPEC.md` (La Estrategia):** Define la Identidad (¿quiénes somos?), Dirección (¿a dónde vamos?) y **Capacidad** (¿con qué contamos?). Aquí viven todas las restricciones inviolables e inmutables del proyecto.
2. **`TODO.md` (Las Tareas):** El backlog táctico. Toda entrada aquí debe haber pasado por los procesos de **Dimensionar** (cabe en la Capacidad) y **Descomponer** (es accionable). Nunca inicies una tarea sin que exista previamente en este archivo.
3. **`CHANGELOG.md` (Los Resultados):** El registro cronológico de los ciclos ejecutados. Sirve como insumo para identificar **"Sorpresas"** (desviaciones entre lo planeado y lo ejecutado) durante el Ritual de Cierre (`/document`).

### Repositorios de Aprendizaje (Cadencia de Cierre)

4. **`USER-DECISIONS.md` (Decisiones):** Documenta los cambios de rumbo, ADRs formales y resoluciones tácticas frente a sorpresas operativas.
5. **`MEMORY.md` (Políticas):** El extracto de las directrices que gobiernan tu comportamiento iterativo, consolidando decisiones repetidas en guías a futuro.

### F. PAUSA ESTRATÉGICA

**Pausa Estratégica:** Antes de iniciar ejecuciones terminales complejas (configuración de infraestructura, instalaciones pesadas), DEBES asentar tu intención y el plan detallado en los archivos `/docs`. La CELERIDAD NO es justificación para la OMISIÓN DOCUMENTAL.

1. **Hermetismo Contextual del Framework:** Si detectas que el directorio de trabajo es el repositorio raíz de Kairós (Framework):
   - **Blindar Directorio /docs:** Los archivos dentro de `/docs/` se consideran plantillas maestras y no deben ser modificados con información específica de la sesión actual (logs de sesión, PDKs efímeros, etc.).
   - **Derivación de Registros:** Toda documentación efímera debe direccionarse a áreas volátiles o ignoradas por git (ej. `.agent/scratch/`).
   - **Mantenimiento de Pureza:** Garantiza que el framework permanezca listo para commit/distribución en todo momento.

### G. DEUDA-TECNICA.md (Opcional/Temporal)

Función: Registra la deuda técnica, refactorizaciones pendientes y áreas de mejora identificadas por `/fix` o auditorías manuales.
Regla de Autoliquidación: El archivo `DEUDA-TECNICA.md` no es una pieza permanente del eje documental. Una vez que el 100% de las tareas están completadas (`[x]`) y su resolución está respaldada por entradas en `CHANGELOG.md` o actualizaciones en `MASTER-SPEC.md`, el sistema DEBE eliminar el archivo proactivamente para mantener la pureza del repositorio.

### H. RIGOR OPERATIVO DE WORKFLOWS

**Mandato de Coreografía:** El comando `/kairos` y la ejecución de tareas complejas deben percibirse como el disparador de una coreografía de workflows autónomos.

1. **Inclusión en check-list:** La IA debe incluir obligatoriamente en su `task.md` la invocación proactiva de los workflows pertinentes al contexto (`/document`, `/test`, `/audit`, etc.) como subtareas explícitas.
2. **Cierre de Ciclo:** Ninguna tarea se considera "finalizada" hasta que el workflow de sincronización documental (`/document`) haya sido ejecutado íntegramente para asegurar que el código y los documentos rectores sean un solo cuerpo de verdad.
