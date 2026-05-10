# 01 - ARQUITECTURA, DEPLOYMENT Y ESTADO DEL MVP

> **Documento de Transición Técnico - Equipo Interno Traza Ambiental**
> **Versión Refactorizada:** 1.0 (Febrero 2026)
> **Contexto Operativo (Documentación Activa):** Este documento está redactado intencionalmente como una guía rápida y ejecutiva para orientar al nuevo equipo de desarrollo. Su objetivo es la legibilidad y estructura. **NO busca reemplazar ni destruir** la granularidad algorítmica y técnica creada por el proveedor original (OpenTech). Para consultar tablas completas de QA, diccionarios exhaustivos o reglas matemáticas granulares, diríjase al repositorio pasivo en `docs/archive-opentech/`.

---

## 1. Visión General del Sistema TrazAmbiental

**TrazAmbiental** es una plataforma digital unificada (PWA) estructurada para la gestión y trazabilidad de Neumáticos Fuera de Uso (NFU) rigiéndose bajo la **Ley REP (Ley N°20.920)** y el **Decreto Supremo N°8/2023** de Chile.

Su objetivo es conectar y auditar a todos los eslabones logísticos:

1. **Generadores (Ex Productores)**
2. **Transportistas**
3. **Gestores (Centros de Valorización)**
4. **Sistema de Gestión** (Autoridad o GRANSIC)

---

## 2. Definición Arquitectónica y Stack Tecnológico

El sistema fue diseñado como un **Monolito Full-Stack** apoyado fuertemente en rutas _serverless_ prescindiendo de microservicios externos para priorizar el mantenimiento ("Mínimas Partes Móviles").

### 2.1 Capa de Presentación (Frontend)

- **Framework Core:** Next.js 16.x utilizando el paradigma `App Router` y Turbopack.
- **Librería UI:** React 19.x con Tailwind CSS 4.x para el sistema de diseño estructurado.
- **Componentes Base:** Shadcn/ui para primitivas accesibles y Lucide Icons (v0.344) para la iconografía.
- **Manejo de Formularios y Estados:** React Hook Form entrelazado con `Zod` (v3.x) para un tipado y validación estricta desde el cliente hasta el modelo. `React Query` administra el estado y caché del lado del cliente.
- **Visualización Analítica:** Dashboards impulsados por `Recharts` 2.x para el modelado de KPIs en tiempo real (Ej. metas de toneladas REP).
- **Usabilidad PWA:** Configurado como Progressive Web App para soportar notificaciones push y operaciones robustas en ambientes móviles (crítico para los choferes de transporte).

### 2.2 Capa de Negocio y Lógica (Backend)

- **Paradigma de API:** Next.js API Routes proveyendo más de 25 endpoints RESTful completamente tipados.
- **Base de Datos Principal:** PostgreSQL 15.x como única fuente de verdad transaccional.
- **Capa ORM:** Prisma ORM 6.x. Encargado de las migraciones, la seguridad anti inyecciones SQL y la validación relacional.
- **Capa de Identidad y Acceso (IAM):** NextAuth.js v5 orquesta las sesiones mediante _JSON Web Tokens_ (JWT), inyectando el Rol del usuario (RBAC) a nivel Context/Middleware. Todas las rutas se blindan bajo el paradigma de comprobación estricta de variables de sesión.

### 2.3 Capa de Procesamiento Logístico Pesado

- **Generación Inmutable Documental:** Uso de **Puppeteer (24.x)** (procesamiento Headless) para vectorizar los "Certificados REP" y "Guías de Despacho" con folios fijos y metadatos anclados por hashing SHA-256.
- **Framework de Testing Múltiplo:** Pruebas unitarias en `Jest`, de componentes en `React Testing Library` y testing End-To-End orquestado vía `Playwright`.

---

## 3. Guía de Ejecución y Onboarding Técnico (Setup)

Para que cualquier ingeniero del equipo pueda inicializar una instancia prístina de desarrollo o pre-producción:

### 3.1 Entorno Local (Secuencia de Arranque)

1. **Gestión de Clonado e Instalación**

   ```bash
   git clone <repository-url>
   cd traza-ambiental.com
   npm install
   ```

2. **Configuración de Variables de Entorno**
   - Importar el `.env.example` hacia `.env.local`.
   - Ajustar las conexiones `DATABASE_URL`, el token `AUTH_SECRET`, y los hooks hacia servicios de almacenamiento (S3 o FileSystem local) y de email (si existiesen como MailGun/SMTP).

3. **Inyección Transaccional (Prisma)**
   - El equipo OpenTech restringió (por política de integridad) la manipulación en crudo del esquema Postgres. El archivo `prisma/schema.prisma` es sagrado.

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Semillas (Seeds) y Testing Data**

   ```bash
   npm run db:seed
   # Población de prueba generada:
   # admin@trazambiental.com
   # generador@trazambiental.com
   # transportista@trazambiental.com
   # gestor@trazambiental.com
   # sistema@trazambiental.com
   # (Contraseña estándar para los seeds: [rol]123)
   ```

5. **Lanzamiento (Development Server)**
   ```bash
   npm run dev
   ```

### 3.2 Protocolos de Despliegue Cloud (Vercel)

El proyecto está configurado bajo métricas Vercel (CI/CD):

- Enlazar repositorio Github con proyecto Vercel.
- Agregar las variables `.env` de producción en los _Settings_.
- En la etapa de pre-build, Vercel ejecuta implícitamente `prisma generate`.
- Se asume el uso de una base externa de PostgreSQL (AWS RDS o similar) alojada, en lugar del uso de PGBouncer para la escalabilidad serverless de Prisma.

---

## 4. Estado de Completitud Funcional (Métricas MVP)

Al cierre operativo de OpenTech (Noviembre - Diciembre 2025), el software TrazAmbiental asume un estado v1.0.1 listado como **"Completado a Nivel MVP"**.

### Resumen de Cumplimiento Logrado

- **33 de 33 Historias de Usuarios (Épicas)** cerradas funcionalmente.
- **Componentes Listos:** > 60 componentes atómicos construidos en el ecosistema Shadcn.
- **APIs:** 30+ endpoints consumibles listos.
- **Performance:** Lighthouse > 90 validado.

### Evolución de Módulos (Changelog de Entrega)

1. **Unificación de Roles "Generador/Productor":** Inicialmente divididos, el MVP entregó un solo dashboard consolidado de "Generador" que aloja tanto la logística operativa (Solicitudes de recolección de chatarra/nfu) como el compliance legal REP (las declaraciones anuales).
2. **Dashboard Transportista Reseteado:** Flujo re-estructurado para agilizar asignación de rutas y comprobante de recolección geolocalizada.
3. **Firmas y Trazabilidad:** Implementación del SHA-256 en documentos para verificación inmutable mediante códigos QR.
4. **Migración Analítica Transaccional:** El archivo transaccional `AnalyticsDailySummary` fue recuperado el 25/Nov/2025 permitiendo velocidad en las consultas agregadas del dashboard para el Ministerio de Medio Ambiente.

### Estado Final y Recomendación

El sistema se encuentra operacionalmente listo para realizar ciclos de trazabilidad _end-to-end_. Nuestra **próxima frontera de ingeniería** no reside en la construcción del core funcional, sino en la estabilización de los pipelines E2E, el profiling de las _querys_ pesadas para evitar cuellos de botella severos a medida que la tabla transaccional crezca y la exploración del API de RETC (CKAN) solicitada dentro de las épicas de escalabilidad futura.
