# TrazAmbiental - Sistema de Trazabilidad REP

Plataforma oficial para la gestión integral y trazabilidad de Neumáticos Fuera de Uso (NFU) bajo la Ley REP de Chile.

Este proyecto ha sido estabilizado y refactorizado a fondo (Next.js App Router, React 19) para garantizar **Cero Errores Typings y Linter (0 explicit-any)**, favoreciendo un mantenimiento seguro y determinismo absoluto en sus flujos.

---

## 📁 Arquitectura Documental (El "Qué" y el "Cómo")

Para facilitar tu incorporación y ahorrarte horas adivinando las reglas, la documentación viva del proyecto se encuentra centralizada en la carpeta `/docs`.

- **`docs/MASTER-SPEC.md`**: Fuente de verdad absoluta. Contiene la especificación técnica, arquitectura, modelos de datos consolidados y lineamientos base.
- **`docs/02-REGLAS-DE-NEGOCIO-Y-FLUJOS.md`**: Flujos operativos obligatorios (Generadores -> Transportistas -> Gestores).
- **`docs/03-ROLES-Y-PERMISOS.md`**: El modelo unificado del RBAC (Permisos de cada actor).
- **`docs/TODO.md`**: El roadmap activo del proyecto. Revisa aquí las épicas en progreso.
- **`docs/MEMORY.md`**: Repositorio de heurísticas transferibles y lecciones aprendidas. Consultar siempre antes de tomar decisiones de arquitectura general.

_(Nota: Toda la documentación extensa heredada de la agencia anterior está alojada en `docs/archive-opentech/` sólo como bóveda de consulta)._

---

## 🚀 Despliegue Local (Docker Recomendado)

Toda la aplicación ya está contenedorizada y lista para correr en desarrollo. Se prefiere el flujo por contenedores.

### 1. Variables de Entorno

```bash
cp .env.example .env
```

_(Los parámetros por defecto del `.env.example` son suficientes para que PostgreSQL local y NextAuth levanten sin fricciones)._

### 2. Iniciar el Entorno

Levantar la base de datos, aplicar migraciones de Prisma, correr el seeder y levantar el frontend:

```bash
docker compose up --build -d
```

Frontend: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Comandos Útiles de Supervivencia

Si necesitas interactuar directamente con la aplicación fuera de Docker, utiliza Node >= 20 y pnpm/npm.

**Base de datos (Prisma):**

```bash
# Limpiar BD y resetear
npx prisma migrate reset
# Generar el cliente de Prisma tras cambiar el schema
npx prisma generate
# Limpiar y correr semillas sólidas de prueba
npx tsx prisma/clean-and-seed-solicitudes.ts
```

**Verificación y Calidad de Código:**

```bash
# Correr el verificador de TypeScript (Cero tolerancia a 'any' implícito)
npx tsc --noEmit

# Correr el Linter estricto
npx eslint "src/**/*.{ts,tsx}" --quiet
```

> ⚠️ **Atención Desarrolladores**: El uso de `eslint-disable-next-line @typescript-eslint/no-explicit-any` o de la palabra clave `any` está **estrictamente prohibido**. Para objetos dinámicos de API, el repositorio prefiere tipos estructurales rigurosos, tipos base dinámicos como `ReturnType<typeof JSON.parse>`, o cast específicos tras validación.

---

## 🤖 Operativa Kairós (Agentes)

Este proyecto está gobernado por directrices de desarrollo agéntico asistido (Kairós).
Cualquier cambio de arquitectura, o refactor significativo **DEBE** sincronizarse con la documentación usando flujos automatizados de agentes (`/document`). No subas PRs con un estado documental desincronizado del código real.
