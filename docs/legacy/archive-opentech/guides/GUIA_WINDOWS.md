# 🪟 Guía de Configuración para Windows

## 📋 Resumen

Esta guía específica para Windows te ayudará a configurar el entorno de desarrollo de TrazAmbiental en sistemas Windows 10/11.

## 🚀 Instalación Paso a Paso

### Paso 1: Instalar Node.js

1. **Descargar Node.js:**
   - Ir a [nodejs.org](https://nodejs.org/)
   - Descargar la versión LTS (recomendada)
   - Ejecutar el instalador

2. **Verificar instalación:**
   ```cmd
   node --version
   npm --version
   ```

### Paso 2: Instalar PostgreSQL

#### Opción A: Instalador Oficial (Recomendado)

1. **Descargar PostgreSQL:**
   - Ir a [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
   - Descargar la versión más reciente
   - Ejecutar el instalador

2. **Configuración durante la instalación:**
   - Puerto: `5432` (por defecto)
   - Contraseña para usuario `postgres`: **¡RECUÉRDALA!**
   - Configuración regional: `Default locale`

3. **Verificar instalación:**
   ```cmd
   psql --version
   ```

#### Opción B: Chocolatey (Para Desarrolladores)

1. **Instalar Chocolatey:**

   ```powershell
   # Ejecutar en PowerShell como administrador
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Instalar PostgreSQL:**

   ```powershell
   choco install postgresql
   ```

3. **Iniciar servicio:**
   ```cmd
   net start postgresql-x64-14
   ```

#### Opción C: WSL2 (Windows Subsystem for Linux)

1. **Instalar WSL2:**

   ```powershell
   wsl --install
   ```

2. **En WSL2 Ubuntu:**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo service postgresql start
   ```

### Paso 3: Configurar Base de Datos

#### Método 1: Usando pgAdmin (Interfaz Gráfica)

1. **Abrir pgAdmin:**
   - Buscar "pgAdmin" en el menú inicio
   - Abrir la aplicación

2. **Conectar al servidor:**
   - Click en "Add New Server"
   - General → Name: `Local PostgreSQL`
   - Connection → Host: `localhost`, Port: `5432`
   - Username: `postgres`
   - Password: [la contraseña que configuraste]

3. **Crear base de datos:**
   - Click derecho en "Databases"
   - "Create" → "Database"
   - Name: `traza_ambiental_dev`
   - Owner: `postgres`
   - Click "Save"

#### Método 2: Línea de Comandos

1. **Abrir Command Prompt como administrador**

2. **Navegar al directorio de PostgreSQL:**

   ```cmd
   cd "C:\Program Files\PostgreSQL\14\bin"
   ```

3. **Conectar a PostgreSQL:**

   ```cmd
   psql -U postgres
   ```

4. **Crear base de datos:**

   ```sql
   CREATE DATABASE traza_ambiental_dev;
   \q
   ```

5. **Verificar conexión:**
   ```cmd
   psql -h localhost -U postgres -d traza_ambiental_dev
   ```

### Paso 4: Configurar Variables de Entorno

1. **Agregar PostgreSQL al PATH:**
   - Abrir "Variables de entorno del sistema"
   - Click en "Variables de entorno..."
   - En "Variables del sistema", seleccionar "Path"
   - Click "Editar..."
   - Click "Nuevo"
   - Agregar: `C:\Program Files\PostgreSQL\14\bin`
   - Click "Aceptar" en todas las ventanas

2. **Reiniciar Command Prompt**

3. **Verificar PATH:**
   ```cmd
   echo %PATH%
   ```

### Paso 5: Configurar el Proyecto

1. **Clonar el repositorio:**

   ```cmd
   git clone https://github.com/tu-org/traza-ambiental.com.git
   cd traza-ambiental.com
   ```

2. **Instalar dependencias:**

   ```cmd
   npm install
   ```

3. **El archivo `.env` ya está configurado** con:

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/traza_ambiental_dev"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-secreto-super-seguro-para-desarrollo-cambiar-en-produccion"
   NODE_ENV="development"
   ```

4. **Actualizar contraseña en `.env`:**
   - Abrir `.env` en un editor de texto
   - Cambiar `password` por la contraseña real de PostgreSQL

### Paso 6: Configurar Prisma

1. **Ejecutar migraciones:**

   ```cmd
   npx prisma migrate dev
   ```

2. **Generar cliente de Prisma:**

   ```cmd
   npx prisma generate
   ```

3. **Ejecutar seeder:**

   ```cmd
   npx prisma db seed
   ```

4. **Verificar con Prisma Studio:**

   ```cmd
   npx prisma studio
   ```

   - Abrirá en `http://localhost:5555`

### Paso 7: Iniciar la Aplicación

```cmd
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Solución de Problemas Comunes

### Error: "psql is not recognized"

**Solución:**

1. Verificar que PostgreSQL esté en el PATH
2. Reiniciar Command Prompt
3. Usar ruta completa: `"C:\Program Files\PostgreSQL\14\bin\psql.exe"`

### Error: "service not found"

**Solución:**

```cmd
# Iniciar servicio manualmente
net start postgresql-x64-14

# O usar Services.msc
# Buscar "postgresql" y hacer click derecho → Start
```

### Error: "authentication failed"

**Solución:**

1. Verificar contraseña en `.env`
2. Cambiar contraseña si es necesario:
   ```cmd
   psql -U postgres
   ALTER USER postgres PASSWORD 'nueva_contraseña';
   ```

### Error: "port already in use"

**Solución:**

```cmd
# Verificar qué usa el puerto 5432
netstat -ano | findstr :5432

# Terminar proceso si es necesario
taskkill /PID <PID_NUMBER> /F
```

### Error: "database does not exist"

**Solución:**

```cmd
# Crear base de datos
psql -U postgres -c "CREATE DATABASE traza_ambiental_dev;"
```

## 🛠️ Herramientas Recomendadas para Windows

### Editores de Código

- **Visual Studio Code** (recomendado)
- **WebStorm**
- **Sublime Text**

### Herramientas de Base de Datos

- **pgAdmin** (incluido con PostgreSQL)
- **DBeaver** (gratuito)
- **DataGrip** (JetBrains)

### Terminales

- **Windows Terminal** (recomendado)
- **PowerShell**
- **Command Prompt**
- **Git Bash**

## 📚 Recursos Adicionales

- [Documentación oficial de PostgreSQL para Windows](https://www.postgresql.org/docs/current/install-windows.html)
- [Guía de Node.js para Windows](https://nodejs.org/en/download/package-manager/#windows)
- [Configuración de PATH en Windows](https://docs.microsoft.com/en-us/windows/win32/procthread/environment-variables)

## 🎯 Checklist de Verificación

- [ ] Node.js instalado y funcionando
- [ ] PostgreSQL instalado y ejecutándose
- [ ] Base de datos `traza_ambiental_dev` creada
- [ ] Variables de entorno configuradas
- [ ] PATH configurado correctamente
- [ ] Prisma migraciones ejecutadas
- [ ] Aplicación iniciando correctamente
- [ ] Prisma Studio funcionando

---

**Fecha de actualización:** Enero 2025  
**Versión:** 1.0.0  
**Sistema:** Windows 10/11
