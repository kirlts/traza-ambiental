# 🚀 Inicio Rápido - Dominio Local

## ¡Un solo comando!

### Iniciar el servidor (automático)

```bash
sudo npm run dev
```

¡Eso es todo! El script:

- ✅ Detecta si necesitas configuración inicial
- ✅ Configura automáticamente el archivo hosts
- ✅ Crea el archivo `.env.local` si no existe
- ✅ Inicia el servidor Next.js en el puerto 80
- ✅ Abre automáticamente el navegador en `http://traza-ambiental.local`

**Nota:**

- Se requiere `sudo` porque el puerto 80 necesita permisos de administrador
- La URL no necesita puerto, quedando más limpia: `http://traza-ambiental.local`

---

## Configuración manual (opcional)

Si prefieres configurar el dominio antes de iniciar el servidor:

```bash
npm run setup:domain
```

Luego inicia normalmente:

```bash
npm run dev
```

---

## 📝 Comandos Disponibles

```bash
# Configurar el dominio local (solo primera vez)
npm run setup:domain

# Iniciar servidor con auto-apertura del navegador (puerto 80)
sudo npm run dev

# Iniciar servidor sin abrir navegador (puerto 80)
sudo npm run dev:server

# Iniciar en localhost tradicional (puerto 3000)
npm run dev:default

# Detener servidor (puerto 80)
sudo lsof -ti:80 | xargs sudo kill -9

# Detener servidor (puerto 3000)
npm run dev:stop
```

---

## 🔍 ¿Problemas?

Consulta la [Guía Completa de Configuración](./docs/guides/CONFIGURACION-DOMINIO-LOCAL.md) para:

- Configuración manual
- Solución de problemas
- Configuración avanzada

---

## 🌐 Sistemas Soportados

- ✅ macOS (todas las versiones) - Requiere `sudo`
- ✅ Linux (Ubuntu, Debian, Fedora, etc.) - Requiere `sudo`
- ⚠️ Windows 10/11 - Requiere ejecutar terminal como Administrador

**Nota:** El puerto 80 es un puerto privilegiado que requiere permisos de administrador en todos los sistemas operativos.

---

**¿Primera vez usando el proyecto?**

1. Clona el repositorio
2. Ejecuta `npm install`
3. Ejecuta `npm run setup:domain`
4. Ejecuta `sudo npm run dev`

¡Ya está! Accede en `http://traza-ambiental.local` 🎉
