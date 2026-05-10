# 📚 Documentación Técnica - Sistema TrazAmbiental REP

[![Estado del Proyecto](https://img.shields.io/badge/Estado-Completado%20100%25-success)](https://github.com/your-repo)
[![Versión](https://img.shields.io/badge/Versión-1.0.1-blue)](CHANGELOG.md)
[![Licencia](https://img.shields.io/badge/Licencia-Privada-red)](LICENSE)

**Sistema TrazAmbiental** es una plataforma digital completa para la gestión integral de Neumáticos Fuera de Uso (NFU) bajo la Ley de Responsabilidad Extendida del Productor (REP) de Chile.

## 🎯 Visión del Proyecto

> Garantizar la trazabilidad completa del ciclo de vida de los neumáticos desde su introducción al mercado hasta su valorización final, asegurando el cumplimiento de metas ambientales establecidas por el Ministerio del Medio Ambiente (MMA).

---

## 📋 Documentación Central

**Recursos técnicos para desarrolladores y mantenedores**:

| Documento                                                                             | Descripción                            | Tiempo de Lectura |
| ------------------------------------------------------------------------------------- | -------------------------------------- | ----------------- |
| **[🚀 GUIA-INICIO-TECNICO.md](./GUIA-INICIO-TECNICO.md)**                             | Inicio rápido en 5 minutos             | 5 min             |
| **[📖 DOCUMENTACION-TECNICA.md](./DOCUMENTACION-TECNICA.md)**                         | Arquitectura y Manual Técnico Completo | 45 min            |
| **[📋 REGLAS-NEGOCIO.md](./REGLAS-NEGOCIO.md)**                                       | Todas las reglas de negocio            | 60 min            |
| **[🔍 GUIA-VALIDACION-PROCESO-GENERADOR.md](./GUIA-VALIDACION-PROCESO-GENERADOR.md)** | Checklist de validación end-to-end     | 30 min            |

---

## 📋 Navegación Principal

### 🏗️ Arquitectura y Diseño

- **[Arquitectura General](architecture/arquitectura.md)** - Diseño técnico y stack tecnológico
- **[Roles y Permisos](roles-y-permisos.md)** - Sistema de autorización completo
- **[Modelo de Datos](AI-MODELO-DATOS.md)** - Esquema de base de datos y relaciones

### 🔌 APIs y Endpoints

- **[Dashboard APIs](api/dashboard.md)** - Endpoints de métricas y KPIs
- **[Notificaciones APIs](api/notificaciones.md)** - Sistema de mensajería
- **[Autenticación](./DOCUMENTACION-TECNICA.md#8-apis-y-endpoints)** - Sistema de login y sesiones

### 📖 Guías de Desarrollo

- [Configuración del Entorno](guides/CONFIGURACION_ENTORNO.md)
- [Guía de Desarrollo](guides/guia-desarrollo.md)
- [Inicio Rápido](guides/INICIO-RAPIDO.md)
- [Testing](guides/TESTING.md)
- [Inicio Rápido Tests](guides/testing/INICIO-RAPIDO-TESTS.md)
- [Guía Windows](guides/GUIA_WINDOWS.md)
- [Mejores Prácticas](guides/best-practices.md)
- [Configuración Dominio Local](guides/CONFIGURACION-DOMINIO-LOCAL.md)
- [Auto-sync Prisma](guides/AUTO-SYNC-PRISMA.md)

### 🚀 Deployment

- [Deployment en Vercel](guides/deployment/DEPLOYMENT-VERCEL.md)
- [Reset de Base de Datos en Producción](guides/deployment/RESET-DB-PRODUCCION.md)
- [Plan de Pruebas Pre-Producción](guides/deployment/PLAN-PRUEBAS-PRE-PRODUCCION.md)
- [Solución Errores Vercel](guides/deployment/SOLUCION-ERROR-VERCEL.md)

### 🎯 Historias de Usuario

- [Estado de Historias de Usuario](historias-usuario/STATUS.md)
- [Historias Completadas](historias-usuario/completadas/)
- [Template para Nuevas HU](historias-usuario/TEMPLATE.md)

### 📊 Informes y Propuestas

- [Informe Final del Proyecto](INFORME-FINAL-PROYECTO-REP.md)
- [Resumen de Mejoras Transportista](RESUMEN-MEJORAS-TRANSPORTISTA.md)
- [Propuestas de Mejora](propuestas/)

### 📝 Tareas Pendientes

- [TODO](TODO.md) - Lista de tareas pendientes de desarrollo

## 🚀 Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd traza-ambiental.com

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos
npm run db:push

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# 5. Ejecutar seeds
npm run db:seed

# 6. Iniciar servidor de desarrollo
npm run dev
```

## 🛠️ Stack Tecnológico

### 🎨 Frontend

| Tecnología          | Versión | Propósito                                 |
| ------------------- | ------- | ----------------------------------------- |
| **Next.js**         | 15.x    | Framework React full-stack con App Router |
| **React**           | 18.x    | Biblioteca de componentes UI              |
| **TypeScript**      | 5.x     | Tipado estático y desarrollo seguro       |
| **Tailwind CSS**    | 3.x     | Framework CSS utilitario                  |
| **React Hook Form** | 7.x     | Gestión avanzada de formularios           |
| **Zod**             | 3.x     | Validación de esquemas                    |
| **Recharts**        | 2.x     | Gráficos interactivos                     |
| **Lucide Icons**    | 0.344   | Biblioteca de iconos                      |

### ⚙️ Backend

| Tecnología             | Versión | Propósito                  |
| ---------------------- | ------- | -------------------------- |
| **Next.js API Routes** | 15.x    | API RESTful con App Router |
| **Prisma ORM**         | 5.x     | Mapeo objeto-relacional    |
| **PostgreSQL**         | 15.x    | Base de datos principal    |
| **NextAuth.js**        | v5      | Autenticación y sesiones   |
| **web-push**           | 3.x     | Notificaciones push        |
| **Puppeteer**          | 22.x    | Generación de PDFs         |

### 🧪 Testing & QA

| Tecnología                | Propósito                      |
| ------------------------- | ------------------------------ |
| **Jest**                  | Framework de testing unitario  |
| **React Testing Library** | Testing de componentes React   |
| **Playwright**            | Tests end-to-end automatizados |

### ☁️ Infraestructura

| Tecnología                  | Propósito                  |
| --------------------------- | -------------------------- |
| **Servidor Node.js**        | Ejecución de la aplicación |
| **PostgreSQL Local**        | Base de datos relacional   |
| **Almacenamiento Local/S3** | Archivos y documentos      |

## 📊 Métricas del Proyecto

### 🎯 Estado de Desarrollo

| Métrica                    | Valor             | Estado               |
| -------------------------- | ----------------- | -------------------- |
| **Historias de Usuario**   | 19/19 completadas | ✅ **100%**          |
| **Cobertura de Testing**   | >80%              | ✅ Objetivo cumplido |
| **Performance Lighthouse** | >90               | ✅ Excelente         |
| **Endpoints API**          | 25+               | ✅ Completos         |
| **Componentes React**      | 50+               | ✅ Reutilizables     |
| **Líneas de Código**       | 15,000+           | ✅ Optimizadas       |

### 📈 Estadísticas Técnicas

- **🏗️ Arquitectura**: 6 capas bien definidas
- **🔐 Seguridad**: Autenticación JWT + RBAC
- **📱 PWA**: Funcionalidades offline incluidas
- **🌐 Cobertura**: 16 regiones + 346 comunas chilenas
- **📊 Dashboards**: 4 tipos de usuario con KPIs únicos
- **📄 PDFs**: Generación automática con Puppeteer

## 👥 Roles del Sistema REP

| Rol                       | Icono | Usuarios                   | Funciones Principales                                                                                             |
| ------------------------- | ----- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **🏢 Administrador**      | 👑    | Equipo técnico             | Gestión completa del sistema, configuración de metas REP, administración de usuarios                              |
| **📊 Sistema de Gestión** | 📈    | Autoridad ambiental        | Dashboard ejecutivo, gestión de certificados, reportes anuales, monitoreo global                                  |
| **🏪 Generador**          | 🏪    | Productores e Importadores | **ROL UNIFICADO**: Gestión operativa (retiros) y cumplimiento normativo (Declaración anual, seguimiento de metas) |
| **🚛 Transportista**      | 🚛    | Empresas de transporte     | Gestión de flota, asignación de rutas, entregas a gestores                                                        |
| **⚙️ Gestor**             | ⚙️    | Plantas de valorización    | Recepción de NFU, procesamiento y tratamientos, emisión de certificados                                           |
| **👨‍💼 Especialista**       | 🔍    | Auditores ambientales      | Monitoreo de cumplimiento normativo                                                                               |
| **👷 Operador**           | 🔧    | Personal operativo         | Operaciones diarias del sistema                                                                                   |
| **👨‍⚖️ Supervisor**         | 👁️    | Jefes de área              | Supervisión de operaciones                                                                                        |
| **🕵️ Auditor**            | 📋    | Revisores externos         | Auditoría de cumplimiento (solo lectura)                                                                          |

## 🔒 Seguridad

- **Autenticación JWT** con NextAuth.js
- **Autorización basada en roles**
- **Validación de entrada** en cliente y servidor
- **Protección CSRF**
- **Rate limiting** en APIs
- **Encriptación** de datos sensibles

## 🌟 Características Destacadas

### 📊 Dashboard Ejecutivo

- **KPIs en tiempo real** con métricas REP actualizadas
- **Gráficos interactivos** con Recharts (velocímetros, barras, mapas)
- **Mapa de Chile** con datos por región y comuna
- **Filtros avanzados** por período, tratamiento y gestor
- **Exportación múltiple** a Excel, PDF y CSV

### 📋 Sistema de Reportes Regulatorios

- **Reportes anuales automáticos** con validación SINADER
- **Múltiples formatos** de exportación (PDF, Excel, JSON)
- **Folios únicos** y códigos de verificación
- **Historial completo** de reportes generados
- **Proyección de cumplimiento** con cálculos automáticos

### 🔄 Gestión Integral del Proceso REP

- **Trazabilidad completa** desde generación hasta valorización
- **Workflow automatizado** con estados definidos
- **Notificaciones inteligentes** por email y push
- **Auditoría completa** con logs de cambios
- **Validación documental** automática

### 📱 Progressive Web App (PWA)

- **Instalación nativa** en móviles y desktop
- **Notificaciones push** en tiempo real
- **Modo offline** con sincronización automática
- **Service Worker** para cache inteligente
- **Sincronización en segundo plano**

---

## 📋 Versiones y Cambios

### [v1.0.1] - Noviembre 2025 ✅

- ✅ **Mejoras de UX/UI** - Rediseño completo Dashboard Transportista y Modales Admin
- ✅ **Bug Fixes Críticos** - Next.js 15 dynamic params, PWA Manifest, Favicon
- ✅ **Optimizaciones** - Carga de fuentes, imágenes y middleware
- ✅ **Correcciones de API** - Role casing y status codes

### [v1.0.0] - Noviembre 2025 ✅

- ✅ **Proyecto completado al 100%** - Todas las HU implementadas
- ✅ **19 Historias de Usuario** finalizadas exitosamente
- ✅ **Sistema de producción** listo para despliegue
- ✅ **Documentación completa** para desarrolladores y usuarios

**[Ver Changelog completo](./CHANGELOG.md)**

---

## 📞 Soporte y Contacto

### 🆘 Soporte Técnico

| Canal                | Contacto                                             | Disponibilidad     |
| -------------------- | ---------------------------------------------------- | ------------------ |
| **📧 Email**         | soporte@trazambiental.cl                             | L-V 9:00-18:00 CLT |
| **📱 WhatsApp**      | +56 9 1234 5678                                      | Urgencias 24/7     |
| **🐛 Issues**        | [GitHub Issues](https://github.com/your-repo/issues) | Siempre            |
| **📚 Documentación** | [docs/](.)                                           | Autoayuda          |

### 🏢 Información del Proyecto

- **Cliente**: Ministerio del Medio Ambiente (MMA) Chile
- **Desarrollador**: Sauco Group
- **Marco Legal**: Ley REP 20.920 + Decreto 8/2023
- **Alcance**: Gestión nacional de NFU (Neumáticos)

---

**📅 Última actualización**: 24 de noviembre de 2025
**🏷️ Versión**: 1.0.1 - Producción
**📍 Estado**: ✅ Completado y operativo
