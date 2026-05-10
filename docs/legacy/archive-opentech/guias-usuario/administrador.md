# Guía de Usuario - Rol Administrador

## ⚙️ Introducción

Como **Administrador** del sistema, usted tiene el control completo sobre la plataforma TrazAmbiental. Su rol es fundamental para mantener el sistema funcionando correctamente, gestionar usuarios y roles, y garantizar la seguridad e integridad de los datos.

### Responsabilidades Principales

1. Gestión de usuarios y roles
2. Configuración del sistema
3. Supervisión general de la plataforma
4. Resolución de problemas técnicos
5. Mantenimiento de seguridad
6. Administración de respaldos

---

## 📋 Funcionalidades del Administrador

### 1. Dashboard de Administración

Al iniciar sesión, acceda a su panel de control:

**Menú:** `Dashboard > Admin`

#### Vista General

El dashboard muestra:

**Estadísticas Globales:**

- 👥 Total de usuarios activos
- 🏭 Total de generadores registrados
- 🚛 Transportistas activos
- ♻️ Gestores autorizados
- 📊 Actividad del sistema (últimas 24h)

**Actividad Reciente:**

- Últimos usuarios registrados
- Últimas asignaciones de roles
- Acciones administrativas recientes
- Alertas del sistema

**Estado del Sistema:**

- 🟢 Base de datos: Operacional
- 🟢 Servidor: Funcionando
- 🟢 API: Disponible
- 🟡 Almacenamiento: 78% usado

---

### 2. Gestión de Usuarios

#### Ver Listado de Usuarios

**Menú:** `Administración > Usuarios`

**Información mostrada:**

- Nombre completo
- Email
- Roles asignados
- Estado (Activo/Inactivo)
- Fecha de registro
- Último acceso

**Filtros disponibles:**

- Por rol
- Por estado (activo/inactivo)
- Por fecha de registro
- Búsqueda por nombre o email

#### Crear Nuevo Usuario

1. **Acceder al formulario**
   - `Usuarios > Crear Usuario`

2. **Completar datos:**

   ```
   - Nombre completo *
   - Email * (será su username)
   - Contraseña temporal *
   - Confirmar contraseña *
   - Estado: Activo/Inactivo
   ```

3. **Asignar roles:**
   - Seleccionar uno o más roles del listado
   - Ver descripción de cada rol al pasar el mouse

4. **Opciones adicionales:**
   - ☑️ Enviar email de bienvenida
   - ☑️ Forzar cambio de contraseña en primer login
   - ☑️ Verificar email automáticamente

5. **Guardar**
   - Sistema valida datos
   - Crea el usuario
   - Envía notificación (si se seleccionó)
   - Muestra credenciales generadas

#### Editar Usuario

1. **Acceder al usuario:**
   - Click en usuario del listado
   - O buscar por email

2. **Datos editables:**
   - Nombre
   - Email (con validación de unicidad)
   - Estado (activar/desactivar)
   - Roles asignados

3. **Cambiar contraseña:**
   - Opción "Resetear Contraseña"
   - Sistema genera contraseña temporal
   - Envía por email al usuario

#### Gestionar Roles de Usuario

**Asignar rol:**

1. Seleccionar usuario
2. Tab "Roles"
3. Click "Agregar Rol"
4. Seleccionar rol del dropdown
5. Confirmar

**Revocar rol:**

1. En listado de roles del usuario
2. Click en ícono de eliminar (🗑️)
3. Confirmar acción
4. Sistema registra en auditoría

#### Desactivar/Activar Usuario

**Desactivar:**

- Usuario no puede iniciar sesión
- Sesiones activas se invalidan
- Datos permanecen en el sistema
- Puede reactivarse posteriormente

**Proceso:**

1. Seleccionar usuario
2. Click "Desactivar Usuario"
3. Ingresar motivo (registrado en auditoría)
4. Confirmar

**Reactivar:**

1. Filtrar por usuarios inactivos
2. Seleccionar usuario
3. Click "Activar Usuario"
4. Usuario puede volver a acceder

#### Eliminar Usuario (Permanente)

⚠️ **Acción irreversible**

Solo disponible si:

- Usuario no tiene operaciones registradas
- O si han pasado > 7 años (retención de datos)

**Proceso:**

1. Seleccionar usuario
2. Click "Eliminar Permanentemente"
3. Confirmar escribiendo el email del usuario
4. Sistema verifica dependencias
5. Si es posible, elimina
6. Log de auditoría queda registrado

---

### 3. Gestión de Roles

#### Ver Roles del Sistema

**Menú:** `Administración > Roles`

**Listado de roles:**
| Rol | Descripción | Usuarios | Estado |
|-----|-------------|----------|--------|
| Administrador | Acceso completo | 3 | Activo |
| Generador | Productor de neumáticos | 45 | Activo |
| Transportista | Logística de NFU | 12 | Activo |
| Gestor | Valorización de NFU | 8 | Activo |
| Especialista | Monitoreo REP | 2 | Activo |
| Operador | Operaciones básicas | 25 | Activo |
| Supervisor | Supervisión | 10 | Activo |
| Auditor | Auditoría | 5 | Activo |

#### Crear Nuevo Rol (Avanzado)

Si necesita un rol personalizado:

1. **Crear rol:**
   - `Roles > Crear Rol`
   - Nombre del rol
   - Descripción detallada
   - Estado: Activo

2. **Definir permisos:**
   - Seleccionar módulos accesibles
   - Definir nivel de acceso:
     - Solo lectura
     - Lectura y escritura
     - Control total
   - Guardar

3. **Asignar a usuarios:**
   - El nuevo rol aparece en opciones de asignación

#### Editar Rol Existente

1. Seleccionar rol
2. Editar descripción (nombre no se recomienda cambiar)
3. Modificar permisos si es necesario
4. Guardar cambios
5. Usuarios con ese rol se actualizan automáticamente

#### Desactivar Rol

Roles desactivados no pueden asignarse a nuevos usuarios, pero usuarios existentes mantienen acceso.

Para desactivar:

1. Ir a detalle del rol
2. Click "Desactivar"
3. Confirmar
4. Rol queda marcado como "Inactivo"

---

### 4. Configuración del Sistema

#### Configuración General

**Menú:** `Administración > Configuración > General`

**Opciones:**

**Información de la Organización:**

- Nombre de la organización
- Logo (upload)
- Colores del tema (primario, secundario)
- Información de contacto

**Parámetros del Sistema:**

- Tiempo de expiración de sesión (minutos)
- Número máximo de intentos de login
- Tiempo de bloqueo tras intentos fallidos
- Tamaño máximo de archivos (MB)

**Notificaciones:**

- Email del remitente del sistema
- Plantillas de emails
- Frecuencia de reportes automáticos

#### Configuración de Seguridad

**Menú:** `Administración > Configuración > Seguridad`

**Políticas de Contraseña:**

- Longitud mínima
- Requerir mayúsculas
- Requerir números
- Requerir caracteres especiales
- Expiración de contraseña (días)
- Historial de contraseñas (no reutilizar últimas X)

**Autenticación de Dos Factores (2FA):**

- ☑️ Habilitar 2FA opcional
- ☑️ Requerir 2FA para roles específicos
- Métodos: SMS, Email, Authenticator App

**Sesiones:**

- Permitir sesiones concurrentes
- Número máximo de dispositivos
- Invalidar sesiones al cambiar contraseña

#### Configuración de Integraciones

**Menú:** `Administración > Configuración > Integraciones`

**APIs Externas:**

- Ministerio del Medio Ambiente (MMA)
- Servicios de email (SendGrid, AWS SES)
- Storage (AWS S3, Azure Blob)
- Notificaciones (Twilio SMS, Push)

**Webhooks:**

- Configurar URLs de notificación
- Eventos a notificar
- Autenticación de webhooks

---

### 5. Logs y Auditoría

#### Ver Logs del Sistema

**Menú:** `Administración > Logs`

**Tipos de logs:**

**A. Logs de Autenticación**

- Inicios de sesión exitosos
- Intentos fallidos
- Cierres de sesión
- Cambios de contraseña

**B. Logs de Acciones**

- Creación de registros
- Modificaciones
- Eliminaciones
- Exportaciones de datos

**C. Logs de Sistema**

- Errores de aplicación
- Warnings
- Cambios de configuración
- Inicio/detención de servicios

**Filtros:**

- Por tipo de log
- Por usuario
- Por acción
- Por rango de fechas
- Por nivel (info, warning, error)

**Exportar logs:**

- CSV para análisis
- JSON para procesamiento
- PDF para reportes

#### Auditoría de Cumplimiento

**Menú:** `Administración > Auditoría`

**Reportes de auditoría:**

- Accesos por usuario
- Modificaciones de datos críticos
- Asignaciones de roles
- Cambios de configuración
- Exportaciones de datos

**Generar reporte:**

1. Seleccionar período
2. Seleccionar tipo de auditoría
3. Aplicar filtros
4. Generar reporte
5. Exportar (PDF firmado digitalmente)

---

### 6. Mantenimiento del Sistema

#### Respaldos de Base de Datos

**Menú:** `Administración > Mantenimiento > Respaldos`

**Respaldo manual:**

1. Click "Crear Respaldo Ahora"
2. Sistema genera snapshot de BD
3. Se descarga automáticamente
4. Se almacena en storage configurado

**Respaldos automáticos:**

- Configurar frecuencia (diario, semanal)
- Hora de ejecución
- Retención (cantidad de respaldos a mantener)
- Notificar por email al completar

**Restaurar respaldo:**
⚠️ **Acción crítica - Requiere confirmación múltiple**

1. Listar respaldos disponibles
2. Seleccionar respaldo a restaurar
3. Vista previa de información del respaldo
4. Confirmar escribiendo: "RESTAURAR"
5. Sistema crea respaldo actual antes de restaurar
6. Ejecuta restauración
7. Reinicia servicios necesarios

#### Limpieza de Datos

**Menú:** `Administración > Mantenimiento > Limpieza`

**Operaciones disponibles:**

**Limpiar sesiones expiradas:**

- Elimina sesiones antiguas de la BD
- Libera espacio
- Mejora rendimiento

**Limpiar archivos temporales:**

- Elimina uploads temporales no utilizados
- Limpia caché de reportes antiguos

**Archivar registros antiguos:**

- Mueve registros > X años a tabla de archivo
- Mantiene accesibles pero fuera de queries principales
- Mejora rendimiento de consultas

#### Optimización de Base de Datos

**Menú:** `Administración > Mantenimiento > Optimización`

**Acciones:**

- **VACUUM:** Libera espacio en PostgreSQL
- **ANALYZE:** Actualiza estadísticas de tablas
- **REINDEX:** Reconstruye índices
- **Ver tablas grandes:** Identifica tablas que requieren atención

**Programar mantenimiento:**

- Día de la semana
- Hora (recomendado: madrugada)
- Notificar al completar

---

### 7. Monitoreo del Sistema

#### Dashboard de Monitoreo

**Menú:** `Administración > Monitoreo`

**Métricas en tiempo real:**

**Rendimiento:**

- Tiempo de respuesta promedio de API
- Queries lentas (> 1 segundo)
- Uso de memoria del servidor
- Uso de CPU

**Usuarios:**

- Usuarios activos en este momento
- Sesiones concurrentes
- Páginas más visitadas
- Errores de usuario

**Base de Datos:**

- Conexiones activas
- Conexiones disponibles
- Tamaño de base de datos
- Tasa de queries por segundo

**Gráficos:**

- Uso de recursos (últimas 24h)
- Actividad de usuarios (última semana)
- Errores por hora
- Tiempo de respuesta de endpoints

#### Alertas del Sistema

**Configurar alertas:**

**Alertas de rendimiento:**

- CPU > 80% por más de 5 minutos
- Memoria > 90%
- Disco > 85%
- Tiempo de respuesta > 3 segundos

**Alertas de seguridad:**

- Múltiples intentos de login fallidos
- Acceso desde IP desconocida (opcional)
- Cambios de configuración crítica

**Alertas de negocio:**

- Errores en emisión de certificados
- Falla en sincronización con MMA
- Caída de servicios externos

**Canales de notificación:**

- Email
- SMS
- Slack/Teams
- PagerDuty (para producción)

---

### 8. Soporte a Usuarios

#### Centro de Ayuda

**Menú:** `Administración > Soporte`

**Tickets de soporte:**

- Ver tickets abiertos
- Asignar a administrador
- Responder a usuarios
- Cerrar tickets resueltos

**Preguntas frecuentes:**

- Gestionar FAQs
- Agregar nuevas preguntas
- Categorizar por tema
- Publicar/despublicar

#### Acceso Temporal a Cuentas

En casos de soporte crítico:

1. **Solicitud de acceso:**
   - Usuario solicita ayuda
   - Administrador solicita acceso temporal

2. **Generar acceso:**
   - Sistema genera token de 1 hora
   - Administrador puede "ver como" el usuario
   - Todas las acciones se registran como "Admin viewing as User"

3. **Finalizar acceso:**
   - Token expira automáticamente
   - O administrador finaliza sesión especial

---

### 9. Reportes Administrativos

#### Reportes Disponibles

**Reporte de Usuarios:**

- Total de usuarios por rol
- Usuarios activos vs. inactivos
- Nuevos registros por mes
- Último acceso de cada usuario

**Reporte de Actividad:**

- Páginas más visitadas
- Funcionalidades más utilizadas
- Horarios pico de actividad
- Dispositivos utilizados

**Reporte de Seguridad:**

- Intentos de acceso no autorizados
- Cambios de permisos
- Exportaciones de datos
- Accesos administrativos

**Reporte de Rendimiento:**

- Tiempos de respuesta promedio
- Endpoints más lentos
- Queries que requieren optimización
- Uso de recursos histórico

---

### 10. Gestión de Catálogo de Productos

#### Acceder al Catálogo

**Menú:** `Administración > Catálogo Productos`

El catálogo de productos permite gestionar el **maestro de neumáticos** del sistema, estandarizando nombres, categorías y códigos para evitar duplicados o errores creados por generadores.

#### Funcionalidades del Catálogo

**Listado de Productos:**

- Ver todos los productos registrados en el sistema
- Filtrar por nombre, categoría o código
- Paginación para grandes volúmenes de datos
- Búsqueda en tiempo real

**Información Mostrada:**

- Nombre del producto
- Marca
- Modelo
- Categoría REP (A o B)
- Código LER (Lista Europea de Residuos)
- Cantidad de inventarios que utilizan el producto
- Fecha de creación
- Última actualización

#### Crear Nuevo Producto

1. **Acceder al formulario:**
   - `Catálogo Productos > Crear Producto`
   - O usar el botón **"➕ Nuevo Producto"**

2. **Completar datos:**

   ```
   - Nombre del producto * (ej: "Neumático R22.5")
   - Marca * (ej: "Michelin", "Bridgestone")
   - Modelo (opcional)
   - Categoría REP * (A: Liviano, B: Pesado)
   - Código LER * (código de clasificación)
   - Descripción (opcional)
   ```

3. **Validaciones:**
   - El nombre debe ser único
   - La categoría es obligatoria
   - El código LER debe ser válido

4. **Guardar:**
   - Sistema valida datos
   - Crea el producto
   - Muestra confirmación

#### Editar Producto Existente

1. **Seleccionar producto:**
   - Click en el producto del listado
   - O usar el botón de edición (✏️)

2. **Modificar datos:**
   - Puede editar: Nombre, Marca, Modelo, Categoría, Código LER
   - Ver cuántos inventarios utilizan el producto

3. **Guardar cambios:**
   - Sistema actualiza el producto
   - Los inventarios que lo usan se actualizan automáticamente

#### Eliminar Producto

⚠️ **Validación de Dependencias**

Antes de eliminar, el sistema verifica:

- Si el producto está en uso en inventarios activos
- Si está asociado a solicitudes de retiro
- Si tiene historial de uso

**Proceso:**

1. Seleccionar producto
2. Click en **"🗑️ Eliminar"**
3. Sistema muestra advertencia si tiene dependencias
4. Si no tiene dependencias, confirma eliminación
5. Si tiene dependencias, muestra lista de usos y bloquea eliminación

**Alternativa:**

- Si el producto tiene errores pero está en uso, **edítelo** en lugar de eliminarlo
- Esto mantiene la integridad de los datos históricos

#### Carga Masiva de Productos

**Menú:** `Administración > Catálogo Productos > Carga Masiva`

**Formato Requerido:**

- Archivo JSON con estructura:
  ```json
  [
    {
      "nombre": "Neumático R22.5",
      "marca": "Michelin",
      "modelo": "XZA2",
      "categoria": "B",
      "codigoLER": "16.01.03"
    }
  ]
  ```

**Proceso:**

1. Preparar archivo JSON con productos
2. Subir archivo desde la interfaz
3. Sistema valida formato y datos
4. Muestra resumen de productos a importar
5. Confirma importación
6. Sistema crea/actualiza productos (upsert)

**Notas:**

- Si un producto ya existe (mismo nombre), se actualiza
- Si no existe, se crea nuevo
- Los errores se muestran en un reporte

---

### 11. Integración RETC (Registro de Emisiones y Transferencias de Contaminantes)

#### Acceder a Integración RETC

**Menú:** `Administración > Integración RETC`

Este módulo permite gestionar y sincronizar el **catálogo de establecimientos** de la Ventanilla Única del RETC para validación automática de identidad de nuevos usuarios.

#### Funcionalidades

**Carga Masiva de Establecimientos:**

1. **Preparar Archivo CSV:**
   - Descargar archivo oficial desde [datosretc.mma.gob.cl](https://datosretc.mma.gob.cl)
   - Formato requerido: CSV delimitado por punto y coma (;)
   - Columnas esperadas:
     - `ID` o `ID_RETC` o `VU_ID`: ID del establecimiento
     - `RAZON_SOCIAL` o `NOMBRE_EMPRESA`: Razón social
     - `DIRECCION` o `CALLE`: Dirección
     - `COMUNA`: Comuna
     - `REGION`: Región
     - `RUBRO` o `CIIU`: Rubro/CIIU
     - `ESTADO`: Estado (Activo, Inactivo, etc.)

2. **Subir Archivo:**
   - Click en **"Seleccionar Archivo CSV"**
   - Seleccionar archivo descargado
   - Verificar que el archivo sea válido (.csv)
   - Click en **"📤 Importar"**

3. **Procesamiento:**
   - Sistema valida formato del archivo
   - Procesa registros en lotes
   - Muestra progreso en tiempo real
   - Al finalizar, muestra estadísticas:
     - Total de registros procesados
     - Registros nuevos creados
     - Registros actualizados
     - Errores (si los hay)

**Estadísticas de Base de Datos:**

El panel derecho muestra:

- **Total Establecimientos:** Cantidad total en la base de datos
- **Última Actualización:** Fecha y hora de la última importación
- **Últimos 10 Registros:** Vista previa de los últimos establecimientos importados

**Tabla de Últimos Registros:**

Muestra:

- ID RETC
- Razón Social
- Comuna
- Rubro (con tooltip completo)
- Estado (badge con color)
- Fecha de Carga

**Importancia de los Datos:**

⚠️ **Crítico para el Sistema:**

- Esta base de datos es **esencial** para la validación automática de identidad
- Permite que nuevos usuarios se registren sin fricción
- Se recomienda actualizar **mensualmente** para incluir nuevos establecimientos
- Sin datos actualizados, el registro de nuevos usuarios puede fallar

**Recomendaciones:**

1. **Frecuencia de Actualización:**
   - Mínimo: Mensual
   - Ideal: Quincenal
   - Cuando hay cambios normativos: Inmediato

2. **Validación Post-Importación:**
   - Revisar estadísticas de importación
   - Verificar que no haya errores masivos
   - Comparar totales con importación anterior

3. **Mantenimiento:**
   - Monitorear tamaño de la base de datos
   - Limpiar registros duplicados si es necesario
   - Verificar integridad de datos periódicamente

**Solución de Problemas:**

**Error: "Formato de archivo inválido"**

- Verificar que el archivo sea CSV
- Verificar que use punto y coma (;) como delimitador
- Verificar que tenga las columnas requeridas

**Error: "No se procesaron registros"**

- Verificar que el archivo no esté vacío
- Verificar que las columnas tengan los nombres correctos
- Revisar logs del sistema para más detalles

**Importación lenta:**

- Normal para archivos grandes (>10,000 registros)
- El sistema procesa en lotes para optimizar rendimiento
- No cerrar la ventana durante la importación

---

### 12. Gestión de Anuncios

#### Crear Anuncio para Usuarios

**Menú:** `Administración > Anuncios`

**Crear anuncio:**

1. Título del anuncio
2. Contenido (soporta Markdown)
3. Tipo:
   - 🔵 Informativo
   - 🟡 Advertencia
   - 🔴 Crítico
4. Dirigido a:
   - Todos los usuarios
   - Roles específicos
5. Vigencia:
   - Fecha inicio
   - Fecha fin (opcional)
6. Posición:
   - Banner superior
   - Modal al login
   - Notificación en dashboard

**Anuncios activos:**

- Ver listado
- Editar
- Desactivar
- Ver estadísticas (cuántos usuarios lo vieron)

---

## ✅ Checklist del Administrador

### Rutina Diaria

- [ ] Revisar dashboard de monitoreo
- [ ] Verificar alertas del sistema
- [ ] Revisar tickets de soporte pendientes
- [ ] Verificar respaldos automáticos

### Rutina Semanal

- [ ] Revisar logs de seguridad
- [ ] Analizar rendimiento del sistema
- [ ] Revisar nuevos usuarios registrados
- [ ] Actualizar FAQs si es necesario

### Rutina Mensual

- [ ] Generar reporte de actividad
- [ ] Revisar y limpiar datos temporales
- [ ] Auditar permisos de usuarios
- [ ] Verificar integridad de respaldos
- [ ] Revisar políticas de seguridad

### Rutina Trimestral

- [ ] Auditoría completa de usuarios
- [ ] Optimización de base de datos
- [ ] Revisión de integraciones
- [ ] Actualizar documentación
- [ ] Planificar mejoras del sistema

---

## 🚨 Acciones de Emergencia

### Sistema Lento

1. Verificar uso de recursos en Monitoreo
2. Identificar queries lentas
3. Revisar conexiones activas a BD
4. Limpiar sesiones expiradas
5. Considerar reinicio de servicios (en horario de bajo uso)

### Usuario Bloqueado

1. Buscar usuario en listado
2. Verificar motivo del bloqueo en logs
3. Resetear contador de intentos fallidos
4. Notificar al usuario
5. Considerar resetear contraseña si es necesario

### Falla en Integración

1. Verificar estado de servicio externo
2. Revisar logs de errores de integración
3. Verificar credenciales/API keys
4. Probar conexión manualmente
5. Notificar a usuarios afectados
6. Activar modo offline si es posible

### Incidente de Seguridad

1. **Identificar** el tipo de incidente
2. **Contener:** Bloquear accesos si es necesario
3. **Investigar:** Revisar logs de auditoría
4. **Remediar:** Revocar permisos, cambiar credenciales
5. **Documentar:** Crear reporte del incidente
6. **Prevenir:** Implementar medidas para evitar recurrencia

---

## 🔐 Mejores Prácticas de Seguridad

1. **Nunca compartir credenciales de administrador**
2. **Usar 2FA obligatoriamente**
3. **Cambiar contraseña periódicamente**
4. **Revisar logs de acceso regularmente**
5. **Mantener respaldos actualizados y probados**
6. **Documentar todos los cambios críticos**
7. **Limitar número de administradores**
8. **Usar principio de menor privilegio**

---

## 📞 Escalamiento de Problemas

### Nivel 1 - Soporte de Usuario

- Problemas de acceso
- Preguntas sobre uso
- Solicitudes de cambios simples

### Nivel 2 - Administrador

- Problemas técnicos del sistema
- Configuraciones
- Gestión de usuarios y roles

### Nivel 3 - Desarrollo/TI

- Bugs críticos
- Problemas de rendimiento graves
- Cambios en infraestructura
- Integraciones complejas

**Contacto Soporte Técnico Avanzado:**

- Email: dev@trazambiental.com
- Urgencias: +56 2 XXXX XXXX

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.1.0
