# 🌐 Configuración de Dominio Local

Esta guía explica cómo configurar el dominio local `traza-ambiental.local` para el desarrollo de la aplicación.

## 📋 Tabla de Contenidos

- [Configuración Automática](#configuración-automática)
- [Configuración Manual](#configuración-manual)
- [Uso Diario](#uso-diario)
- [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Configuración Automática

### Opción 1: Automática al iniciar (Recomendado)

Simplemente ejecuta:

```bash
sudo npm run dev
```

El script detectará automáticamente si necesitas configuración inicial y:

- ✅ Te solicitará contraseña de administrador (sudo)
- ✅ Configurará el archivo hosts
- ✅ Creará `.env.local`
- ✅ Iniciará el servidor en el puerto 80
- ✅ Abrirá el navegador en `http://traza-ambiental.local`

**Nota:** Se requiere `sudo` porque el puerto 80 es privilegiado (< 1024)

### Opción 2: Configuración previa

Si prefieres configurar antes de iniciar:

```bash
npm run setup:domain
```

Este script:

- ✅ Detecta automáticamente tu sistema operativo (Windows, macOS, Linux)
- ✅ Configura el archivo hosts con el dominio `traza-ambiental.local`
- ✅ Crea el archivo `.env.local` con las variables necesarias
- ✅ Limpia la caché DNS (en macOS)
- ✅ Solicita permisos de administrador cuando sea necesario

### Sistemas Soportados

#### 🪟 Windows

- Requiere ejecutar como Administrador
- El script solicitará permisos automáticamente
- Modifica: `C:\Windows\System32\drivers\etc\hosts`

#### 🍎 macOS

- Requiere contraseña de administrador (sudo)
- Limpia automáticamente la caché DNS
- Modifica: `/etc/hosts`

#### 🐧 Linux

- Requiere contraseña de administrador (sudo)
- Limpia caché DNS si usa systemd-resolved
- Modifica: `/etc/hosts`

---

## 🔧 Configuración Manual

Si prefieres configurar manualmente o el script automático falla:

### 1. Editar el archivo hosts

#### En Windows:

1. Abre el Bloc de notas como Administrador
2. Abre el archivo: `C:\Windows\System32\drivers\etc\hosts`
3. Agrega al final:
   ```
   127.0.0.1    traza-ambiental.local
   ```
4. Guarda el archivo

#### En macOS/Linux:

1. Abre la terminal
2. Ejecuta:
   ```bash
   sudo nano /etc/hosts
   ```
3. Agrega al final:
   ```
   127.0.0.1    traza-ambiental.local
   ```
4. Guarda (Ctrl+X, luego Y, luego Enter)
5. En macOS, limpia la caché DNS:
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

### 2. Crear archivo .env.local

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y asegúrate de que contenga:

```env
NEXTAUTH_URL=http://traza-ambiental.local:3000
NEXTAUTH_SECRET=tu-secret-super-seguro-cambiame
DATABASE_URL="file:./prisma/dev.db"
```

---

## 💻 Uso Diario

### Iniciar el servidor de desarrollo

```bash
sudo npm run dev
```

Este comando:

- ✅ Verifica que el dominio esté configurado
- ✅ Inicia el servidor Next.js en el puerto 80
- ✅ Abre automáticamente el navegador en `http://traza-ambiental.local`

**¿Por qué sudo?** El puerto 80 es un puerto privilegiado que requiere permisos de administrador.

### Otros comandos útiles

```bash
# Iniciar sin abrir el navegador (puerto 80)
sudo npm run dev:server

# Iniciar en localhost con puerto 3000 (modo tradicional, sin sudo)
npm run dev:default

# Detener el servidor en el puerto 80
sudo lsof -ti:80 | xargs sudo kill -9

# Detener el servidor en el puerto 3000
npm run dev:stop

# Reiniciar el servidor
sudo npm run dev:r
```

---

## 🔍 Solución de Problemas

### El dominio no funciona después de configurar

1. **Verifica el archivo hosts:**

   ```bash
   # macOS/Linux
   cat /etc/hosts | grep traza-ambiental

   # Windows (PowerShell)
   Get-Content C:\Windows\System32\drivers\etc\hosts | Select-String traza-ambiental
   ```

2. **Limpia la caché DNS:**

   ```bash
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder

   # Linux (systemd)
   sudo systemd-resolve --flush-caches

   # Windows (PowerShell como Admin)
   ipconfig /flushdns
   ```

3. **Verifica que el servidor esté corriendo:**
   ```bash
   # Debería mostrar el proceso de Node
   lsof -i :3000  # macOS/Linux
   netstat -ano | findstr :3000  # Windows
   ```

### El navegador no se abre automáticamente

No hay problema, simplemente abre manualmente:

```
http://traza-ambiental.local:3000
```

### Error de permisos en Windows

Ejecuta el terminal (PowerShell o CMD) como Administrador:

1. Click derecho en el icono del terminal
2. "Ejecutar como Administrador"
3. Ejecuta `npm run setup:domain`

### Error de permisos en macOS/Linux

El script te pedirá la contraseña de sudo automáticamente. Si falla:

```bash
sudo node scripts/setup-local-domain.js
```

### El puerto 3000 está ocupado

Detén el proceso que usa el puerto:

```bash
npm run dev:stop
```

O usa un puerto diferente:

```bash
PORT=3001 npm run dev
```

### NextAuth no funciona correctamente

Asegúrate de que `NEXTAUTH_URL` en `.env.local` coincida con el dominio:

```env
NEXTAUTH_URL=http://traza-ambiental.local
```

**Nota:** Sin puerto porque usamos el puerto 80 estándar.

---

## 🔌 Uso del Puerto 80

### ¿Por qué Puerto 80?

El puerto 80 es el puerto HTTP estándar, lo que significa que las URLs no necesitan especificar el puerto explícitamente.

| Puerto   | URL                                 | Aspecto                     |
| -------- | ----------------------------------- | --------------------------- |
| **3000** | `http://traza-ambiental.local:3000` | ❌ Menos profesional        |
| **80**   | `http://traza-ambiental.local`      | ✅ Más limpio y profesional |

### Permisos Requeridos

El puerto 80 es un **puerto privilegiado** (puertos 1-1023), lo que significa que requiere permisos de administrador/root para ser utilizado.

**¿Es seguro usar sudo?** Sí, en este contexto es seguro porque:

- ✅ Código auditable: Todo el código es visible en los scripts
- ✅ Solo vincula a puerto: No realiza operaciones peligrosas
- ✅ Entorno de desarrollo: Es para desarrollo local, no producción
- ✅ Estándar de la industria: Muchos servidores de desarrollo usan este enfoque

### Problemas Comunes del Puerto 80

#### Error: "Port 80 already in use"

**Causa:** Otro servicio está usando el puerto 80 (Apache, nginx, etc.)

**Soluciones:**

```bash
# Detener el servicio existente (macOS/Linux)
sudo lsof -ti:80 | xargs sudo kill -9

# Detener Apache
sudo apachectl stop

# Detener nginx
sudo nginx -s stop

# O usar el puerto 3000 sin sudo
npm run dev:default
```

### Alternativa: Usar Puerto 3000

Si prefieres no usar sudo, puedes volver al puerto 3000:

```bash
npm run dev:default
```

Esto iniciará el servidor en `http://traza-ambiental.local:3000` sin requerir permisos especiales.

## 📚 Información Adicional

### ¿Por qué usar un dominio local con puerto 80?

1. **URLs Profesionales:** `http://traza-ambiental.local` sin puerto visible
2. **Consistencia:** El mismo dominio en todas las máquinas de desarrollo
3. **Cookies y sesiones:** NextAuth funciona mejor con dominios reales
4. **Testing:** Pruebas más realistas del comportamiento en producción
5. **Experiencia de usuario:** URLs más limpias y fáciles de recordar
6. **Simula producción:** El puerto 80 es el estándar HTTP

### Subdominios (opcional)

Si necesitas subdominios para desarrollo avanzado, agrégalos al archivo hosts:

```
127.0.0.1    traza-ambiental.local
127.0.0.1    api.traza-ambiental.local
127.0.0.1    admin.traza-ambiental.local
```

### Alternativas al dominio .local

Si `.local` causa problemas en tu red (conflictos con Bonjour/mDNS):

1. Usa `.test` (estándar RFC):

   ```
   127.0.0.1    traza-ambiental.test
   ```

2. Actualiza todos los archivos de configuración con el nuevo dominio

---

## 🆘 Soporte

Si encuentras problemas no cubiertos en esta guía:

1. Revisa los logs del servidor
2. Verifica la configuración del archivo hosts
3. Asegúrate de que `.env.local` está configurado correctamente
4. Contacta al equipo de desarrollo

---

**¡Listo!** Ahora puedes desarrollar cómodamente con `traza-ambiental.local` 🚀
