# Guía de Inicio Técnico - TrazAmbiental.com

## Introducción

TrazAmbiental es una plataforma PWA diseñada para la gestión integral de residuos bajo la Ley REP en Chile. Esta guía está orientada a desarrolladores y arquitectos que trabajan en el proyecto.

**Stack Principal:**

- Next.js 15 (App Router)
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Tailwind CSS
- PWA (Progressive Web App)

## Arquitectura Modular

El sistema se divide en dashboards específicos por rol, ahora con una importante unificación:

1. **Administrador**: `/dashboard/admin` - Gestión de usuarios, roles y configuración global.
2. **Sistema de Gestión**: `/dashboard/sistema-gestion` - Monitoreo de metas a nivel nacional.
3. **Generador**: `/dashboard/generador` - **Rol Unificado**.
   - **Gestión Operativa**: Solicitud de retiros, inventario, movimientos.
   - **Cumplimiento REP**: Metas anuales, declaraciones, reportes.
4. **Transportista**: `/dashboard/transportista` - Gestión de flota, rutas y recolecciones.
5. **Gestor**: `/dashboard/gestor` - Recepción, tratamiento y valorización.

## Roles del Sistema

La autenticación y autorización se manejan via NextAuth.js y middleware.

- **Generador (Unificado)**: Entidad que genera el residuo (operativo) y/o lo introduce al mercado (normativo).
  - _Antes existía el rol "Productor", ahora sus funciones están bajo Generador._
- **Transportista**: Logística.
- **Gestor**: Planta de valorización.
- **Sistema de Gestión**: Entidad administradora (GRANSIC).
- **Administrador**: Superusuario.

## Flujos Críticos

1. **Solicitud de Retiro**: Generador -> Transportista -> Gestor.
2. **Trazabilidad**: Seguimiento del residuo desde origen hasta valorización.
3. **Cumplimiento**: Declaración anual de metas y reportes de cumplimiento (ahora en dashboard Generador).

## Configuración Local

1. Clonar repositorio.
2. `npm install`
3. Configurar `.env` con base de datos local.
4. `npx prisma generate`
5. `npx prisma db push`
6. `npx prisma db seed` (Crea usuarios de prueba)
7. `npm run dev`

## Usuarios de Prueba (Seeds)

- **Admin**: admin@trazambiental.com / admin123
- **Generador**: generador@trazambiental.com / generador123
- **Transportista**: transportista@trazambiental.com / transportista123
- **Gestor**: gestor@trazambiental.com / gestor123
- **Sistema Gestión**: sistema@trazambiental.com / sistema123
