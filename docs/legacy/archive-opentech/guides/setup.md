# ⚙️ Configuración del Entorno - Sistema REP Chile

## 📋 Requisitos del Sistema

### Hardware Mínimo

- **RAM**: 4GB
- **CPU**: 2 núcleos
- **Almacenamiento**: 10GB disponibles
- **Conexión**: Internet estable

### Software Requerido

- **Node.js**: 18.17.0 o superior
- **npm**: 9.0.0 o superior
- **PostgreSQL**: 15.0 o superior
- **Git**: 2.30.0 o superior

### Navegadores Soportados

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/your-org/traza-ambiental.com.git

# SSH
git clone git@github.com:your-org/traza-ambiental.com.git

cd traza-ambiental.com
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instala:

- Next.js y dependencias de React
- Prisma ORM
- Librerías de autenticación
- Herramientas de desarrollo
- Dependencias de testing

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear usuario y base de datos
sudo -u postgres psql
```

```sql
CREATE USER rep_user WITH PASSWORD 'your_password';
CREATE DATABASE rep_chile OWNER rep_user;
GRANT ALL PRIVILEGES ON DATABASE rep_chile TO rep_user;
\q
```

#### Opción B: Docker

```bash
# Ejecutar PostgreSQL en Docker
docker run --name postgres-rep \
  -e POSTGRES_USER=rep_user \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=rep_chile \
  -p 5432:5432 \
  -d postgres:15

# Para desarrollo local
docker run --name postgres-rep \
  -e POSTGRES_USER=rep_user \
  -e POSTGRES_PASSWORD=rep_password \
  -e POSTGRES_DB=rep_chile \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15
```

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus configuraciones
nano .env.local
```

#### Contenido de `.env.local`

```env
# Base de datos
DATABASE_URL="postgresql://rep_user:your_password@localhost:5432/rep_chile"

# NextAuth (generar secret seguro)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"

# VAPID Keys para notificaciones push
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"

# Configuración adicional
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Generar NEXTAUTH_SECRET

```bash
# Opción 1: Usar openssl
openssl rand -base64 32

# Opción 2: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Generar VAPID Keys

```bash
# Ejecutar script incluido
npm run generate:vapid

# O instalar web-push globalmente
npm install -g web-push
web-push generate-vapid-keys
```

### 5. Configurar Base de Datos

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push

# Ejecutar seeds (datos de ejemplo)
npm run db:seed
```

### 6. Configurar Autenticación

#### NextAuth Configuration

El sistema usa múltiples providers. Configura al menos uno:

```typescript
// src/lib/auth.ts
export const authOptions = {
  providers: [
    CredentialsProvider({
      // Configuración de credenciales
    }),
    // Agregar otros providers según necesites
  ],
};
```

### 7. Iniciar Servidor de Desarrollo

```bash
# Modo desarrollo estándar
npm run dev

# Modo desarrollo con Turbopack (más rápido)
npm run dev

# El servidor estará disponible en:
# http://localhost:3000
```

## 🔧 Configuraciones Avanzadas

### Configuración de Next.js

Crear `next.config.js` si necesitas configuraciones personalizadas:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["localhost"],
  },
  // Configuración PWA
  headers: async () => [
    {
      source: "/sw.js",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
  ],
};

module.exports = nextConfig;
```

### Configuración de ESLint

```javascript
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Configuración de TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🧪 Verificar Instalación

### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests con watch
npm run test:watch

# Tests de cobertura
npm run test:coverage
```

### Verificar Funcionalidades

1. **Acceder a la aplicación**: http://localhost:3000
2. **Login**: Crear usuario administrador
3. **Dashboard**: Verificar carga de datos
4. **Notificaciones**: Probar permisos y envío

### Health Checks

```bash
# Verificar base de datos
npm run db:studio

# Verificar build
npm run build

# Verificar linting
npm run lint
```

## 🌐 Configuración de Producción

### Variables de Entorno de Producción

```env
# Producción
NODE_ENV="production"
NEXTAUTH_URL="https://your-domain.com"
DATABASE_URL="postgresql://user:pass@host:5432/db"

# HTTPS requerido para PWA
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Build de Producción

```bash
# Build optimizado
npm run build

# Iniciar servidor de producción
npm start
```

### Despliegue Recomendado

#### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel dashboard
```

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🚨 Solución de Problemas

### Error: "Can't resolve 'fs'"

- Este es normal en Next.js. Ignorar en client-side code.

### Error: "Prisma client not generated"

```bash
npm run db:generate
```

### Error: "Database connection failed"

- Verificar DATABASE_URL
- Asegurar que PostgreSQL esté ejecutándose
- Verificar credenciales

### Error: "NEXTAUTH_SECRET missing"

- Generar secret seguro de al menos 32 caracteres
- Agregar a variables de entorno

### Notificaciones no funcionan

```bash
# Verificar VAPID keys
npm run generate:vapid

# Verificar HTTPS (requerido para push notifications)
# En desarrollo: localhost funciona
# En producción: HTTPS obligatorio
```

### PWA no se instala

- Verificar que el sitio tenga HTTPS
- Revisar manifest.json
- Verificar service worker registration

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisar los logs de error
2. Verificar que todas las dependencias estén instaladas
3. Comprobar variables de entorno
4. Consultar la [documentación de troubleshooting](troubleshooting.md)

Para soporte adicional:

- 📧 soporte@repchile.cl
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
