# 🚀 Guía de Inicio Rápido

## Para Desarrolladores

### 1. Requisitos Previos

Asegúrate de tener instalado:

- Node.js 18.17+
- PostgreSQL 14+
- Git

### 2. Instalación (5 minutos)

```bash
# Clonar el repositorio
git clone https://github.com/tu-org/traza-ambiental.com.git
cd traza-ambiental.com

# Instalar dependencias
npm install

# Configurar variables de entorno (ya incluido)
# El archivo .env ya está configurado para PostgreSQL

# Instalar PostgreSQL (si no está instalado)
# macOS: brew install postgresql && brew services start postgresql
# Ubuntu: sudo apt install postgresql postgresql-contrib

# Crear base de datos
createdb traza_ambiental_dev

# Configurar base de datos
npx prisma migrate dev
npx prisma generate
npx prisma db seed

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Acceder al Sistema

Abre tu navegador en: `http://localhost:3000`

### 4. Usuarios de Prueba

| Rol           | Email                           | Contraseña       |
| ------------- | ------------------------------- | ---------------- |
| Admin         | admin@trazambiental.com         | admin123         |
| Generador     | generador@trazambiental.com     | generador123     |
| Productor     | productor@trazambiental.com     | productor123     |
| Transportista | transportista@trazambiental.com | transportista123 |
| Gestor        | gestor@trazambiental.com        | gestor123        |
| Especialista  | especialista@trazambiental.com  | especialista123  |

---

## Para Usuarios Finales

### 1. Acceder al Sistema

Visita la URL proporcionada por tu organización (ej: `https://app.trazambiental.com`)

### 2. Iniciar Sesión

- Ingresa tu email y contraseña
- Si es tu primer acceso, usa las credenciales temporales que recibiste por email
- Se te pedirá cambiar la contraseña

### 3. Explorar tu Dashboard

Cada rol tiene un dashboard personalizado con las funciones que necesitas.

### 4. Ayuda Rápida

- **?** Ícono de ayuda en la esquina superior derecha
- **Documentación** en el menú lateral
- **Soporte** vía email: soporte@trazambiental.com

---

## Próximos Pasos

### Para Desarrolladores

1. Lee la [Guía de Desarrollo](./guia-desarrollo.md)
2. Revisa la [Arquitectura del Sistema](./arquitectura.md)
3. Consulta la [API Reference](./api-reference.md)

### Para Usuarios

1. Lee la guía de tu rol específico en [Guías de Usuario](./guias-usuario/)
2. Familiarízate con [Roles y Permisos](./roles-y-permisos.md)
3. Consulta el [Glosario](./glosario.md) para términos técnicos

---

## ¿Necesitas Ayuda?

- 📧 Email: soporte@trazambiental.com
- 📚 Documentación completa: [/docs](./README.md)
- 💬 Comunidad: [GitHub Discussions](link)

---

**¡Bienvenido a TrazAmbiental!** 🌱
