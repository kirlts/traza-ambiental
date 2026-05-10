# 🏗️ Propuesta Técnica: Unificación de Módulos Generador y Productor

**Fecha**: 24 de Noviembre de 2025  
**Estado**: Propuesta de Refactorización  
**Objetivo**: Centralizar la experiencia de usuario fusionando los roles "Generador" y "Productor" en una única entidad operativa denominada **"Generador"** (o "Generador/Productor"), conservando el 100% de las funcionalidades.

---

## 1. Análisis de Situación Actual

Actualmente, el sistema trata estas dos facetas de una empresa como entidades separadas:

| Módulo Actual | Rol Técnico | Funcionalidades Clave                                   | URL Base               |
| ------------- | ----------- | ------------------------------------------------------- | ---------------------- |
| **Generador** | `Generador` | Solicitudes de retiro, Historial, Inventario            | `/dashboard/generador` |
| **Productor** | `Productor` | Metas REP, Declaraciones Anuales, Reportes Cumplimiento | `/dashboard/productor` |

**Problema Detectado**: Fragmentación. Un usuario que cumple ambas funciones debe tener dos cuentas o cambiar de rol, dificultando la visión integral de su gestión de residuos.

---

## 2. Arquitectura de la Solución

### A. Estrategia de Fusión de Roles

Se eliminará el rol `Productor` del sistema de autenticación y base de datos. El rol `Generador` heredará todas las capacidades ("capabilities") del productor.

**Nuevo Alcance del Rol Generador:**

1.  **Gestión Operativa** (Lo que ya hacía): Solicitar retiros, ver trazabilidad.
2.  **Gestión de Cumplimiento** (Lo nuevo): Configurar metas, declarar ante el sistema.

### B. Reestructuración del Dashboard (`/dashboard/generador`)

El dashboard del Generador se rediseñará para acomodar las nuevas funcionalidades sin saturar la interfaz, utilizando una estructura de navegación jerárquica:

**Nueva Estructura del Menú Lateral:**

1.  **Inicio** (Dashboard unificado con KPIs operativos y de cumplimiento).
2.  **Gestión de Retiros** (Ex-Generador):
    - Nueva Solicitud
    - Historial de Retiros
    - Certificados Recibidos
3.  **Cumplimiento REP** (Ex-Productor):
    - Mis Metas Anuales
    - Declaración de Productos
    - Reportes de Cumplimiento
4.  **Configuración**: Perfil y Usuarios.

### C. Migración de Base de Datos

No se eliminarán datos históricos. Se realizará una migración de claves foráneas:

- Registros en tabla `Meta` que apuntaban a `productorId` ahora se asociarán al `userId` del Generador.
- Registros en `DeclaracionAnual` se reasignarán de igual manera.

---

## 3. Plan de Ejecución

### Fase 1: Base de Datos y Backend

1.  **Actualizar Schema**: Modificar permisos en `src/lib/auth.ts` y `middleware.ts` para que el rol `Generador` tenga acceso a las APIs de cumplimiento.
2.  **Migración de Datos**: Script para mover usuarios con rol `Productor` al rol `Generador` y reasignar sus relaciones.

### Fase 2: Unificación de Frontend

1.  **Mover Archivos**: Trasladar las páginas de `src/app/dashboard/productor/*` hacia `src/app/dashboard/generador/cumplimiento/*`.
2.  **Integrar Componentes**: Mover los componentes de gráficos de cumplimiento (velocímetros de metas) al dashboard principal del Generador.
3.  **Actualizar Sidebar**: Modificar `Sidebar.tsx` para incluir las nuevas opciones bajo el perfil de Generador.

### Fase 3: Limpieza

1.  Eliminar directorio `src/app/dashboard/productor`.
2.  Eliminar lógica de rutas exclusivas de Productor en el middleware.

---

## 4. Beneficios Esperados

1.  **Visión 360°**: El usuario ve en una sola pantalla cuánto ha generado (operativo) y cuánto le falta para cumplir su meta legal (normativo).
2.  **Simplificación de Código**: Menos duplicidad de layouts y componentes de autenticación.
3.  **Mejor UX**: Elimina la necesidad de "cerrar sesión" para cambiar de perfil dentro de la misma empresa.

---

### ⚠️ Consideración Legal

Aunque el sistema unifique los módulos, los reportes generados (PDFs/Excels) seguirán distinguiendo entre "Solicitante" (Generador) y "Responsable Legal" (Productor) cuando la normativa lo exija, utilizando los datos de la misma cuenta unificada.
