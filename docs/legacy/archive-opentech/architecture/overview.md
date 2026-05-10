# 🏗️ Arquitectura General - Sistema REP Chile

## 📋 Visión General

El **Sistema REP Chile** sigue una arquitectura **full-stack moderna** basada en Next.js 15, implementando el patrón **App Router** con separación clara entre cliente y servidor.

## 🏛️ Arquitectura de Alto Nivel

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Database      │
│   (React)       │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Componentes   │    │ - REST APIs     │    │ - Prisma ORM    │
│ - Páginas       │    │ - Autenticación │    │ - Migraciones   │
│ - Hooks         │    │ - Validación    │    │ - Seeds         │
│ - Context       │    │ - Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               │
                 ┌─────────────────┐
                 │   Service       │
                 │   Workers       │
                 │ - Push Notif.   │
                 │ - Background Sync│
                 │ - Cache          │
                 └─────────────────┘
```

## 🗂️ Estructura de Directorios

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas del dashboard
│   ├── login/            # Página de login
│   └── layout.tsx        # Layout principal
├── components/            # Componentes React reutilizables
│   ├── dashboard/        # Componentes del dashboard
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes base (shadcn/ui)
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
│   ├── helpers/          # Funciones auxiliares
│   ├── prisma.ts         # Configuración de Prisma
│   └── auth.ts           # Configuración de NextAuth
├── providers/            # Context providers
├── types/                # TypeScript type definitions
└── __tests__/           # Tests automatizados

public/                   # Assets estáticos
├── images/              # Imágenes y mapas
├── sw.js               # Service Worker
└── manifest.json       # PWA Manifest

docs/                    # Documentación
prisma/                  # Schema de base de datos
scripts/                 # Scripts de utilidad
```

## 🔄 Flujo de Datos

### 1. Autenticación

```
Usuario → NextAuth.js → Prisma → PostgreSQL
    ↓
JWT Token → HttpOnly Cookie → API Routes
```

### 2. Dashboard

```
Usuario → Componente → API Route → Prisma → PostgreSQL
    ↓                                       ↓
React State ← Suspense ← Streaming ← Resultados
```

### 3. Notificaciones Push

```
Evento → API Route → web-push → Service Worker → Usuario
Sistema   (Server)    (Library)    (Browser)    (Navegador)
```

## 🎯 Principios Arquitectónicos

### 1. **Server-Side Rendering (SSR)**

- Páginas críticas renderizadas en servidor
- Mejor SEO y performance inicial
- Hydration automática en cliente

### 2. **API Routes**

- Endpoints RESTful
- Validación con Zod
- Manejo de errores consistente
- Rate limiting

### 3. **Componentes Reutilizables**

- Patrón de composición
- Props interfaces tipadas
- Storybook para documentación visual

### 4. **Separación de Responsabilidades**

- UI: Presentación y interacción
- API: Lógica de negocio
- DB: Persistencia de datos
- Hooks: Lógica compartida

## 🗃️ Modelo de Datos

### Entidades Principales

```typescript
// Usuario con roles múltiples
User {
  id: string
  email: string
  roles: Role[]
  empresa: Empresa?
}

// Ciclo de vida del neumático
SolicitudRetiro → Lote → Tratamiento → Certificado
```

### Relaciones

- **Usuario** → **Solicitudes** (1:N)
- **Solicitud** → **Lotes** (1:N)
- **Lote** → **Tratamientos** (1:N)
- **Tratamiento** → **Certificado** (1:1)

## 🔐 Seguridad

### Autenticación

- **NextAuth.js** con múltiples providers
- **JWT tokens** con refresh automático
- **HttpOnly cookies** para seguridad

### Autorización

- **Role-Based Access Control (RBAC)**
- **Middleware** para protección de rutas
- **API validation** en servidor

### Validación

- **Zod schemas** para validación de entrada
- **Sanitización** de datos
- **SQL injection prevention** con Prisma

## ⚡ Optimización de Performance

### Frontend

- **Lazy loading** de componentes
- **Code splitting** automático
- **Image optimization** con Next.js
- **Memoización** de componentes caros

### Backend

- **Database indexing** estratégico
- **Query optimization** con Prisma
- **Caching** con Redis (futuro)
- **API response compression**

### PWA

- **Service Worker** para cache offline
- **Background sync** para operaciones offline
- **Push notifications** para actualizaciones

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Móviles grandes */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
```

### Estrategia

- **Mobile-first** approach: **CRÍTICO**. El diseño debe ser concebido y validado primero en móvil.
- **Verificación obligatoria**: Se debe revisar siempre el buen diseño y usabilidad de la versión mobile.
- **Tailwind CSS** para styling
- **Componentes adaptativos**
- **Grid responsivo**

## 🔄 CI/CD Pipeline

```yaml
# GitHub Actions workflow
Build → Test → Lint → Security Scan → Deploy
```

### Etapas

1. **Build**: TypeScript compilation
2. **Test**: Unit, integration, E2E
3. **Lint**: ESLint + Prettier
4. **Security**: Dependency scanning
5. **Deploy**: Vercel/Staging/Production

## 📊 Monitoreo y Observabilidad

### Métricas

- **Performance**: Lighthouse scores
- **Errors**: Sentry error tracking
- **Usage**: Custom analytics
- **APIs**: Response times y error rates

### Logs

- **Application logs**: Winston
- **Database queries**: Prisma logging
- **API requests**: Custom middleware
- **Client errors**: Error boundaries

## 🚀 Escalabilidad

### Horizontal Scaling

- **Stateless APIs** fáciles de escalar
- **Database connection pooling**
- **CDN** para assets estáticos
- **Load balancing** automático

### Vertical Scaling

- **Database optimization**
- **Caching layers**
- **Background job processing**
- **Microservices** ready (futuro)

## 🔧 Tecnologías Detalladas

### Core Framework

- **Next.js 15** - React full-stack framework
- **React 18** - UI library con concurrent features
- **TypeScript 5** - Type safety

### Database & ORM

- **PostgreSQL 15** - Relational database
- **Prisma 5** - Type-safe ORM
- **Prisma Migrate** - Schema migrations

### UI/UX

- **Tailwind CSS** - Utility-first CSS
- **Radix UI** - Accessible components
- **Lucide Icons** - Icon library
- **Recharts** - Data visualization

### APIs & Communication

- **REST APIs** - Resource-based endpoints
- **WebSockets** - Real-time features (futuro)
- **Web Push** - Browser notifications
- **Fetch API** - HTTP client

### Testing

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **MSW** - API mocking

### DevOps

- **Docker** - Containerization
- **Vercel** - Deployment platform
- **GitHub Actions** - CI/CD
- **ESLint/Prettier** - Code quality
