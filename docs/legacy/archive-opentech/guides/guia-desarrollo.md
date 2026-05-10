# Guía de Desarrollo

## 🚀 Primeros Pasos

### Requisitos Previos

| Requisito      | Versión Mínima | Recomendado | Propósito             |
| -------------- | -------------- | ----------- | --------------------- |
| **Node.js**    | 18.17+         | 20.x LTS    | Runtime de JavaScript |
| **npm**        | 9.0+           | 10.x        | Gestor de paquetes    |
| **PostgreSQL** | 14+            | 15.x        | Base de datos         |
| **Git**        | 2.30+          | 2.40+       | Control de versiones  |

#### Verificación de Instalación

```bash
# Verificar versiones instaladas
node --version    # Debe ser 18.17+ o 20.x
npm --version     # Debe ser 9.0+ o 10.x
psql --version    # Debe ser 14+ o 15.x
git --version     # Debe ser 2.30+
```

### Clonar el Repositorio

```bash
git clone https://github.com/tu-org/traza-ambiental.com.git
cd traza-ambiental.com
```

### Instalación de Dependencias

```bash
npm install
```

### Configuración del Entorno de Desarrollo

#### 1. Variables de Entorno (.env.local)

El proyecto incluye un archivo `.env.example` como template. Copiarlo y configurarlo:

```bash
cp .env.example .env.local
```

**Contenido mínimo requerido para desarrollo:**

```env
# 🗄️ Base de Datos (PostgreSQL)
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/traza_ambiental_dev"

# 🔐 Autenticación (NextAuth.js v5)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="desarrollo-secreto-temporal-generar-nuevo-para-produccion"

# 🌍 Entorno de Aplicación
NODE_ENV="development"
NEXT_PUBLIC_APP_ENV="development"

# 📧 Email (desarrollo - usar Ethereal o similar)
EMAIL_FROM="noreply@trazambiental.dev"
EMAIL_SERVER_HOST="smtp.ethereal.email"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu-usuario-ethereal"
EMAIL_SERVER_PASSWORD="tu-password-ethereal"

# ☁️ AWS S3 (opcional para desarrollo local)
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_S3_BUCKET_NAME="traza-ambiental-dev"
AWS_REGION="us-east-1"
```

#### 2. Generación de Secretos Seguros

```bash
# Generar NEXTAUTH_SECRET seguro
openssl rand -base64 32

# O usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 3. Configuración por Entorno

| Variable       | Desarrollo        | Staging            | Producción          |
| -------------- | ----------------- | ------------------ | ------------------- |
| `DATABASE_URL` | Local PostgreSQL  | RDS Staging        | RDS Producción      |
| `NEXTAUTH_URL` | localhost:3000    | staging.domain.com | domain.com          |
| `EMAIL_*`      | Ethereal/Mailtrap | SendGrid Staging   | SendGrid Producción |
| `AWS_*`        | LocalStack        | S3 Staging         | S3 Producción       |

### Configuración de Base de Datos

#### Paso 1: Instalar PostgreSQL (si no está instalado)

**En macOS con Homebrew:**

```bash
brew install postgresql
brew services start postgresql
```

**En Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**En Windows:**

**Opción 1: Instalador oficial**

1. Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Ejecutar el instalador y seguir las instrucciones
3. Recordar la contraseña del usuario `postgres` durante la instalación

**Opción 2: Chocolatey (recomendado para desarrolladores)**

```powershell
# Instalar Chocolatey si no está instalado
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar PostgreSQL
choco install postgresql

# Iniciar servicio
net start postgresql-x64-14
```

**Opción 3: WSL2 (Windows Subsystem for Linux)**

```bash
# En WSL2 Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

#### Paso 2: Configurar PostgreSQL

##### Para macOS y Linux:

1. **Crear usuario y base de datos:**

```bash
# Conectar como superusuario
sudo -u postgres psql

# Crear usuario (si no existe)
CREATE USER postgres WITH PASSWORD 'password';

# Crear base de datos
CREATE DATABASE traza_ambiental_dev OWNER postgres;

# Salir
\q
```

2. **Verificar conexión:**

```bash
psql -h localhost -U postgres -d traza_ambiental_dev
```

##### Para Windows:

1. **Usando pgAdmin (interfaz gráfica):**
   - Abrir pgAdmin (instalado con PostgreSQL)
   - Conectar al servidor local
   - Click derecho en "Databases" → "Create" → "Database"
   - Nombre: `traza_ambiental_dev`
   - Owner: `postgres`

2. **Usando línea de comandos:**

```cmd
# Abrir Command Prompt como administrador
# Navegar al directorio de PostgreSQL
cd "C:\Program Files\PostgreSQL\14\bin"

# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE traza_ambiental_dev;

# Salir
\q
```

3. **Verificar conexión:**

```cmd
psql -h localhost -U postgres -d traza_ambiental_dev
```

4. **Configurar variables de entorno en Windows:**
   - Abrir "Variables de entorno del sistema"
   - Agregar `C:\Program Files\PostgreSQL\14\bin` al PATH
   - Reiniciar Command Prompt

#### Paso 3: Configurar Prisma

1. **El esquema ya está configurado** para PostgreSQL en `prisma/schema.prisma`

2. **Ejecutar migraciones:**

```bash
npx prisma migrate dev
```

3. **Generar cliente de Prisma:**

```bash
npx prisma generate
```

4. **Ejecutar seeder:**

```bash
npx prisma db seed
```

Este comando creará:

- 8 roles del sistema
- 1 usuario de prueba por cada rol
- Credenciales mostradas en consola

#### Paso 4: Verificar configuración

```bash
# Abrir Prisma Studio para ver los datos
npx prisma studio
```

La interfaz estará disponible en `http://localhost:5555`

#### Migración de SQLite a PostgreSQL

Si el proyecto estaba configurado previamente con SQLite y necesitas migrar a PostgreSQL:

1. **Actualizar esquema de Prisma:**
   - El archivo `prisma/schema.prisma` ya está configurado con `provider = "postgresql"`
   - Las variables de entorno en `.env` ya están configuradas para PostgreSQL

2. **Eliminar archivos de SQLite (opcional):**

   ```bash
   # Si existía una base de datos SQLite previa
   rm prisma/dev.db
   ```

3. **Ejecutar migraciones desde cero:**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   ```

4. **Verificar migración:**
   ```bash
   npx prisma studio
   ```

### Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 🏗️ Estructura del Proyecto

```
traza-ambiental.com/
├── prisma/
│   ├── schema.prisma       # Modelo de datos
│   ├── seed.ts            # Datos iniciales
│   └── migrations/        # Migraciones de BD
│
├── src/
│   ├── app/               # App Router de Next.js
│   │   ├── (auth)/       # Rutas de autenticación
│   │   ├── api/          # API Routes
│   │   ├── dashboard/    # Dashboards por rol
│   │   ├── layout.tsx    # Layout principal
│   │   └── page.tsx      # Página de inicio
│   │
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes UI base
│   │   ├── auth/        # Componentes de auth
│   │   ├── dashboard/   # Componentes de dashboard
│   │   └── forms/       # Formularios
│   │
│   ├── lib/             # Utilidades y configuración
│   │   ├── auth.ts      # Config NextAuth
│   │   ├── auth-helpers.ts
│   │   ├── prisma.ts    # Cliente Prisma
│   │   └── utils.ts     # Utilidades
│   │
│   ├── types/           # Tipos TypeScript
│   │   └── next-auth.d.ts
│   │
│   └── middleware.ts    # Middleware de rutas
│
├── docs/                # Documentación
├── public/              # Assets estáticos
└── [archivos de config]
```

---

## 🔧 Tecnologías Utilizadas

### Frontend

- **Next.js 14+** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Backend

- **Next.js API Routes** - Endpoints REST
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **NextAuth.js** - Autenticación
- **bcryptjs** - Hash de contraseñas

---

## 📝 Convenciones de Código

### Nomenclatura

#### Archivos y Carpetas

- **Componentes React:** PascalCase - `UserProfile.tsx`
- **Utilidades:** camelCase - `authHelpers.ts`
- **API Routes:** kebab-case - `route.ts` en carpetas descriptivas
- **Carpetas:** kebab-case - `user-management/`

#### Variables y Funciones

```typescript
// Variables: camelCase
const userName = "Juan";
const isActive = true;

// Funciones: camelCase
function getUserById(id: string) {}

// Constantes: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5242880;

// Tipos e Interfaces: PascalCase
interface UserProfile {}
type RoleName = "Administrador" | "Generador";

// Componentes: PascalCase
export function UserDashboard() {}
```

### Estructura de Componentes

```typescript
// 1. Imports
import { useState } from "react"
import { useSession } from "next-auth/react"

// 2. Tipos
interface Props {
  userId: string
  onUpdate?: () => void
}

// 3. Componente
export function UserProfile({ userId, onUpdate }: Props) {
  // 3.1. Hooks
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  // 3.2. Funciones auxiliares
  const handleSave = async () => {
    // ...
  }

  // 3.3. Efectos
  useEffect(() => {
    // ...
  }, [userId])

  // 3.4. Early returns
  if (!session) return <div>No autorizado</div>

  // 3.5. Render
  return (
    <div>
      {/* contenido */}
    </div>
  )
}
```

### API Routes

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    // 1. Autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Autorización (verificar roles si es necesario)
    if (!hasRole(session.user, "Administrador")) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // 3. Lógica de negocio
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // 4. Respuesta
    return NextResponse.json({ users });
  } catch (error) {
    // 5. Manejo de errores
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
```

---

## 🗃️ Trabajar con Prisma

### Comandos Útiles

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name descripcion_cambio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (GUI para ver datos)
npx prisma studio

# Resetear base de datos (⚠️ borra todos los datos)
npx prisma migrate reset

# Formatear schema.prisma
npx prisma format
```

### Crear un Nuevo Modelo

1. Editar `prisma/schema.prisma`:

```prisma
model Neumatico {
  id          String   @id @default(cuid())
  codigo      String   @unique
  marca       String
  modelo      String
  tipo        String
  peso        Float
  generadorId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  generador   User     @relation(fields: [generadorId], references: [id])

  @@map("neumaticos")
}
```

2. Añadir relación en modelo `User`:

```prisma
model User {
  // ... campos existentes
  neumaticos Neumatico[]
}
```

3. Crear migración:

```bash
npx prisma migrate dev --name add_neumaticos_model
```

4. El cliente Prisma se regenera automáticamente

### Queries Comunes

```typescript
// Crear
const user = await prisma.user.create({
  data: {
    email: "usuario@example.com",
    name: "Usuario",
    password: hashedPassword,
  },
});

// Leer uno
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Leer muchos con filtros
const users = await prisma.user.findMany({
  where: {
    active: true,
    email: {
      contains: "trazambiental",
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 10,
});

// Actualizar
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: "Nuevo Nombre" },
});

// Eliminar
await prisma.user.delete({
  where: { id: userId },
});

// Con relaciones
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    userRoles: {
      include: {
        role: true,
      },
    },
  },
});
```

---

## 🔐 Autenticación y Autorización

### Proteger una Página

```typescript
// src/app/dashboard/admin/page.tsx
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hasRole } from "@/lib/auth-helpers"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (!hasRole(session.user, "Administrador")) {
    redirect("/dashboard")
  }

  return <div>Contenido de administrador</div>
}
```

### Proteger un API Route

```typescript
// src/app/api/admin/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasRole } from "@/lib/auth-helpers";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!hasRole(session.user, "Administrador")) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  // Lógica...
}
```

### Usar Sesión en Cliente

```typescript
"use client"

import { useSession } from "next-auth/react"

export function UserInfo() {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Cargando...</div>

  if (status === "unauthenticated") return <div>No autenticado</div>

  return (
    <div>
      <p>Bienvenido, {session?.user?.name}</p>
      <p>Roles: {session?.user?.roles?.join(", ")}</p>
    </div>
  )
}
```

---

## 🎨 Estilos con Tailwind CSS

### Clases Comunes

```tsx
// Botones
<button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
  Guardar
</button>

// Tarjetas
<div className="bg-white shadow rounded-lg p-6">
  {/* contenido */}
</div>

// Formularios
<input
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
  type="text"
/>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* items */}
</div>
```

### Tema Personalizado

Editar `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          // ... otros tonos
          600: "#16a34a",
        },
      },
    },
  },
};
```

---

## 🧪 Testing

### Configuración (Pendiente)

```bash
# Instalar dependencias de testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Ejemplo de Test Unitario

```typescript
// src/lib/__tests__/auth-helpers.test.ts
import { describe, it, expect } from "vitest";
import { hasRole } from "../auth-helpers";

describe("hasRole", () => {
  it("debe retornar true si el usuario tiene el rol", () => {
    const user = {
      roles: ["Administrador", "Operador"],
    };

    expect(hasRole(user, "Administrador")).toBe(true);
  });

  it("debe retornar false si el usuario no tiene el rol", () => {
    const user = {
      roles: ["Operador"],
    };

    expect(hasRole(user, "Administrador")).toBe(false);
  });
});
```

---

## 🐛 Debugging

### Logs en Servidor

```typescript
// Logs básicos
console.log("Info:", data);
console.error("Error:", error);

// Logs estructurados
console.log({
  action: "user_login",
  userId: user.id,
  timestamp: new Date().toISOString(),
});
```

### Debugging en VS Code

Crear `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### Prisma Studio

```bash
npx prisma studio
```

Abre interfaz gráfica en `http://localhost:5555` para explorar datos.

---

## 📦 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio:**
   - Ir a vercel.com
   - Import Git Repository
   - Seleccionar el repo

2. **Configurar variables de entorno:**
   - Añadir todas las variables de `.env`
   - Especialmente `DATABASE_URL` de producción

3. **Configurar base de datos:**
   - Provisionar PostgreSQL (Vercel Postgres o externo)
   - Ejecutar migraciones:

   ```bash
   npx prisma migrate deploy
   ```

4. **Deploy:**
   - Push a `main` branch
   - Vercel automáticamente despliega

### Docker (Alternativo)

Crear `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Crear `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/traza
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=traza
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Ejecutar:

```bash
docker-compose up -d
```

---

## 🔄 Flujo de Trabajo Git

### Branches

```
main (producción)
  ├── develop (desarrollo)
  │   ├── feature/nueva-funcionalidad
  │   ├── fix/corregir-bug
  │   └── refactor/mejorar-codigo
```

### Workflow

1. **Crear feature branch:**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/dashboard-generador
```

2. **Hacer cambios y commits:**

```bash
git add .
git commit -m "feat: agregar dashboard de generador"
```

3. **Push y crear PR:**

```bash
git push origin feature/dashboard-generador
```

Luego crear Pull Request en GitHub.

### Mensajes de Commit

Seguir convención [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, sin cambios de código
refactor: refactorización
test: añadir tests
chore: tareas de mantenimiento
```

Ejemplos:

```bash
git commit -m "feat: agregar módulo de transportistas"
git commit -m "fix: corregir validación de formulario de login"
git commit -m "docs: actualizar README con instrucciones de instalación"
```

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tutoriales Recomendados

- [Next.js Learn](https://nextjs.org/learn)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [NextAuth.js Tutorial](https://next-auth.js.org/getting-started/introduction)

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear feature branch
3. Hacer cambios y tests
4. Crear Pull Request
5. Esperar revisión

### Checklist antes de PR

- [ ] Código sigue las convenciones
- [ ] Tests pasan
- [ ] No hay errores de linting
- [ ] Documentación actualizada
- [ ] Commit messages claros

---

## 🏆 Mejores Prácticas de Desarrollo

### 📋 Estándares de Código

#### TypeScript - Patrones Recomendados

```typescript
// ✅ Correcto: Interfaces descriptivas y tipos específicos
interface SolicitudREP {
  id: string;
  folio: string;
  estado: 'draft' | 'approved' | 'in_transit' | 'completed';
  tipoNeumatico: TipoNeumatico;
  cantidadUnidades: number;
  pesoEstimadoKg: number;
  generador: UsuarioEmpresa;
  transportista?: UsuarioEmpresa;
  createdAt: Date;
  updatedAt: Date;
}

// ❌ Incorrecto: Tipos vagos o any
const solicitud: any = await api.getSolicitud(id);
const processData = (input: any): any => { ... };
```

#### Nombres de Variables y Funciones

```typescript
// ✅ Correcto: Nombres descriptivos en español/inglés técnico
const calcularTotalPesoValorizado = (certificados: Certificado[]): number => {
  return certificados.reduce((total, cert) => total + cert.pesoValorizado, 0);
};

const validarPermisosUsuario = (usuario: Usuario, accion: Accion): boolean => {
  return usuario.roles.some(rol =>
    rol.permisos.includes(accion)
  );
};

// ❌ Incorrecto: Abreviaturas confusas
const calcTotW = (c: Certificado[]): number => { ... };
const chkPerm = (u: Usuario, a: Accion): boolean => { ... };
```

### 🔄 Control de Versiones Git

#### Flujo de Trabajo Profesional

```bash
# Actualizar rama principal
git checkout main && git pull origin main

# Crear rama descriptiva basada en HU
git checkout -b feature/HU-025-mejora-certificado-pdf

# Commits frecuentes y descriptivos
git add .
git commit -m "feat: enhance PDF certificate generation

- Add high-quality PDF rendering with Puppeteer
- Include QR code for verification
- Add digital signature support
- Improve responsive design for mobile printing"

# Push y crear PR
git push origin feature/HU-025-mejora-certificado-pdf
```

#### Estructura de Commits (Conventional Commits)

```
feat: nueva funcionalidad visible al usuario
fix: corrección de bug en producción
docs: actualización de documentación
style: cambios de formato (eslint, prettier)
refactor: reestructuración de código sin cambiar funcionalidad
test: agregar o modificar tests
chore: cambios de build, dependencias, herramientas
```

### 🧪 Testing Strategy

#### Cobertura por Tipo de Test

- **Unit Tests**: >80% - Componentes, utilidades, validaciones
- **Integration Tests**: APIs críticas - Base de datos, servicios externos
- **E2E Tests**: Flujos críticos - Login → Solicitud → Certificado

#### Ejemplo de Test Completo

```typescript
// __tests__/api/solicitudes.test.ts
import { createMocks } from "node-mocks-http";
import { POST } from "@/app/api/solicitudes/route";
import { prisma } from "@/lib/prisma";

describe("/api/solicitudes", () => {
  beforeEach(async () => {
    await prisma.solicitud.deleteMany();
  });

  it("should create solicitud with valid data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        tipoNeumatico: "neumatico_vehiculo_liviano",
        cantidadUnidades: 100,
        pesoEstimadoKg: 2500,
        direccionRetiro: {
          calle: "Av. Industrial 123",
          regionId: 13,
          comunaId: 101,
        },
      },
    });

    await POST(req, res);

    expect(res._getStatusCode()).toBe(201);
    const response = JSON.parse(res._getData());
    expect(response.solicitud).toHaveProperty("folio");
    expect(response.solicitud.folio).toMatch(/^SOL-/);
  });

  it("should reject invalid data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        tipoNeumatico: "",
        cantidadUnidades: -5,
      },
    });

    await POST(req, res);

    expect(res._getStatusCode()).toBe(400);
    const response = JSON.parse(res._getData());
    expect(response.errors).toContain("Tipo de neumático es requerido");
  });
});
```

### 🚀 Optimizaciones de Performance

#### Frontend - Técnicas Avanzadas

```typescript
// Lazy loading inteligente
const CertificadosDashboard = lazy(() =>
  import('@/components/dashboard/CertificadosDashboard')
);

// Virtualización para listas grandes
import { FixedSizeList as List } from 'react-window';

const CertificadosList = ({ certificados }: { certificados: Certificado[] }) => (
  <List
    height={400}
    itemCount={certificados.length}
    itemSize={60}
    itemData={certificados}
  >
    {CertificadoRow}
  </List>
);

// Query optimization con React Query
const useCertificadosDashboard = () => {
  return useQuery({
    queryKey: ['certificados', 'dashboard'],
    queryFn: fetchCertificadosDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};
```

#### Backend - Optimizaciones de Base de Datos

```typescript
// Índices estratégicos en schema.prisma
model Solicitud {
  id             String   @id @default(cuid())
  folio          String   @unique
  estado         String
  tipoNeumatico  String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  generadorId    String?
  transportistaId String?

  // Índices para búsquedas comunes
  @@index([estado, createdAt])
  @@index([generadorId, estado])
  @@index([transportistaId, createdAt])
  @@index([tipoNeumatico, estado])
}

// Queries optimizadas
export const getSolicitudesDashboard = async (
  userId: string,
  filters: DashboardFilters
) => {
  const where = buildWhereClause(userId, filters);

  return await prisma.solicitud.findMany({
    where,
    select: {
      id: true,
      folio: true,
      estado: true,
      tipoNeumatico: true,
      cantidadUnidades: true,
      createdAt: true,
      // Solo campos necesarios para dashboard
    },
    orderBy: { createdAt: 'desc' },
    take: 50, // Paginación eficiente
  });
};
```

### 🔒 Seguridad en Desarrollo

#### Validación Robusta

```typescript
// Schema de validación completo
import { z } from "zod";

const direccionSchema = z.object({
  calle: z
    .string()
    .min(5, "Dirección muy corta")
    .max(200, "Dirección muy larga")
    .regex(/^[a-zA-Z0-9\s.,#-]+$/, "Caracteres inválidos"),
  regionId: z.number().min(1, "Región inválida").max(16, "Región inválida"),
  comunaId: z.number().min(1, "Comuna inválida"),
});

const solicitudSchema = z.object({
  tipoNeumatico: z.enum([
    "neumatico_vehiculo_liviano",
    "neumatico_vehiculo_pesado",
    "neumatico_camion_transporte",
  ]),
  cantidadUnidades: z
    .number()
    .min(1, "Debe ser al menos 1 unidad")
    .max(10000, "Máximo 10.000 unidades"),
  pesoEstimadoKg: z.number().min(1, "Peso inválido").max(50000, "Peso excede límite"),
  direccionRetiro: direccionSchema,
  fechaPreferenteRetiro: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Fecha debe ser futura",
  }),
});
```

#### Rate Limiting Implementation

```typescript
// middleware.ts
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por windowMs
  message: {
    error: "Demasiadas solicitudes desde esta IP",
    retryAfter: 900, // segundos
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 📊 Monitoreo y Observabilidad

#### Logging Estructurado

```typescript
// lib/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "traza-ambiental" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Uso en APIs
export const createSolicitud = async (data: CreateSolicitudData) => {
  logger.info("Creando solicitud", {
    userId: data.userId,
    tipoNeumatico: data.tipoNeumatico,
    cantidadUnidades: data.cantidadUnidades,
  });

  try {
    const solicitud = await prisma.solicitud.create({
      data: {
        ...data,
        folio: generateFolio("SOL"),
      },
    });

    logger.info("Solicitud creada exitosamente", {
      solicitudId: solicitud.id,
      folio: solicitud.folio,
    });

    return solicitud;
  } catch (error) {
    logger.error("Error creando solicitud", {
      error: error.message,
      userId: data.userId,
      data,
    });
    throw handleDatabaseError(error);
  }
};
```

### 🔧 Code Quality Tools

#### ESLint + Prettier Configuration

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended", "prettier"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### Husky para Pre-commit Hooks

```bash
# Instalar Husky
npm install --save-dev husky

# Configurar hooks
npx husky install
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-commit "npm run test:unit"
```

---

**Última actualización:** 20 de noviembre de 2025
**Versión:** 1.0.0
**Estado:** ✅ Guía completa actualizada
