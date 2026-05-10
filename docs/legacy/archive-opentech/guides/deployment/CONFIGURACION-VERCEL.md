# Configuración de Variables de Entorno en Vercel

## ⚙️ Variables Requeridas

### Variables Esenciales (OBLIGATORIAS)

```bash
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="tu-secret-generado-aleatorio-seguro"

# Entorno
NODE_ENV="production"
```

### Variables de Inicialización

#### Para BASE DE DATOS CON DATOS EXISTENTES (recomendado):

```bash
INITIALIZE_DB_AND_SEED_DATA="false"
```

**Comportamiento:**

- ✅ Solo ejecuta migraciones pendientes
- ✅ NO elimina datos existentes
- ✅ NO ejecuta seeds
- ✅ Despliegues rápidos y seguros

#### Para BASE DE DATOS VACÍA (solo primer despliegue):

```bash
INITIALIZE_DB_AND_SEED_DATA="true"
```

**Comportamiento:**

- ⚠️ Sincroniza schema completo
- ✅ Ejecuta seeds con datos de prueba
- ✅ Crea usuarios administradores
- ⚠️ NO recomendado para despliegues subsecuentes

### Variables Opcionales pero Recomendadas

```bash
# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="tu-site-key"
RECAPTCHA_SECRET_KEY="tu-secret-key"

# Mailgun (Email)
MAILGUN_API_KEY="tu-api-key"
MAILGUN_DOMAIN="tu-dominio.mailgun.org"
MAILGUN_API_URL="https://api.mailgun.net"
FROM_EMAIL="noreply@tu-dominio.com"
FROM_NAME="TrazAmbiental"

# AWS S3 (Almacenamiento)
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="tu-bucket"
```

## 📝 Cómo Configurar en Vercel

### Opción 1: Desde Dashboard (Recomendado)

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Click en "Settings" → "Environment Variables"
4. Para cada variable:
   - **Key:** Nombre de la variable (ej: `DATABASE_URL`)
   - **Value:** Valor de la variable
   - **Environments:** Selecciona `Production`, `Preview`, `Development` según necesites
5. Click "Save"
6. **IMPORTANTE:** Redeploy después de cambiar variables

### Opción 2: Usando Vercel CLI

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Configurar variable
vercel env add DATABASE_URL production
# (te pedirá el valor)

# Ver variables configuradas
vercel env ls
```

### Opción 3: Desde archivo .env (solo para desarrollo local)

Vercel NO lee archivos `.env` directamente. Debes configurarlas manualmente.

## 🔧 Configuración Recomendada por Escenario

### Escenario 1: Primer Despliegue (BD Vacía)

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="..."
NODE_ENV="production"
INITIALIZE_DB_AND_SEED_DATA="true"  # ← Primera vez
```

**Después del primer despliegue exitoso:**

```bash
# CAMBIAR a false inmediatamente
INITIALIZE_DB_AND_SEED_DATA="false"
```

### Escenario 2: Despliegues Subsecuentes (BD con Datos)

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="..."
NODE_ENV="production"
INITIALIZE_DB_AND_SEED_DATA="false"  # ← Siempre false
```

### Escenario 3: Desarrollo/Preview

```bash
# Mismas variables pero con valores de staging
DATABASE_URL="postgresql://...staging..."
INITIALIZE_DB_AND_SEED_DATA="true"  # OK para preview
```

## 🚨 Problemas Comunes

### Error: "Command npm run vercel-build exited with 1"

**Causas posibles:**

1. **INITIALIZE_DB_AND_SEED_DATA=true en producción con datos**
   - Solución: Cambiar a `false`

2. **DATABASE_URL incorrecta o inaccesible**
   - Verificar que la URL es correcta
   - Verificar que incluye `?sslmode=require` si es necesario
   - Verificar que Vercel puede acceder a la BD

3. **NEXTAUTH_SECRET no configurada**
   - Generar una: `openssl rand -base64 32`
   - Configurar en Vercel

4. **Timeout durante seeds**
   - Verificar que la BD es accesible rápidamente
   - Considerar usar `INITIALIZE_DB_AND_SEED_DATA=false`

### Error: "Prisma migrate deploy failed"

**Solución:**

```bash
# Si la BD ya tiene schema, usar:
INITIALIZE_DB_AND_SEED_DATA="false"
```

### Seeds no se ejecutan

**Verificar:**

```bash
# Debe estar en true solo si quieres seeds
INITIALIZE_DB_AND_SEED_DATA="true"
NODE_ENV="development"  # o no configurar NODE_ENV
```

## 🔐 Seguridad

### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
# o
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Proteger Variables Sensibles

- ✅ Nunca commitear `.env` con valores reales
- ✅ Usar valores diferentes para desarrollo/producción
- ✅ Rotar secrets periódicamente
- ✅ Usar variables de entorno de Vercel, no hardcodear

## 📊 Verificar Configuración

### Desde Logs de Vercel

Durante el build, verás:

```
🚀 Iniciando proceso de despliegue en Vercel
📍 Entorno: PRODUCCIÓN
🔧 INITIALIZE_DB_AND_SEED_DATA: false  # ← Verificar este valor
```

### Probar Localmente

```bash
# Simular producción
INITIALIZE_DB_AND_SEED_DATA=false NODE_ENV=production npm run vercel-build
```

## 🆘 Soporte

Si el despliegue falla:

1. Copia los logs completos de Vercel
2. Verifica las variables de entorno
3. Prueba localmente con las mismas variables
4. Revisa la conectividad a la base de datos

### Información útil para debug:

- Última línea antes del error
- Valor de INITIALIZE_DB_AND_SEED_DATA
- Tipo de base de datos y ubicación
- Región de Vercel vs región de BD
