# 🔧 Configuración de Entorno de Desarrollo

## 📋 Resumen de Cambios Realizados

Este documento describe la configuración de PostgreSQL para el entorno de desarrollo de TrazAmbiental, incluyendo la migración desde SQLite.

## ✅ Cambios Implementados

### 1. Esquema de Prisma Actualizado

**Archivo:** `prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"  // Cambiado de "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Variables de Entorno Configuradas

**Archivo:** `.env` (creado)

```env
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Base de datos local para desarrollo
DATABASE_URL="postgresql://postgres:password@localhost:5432/traza_ambiental_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-super-seguro-para-desarrollo-cambiar-en-produccion"

# Variables de entorno para desarrollo
NODE_ENV="development"
```

## 🚀 Pasos para Configurar el Entorno

### Paso 1: Instalar PostgreSQL

#### macOS (Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows

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

### Paso 2: Configurar Base de Datos

#### Para macOS y Linux:

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

#### Para Windows:

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

### Paso 3: Configurar Prisma

1. **Ejecutar migraciones:**

```bash
npx prisma migrate dev
```

2. **Generar cliente de Prisma:**

```bash
npx prisma generate
```

3. **Ejecutar seeder:**

```bash
npx prisma db seed
```

### Paso 4: Verificar Configuración

```bash
# Abrir Prisma Studio para ver los datos
npx prisma studio
```

La interfaz estará disponible en `http://localhost:5555`

## 🔄 Migración desde SQLite

Si el proyecto estaba configurado previamente con SQLite:

1. **Los archivos ya están actualizados:**
   - `prisma/schema.prisma` configurado para PostgreSQL
   - `.env` con variables de PostgreSQL

2. **Eliminar archivos de SQLite (opcional):**

   ```bash
   rm prisma/dev.db
   ```

3. **Ejecutar migraciones desde cero:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   ```

## 🧪 Verificación de la Configuración

### 1. Verificar Conexión a Base de Datos

```bash
# Probar conexión directa
psql -h localhost -U postgres -d traza_ambiental_dev -c "SELECT version();"
```

### 2. Verificar Prisma

```bash
# Verificar que Prisma puede conectarse
npx prisma db pull
```

### 3. Verificar Aplicación

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación debe estar disponible en `http://localhost:3000`

## 🔧 Solución de Problemas

### Error: "relation does not exist"

```bash
# Recrear migraciones
npx prisma migrate reset
npx prisma migrate dev
npx prisma db seed
```

### Error: "connection refused"

1. Verificar que PostgreSQL esté ejecutándose:

   ```bash
   # macOS
   brew services list | grep postgresql

   # Ubuntu
   sudo systemctl status postgresql

   # Windows
   net start postgresql-x64-14
   ```

2. Verificar configuración en `.env`:
   - Usuario correcto
   - Contraseña correcta
   - Puerto correcto (5432)
   - Nombre de base de datos correcto

### Error: "database does not exist"

```bash
# Crear base de datos manualmente
# macOS/Linux
createdb traza_ambiental_dev

# Windows
psql -U postgres -c "CREATE DATABASE traza_ambiental_dev;"
```

### Problemas Específicos de Windows

#### Error: "psql is not recognized"

1. **Agregar PostgreSQL al PATH:**
   - Abrir "Variables de entorno del sistema"
   - Editar variable PATH
   - Agregar: `C:\Program Files\PostgreSQL\14\bin`
   - Reiniciar Command Prompt

2. **Usar ruta completa:**
   ```cmd
   "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
   ```

#### Error: "service not found"

```cmd
# Iniciar servicio de PostgreSQL
net start postgresql-x64-14

# O usar Services.msc
# Buscar "postgresql" y iniciar servicio
```

#### Error: "authentication failed"

1. **Verificar contraseña:**
   - La contraseña se establece durante la instalación
   - Si no la recuerdas, puedes cambiarla en pgAdmin

2. **Cambiar contraseña:**

   ```cmd
   # Conectar como administrador
   psql -U postgres

   # Cambiar contraseña
   ALTER USER postgres PASSWORD 'nueva_contraseña';
   ```

#### Error: "port already in use"

```cmd
# Verificar qué proceso usa el puerto 5432
netstat -ano | findstr :5432

# Terminar proceso si es necesario
taskkill /PID <PID_NUMBER> /F
```

#### Problemas con WSL2

Si usas WSL2, asegúrate de que PostgreSQL esté ejecutándose en el subsistema:

```bash
# En WSL2
sudo service postgresql start
sudo service postgresql status
```

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs/getting-started)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Guía de Desarrollo](./guia-desarrollo.md)
- [Inicio Rápido](./INICIO-RAPIDO.md)

## 🎯 Próximos Pasos

1. **Ejecutar migraciones:** `npx prisma migrate dev`
2. **Generar cliente:** `npx prisma generate`
3. **Poblar datos:** `npx prisma db seed`
4. **Iniciar aplicación:** `npm run dev`

---

**Fecha de actualización:** Enero 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Completado
