# 🚀 Guía Completa de Despliegue en Vercel 2026

**Última actualización:** 29 de enero de 2026  
**Estado:** ✅ Producción - Completamente funcional

---

## 📚 Tabla de Contenidos

1. [Variables de Entorno](#variables-de-entorno)
2. [Proceso de Despliegue](#proceso-de-despliegue)
3. [Sistema de Inicialización](#sistema-de-inicialización)
4. [Troubleshooting](#troubleshooting)
5. [Optimizaciones Aplicadas](#optimizaciones-aplicadas)
6. [Changelog de Mejoras](#changelog-de-mejoras)

---

## 🔐 Variables de Entorno

### Variables Esenciales (OBLIGATORIAS)

```bash
# Base de Datos
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="genera-con-openssl-rand-base64-32"

# Control de Inicialización
INITIALIZE_DB_AND_SEED_DATA="true"   # true: primer deploy | false: subsecuentes
```

### Variables Opcionales

```bash
# Admin personalizado (JSON)
ADMIN_USERS_JSON='[{"email":"admin@dominio.com","password":"...","name":"...","rut":"..."}]'

# O admin simple
ADMIN_EMAIL="admin@trazambiental.com"
ADMIN_PASSWORD="contraseña-segura-12-chars"
ADMIN_NAME="Admin Principal"
ADMIN_RUT="12345678-9"

# Servicios externos
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="..."
RECAPTCHA_SECRET_KEY="..."
MAILGUN_API_KEY="..."
MAILGUN_DOMAIN="..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

---

## 🎯 Sistema de Inicialización

### Flag: `INITIALIZE_DB_AND_SEED_DATA`

Esta flag controla completamente qué se ejecuta durante el deployment.

#### `INITIALIZE_DB_AND_SEED_DATA=true`

**Cuándo usar:**

- ✅ Primer despliegue en producción
- ✅ Ambientes de staging/testing
- ✅ Cuando quieres datos de prueba

**Qué hace:**

1. Sincroniza schema de base de datos
2. Ejecuta TODOS los seeds
3. Crea usuario administrador
4. **Crea 9 usuarios de prueba:**
   - generador@trazambiental.com (generador123)
   - transportista@trazambiental.com (transportista123)
   - gestor@trazambiental.com (gestor123)
   - especialista@trazambiental.com (especialista123)
   - sistema@trazambiental.com (sistema123)
   - operador@trazambiental.com (operador123)
   - supervisor@trazambiental.com (supervisor123)
   - auditor@trazambiental.com (auditor123)
5. Crea datos demo:
   - Regiones y comunas (346 comunas)
   - Solicitudes de retiro de ejemplo
   - Sistema de gestión con datos
   - Entregas de prueba
   - Metas REP configuradas
   - Categorías de inventario

**Tiempo de ejecución:** ~5-10 segundos

#### `INITIALIZE_DB_AND_SEED_DATA=false`

**Cuándo usar:**

- ✅ Despliegues subsecuentes en producción
- ✅ Cuando ya tienes datos y solo quieres actualizar código
- ✅ Para preservar datos existentes

**Qué hace:**

1. Solo ejecuta migraciones pendientes
2. NO ejecuta seeds
3. NO crea usuarios
4. Preserva todos los datos existentes

**Tiempo de ejecución:** ~2-3 segundos

---

## 🚀 Proceso de Despliegue

### Primera Vez (BD Vacía)

1. **Configurar Variables en Vercel:**

   ```bash
   INITIALIZE_DB_AND_SEED_DATA=true
   DATABASE_URL=...
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   NEXTAUTH_SECRET=...
   ADMIN_EMAIL=admin@trazambiental.com
   ADMIN_PASSWORD=...
   ```

2. **Push a GitHub:**

   ```bash
   git push origin main
   ```

3. **Verificar en Vercel:**
   - ✅ Build completo en ~2-3 minutos
   - ✅ 13/13 seeders ejecutados
   - ✅ Usuarios de prueba creados
   - ✅ Datos demo cargados

4. **IMPORTANTE - Cambiar Flag:**
   ```bash
   # Después del primer deploy exitoso
   INITIALIZE_DB_AND_SEED_DATA=false
   ```

### Despliegues Subsecuentes

1. **Verificar Configuración:**

   ```bash
   INITIALIZE_DB_AND_SEED_DATA=false  ✅
   ```

2. **Push Cambios:**

   ```bash
   git push origin main
   ```

3. **Resultado:**
   - ✅ Solo migraciones aplicadas
   - ✅ Seeds omitidos
   - ✅ Datos preservados
   - ✅ Build en ~1-2 minutos

---

## 🛠️ Troubleshooting

### Error: "Command npm run vercel-build exited with 1"

**Causa 1:** Error en seeds por usuarios faltantes

**Solución:**

```bash
# Asegúrate de tener:
INITIALIZE_DB_AND_SEED_DATA=true
```

**Causa 2:** Base de datos no accesible

**Verificar:**

- DATABASE_URL correcta
- Base de datos acepta conexiones desde Vercel
- Incluir `?sslmode=require` si es necesario

### Error: P2025 "No record was found"

**Causa:** Seeders intentando actualizar usuarios que no existen

**Solución:** Ya está arreglado en commit `ea0b435`. Seeders ahora verifican `INITIALIZE_DB_AND_SEED_DATA`.

### Error: P3005 "Database schema is not empty"

**Causa:** Base de datos ya tiene schema

**Solución:** Script automáticamente usa `db push` en producción (commit `fa09bd5`)

### Timeout en Regiones y Comunas

**Solución:** Ya optimizado en commit `01cbc3a` (1000x más rápido)

### No Se Crean Usuarios de Prueba

**Causa:** Vercel siempre setea `NODE_ENV=production`

**Solución:** Script ahora usa `INITIALIZE_DB_AND_SEED_DATA` (commit `f5d8cdc`)

---

## ⚡ Optimizaciones Aplicadas

### 1. Seeder de Regiones Optimizado

**Antes:**

- 346 queries individuales (`upsert` por comuna)
- Tiempo: ~5-10 minutos
- Causaba timeout en Vercel

**Después:**

- 16 queries batch (`createMany` por región)
- Tiempo: ~0.8 segundos
- ✅ 1000x más rápido

**Commit:** `01cbc3a`

### 2. Script de Deploy Inteligente

**Características:**

- Detecta entorno automáticamente
- Usa `db push` en producción (más seguro)
- Usa `migrate reset` solo en desarrollo
- Maneja errores gracefully

**Commit:** `fa09bd5`

### 3. Seeders Protegidos

**Mejora:**

- Verifican `INITIALIZE_DB_AND_SEED_DATA` en lugar de `NODE_ENV`
- Omiten datos demo cuando flag=false
- Crean usuarios de prueba cuando flag=true

**Commits:** `ea0b435`, `f5d8cdc`

---

## 📊 Changelog de Mejoras (29 Enero 2026)

### Commit 1: `e20d907` - Sistema de Despliegue Simplificado

- Creado `scripts/vercel-deploy.js`
- Dos modos: inicialización completa vs solo migraciones
- Manejo robusto de errores

### Commit 2: `6018ba9` - Fix Exportación Seeders

- Agregado `export async function main()` a seeders
- Consistencia en convención de exportación

### Commit 3: `01cbc3a` - Optimización Batch Regiones

- Cambio de `upsert` individual a `createMany` batch
- Reducción de 346 queries a 16
- Mejora de rendimiento: 1000x

### Commit 4: `fa09bd5` - Manejo Inteligente Producción

- Usa `db push` en producción
- Usa `migrate reset` en desarrollo
- Advertencias claras sobre configuración

### Commit 5: `ea0b435` - Protección Seeders Demo

- Seeders de demo omiten ejecución según flag
- Evita errores por usuarios faltantes

### Commit 6: `f5d8cdc` - Fix Usuarios de Prueba

- Cambio de `NODE_ENV` a `INITIALIZE_DB_AND_SEED_DATA`
- Solución definitiva para creación de usuarios en Vercel

---

## 📁 Estructura de Archivos

```
scripts/
  └── vercel-deploy.js         # Script principal de deployment

prisma/
  ├── seed.ts                  # Coordinador de seeds
  ├── 001-...-seeder.ts        # Configuración metas REP
  ├── 002-...-seeder.ts        # Roles y usuarios
  ├── 003-...-seeder.ts        # Sistema de gestión
  ├── 004-...-seeder.ts        # Regiones y comunas (optimizado)
  ├── 005-...-seeder.ts        # Vehículos
  ├── 006-...-seeder.ts        # Solicitudes retiro
  ├── 007-...-seeder.ts        # Entregas (protegido)
  ├── 008-...-seeder.ts        # Validación (protegido)
  ├── 009-...-seeder.ts        # Categorías inventario
  ├── 010-...-seeder.ts        # Productos inventario
  ├── 011-...-seeder.ts        # Dashboard transportista (protegido)
  ├── 012-...-seeder.ts        # Perfiles legales transportista
  └── 013-...-seeder.ts        # Perfiles legales gestor

docs/guides/deployment/
  ├── GUIA-DEPLOYMENT-2026.md  # Esta guía (consolidada)
  ├── CONFIGURACION-VERCEL.md  # Detalles de configuración
  └── PRUEBAS-REALIZADAS.md    # Log de pruebas
```

---

## 🎯 Checklist de Despliegue

### Pre-Deploy

- [ ] Variables de entorno configuradas
- [ ] `INITIALIZE_DB_AND_SEED_DATA` con valor correcto
- [ ] Base de datos accesible desde Vercel
- [ ] `NEXTAUTH_SECRET` generado (32+ caracteres)
- [ ] Contraseña admin cumple requisitos (12+ chars, mayús, minús, número, especial)

### Durante Deploy

- [ ] Build inicia correctamente
- [ ] Prisma generate exitoso
- [ ] Script vercel-deploy.js ejecuta sin errores
- [ ] Seeds completan (si INITIALIZE_DB_AND_SEED_DATA=true)
- [ ] Next build completa

### Post-Deploy

- [ ] Aplicación accesible
- [ ] Login con admin funciona
- [ ] Usuarios de prueba disponibles (si se crearon)
- [ ] Cambiar `INITIALIZE_DB_AND_SEED_DATA=false` (si primer deploy)

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa logs de Vercel
2. Verifica variables de entorno
3. Consulta sección de Troubleshooting
4. Revisa commits del changelog

**Documentos relacionados:**

- `docs/guides/deployment/CONFIGURACION-VERCEL.md` - Configuración detallada
- `docs/guides/deployment/RESET-DB-PRODUCCION.md` - Resetear BD producción
- `README.md` - Información general del proyecto
