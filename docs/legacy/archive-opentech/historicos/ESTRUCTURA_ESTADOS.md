# 📊 Estructura de Estados - Historias de Usuario

> **Implementado:** 29 de octubre de 2025  
> **Sistema:** Gestión de Historias de Usuario con 3 Estados

---

## 🎯 Resumen

Se ha implementado una **estructura de 3 estados** para las Historias de Usuario, permitiendo un mejor seguimiento del flujo de trabajo y mayor visibilidad del progreso del proyecto.

---

## 📂 Estructura de Carpetas

```
docs/historias-usuario/
│
├── 📋 pendientes/              (10 HUs)
│   ├── HU-003B-crear-solicitud-retiro.md
│   ├── HU-004-seguimiento-solicitudes-retiro.md
│   ├── HU-006-gestion-solicitudes-transportista.md
│   └── ... (7 más)
│
├── 🚧 en-progreso/             (0 HUs)
│   └── README.md               ← Guía completa del flujo
│
├── ✅ completadas/             (6 HUs)
│   ├── HU-001-sistema-autenticacion.md
│   ├── HU-002-dashboard-admin.md
│   ├── HU-003-registro-generador.md
│   └── ... (3 más)
│
├── 📊 STATUS.md                ← Fuente de verdad del proyecto
├── 📋 TEMPLATE.md              ← Plantilla actualizada con flujo
├── 📖 README.md                ← Guía general actualizada
└── 📊 ESTRUCTURA_ESTADOS.md    ← Este archivo
```

---

## 🔄 Ciclo de Vida de una Historia

### Diagrama de Flujo

```
┌─────────────┐
│  📋 Nueva   │
│  Historia   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  📋 PENDIENTE   │  ← Se crea en /pendientes/
│  (Backlog)      │
└────────┬────────┘
         │
         │ Desarrollador la asigna
         │ y comienza a trabajar
         ▼
┌─────────────────┐
│ 🚧 EN PROGRESO  │  ← Se mueve a /en-progreso/
│ (Desarrollo)    │  ← Límite WIP: 2 simultáneas
└────────┬────────┘
         │
         │ Se completan todos
         │ los criterios de aceptación
         ▼
┌─────────────────┐
│ ✅ COMPLETADA   │  ← Se mueve a /completadas/
│ (Done)          │
└─────────────────┘
```

### Estados Adicionales

```
🚫 BLOQUEADA
   └─> Situación temporal cuando hay impedimentos
   └─> Se documenta en STATUS.md
   └─> Puede volver a Pendiente o En Progreso
```

---

## 📝 Metadata de Estados

Cada archivo `.md` de HU tiene metadata YAML en el encabezado:

### Estado: Pendiente

```yaml
---
id: HU-003B
titulo: Crear Solicitud de Retiro de NFU
estado: pendiente # ← Estado actual
prioridad: critica
sprint: 3
estimacion: 6h
fecha-inicio: null # ← Aún no se inicia
fecha-fin: null
desarrollador: null # ← Sin asignar
dependencias: [HU-003]
bloqueadores: []
---
```

### Estado: En Progreso

```yaml
---
id: HU-003B
titulo: Crear Solicitud de Retiro de NFU
estado: en-progreso # ← Cambió a en-progreso
prioridad: critica
sprint: 3
estimacion: 6h
fecha-inicio: 2025-10-30 # ← Fecha cuando se inició
fecha-fin: null
desarrollador: Juan Pérez # ← Desarrollador asignado
dependencias: [HU-003]
bloqueadores: []
---
```

### Estado: Completada

```yaml
---
id: HU-003B
titulo: Crear Solicitud de Retiro de NFU
estado: completada # ← Cambió a completada
prioridad: critica
sprint: 3
estimacion: 6h
fecha-inicio: 2025-10-30
fecha-fin: 2025-10-30 # ← Fecha de completitud
desarrollador: Juan Pérez
dependencias: [HU-003]
bloqueadores: []
---
```

---

## 🎮 Flujo de Trabajo

### 1. Iniciar una Historia (Pendiente → En Progreso)

**¿Cuándo?**

- Un desarrollador la asigna y comienza a trabajar
- Se ha revisado que las dependencias estén cumplidas
- Hay slot disponible en el límite WIP

**Pasos:**

```bash
# 1. Editar el archivo y actualizar metadata
# En el archivo: pendientes/HU-003B-crear-solicitud-retiro.md
# Cambiar:
#   estado: en-progreso
#   fecha-inicio: 2025-10-30
#   desarrollador: Juan Pérez

# 2. Mover el archivo
git mv docs/historias-usuario/pendientes/HU-003B-crear-solicitud-retiro.md \
       docs/historias-usuario/en-progreso/HU-003B-crear-solicitud-retiro.md

# 3. Actualizar STATUS.md
# - Mover HU de sección "Pendientes" a "En Progreso"
# - Actualizar contadores

# 4. Hacer commit
git add .
git commit -m "feat(HU-003B): Inicia desarrollo - Movida a en-progreso"

# 5. Notificar al equipo (opcional pero recomendado)
```

### 2. Completar una Historia (En Progreso → Completada)

**¿Cuándo?**

- ✅ Todos los criterios de aceptación cumplidos
- ✅ Tests pasando (unitarios, integración, E2E)
- ✅ Code review aprobado
- ✅ Funcionalidad probada manualmente
- ✅ Documentación actualizada
- ✅ Sin errores de linter/TypeScript

**Pasos:**

```bash
# 1. Editar el archivo y actualizar metadata
# En el archivo: en-progreso/HU-003B-crear-solicitud-retiro.md
# Cambiar:
#   estado: completada
#   fecha-fin: 2025-10-30

# 2. Actualizar el Changelog en la HU
# Agregar entrada con fecha y resumen de lo completado

# 3. Mover el archivo
git mv docs/historias-usuario/en-progreso/HU-003B-crear-solicitud-retiro.md \
       docs/historias-usuario/completadas/HU-003B-crear-solicitud-retiro.md

# 4. Actualizar STATUS.md
# - Mover HU de sección "En Progreso" a "Completadas"
# - Actualizar contadores y porcentajes
# - Actualizar gráfico de avance

# 5. Hacer commit
git add .
git commit -m "feat(HU-003B): Completa implementación - Movida a completadas

- Todos los criterios de aceptación cumplidos (59/59)
- Tests pasando (77 tests)
- Documentación actualizada
- Funcionalidad probada y aprobada"

# 6. Notificar al Product Owner
```

---

## 🚨 Límite WIP (Work In Progress)

### Regla Principal

**Máximo 2 HUs en progreso simultáneas**

### ¿Por qué?

| ✅ Beneficios           | ❌ Sin límite WIP   |
| ----------------------- | ------------------- |
| Mayor enfoque           | Fragmentación       |
| Completitud más rápida  | Context switching   |
| Mejor calidad de código | Acumulación de WIP  |
| Code reviews eficientes | Bloqueos frecuentes |
| Menos bugs              | Menor velocidad     |

### Excepciones

- **Equipos grandes** (>5 devs): Hasta 3 HUs simultáneas
- **HUs bloqueadas**: Mantienen slot mientras se desbloquean (pero se documenta)
- **HUs de documentación**: No cuentan para el límite si son complementarias

---

## 📊 Visualización en STATUS.md

El archivo `STATUS.md` es la **fuente de verdad** del proyecto:

```markdown
## Resumen General

| Estado         | Cantidad | Porcentaje |
| -------------- | -------- | ---------- |
| ✅ Completadas | 6        | 37.5%      |
| 🚧 En Progreso | 0        | 0%         |
| 📋 Pendientes  | 10       | 62.5%      |
| 🚫 Bloqueadas  | 0        | 0%         |
| **TOTAL**      | **16**   | **100%**   |

## 🚧 En Progreso (0)

_No hay HDU en desarrollo actualmente_

**Límite WIP recomendado:** 2 HUs simultáneas  
**Ubicación:** `docs/historias-usuario/en-progreso/`  
**Guía completa:** Ver [en-progreso/README.md](./en-progreso/README.md)
```

---

## 📚 Documentación de Apoyo

| Archivo                 | Propósito                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| `en-progreso/README.md` | **Guía completa** del flujo de trabajo, checklists, mejores prácticas  |
| `STATUS.md`             | **Dashboard del proyecto** con métricas, roadmap, dependencias         |
| `TEMPLATE.md`           | **Plantilla** para crear nuevas HUs (incluye sección de ciclo de vida) |
| `README.md`             | **Guía general** de uso de las HUs                                     |
| `ESTRUCTURA_ESTADOS.md` | **Este archivo** - Explicación de la estructura de estados             |

---

## 🎯 Checklist Rápido

### Al Iniciar una HU

- [ ] Leí la HU completa y entiendo todos los CAC
- [ ] Revisé las dependencias técnicas
- [ ] Actualicé metadata (`estado`, `fecha-inicio`, `desarrollador`)
- [ ] Moví archivo a `en-progreso/`
- [ ] Actualicé `STATUS.md`
- [ ] Hice commit con mensaje descriptivo
- [ ] Notifiqué al equipo

### Al Completar una HU

- [ ] ✅ Todos los CAC cumplidos
- [ ] ✅ Tests pasando
- [ ] ✅ Code review aprobado
- [ ] ✅ Funcionalidad probada manualmente
- [ ] ✅ Sin errores de linter/TS
- [ ] ✅ Documentación actualizada
- [ ] Actualicé metadata (`estado`, `fecha-fin`)
- [ ] Actualicé Changelog en la HU
- [ ] Moví archivo a `completadas/`
- [ ] Actualicé `STATUS.md`
- [ ] Hice commit descriptivo
- [ ] Notifiqué al Product Owner

---

## 🔍 Comandos Útiles

### Ver estado actual de las carpetas

```bash
# Contar HUs por estado
ls docs/historias-usuario/pendientes/ | wc -l
ls docs/historias-usuario/en-progreso/ | wc -l
ls docs/historias-usuario/completadas/ | wc -l

# Ver cuáles están en progreso
ls -la docs/historias-usuario/en-progreso/
```

### Buscar una HU específica

```bash
# Buscar por ID
find docs/historias-usuario/ -name "HU-003B*"

# Buscar por palabra clave en el título
grep -r "Solicitud de Retiro" docs/historias-usuario/*/HU-*.md
```

### Ver historial de movimientos de una HU

```bash
# Ver todos los commits donde se movió esta HU
git log --follow --oneline -- docs/historias-usuario/*/HU-003B-*.md
```

---

## 💡 Mejores Prácticas

### DO ✅

1. **Actualiza metadata antes de mover** el archivo
2. **Actualiza STATUS.md** cada vez que muevas una HU
3. **Commits descriptivos** que expliquen el cambio de estado
4. **Comunica al equipo** cuando inicies o completes una HU
5. **Respeta el límite WIP** de 2 HUs simultáneas
6. **Documenta bloqueadores** si una HU se atasca

### DON'T ❌

1. ❌ No muevas archivos sin actualizar metadata
2. ❌ No olvides actualizar STATUS.md
3. ❌ No excedas el límite WIP sin justificación
4. ❌ No marques como completada sin cumplir todos los CAC
5. ❌ No dejes HUs en progreso abandonadas (>1 semana sin cambios)
6. ❌ No edites HUs completadas (excepto su Changelog)

---

## 📊 Métricas de Éxito

### Lead Time

**Tiempo promedio desde que una HU entra a "En Progreso" hasta "Completada"**

- 🎯 **Objetivo:** < 3 días para HUs críticas/altas
- 📊 **Actual:** Por medir (primera implementación)

### Cycle Time

**Tiempo total desde "Pendiente" hasta "Completada"**

- 🎯 **Objetivo:** < 5 días para HUs críticas/altas
- 📊 **Actual:** Por medir

### Throughput

**Número de HUs completadas por sprint**

- 🎯 **Objetivo:** Aumentar progresivamente manteniendo calidad
- 📊 **Sprint 1:** 5 HUs
- 📊 **Sprint 2:** 1 HU
- 📊 **Sprint 3:** Por definir

---

## 🎉 Beneficios Implementados

### Para el Equipo

1. ✅ **Visibilidad clara** de qué se está trabajando ahora
2. ✅ **Prevención de duplicación** de esfuerzos
3. ✅ **Mejor gestión del flujo** (Kanban-style)
4. ✅ **Auditoría mediante Git** (historial de movimientos)
5. ✅ **Límite WIP** para mayor enfoque

### Para el Proyecto

1. ✅ **Transparencia** del progreso en tiempo real
2. ✅ **Métricas claras** (Lead Time, Cycle Time, Throughput)
3. ✅ **Mejor estimación** basada en datos históricos
4. ✅ **Identificación temprana** de bloqueos
5. ✅ **Documentación viva** que refleja el estado real

---

## 🚀 Próximos Pasos Recomendados

### A Corto Plazo

- [ ] Entrenar al equipo en el nuevo flujo
- [ ] Comenzar a usar con HU-003B (siguiente HU crítica)
- [ ] Medir métricas del primer sprint con la nueva estructura

### A Mediano Plazo

- [ ] Implementar automatización (scripts para mover HUs)
- [ ] Integrar con tablero Kanban visual (GitHub Projects, Trello, etc.)
- [ ] Crear dashboard de métricas automático

### A Largo Plazo

- [ ] Análisis de tendencias de Lead Time por tipo de HU
- [ ] Optimización del límite WIP basado en datos reales
- [ ] Integración con CI/CD para validación automática de CACs

---

**Implementado por:** Equipo de Desarrollo  
**Fecha:** 29 de octubre de 2025  
**Versión:** 1.0  
**Siguiente revisión:** Sprint 4

---

📝 **Notas:** Esta estructura está alineada con metodologías Agile/Kanban y es compatible con herramientas estándar de gestión de proyectos. Puede evolucionar según las necesidades del equipo.
