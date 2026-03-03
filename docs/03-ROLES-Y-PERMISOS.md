# 03 - MATRIZ DE ROLES, PERMISOS (RBAC) Y PERFILES LEGALES

> **Documento de Transición Técnico - Equipo Interno Traza Ambiental**
> **Versión Refactorizada:** 1.0 (Febrero 2026)
> **Contexto Operativo (Documentación Activa):** Este documento está redactado intencionalmente como una guía rápida y ejecutiva para orientar al nuevo equipo de desarrollo. Su objetivo es la legibilidad y estructura. **NO busca reemplazar ni destruir** la granularidad algorítmica y técnica creada por el proveedor original (OpenTech). Para consultar tablas completas de QA, diccionarios exhaustivos o reglas matemáticas granulares, diríjase al repositorio pasivo en `docs/archive-opentech/`.

---

## 1. Topología del Sistema y Control de Acceso Automático

El núcleo transaccional descansa sobre `NextAuth.js v5` mediante tokens `JWT`. El middleware de enrutamiento y las funciones `Server Actions` de Prisma interceptan las credenciales basándose estrictamente en uno de estos **10 niveles jerárquicos** (del Nivel 1, mínimo, al Nivel 5, administrativo).

### La Matriz Fundamental de Privilegios (CRUD)

| Funcionalidad                 | Admin (L5)   | Especialista (L4) | Gestor (L2)    | Transportista (L2)   | Generador (L2)     | Auditor (Solo Lectura) |
| ----------------------------- | ------------ | ----------------- | -------------- | -------------------- | ------------------ | ---------------------- |
| **Asignar Roles/Cuentas**     | ✅ Crear/Del | ❌                | ❌             | ❌                   | ❌                 | ❌                     |
| **Declarar Intro. de NFU**    | ✅ Override  | 👁️ Leer           | ❌             | ❌                   | ✅ Crear/Modificar | 👁️ Leer                |
| **Crear Guías Transporte**    | ✅ Override  | 👁️ Leer           | ❌             | ✅ Crear/Recolección | ❌                 | 👁️ Leer                |
| **Firmar Entregas Planta**    | ✅ Override  | ❌                | ✅ Firmar      | ✅ Firmar            | ❌                 | ❌                     |
| **Registrar Recepción NFU**   | ✅ Override  | 👁️ Leer           | ✅ Crear/Mod   | ❌                   | ❌                 | 👁️ Leer                |
| **Emitir Certificado QR**     | ✅ Override  | ❌                | ✅ Autogenerar | ❌                   | ❌                 | ❌                     |
| **Definir Metas Anuales REP** | ✅ Override  | ✅ Editar         | ❌             | ❌                   | ❌                 | ❌                     |
| **Dashboards / Reportes**     | ✅ Total     | ✅ Total          | 📊 Parcial     | 📊 Parcial           | 📊 Parcial         | 👁️ Total               |
| **Exportar Excel/CSV DB**     | ✅ Total     | ✅ Total          | ✅ Relacional  | ✅ Relacional        | ✅ Relacional      | ✅ Total               |
| **Ver Logs Completos**        | ✅ Total     | ✅ Total          | ❌             | ❌                   | ❌                 | ✅ Total               |

### Notas Vitales de Arquitectura:

- **Rol Unificado:** OpenTech eliminó la antigua dicotomía _Productor_ vs _Generador_ integrándolos funcionalmente. El Generador es hoy la cuenta maestra logística y contable por defecto.
- **Marca de Agua Auditoria:** Para el rol "Auditor", la Interfaz desactiva (`disabled`) absolutamente todas las llamadas de servidor tipo `POST/PATCH/DELETE` y muestra una visualización forense de la plataforma.

---

## 2. Requisitos de Activación por Rol Operativo (Onboarding)

La cuenta no sirve para operar (solicitar pings de transporte o acopio) a menos que esté documentadamente calificada por el Admin (`Estado PENDIENTE_VERIFICACION -> VERIFICADO`).

### 2.1 Módulo Transportista (`HU-016`)

- **[Obligatorio]** Res. Sanitaria de Transporte (MINSAL). Validada contra el Decreto 148/2003. Posee fecha de vencimiento (`alertas a 15 y 30 días`).
- **[Obligatorio]** Revisión Técnica Válida MT (Vencimiento Semestral o Anual).
- **[Obligatorio]** Permiso de Circulación (Vencimiento: 31/Marzo de cada año).
- _(Optativo)_ Certificado de Antecedentes de Conductor (Registro Civil, 60 días).

### 2.2 Módulo Gestor (Planta Revalorizadora)

- **[Obligatorio]** Autorización Sanitaria de Planta (MINSAL). Detalla el Kilo/Capacidad de la planta.
- **[Obligatorio]** Inscripción en SINADER (MMA) para gestores de Ley REP. No vence, pero su pérdida (eliminación legal externa) debe notificarse.
- _(Condicional)_ R.C.A por Servicio de Evaluación Ambiental si su volumen cruza umbrales críticos de procesamiento.

---
