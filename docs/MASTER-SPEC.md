# MASTER-SPEC: Traza Ambiental

## 1. Propósito Guía

Plataforma integral para la gestión de productos prioritarios bajo la Ley REP Chile.

## 2. Usuarios y Roles

- Generadores (Productores)
- Transportistas
- Gestores
- Administradores de Sistema

## 3. Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), TailwindCSS, TypeScript. Construcción y bundling vía Turbopack. Opciones de estado asíncrono gestionadas a través de TanStack Query.
- **Backend**: API Routes, Prisma. Generación de PDFs integrada con Puppeteer y PDFKit. Background jobs mediante cron nativo para notificaciones/vencimientos.
- **Base de Datos**: PostgreSQL.
- **Autenticación**: NextAuth.js v5.

## 4. Restricciones Técnicas

- Cero errores programáticos (TypeScript + ESLint).
- Prohibición del uso de `any` sin justificación extrema.
- Cumplimiento estricto de accesibilidad e integridad de datos.

## 5. Arquitectura de Datos y Autenticación

- **Seguridad y RBAC (Role-Based Access Control)**: Centralizada al nivel del `middleware.ts`. La validación de rutas y operaciones críticas evita validaciones de cliente redundantes inyectándose a nivel top-level.
- **Modelo de Sesión Explicita**: El token JWT y la sesión transmiten de manera integral campos clave como `rol`, `roles`, y `rut`, permitiendo un control granular de autorizaciones y consultas de dominio.

## 6. Foco Estratégico Actual: Módulo Minería (Modo Demo)

El desarrollo a corto plazo (próximo mes) se centra exclusivamente en la vertical "Minería". Se prioriza la construcción de un **"Modo Demo"** puramente visual para que el Stakeholder valide la experiencia de usuario (UX) de los 5 roles base y el ciclo de vida del residuo.

- Regla FrontEnd: Las pantallas Demo (`/demo/*`) deben operar mediante funciones Mock/bypass de NextAuth.
- Criterio Kairós §6: Se exige estética premium (cero slop) al construir las vistas.

## 7. Procedimientos Adicionales (Checklist de Integridad Kairós)

Cualquier bloque de ejecución que demande alteraciones en arquitectura o core-logic DEBE estar precedido por:

- Declaración de una Checklist de Integridad (en `implementation_plan.md` si es planning).
- Sincronización continua de progreso en `TODO.md` respetando estructura `[EPIC-nnn] / [TASK-nnn]`.
- En caso de nuevos workflows, actualizar `MASTER-SPEC.md` §4 (Restricciones).
