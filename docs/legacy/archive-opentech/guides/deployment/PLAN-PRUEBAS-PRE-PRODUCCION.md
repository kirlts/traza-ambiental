# 🧪 Plan de Pruebas Pre-Producción

**Proyecto**: TrazAmbiental - Sistema REP  
**Fecha**: 15 de enero de 2025  
**Objetivo**: Verificar que todo funciona correctamente antes del despliegue con reset de BD  
**Estado**: ✅ Herramientas de prueba listas

---

## 📋 Resumen Ejecutivo

Este documento describe el plan completo de pruebas que debe ejecutarse antes de hacer el reset de base de datos en producción. Incluye todas las herramientas, verificaciones y pasos necesarios para asegurar un despliegue exitoso.

## 🛠️ Herramientas Disponibles

### 1. Verificación Automática ⭐

**Script**: `npm run verify:pre-prod`

Verifica automáticamente:

- ✅ Variables de entorno configuradas
- ✅ Conexión a base de datos
- ✅ Cliente de Prisma generado
- ✅ Migraciones presentes
- ✅ Seeders configurados
- ✅ Scripts NPM disponibles
- ✅ Estructura de archivos correcta
- ✅ Dependencias instaladas

**Uso**:

```bash
npm run verify:pre-prod
```

**Resultado esperado**: Todas las verificaciones en verde ✅

### 2. Prueba de Reset en Desarrollo

**Script**: `scripts/test-reset-dev.sh`

Ejecuta una prueba completa del reset en entorno de desarrollo:

- Verificación automática
- Backup opcional
- Reset completo
- Verificación post-reset

**Uso**:

```bash
# Dar permisos de ejecución (solo primera vez)
chmod +x scripts/test-reset-dev.sh

# Ejecutar
./scripts/test-reset-dev.sh
```

### 3. Script de Reset Seguro para Producción

**Script**: `scripts/reset-prod-db.js`  
**Comando**: `npm run db:reset:prod`

Script interactivo con múltiples confirmaciones para reset en producción.

**Características de seguridad**:

- ✅ **3 confirmaciones requeridas** antes de proceder
- ✅ **Información transparente** sobre qué base de datos se resetea
- ✅ **Advertencias claras** sobre la pérdida de datos
- ✅ **Proceso paso a paso** con feedback visual
- ✅ **Manejo de errores** robusto

**Uso**:

```bash
npm run db:reset:prod
```

El script te pedirá:

1. Escribir "RESET" para confirmar
2. Escribir el nombre exacto de la base de datos
3. Confirmar una última vez con "sí"

---

## ✅ Checklist de Verificación Inicial

### Paso 1: Verificación Automática

Ejecutar el script de verificación automática:

```bash
npm run verify:pre-prod
```

Este script verifica:

- ✅ Variables de entorno configuradas
- ✅ Conexión a base de datos
- ✅ Cliente de Prisma generado
- ✅ Migraciones presentes
- ✅ Seeders configurados
- ✅ Scripts NPM disponibles
- ✅ Estructura de archivos correcta
- ✅ Dependencias instaladas

**Resultado esperado**: Todas las verificaciones en verde ✅

---

## 🔬 Pruebas Paso a Paso

### Fase 1: Verificación de Entorno de Desarrollo

#### 1.1 Verificar Base de Datos de Desarrollo

```bash
# Verificar que la BD de desarrollo funciona
npm run db:generate
npm run db:studio
```

**Verificar**:

- [ ] Prisma Studio se abre correctamente
- [ ] Se pueden ver las tablas
- [ ] Hay datos existentes (si aplica)

#### 1.2 Verificar Script de Reset (Modo Prueba)

**IMPORTANTE**: Usar base de datos de desarrollo o test

```bash
# Opción 1: Usar BD de pruebas
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trazambiental_test?schema=public"
npm run db:reset

# Opción 2: Probar el script interactivo
npm run db:reset:prod
# (Cancelar cuando pida confirmaciones)
```

**Verificar**:

- [ ] El script muestra las confirmaciones correctamente
- [ ] La información de la BD se muestra correctamente
- [ ] Las advertencias son claras

---

### Fase 2: Prueba Completa en Entorno de Desarrollo

#### 2.1 Backup de Desarrollo

```bash
# Crear backup de la BD de desarrollo
pg_dump $DATABASE_URL > backup_dev_$(date +%Y%m%d_%H%M%S).sql
```

#### 2.2 Reset Completo en Desarrollo

```bash
# Ejecutar reset completo
npm run db:reset
```

**Verificar durante la ejecución**:

- [ ] El proceso no falla
- [ ] Las migraciones se aplican correctamente
- [ ] Los seeders se ejecutan sin errores
- [ ] No hay errores en la consola

#### 2.3 Verificar Datos Post-Reset

```bash
# Abrir Prisma Studio
npm run db:studio
```

**Verificar que existen**:

- [ ] Tabla `roles` con 8 roles
- [ ] Tabla `users` con usuarios de prueba
- [ ] Tabla `regiones` con 16 regiones
- [ ] Tabla `comunas` con ~346 comunas
- [ ] Tabla `configuracion_metas_rep` con configuración
- [ ] Otras tablas según seeders configurados

#### 2.4 Probar Funcionalidad Básica

1. **Iniciar servidor de desarrollo**:

   ```bash
   npm run dev
   ```

2. **Probar login**:
   - [ ] Ir a `http://localhost:3000/login`
   - [ ] Iniciar sesión con usuario de prueba
   - [ ] Verificar que el login funciona

3. **Probar dashboards**:
   - [ ] Acceder a dashboard de admin
   - [ ] Acceder a dashboard de generador
   - [ ] Acceder a dashboard de transportista
   - [ ] Verificar que las páginas cargan correctamente

---

### Fase 3: Pruebas de Seeders Individuales

#### 3.1 Verificar Cada Seeder

```bash
# Ver lista de seeders
ls prisma/*-seeder.ts
```

**Para cada seeder**:

- [ ] Verificar que usa `upsert` (seguro para producción)
- [ ] Verificar que tiene manejo de errores
- [ ] Verificar que muestra logs claros

#### 3.2 Probar Ejecución de Seeders

```bash
# Ejecutar seeders
npm run db:seed
```

**Verificar**:

- [ ] Todos los seeders se ejecutan en orden
- [ ] No hay errores
- [ ] Los logs muestran progreso claro
- [ ] Los datos se crean correctamente

---

### Fase 4: Pruebas de Build de Producción

#### 4.1 Build Local

```bash
# Hacer build de producción
npm run build
```

**Verificar**:

- [ ] El build se completa sin errores
- [ ] No hay warnings críticos
- [ ] El tamaño del bundle es razonable

#### 4.2 Verificar Build de Vercel (si aplica)

```bash
# Simular build de Vercel
npm run vercel-build
```

**Verificar**:

- [ ] El build funciona
- [ ] Prisma genera correctamente
- [ ] No hay errores de dependencias

---

### Fase 5: Pruebas de Script de Reset Seguro

#### 5.1 Probar Flujo Interactivo

```bash
# Ejecutar script interactivo (en BD de prueba)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trazambiental_test?schema=public"
npm run db:reset:prod
```

**Probar todas las confirmaciones**:

- [ ] Primera confirmación (escribir "RESET")
- [ ] Segunda confirmación (nombre de BD)
- [ ] Tercera confirmación ("sí")
- [ ] Verificar que se puede cancelar en cualquier paso

#### 5.2 Verificar Información Mostrada

El script debe mostrar:

- [ ] Host de la base de datos
- [ ] Puerto
- [ ] Nombre de la base de datos
- [ ] Advertencias claras
- [ ] Progreso paso a paso

---

## 📊 Checklist Final Pre-Producción

Antes de ejecutar el reset en producción, verificar:

### Verificaciones Técnicas

- [ ] ✅ Script `verify:pre-prod` pasa todas las pruebas
- [ ] ✅ Reset funciona correctamente en desarrollo
- [ ] ✅ Seeders se ejecutan sin errores
- [ ] ✅ Build de producción funciona
- [ ] ✅ Datos se crean correctamente después del reset

### Verificaciones de Seguridad

- [ ] ✅ Backup de producción realizado
- [ ] ✅ Backup verificado (se puede restaurar)
- [ ] ✅ Variables de entorno de producción configuradas
- [ ] ✅ Acceso a base de datos de producción verificado
- [ ] ✅ Script de reset probado en entorno de prueba

### Verificaciones de Documentación

- [ ] ✅ Guía de reset leída completamente
- [ ] ✅ Checklist pre-reset completado
- [ ] ✅ Plan de rollback preparado (en caso de problemas)

### Verificaciones Organizacionales

- [ ] ✅ Equipo notificado sobre el reset
- [ ] ✅ Ventana de mantenimiento programada (si aplica)
- [ ] ✅ Usuarios notificados (si aplica)
- [ ] ✅ Monitoreo configurado para post-reset

---

## 🧪 Script de Pruebas Rápido

Ejecutar este script para pruebas rápidas:

```bash
#!/bin/bash

echo "🧪 Iniciando pruebas pre-producción..."

# 1. Verificación automática
echo "1. Verificación automática..."
npm run verify:pre-prod

# 2. Build de producción
echo "2. Build de producción..."
npm run build

# 3. Verificar seeders
echo "3. Verificando seeders..."
npm run db:seed

echo "✅ Pruebas completadas"
```

---

## 🐛 Problemas Comunes y Soluciones

### Error: "DATABASE_URL no configurada"

**Solución**:

```bash
# Verificar variable
echo $DATABASE_URL

# O cargar desde archivo
export $(cat .env | xargs)
```

### Error: "Cannot connect to database"

**Solución**:

1. Verificar que PostgreSQL está corriendo
2. Verificar credenciales en DATABASE_URL
3. Verificar que la BD existe

### Error: "Seeder failed"

**Solución**:

1. Revisar logs del seeder específico
2. Verificar que los datos del seeder son válidos
3. Verificar que la estructura de la BD es correcta

### Error: "Migration not found"

**Solución**:

```bash
# Actualizar código
git pull

# Verificar migraciones
ls prisma/migrations/
```

---

## 📝 Registro de Pruebas

**Fecha de pruebas**: **\*\***\_\_\_**\*\***

**Entorno probado**:

- [ ] Desarrollo
- [ ] Staging
- [ ] Otro: **\*\***\_\_\_**\*\***

**Resultados**:

| Prueba                  | Estado | Observaciones |
| ----------------------- | ------ | ------------- |
| Verificación automática | ⬜     |               |
| Reset en desarrollo     | ⬜     |               |
| Seeders                 | ⬜     |               |
| Build de producción     | ⬜     |               |
| Login funcional         | ⬜     |               |
| Dashboards funcionan    | ⬜     |               |

**Problemas encontrados**:

---

---

**Acciones correctivas**:

---

---

**Firmado por**: **\*\***\_\_\_**\*\***

**Aprobado para producción**: ⬜ Sí ⬜ No

---

## ✅ Aprobación Final

Una vez completadas todas las pruebas:

- [ ] Todas las verificaciones pasaron
- [ ] Problemas encontrados resueltos
- [ ] Backup de producción realizado
- [ ] Equipo notificado
- [ ] Listo para producción

**Fecha de aprobación**: **\*\***\_\_\_**\*\***

**Aprobado por**: **\*\***\_\_\_**\*\***

---

## 📚 Documentación Relacionada

- **Guía de Reset en Producción**: [RESET-DB-PRODUCCION.md](./RESET-DB-PRODUCCION.md)
- **Deployment en Vercel**: [DEPLOYMENT-VERCEL.md](./DEPLOYMENT-VERCEL.md)
- **Configuración de Entorno**: [../CONFIGURACION_ENTORNO.md](../CONFIGURACION_ENTORNO.md)

---

## 🚀 Comandos Rápidos

```bash
# Verificación rápida
npm run verify:pre-prod

# Prueba completa en desarrollo
./scripts/test-reset-dev.sh

# Reset en desarrollo
npm run db:reset

# Verificar datos
npm run db:studio

# Build de producción
npm run build

# Reset seguro para producción (solo cuando esté listo)
npm run db:reset:prod
```

---

**Última actualización**: 15 de enero de 2025  
**Estado**: ✅ Plan de pruebas listo y herramientas disponibles
