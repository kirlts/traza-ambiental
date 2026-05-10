# 🚀 Guía de Deployment en Vercel

**Proyecto**: TrazAmbiental - Sistema REP  
**Fecha**: 13 de noviembre de 2025  
**Estado**: ✅ Configurado para Producción

---

## 🔧 Problema Resuelto

### Error Original

```
Error: Use the --accept-data-loss flag to ignore the data loss warnings
like prisma db push --accept-data-loss
```

### Causa

El script `postinstall` estaba ejecutando `prisma db push` en producción, lo cual:

- ❌ No es recomendado para producción
- ❌ Puede causar pérdida de datos
- ❌ Requiere confirmación manual

### Solución Implementada ✅

Separación de comandos para desarrollo y producción:

#### Antes (Incorrecto)

```json
"postinstall": "prisma generate && prisma db push && npm run db:seed"
```

#### Después (Correcto)

```json
"postinstall": "prisma generate",
"vercel-build": "prisma generate && prisma migrate deploy && npm run db:seed && next build --turbopack"
```

---

## 📋 Configuración de Vercel

### 1. Variables de Entorno Requeridas

En tu proyecto de Vercel, configura estas variables:

```bash
# Base de Datos (requerido)
DATABASE_URL="postgresql://usuario:contraseña@host:5432/database?schema=public"

# NextAuth (requerido)
NEXTAUTH_SECRET="tu-secret-aleatorio-largo-y-seguro"
NEXTAUTH_URL="https://tu-dominio.vercel.app"

# AWS S3 (para almacenamiento de documentos)
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_BUCKET_NAME="tu-bucket"
AWS_REGION="us-east-1"

# Email SMTP (para notificaciones)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"
FROM_EMAIL="noreply@tu-dominio.com"
FROM_NAME="TrazAmbiental"

# reCAPTCHA (opcional pero recomendado)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="tu-site-key"
RECAPTCHA_SECRET_KEY="tu-secret-key"

# Inicialización de Base de Datos (CRÍTICO)
# PRIMER DEPLOY: true (crea roles, admin, estructura inicial)
# DEPLOYS POSTERIORES: false (solo migraciones, preserva datos)
INITIALIZE_DB_AND_SEED_DATA="true"

# Usuarios admin (solo se usan si INITIALIZE_DB_AND_SEED_DATA=true)
# Opción 1 - JSON (múltiples admins)
ADMIN_USERS_JSON='[{"email":"admin@tudominio.com","password":"TuPasswordSegura!123","name":"Admin Principal"}]'

# Opción 2 - Variables individuales (un solo admin)
ADMIN_EMAIL="admin@tudominio.com"
ADMIN_PASSWORD="TuPasswordSegura!123"
ADMIN_NAME="Admin Principal"
ADMIN_RUT=""

# Node Environment
NODE_ENV="production"
```

### 2. Configuración del Proyecto en Vercel

#### Build Settings

```
Framework Preset: Next.js
Build Command: npm run vercel-build
Output Directory: .next
Install Command: npm install
```

#### Root Directory

```
./
```

#### Node Version

```
20.x (LTS)
```

---

## 🗃️ Base de Datos

### Opciones de Base de Datos para Producción

#### Opción 1: Vercel Postgres (Recomendada)

```bash
# Vercel automáticamente configura DATABASE_URL
# Solo necesitas crear el proyecto desde Vercel Dashboard
```

#### Opción 2: Supabase (Gratuito)

```bash
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROYECTO].supabase.co:5432/postgres"
```

#### Opción 3: Railway

```bash
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@[TU-HOST].railway.app:5432/railway"
```

#### Opción 4: Neon (Serverless)

```bash
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

### Crear Migraciones (Solo una vez)

Si aún no has creado las migraciones, ejecuta en local:

```bash
# 1. Asegurarse de que el schema está actualizado
npm run db:push

# 2. Crear la migración inicial
npx prisma migrate dev --name initial-migration

# 3. Hacer commit de las migraciones
git add prisma/migrations/
git commit -m "Add initial Prisma migrations"
git push
```

### Aplicar Migraciones en Producción

El comando `vercel-build` automáticamente ejecuta:

```bash
prisma migrate deploy  # Aplica migraciones de forma segura
```

---

## 🚀 Proceso de Deployment

### Primera vez

1. **Crear proyecto en Vercel**

   ```bash
   vercel
   ```

2. **Configurar base de datos**
   - Crear base de datos en el proveedor elegido
   - Copiar `DATABASE_URL`
   - Agregar en Vercel → Settings → Environment Variables

3. **Agregar variables de entorno**
   - Todas las variables listadas arriba
   - En: Vercel Dashboard → Project → Settings → Environment Variables

4. **Deploy**
   ```bash
   git push origin main
   # O desde Vercel Dashboard: Deployments → Deploy
   ```

### Deployments Subsecuentes

```bash
# Simplemente hacer push
git add .
git commit -m "Tu mensaje"
git push origin main

# Vercel automáticamente:
# 1. Detecta el push
# 2. Ejecuta npm install
# 3. Ejecuta vercel-build
# 4. Despliega
```

---

## 🔍 Troubleshooting

### Error: "Migration failed"

**Causa**: Las migraciones no están en el repositorio o hay conflictos.

**Solución**:

```bash
# 1. Crear migraciones faltantes localmente
npx prisma migrate dev

# 2. Hacer commit
git add prisma/migrations/
git commit -m "Add missing migrations"
git push
```

### Error: "Database connection failed"

**Causa**: `DATABASE_URL` incorrecta o base de datos no accesible.

**Solución**:

1. Verificar que `DATABASE_URL` esté configurada en Vercel
2. Verificar que la base de datos permita conexiones externas
3. Para PostgreSQL, asegurarse de incluir `?sslmode=require` si es necesario

### Error: "Seeder failed"

**Causa**: El seeder intenta crear datos que ya existen.

**Solución**: Modificar el seeder para que use `upsert` en lugar de `create`:

```typescript
// ❌ Malo
await prisma.role.create({ data: { name: "Admin" } });

// ✅ Bueno
await prisma.role.upsert({
  where: { name: "Admin" },
  update: {},
  create: { name: "Admin" },
});
```

### Error: "Out of memory"

**Causa**: Build de Next.js requiere mucha memoria.

**Solución**: Agregar en `package.json`:

```json
"vercel-build": "NODE_OPTIONS='--max_old_space_size=4096' prisma generate && prisma migrate deploy && npm run db:seed && next build --turbopack"
```

---

## 📊 Monitoreo

### Logs de Build

Ver en: Vercel Dashboard → Project → Deployments → [Click en deployment] → Build Logs

### Logs de Runtime

Ver en: Vercel Dashboard → Project → Deployments → [Click en deployment] → Function Logs

### Verificar Base de Datos

```bash
# Conectarse a la BD de producción (con cuidado)
DATABASE_URL="tu-production-url" npx prisma studio
```

---

## ✅ Checklist de Deployment

### Antes del Primer Deploy

- [ ] Base de datos de producción creada
- [ ] Todas las variables de entorno configuradas en Vercel
- [ ] Migraciones de Prisma creadas y commitadas
- [ ] Seeder adaptado para producción (usar `upsert`)
- [ ] Tests pasando al 100%
- [ ] Build local exitoso: `npm run vercel-build`

### Después de Cada Deploy

- [ ] Verificar que el build fue exitoso
- [ ] Probar funcionalidad crítica en producción
- [ ] Verificar que las migraciones se aplicaron
- [ ] Revisar logs de errores
- [ ] Verificar métricas de performance

---

## 🔒 Seguridad

### Variables Sensibles

**NUNCA** commitear:

- ❌ `DATABASE_URL` con credenciales reales
- ❌ `NEXTAUTH_SECRET`
- ❌ `AWS_SECRET_ACCESS_KEY`
- ❌ Passwords de SMTP
- ❌ API keys

**SIEMPRE** usar:

- ✅ Variables de entorno en Vercel
- ✅ `.env.local` para desarrollo (no commitear)
- ✅ `.env.example` con valores de ejemplo (sí commitear)

### Base de Datos

- ✅ Usar SSL/TLS: `?sslmode=require`
- ✅ Restringir IPs si es posible
- ✅ Usar passwords fuertes
- ✅ Backups automáticos configurados

---

## 📚 Recursos Adicionales

### Documentación Oficial

- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)

### Proveedores de Base de Datos

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/docs)
- [Railway](https://docs.railway.app/)
- [Neon](https://neon.tech/docs/introduction)

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisar logs de build en Vercel Dashboard
2. Verificar variables de entorno
3. Consultar documentación de Prisma
4. Revisar este documento nuevamente

---

**Última actualización**: 13 de noviembre de 2025  
**Estado**: ✅ Configuración lista para producción
