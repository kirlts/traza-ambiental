# 🚨 Guía: Reset de Base de Datos en Producción

**Proyecto**: TrazAmbiental - Sistema REP  
**Fecha**: 15 de enero de 2025  
**Estado**: ✅ Scripts y documentación listos

---

## ⚠️ ADVERTENCIA IMPORTANTE

**Este proceso eliminará TODOS los datos de la base de datos de producción y los reemplazará con datos iniciales de seed.**

- ❌ **Esta acción NO se puede deshacer**
- ❌ **TODOS los datos existentes serán PERDIDOS permanentemente**
- ⚠️ **Hacer backup antes de proceder**

---

## 📋 Pre-requisitos

Antes de ejecutar el reset, asegúrate de:

1. ✅ **Backup completo de la base de datos**

   ```bash
   # Ejemplo con pg_dump
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. ✅ **Variables de entorno configuradas**
   - `DATABASE_URL` debe apuntar a la base de datos de producción
   - Verificar que `NODE_ENV=production` (o según corresponda)

3. ✅ **Acceso a la base de datos**
   - Verificar conexión antes de proceder
   - Credenciales válidas y permisos suficientes

4. ✅ **Código actualizado**
   - Migraciones más recientes
   - Seeders actualizados y probados

---

## 🚀 Proceso de Reset

### Opción 1: Script Seguro (Recomendado) ⭐

Este script incluye múltiples confirmaciones y verificaciones de seguridad:

```bash
npm run db:reset:prod
```

**O también puedes usar:**

```bash
npm run db:reset:safe
```

**El script te pedirá:**

1. Escribir "RESET" para confirmar
2. Escribir el nombre exacto de la base de datos
3. Confirmar una última vez con "sí"

### Opción 2: Comando Directo (Más Riesgoso)

⚠️ **NO recomendado para producción**, solo usar si estás completamente seguro:

```bash
npm run db:reset
```

Este comando ejecuta directamente:

```bash
prisma migrate reset --force && npm run db:seed
```

---

## 📝 Paso a Paso Detallado

### Paso 1: Preparación

1. **Hacer backup de la base de datos**

   ```bash
   # Conectarse a la base de datos y hacer dump
   pg_dump "postgresql://usuario:password@host:5432/database" > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Verificar variables de entorno**

   ```bash
   # Verificar que DATABASE_URL está configurada
   echo $DATABASE_URL
   ```

3. **Verificar conexión a la base de datos**
   ```bash
   npx prisma db pull
   ```

### Paso 2: Ejecutar el Reset

```bash
npm run db:reset:prod
```

El script mostrará:

- ✅ Información de la base de datos (host, puerto, nombre)
- ⚠️ Advertencias de seguridad
- 🔄 Progreso del reset paso a paso

### Paso 3: Verificación Post-Reset

1. **Verificar que las migraciones se aplicaron**

   ```bash
   npx prisma migrate status
   ```

2. **Verificar que los seeders se ejecutaron**

   ```bash
   npx prisma studio
   # Revisar que existen datos en las tablas principales
   ```

3. **Probar funcionalidad básica**
   - Login de usuarios
   - Acceso a dashboards
   - Verificación de datos iniciales

---

## 🔧 Comandos Disponibles

### Scripts de Base de Datos

| Comando                 | Descripción                             | Uso                   |
| ----------------------- | --------------------------------------- | --------------------- |
| `npm run db:reset:prod` | Reset seguro con confirmaciones         | ⭐ **Producción**     |
| `npm run db:reset:safe` | Alias de reset:prod                     | ⭐ **Producción**     |
| `npm run db:reset`      | Reset directo (sin confirmaciones)      | ⚠️ Solo desarrollo    |
| `npm run db:seed`       | Ejecutar solo los seeders               | Desarrollo/Producción |
| `npm run db:deploy`     | Aplicar migraciones en producción       | Producción            |
| `npm run db:migrate`    | Crear/aplicar migraciones en desarrollo | Desarrollo            |
| `npm run db:generate`   | Generar cliente de Prisma               | Cualquier entorno     |

### Diferencias Importantes

#### `db:reset` vs `db:reset:prod`

| Aspecto                  | `db:reset`      | `db:reset:prod`     |
| ------------------------ | --------------- | ------------------- |
| **Confirmaciones**       | ❌ Ninguna      | ✅ 3 confirmaciones |
| **Información mostrada** | ❌ Mínima       | ✅ Completa         |
| **Verificaciones**       | ❌ Ninguna      | ✅ Múltiples        |
| **Uso recomendado**      | Solo desarrollo | Producción          |

---

## 🛡️ Medidas de Seguridad Implementadas

### 1. Confirmaciones Múltiples

El script `db:reset:prod` requiere:

- ✅ Escribir "RESET" para confirmar
- ✅ Escribir el nombre exacto de la base de datos
- ✅ Confirmar una última vez con "sí"

### 2. Información Transparente

Antes de proceder, el script muestra:

- 📊 Información de la base de datos (host, puerto, nombre)
- ⚠️ Advertencias claras sobre la pérdida de datos
- 🔍 Estado del entorno (production/development)

### 3. Seeders Seguros

Todos los seeders usan `upsert` en lugar de `create`, lo que significa:

- ✅ No fallarán si los datos ya existen
- ✅ Actualizarán datos existentes si es necesario
- ✅ Crearán datos nuevos solo si no existen

---

## 📊 Qué Hace el Reset

El proceso de reset ejecuta en orden:

1. **Generar cliente de Prisma**

   ```bash
   npx prisma generate
   ```

2. **Resetear base de datos**

   ```bash
   npx prisma migrate reset --force --skip-seed
   ```

   - Elimina todas las tablas
   - Recrea el esquema desde las migraciones
   - NO ejecuta seeders automáticamente

3. **Ejecutar seeders**

   ```bash
   npm run db:seed
   ```

   - Ejecuta todos los seeders en orden numérico
   - Pobla la base de datos con datos iniciales

---

## 📦 Datos que se Cargarán

Después del reset, la base de datos tendrá:

### Configuración

- ✅ Porcentajes de metas REP
- ✅ Configuración del sistema

### Roles y Usuarios

- ✅ 8 roles del sistema (Admin, Generador, Transportista, Gestor, etc.)
- ✅ 1 usuario de prueba por cada rol
- ✅ Credenciales mostradas en consola

### Datos Geográficos

- ✅ 16 regiones de Chile
- ✅ ~346 comunas de Chile

### Datos del Sistema

- ✅ Categorías de productos
- ✅ Productos de ejemplo
- ✅ Metas del sistema
- ✅ Datos de ejemplo según seeders configurados

---

## 🆘 Solución de Problemas

### Error: "DATABASE_URL no está definida"

**Solución:**

```bash
# Verificar que existe el archivo .env o variables de entorno
echo $DATABASE_URL

# O cargar variables desde archivo
export $(cat .env | xargs)
```

### Error: "Connection refused"

**Solución:**

1. Verificar que PostgreSQL está corriendo
2. Verificar credenciales en DATABASE_URL
3. Verificar que la base de datos permite conexiones externas

### Error: "Migration X not found"

**Solución:**

```bash
# Actualizar código desde git
git pull

# Verificar migraciones
ls prisma/migrations/
```

### Error: "Seeder failed"

**Solución:**

- Los seeders usan `upsert`, así que deberían ser seguros
- Revisar logs del seeder específico que falló
- Verificar que los datos del seeder son válidos

### Reset Incompleto

Si el reset falla a la mitad:

1. **Verificar estado de la base de datos**

   ```bash
   npx prisma studio
   ```

2. **Reintentar el reset completo**

   ```bash
   npm run db:reset:prod
   ```

3. **O restaurar desde backup**
   ```bash
   psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
   ```

---

## ✅ Checklist Pre-Reset

Antes de ejecutar el reset, verifica:

- [ ] Backup completo realizado y verificado
- [ ] Backup almacenado en ubicación segura
- [ ] Variables de entorno configuradas correctamente
- [ ] Conexión a la base de datos verificada
- [ ] Todas las migraciones están en el código
- [ ] Seeders probados en entorno de desarrollo
- [ ] Equipo notificado sobre el reset (si aplica)
- [ ] Ventana de mantenimiento programada (si aplica)

---

## ✅ Checklist Post-Reset

Después del reset, verifica:

- [ ] Migraciones aplicadas correctamente
- [ ] Seeders ejecutados sin errores
- [ ] Datos iniciales presentes en la base de datos
- [ ] Login de usuarios funciona
- [ ] Dashboards cargan correctamente
- [ ] Funcionalidad crítica verificada
- [ ] Logs sin errores críticos

---

## 🔒 Recomendaciones de Seguridad

1. **Backups Automáticos**
   - Configurar backups automáticos diarios
   - Probar restauración de backups periódicamente

2. **Entorno de Staging**
   - Probar el reset primero en staging
   - Validar que todo funciona antes de producción

3. **Ventana de Mantenimiento**
   - Ejecutar el reset en horario de bajo tráfico
   - Notificar a usuarios si es necesario

4. **Monitoreo**
   - Monitorear logs durante y después del reset
   - Verificar métricas de la aplicación

---

## 📚 Recursos Adicionales

- [Documentación de Prisma Migrate Reset](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-reset)
- [Guía de Deployment en Vercel](./DEPLOYMENT-VERCEL.md)
- [Guía de Configuración de Entorno](../CONFIGURACION_ENTORNO.md)

---

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs del script
2. Verificar documentación de Prisma
3. Consultar este documento nuevamente
4. Revisar backups disponibles

---

**Última actualización**: 15 de enero de 2025  
**Estado**: ✅ Scripts y documentación completos y probados
