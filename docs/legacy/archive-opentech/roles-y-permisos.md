# Roles y Permisos del Sistema

## Introducción

El Sistema de Gestión REP TrazAmbiental implementa un sistema de Control de Acceso Basado en Roles (RBAC - Role-Based Access Control) que garantiza que cada usuario solo pueda acceder a las funcionalidades necesarias para su trabajo.

## Roles Disponibles

### 1. Administrador ⚙️

**Descripción:** Acceso completo al sistema y todas sus funcionalidades. Puede gestionar usuarios, roles y configuraciones del sistema.

**Responsabilidades:**

- Gestión de usuarios y roles
- Configuración del sistema
- Supervisión general de la plataforma
- Administración de permisos y accesos
- Resolución de problemas técnicos

**Permisos:**

- ✅ Crear, editar y eliminar usuarios
- ✅ Asignar y revocar roles
- ✅ Configurar parámetros del sistema
- ✅ Acceso a todos los módulos
- ✅ Visualizar logs de auditoría completos
- ✅ Gestionar integraciones y APIs
- ✅ Realizar copias de seguridad y restauraciones

**Dashboard:**

- Panel de control administrativo
- Estadísticas globales del sistema
- Gestión de usuarios y roles
- Configuración del sistema
- Logs de auditoría

---

### 2. Generador (Productor) 🏭

**Descripción:** Productor/importador de neumáticos. Responsable de la gestión financiera y operativa de los NFU generados por sus productos según la Ley REP.

**Base Legal:** Ley 21.216 y Decreto Supremo N°8/2023 del MMA

**Responsabilidades:**

- Registrar neumáticos introducidos al mercado chileno
- Declarar volúmenes de importación/producción
- Financiar la recolección y valorización de NFU
- Cumplir con metas anuales establecidas por el MMA
- Reportar al Ministerio del Medio Ambiente

**Permisos:**

- ✅ Registrar nuevos neumáticos en el sistema
- ✅ Declarar volúmenes de importación/producción
- ✅ Ver historial de productos introducidos
- ✅ Solicitar recolección de NFU
- ✅ Visualizar certificados de valorización
- ✅ Generar reportes de cumplimiento
- ✅ Acceder a dashboard de metas REP
- ❌ Modificar certificados emitidos
- ❌ Acceder a datos de otros generadores

**Dashboard:**

- Metas de recolección y valorización
- Volúmenes declarados vs. valorizados
- Certificados recibidos
- Estado de cumplimiento REP
- Costos de gestión

**KPIs Principales:**

- % de cumplimiento de meta anual
- Toneladas introducidas al mercado
- Toneladas valorizadas
- Costo por tonelada gestionada

---

### 3. Productor 🏢

**Descripción:** Responsable del cumplimiento de la Ley REP como introductor de neumáticos al mercado nacional. Gestiona metas de recolección y valorización, reportes de cumplimiento y coordinación con sistemas de gestión.

**Base Legal:** Ley N° 20.920 (Ley REP) y Decreto Supremo N°8/2023 del MMA

**Responsabilidades:**

- Inscripción anual en el Registro de Productores (SINADER)
- Declaración Anual de Productos Prioritarios (DAP)
- Implementación o adhesión a Sistema de Gestión (SIG/SGI)
- Cumplimiento de metas de recolección y valorización
- Reportes de cumplimiento al MMA
- Información al consumidor sobre gestión de NFU
- Auditoría y supervisión de gestores autorizados

**Permisos:**

- ✅ Configurar y gestionar metas anuales REP
- ✅ Dashboard de cumplimiento global
- ✅ Análisis regional de cumplimiento
- ✅ Integración con sistemas de gestión (SIG/SGI)
- ✅ Generación de reportes regulatorios
- ✅ Monitoreo de KPIs de cumplimiento
- ✅ Gestión de certificados de valorización
- ✅ Auditoría de gestores y transportistas
- ✅ Proyecciones y planificación estratégica
- ❌ Modificar datos históricos de otros productores
- ❌ Acceder a información confidencial de competidores

**Dashboard:**

- Cumplimiento global de metas REP
- Proyecciones de cumplimiento anual
- Análisis por región y tipo de neumático
- Integración con sistemas de gestión
- Reportes automáticos para autoridades
- KPIs de eficiencia y costos

**KPIs Principales:**

- % de cumplimiento de meta anual de recolección
- % de cumplimiento de meta anual de valorización
- Costo por tonelada gestionada
- Eficiencia del sistema de gestión
- Tiempo promedio de procesamiento
- Índice de satisfacción con gestores

**Funcionalidades Específicas:**

- Calculadora automática de metas basada en volúmenes introducidos
- Sistema de alertas de cumplimiento
- Integración automática con certificados de gestores
- Reportes regulatorios automáticos
- Análisis de tendencias y proyecciones
- Gestión de contratos con gestores autorizados

---

### 4. Transportista 🚛

**Descripción:** Responsable del transporte y logística de los Neumáticos Fuera de Uso (NFU) desde los puntos de recolección hasta los gestores autorizados.

**Responsabilidades:**

- Recolectar NFU de puntos autorizados
- Transportar NFU a instalaciones de gestores
- Registrar movimientos y cantidades
- Emitir guías de transporte
- Mantener trazabilidad durante el transporte
- Cumplir normativas de transporte de residuos

**Permisos:**

- ✅ Registrar recolecciones de NFU
- ✅ Crear y actualizar guías de transporte
- ✅ Escanear códigos de identificación de NFU
- ✅ Registrar cantidades y pesos
- ✅ Firmar digitalmente entregas
- ✅ Visualizar rutas asignadas
- ✅ Reportar incidentes o problemas
- ❌ Modificar registros históricos
- ❌ Acceder a información financiera

**Dashboard:**

- Rutas y recolecciones programadas
- Entregas completadas
- Toneladas transportadas
- Incidentes reportados
- Eficiencia de rutas

**KPIs Principales:**

- Toneladas transportadas/mes
- % de entregas a tiempo
- Eficiencia de rutas
- Incidentes de transporte

---

### 5. Gestor ♻️

**Descripción:** Encargado de la valorización y procesamiento final de los NFU. Emite certificados digitales de valorización y gestiona el tratamiento de residuos.

**Responsabilidades:**

- Recibir NFU de transportistas
- Procesar y valorizar neumáticos
- Registrar métodos de valorización utilizados
- Emitir certificados digitales de valorización
- Reportar rendimientos de valorización
- Cumplir normativas ambientales

**Tipos de Valorización:**

- Reciclaje material
- Valorización energética
- Reutilización
- Otros procesos autorizados

**Permisos:**

- ✅ Registrar recepción de NFU
- ✅ Registrar procesos de valorización
- ✅ Emitir certificados digitales (automáticos)
- ✅ Actualizar capacidades de procesamiento
- ✅ Reportar rendimientos
- ✅ Visualizar historial de procesos
- ✅ Generar reportes técnicos
- ❌ Modificar certificados ya emitidos
- ❌ Eliminar registros de recepción

**Dashboard:**

- NFU recibidos pendientes de procesamiento
- Capacidad utilizada vs. disponible
- Certificados emitidos
- Rendimientos de valorización
- Métodos de valorización utilizados

**KPIs Principales:**

- Toneladas valorizadas/mes
- % de capacidad utilizada
- Rendimiento por método de valorización
- Certificados emitidos

---

### 6. Especialista de Sistema de Gestión REP 📊

**Descripción:** Especialista en Sistema de Gestión REP. Monitorea el cumplimiento de metas, genera reportes y optimiza procesos según normativa del MMA.

**Base Legal:** Decreto Supremo N°1/2021 del MMA

**Responsabilidades:**

- Acceder al Dashboard de Cumplimiento Global
- Definir y actualizar metas anuales REP
- Monitorear flujo de datos del sistema
- Analizar cumplimiento y desviaciones
- Generar reportes para stakeholders
- Identificar mejoras en procesos
- Asegurar cumplimiento normativo
- Preparar informes para autoridades

**Permisos:**

- ✅ Acceso completo a Dashboard de Cumplimiento
- ✅ Definir metas anuales de recolección/valorización
- ✅ Visualizar datos de todos los actores
- ✅ Generar reportes avanzados
- ✅ Filtrar datos por región, período, etc.
- ✅ Exportar datos para análisis
- ✅ Configurar alertas de cumplimiento
- ✅ Visualizar todos los certificados
- ❌ Modificar datos operacionales
- ❌ Emitir o modificar certificados

**Dashboard:**

- Vista global de cumplimiento REP
- Progreso vs. metas anuales
- Análisis por región
- Tendencias y proyecciones
- Alertas de incumplimiento
- Comparativas históricas

**KPIs Principales:**

- % de cumplimiento de meta anual nacional
- % de cumplimiento por región
- Brecha entre meta y realizado
- Proyección de cumplimiento fin de año
- Eficiencia de la cadena de gestión

**Herramientas:**

- Dashboard interactivo con filtros avanzados
- Generador de reportes personalizados
- Sistema de alertas automáticas
- Exportación a Excel, PDF, CSV
- Visualización de certificados digitales

---

### 7. Sistema de Gestión ♻️🏛️

**Descripción:** Sistema de Gestión Colectivo o Individual responsable de cumplir con las metas anuales de recolección y valorización de NFU establecidas en el D.S. N°8, actuando en nombre de uno o múltiples productores adheridos.

**Base Legal:** Ley N° 20.920 (Ley REP) - Artículo 10, Decreto Supremo N°8/2023 del MMA

**Responsabilidades:**

- Configurar y monitorear metas anuales de recolección y valorización
- Coordinar la recolección de NFU con transportistas
- Supervisar procesos de valorización con gestores
- Reportar avances de cumplimiento a productores adheridos
- Garantizar el cumplimiento de obligaciones REP
- Mantener auditoría completa de operaciones
- Generar reportes de cumplimiento para el MMA
- Optimizar logística y costos de gestión

**Permisos:**

- ✅ Configurar metas anuales de recolección y valorización
- ✅ Ver dashboard de cumplimiento en tiempo real
- ✅ Modificar metas (con justificación y auditoría)
- ✅ Importar metas desde declaraciones de productores
- ✅ Visualizar historial de metas de años anteriores
- ✅ Acceder a proyecciones de cumplimiento
- ✅ Ver desgloses por categoría y tratamiento
- ✅ Recibir notificaciones de cumplimiento
- ✅ Visualizar certificados de valorización
- ✅ Generar reportes de avance
- ❌ Modificar metas con avance registrado sin justificación
- ❌ Eliminar metas históricas
- ❌ Acceder a datos de otros sistemas de gestión

**Dashboard:**

- Metas configuradas para año actual
- Avance en toneladas y porcentaje
- Barras de progreso visuales
- Proyección de cumplimiento al final del año
- Alertas de ritmo insuficiente
- Comparación con años anteriores
- Estados visuales (crítico, alerta, en progreso, cumplido)

**KPIs Principales:**

- % de cumplimiento meta de recolección
- % de cumplimiento meta de valorización
- Toneladas recolectadas / meta anual
- Toneladas valorizadas / meta anual
- Ritmo actual (ton/mes)
- Proyección de cumplimiento fin de año
- Días restantes para cumplir meta

**Funcionalidades Específicas:**

- Configuración manual de metas con validaciones
- Importación automática desde declaraciones
- Cálculo automático de avance basado en certificados
- Proyección inteligente de cumplimiento
- Alertas tempranas de incumplimiento
- Historial completo con estados (cumplida/incumplida)
- Sistema de auditoría de cambios
- Desgloses opcionales por categoría/tratamiento/región
- Notificaciones al alcanzar 90% de meta

**URLs del Sistema:**

- `/dashboard/sistema-gestion` - Dashboard principal
- `/dashboard/sistema-gestion/configuracion-metas` - Configuración de metas

**Credenciales de Prueba:**

```
Email: sistema@trazambiental.com
Contraseña: sistema123
```

---

### 8. Operador 👤

**Descripción:** Puede gestionar registros de neumáticos y realizar operaciones básicas del día a día en el sistema.

**Responsabilidades:**

- Ingreso de datos operacionales
- Actualización de registros básicos
- Verificación de información
- Soporte operacional diario

**Permisos:**

- ✅ Crear registros de operaciones
- ✅ Actualizar información básica
- ✅ Visualizar datos operacionales
- ✅ Generar reportes básicos
- ❌ Eliminar registros
- ❌ Modificar configuraciones
- ❌ Acceder a información financiera

**Dashboard:**

- Tareas pendientes
- Registros del día
- Alertas operacionales
- Estadísticas básicas

---

### 9. Supervisor 👁️

**Descripción:** Puede supervisar operaciones, revisar registros y generar reportes de actividades del sistema.

**Responsabilidades:**

- Supervisión de operaciones diarias
- Revisión de registros
- Validación de información
- Generación de reportes operacionales
- Resolución de inconsistencias

**Permisos:**

- ✅ Visualizar todas las operaciones
- ✅ Revisar y validar registros
- ✅ Generar reportes detallados
- ✅ Acceder a logs de actividad
- ✅ Exportar información
- ❌ Modificar configuraciones del sistema
- ❌ Eliminar registros auditables
- ❌ Gestionar usuarios

**Dashboard:**

- Resumen de operaciones diarias
- Registros pendientes de validación
- Reportes de desempeño
- Alertas y excepciones
- Actividad de usuarios

**KPIs Principales:**

- Registros procesados/día
- Excepciones detectadas
- Tiempo promedio de validación
- Eficiencia operacional

---

### 10. Auditor 🔍

**Descripción:** Acceso de solo lectura para auditoría y revisión de cumplimiento normativo. Puede visualizar datos sin realizar cambios.

**Responsabilidades:**

- Auditoría de procesos y registros
- Verificación de cumplimiento normativo
- Revisión de trazabilidad
- Evaluación de controles internos
- Generación de informes de auditoría

**Permisos:**

- ✅ Visualizar todos los registros (solo lectura)
- ✅ Acceder a logs de auditoría completos
- ✅ Generar reportes de auditoría
- ✅ Exportar datos para análisis
- ✅ Visualizar certificados y documentos
- ✅ Revisar trazabilidad completa
- ❌ Crear, modificar o eliminar cualquier dato
- ❌ Acceder a configuraciones del sistema
- ❌ Realizar operaciones que generen cambios

**Dashboard:**

- Vista de auditoría completa
- Logs de actividad del sistema
- Trazabilidad de operaciones
- Inconsistencias detectadas
- Reportes de cumplimiento

**Características Especiales:**

- Marca de agua "SOLO LECTURA" en todas las vistas
- Sin botones de edición o creación
- Exportación con sello de auditoría
- Registro automático de accesos del auditor

---

## Matriz de Permisos

| Funcionalidad            | Admin | Generador | Transportista | Gestor | Especialista | Operador | Supervisor | Auditor |
| ------------------------ | ----- | --------- | ------------- | ------ | ------------ | -------- | ---------- | ------- |
| **Gestión de Usuarios**  |
| Crear usuarios           | ✅    | ❌        | ❌            | ❌     | ❌           | ❌       | ❌         | ❌      |
| Editar usuarios          | ✅    | ❌        | ❌            | ❌     | ❌           | ❌       | ❌         | ❌      |
| Eliminar usuarios        | ✅    | ❌        | ❌            | ❌     | ❌           | ❌       | ❌         | ❌      |
| Asignar roles            | ✅    | ❌        | ❌            | ❌     | ❌           | ❌       | ❌         | ❌      |
| **Neumáticos**           |
| Registrar introducción   | ✅    | ✅        | ❌            | ❌     | 👁️           | ✅       | 👁️         | 👁️      |
| Declarar volúmenes       | ✅    | ✅        | ❌            | ❌     | 👁️           | ❌       | 👁️         | 👁️      |
| **Transporte**           |
| Crear guías transporte   | ✅    | ❌        | ✅            | ❌     | 👁️           | ✅       | 👁️         | 👁️      |
| Registrar recolección    | ✅    | ❌        | ✅            | ❌     | 👁️           | ✅       | 👁️         | 👁️      |
| Firmar entregas          | ✅    | ❌        | ✅            | ✅     | ❌           | ❌       | ❌         | ❌      |
| **Valorización**         |
| Registrar recepción NFU  | ✅    | ❌        | ❌            | ✅     | 👁️           | ✅       | 👁️         | 👁️      |
| Registrar valorización   | ✅    | ❌        | ❌            | ✅     | 👁️           | ❌       | 👁️         | 👁️      |
| Emitir certificados      | ✅    | ❌        | ❌            | ✅     | ❌           | ❌       | ❌         | ❌      |
| **Metas y Cumplimiento** |
| Definir metas REP        | ✅    | ❌        | ❌            | ❌     | ✅           | ❌       | ❌         | ❌      |
| Dashboard cumplimiento   | ✅    | 👁️        | ❌            | ❌     | ✅           | ❌       | 👁️         | 👁️      |
| Reportes avanzados       | ✅    | 📊        | 📊            | 📊     | ✅           | 📊       | ✅         | 👁️      |
| **Auditoría**            |
| Ver logs completos       | ✅    | ❌        | ❌            | ❌     | ✅           | ❌       | ✅         | ✅      |
| Exportar datos           | ✅    | ✅        | ✅            | ✅     | ✅           | ✅       | ✅         | ✅      |
| **Configuración**        |
| Configurar sistema       | ✅    | ❌        | ❌            | ❌     | ❌           | ❌       | ❌         | ❌      |
| Gestionar integraciones  | ✅    | ❌        | ❌            | ❌     | ❌           | ❌       | ❌         | ❌      |

**Leyenda:**

- ✅ Acceso completo (lectura y escritura)
- 👁️ Solo lectura
- 📊 Reportes limitados a su ámbito
- ❌ Sin acceso

## Jerarquía de Roles

```
Administrador (Nivel 5 - Máximo)
    ↓
Especialista Sistema Gestión (Nivel 4)
    ↓
Supervisor (Nivel 3)
    ↓
Generador / Transportista / Gestor (Nivel 2 - Roles operacionales)
    ↓
Operador (Nivel 1)

Auditor (Nivel independiente - Solo lectura transversal)
```

## Asignación de Roles

### Criterios de Asignación

1. **Administrador:** Personal TI y de gestión de sistemas
2. **Generador:** Empresas productoras/importadoras registradas en el MMA
3. **Transportista:** Empresas de transporte autorizadas ⚠️ **Requiere validación documental (HU-016)**
4. **Gestor:** Instalaciones de valorización certificadas ⚠️ **Requiere validación documental (HU-016)**
5. **Especialista:** Profesionales responsables de cumplimiento REP
6. **Operador:** Personal operativo de cualquier organización
7. **Supervisor:** Jefaturas y coordinadores
8. **Auditor:** Auditores internos/externos y fiscalizadores

---

## 📄 Documentación Requerida (HU-016)

### Para Transportistas 🚛

#### Documentos Obligatorios:

1. **Autorización Sanitaria de Transporte de Residuos Peligrosos**
   - **Emisor:** MINSAL/SEREMI de Salud
   - **Base Legal:** Decreto Supremo N°148/2003
   - **Validación:** Portal MINSAL/SEREMI
   - **Vencimiento:** Según resolución (típicamente anual)
   - **Formato:** PDF
2. **Permiso de Circulación** (por cada vehículo registrado)
   - **Emisor:** Municipalidad correspondiente
   - **Base Legal:** Ley N°18.290 (Ley de Tránsito)
   - **Validación:** Registro Civil
   - **Vencimiento:** 31 de marzo de cada año
   - **Formato:** PDF/Imagen

3. **Revisión Técnica** (por cada vehículo)
   - **Emisor:** Planta de Revisión Técnica autorizada
   - **Base Legal:** Ley N°18.290
   - **Validación:** Portal Ministerio de Transportes
   - **Vencimiento:** Según antigüedad del vehículo
   - **Formato:** PDF/Imagen

#### Documentos Opcionales:

4. **Certificado de Antecedentes del Conductor**
   - **Emisor:** Registro Civil
   - **Vigencia:** 60 días
   - **Formato:** PDF

### Para Gestores ♻️

#### Documentos Obligatorios:

1. **Autorización Sanitaria de Funcionamiento de Planta**
   - **Emisor:** MINSAL/SEREMI de Salud
   - **Base Legal:** Decreto Supremo N°148/2003
   - **Validación:** Portal MINSAL/SEREMI
   - **Contenido:** Tipo de residuos autorizados, capacidad
   - **Vencimiento:** Según resolución
   - **Formato:** PDF

2. **Inscripción en Registro de Gestores MMA**
   - **Emisor:** Ministerio del Medio Ambiente
   - **Base Legal:** Decreto Supremo N°8/2023
   - **Validación:** Portal SINADER
   - **Contenido:** Categorías autorizadas, capacidad
   - **Formato:** PDF

3. **RCA - Resolución de Calificación Ambiental** (si aplica según tipo de operación)
   - **Emisor:** SEA (Servicio de Evaluación Ambiental)
   - **Base Legal:** Ley N°19.300
   - **Validación:** Portal SEA
   - **Aplica a:** Proyectos con impacto ambiental significativo
   - **Formato:** PDF

#### Documentos Opcionales:

4. **Certificado de Instalación Eléctrica**
   - **Emisor:** SEC (Superintendencia de Electricidad y Combustibles)
   - **Aplica:** Si la planta procesa materiales
   - **Formato:** PDF

5. **Certificado de Vigencia de Poderes**
   - **Emisor:** Notaría
   - **Representante legal**
   - **Vigencia:** 60 días
   - **Formato:** PDF

### Sistema de Alertas de Vencimiento

El sistema monitorea automáticamente los vencimientos:

- **🟢 30 días antes**: Email de alerta al usuario
- **🟡 15 días antes**: Email crítico al usuario + notificación al admin
- **🔴 Vencido + 3 días**: **Suspensión automática** de la cuenta
  - Transportistas: No pueden aceptar nuevas solicitudes
  - Gestores: No pueden registrar recepciones ni emitir certificados

### Reactivación

Para reactivar una cuenta suspendida:

1. Usuario sube documento actualizado
2. Administrador valida (mismo proceso)
3. Aprobación → Cuenta reactivada automáticamente

### Proceso de Asignación

#### Para Generadores:

1. Usuario se registra en el sistema
2. Administrador revisa la solicitud
3. Verifica documentación de respaldo
4. Asigna el rol correspondiente
5. Usuario recibe notificación de activación
6. Usuario accede con permisos del rol asignado

#### Para Transportistas y Gestores (HU-016):

1. Usuario se registra con rol específico
2. **Carga documentación obligatoria** (ver sección "Documentación Requerida")
3. Estado: `PENDIENTE_VERIFICACION`
4. Administrador **valida documentación contra portales oficiales**
5. Administrador **ingresa fechas de vencimiento**
6. Si aprueba: Estado cambia a `VERIFICADO`
7. Si rechaza: Usuario recibe motivo y puede reenviar documentos
8. Sistema monitorea vencimientos automáticamente

## Cambio de Roles

Solo los Administradores pueden cambiar roles de usuarios. El proceso incluye:

1. Registro de auditoría del cambio
2. Notificación al usuario afectado
3. Actualización inmediata de permisos
4. Log del cambio con justificación

## Seguridad

### Autenticación

- Sistema de autenticación basado en NextAuth.js
- Soporte para múltiples proveedores (Credentials, Google, etc.)
- Tokens JWT seguros
- Sesiones con expiración configurable

### Control de Acceso

- Middleware de Next.js para protección de rutas
- Verificación de permisos en cada endpoint de API
- Validación de roles en el cliente y servidor
- Logs de auditoría de todos los accesos

### Mejores Prácticas

1. **Principio de Menor Privilegio:** Cada usuario solo tiene los permisos mínimos necesarios
2. **Segregación de Funciones:** Separación de responsabilidades críticas
3. **Auditoría Completa:** Registro de todas las operaciones
4. **Revisión Periódica:** Auditoría regular de permisos asignados

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0.0
