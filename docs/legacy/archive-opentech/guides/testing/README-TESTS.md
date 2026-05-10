# Configuración de Tests

## Base de Datos de Pruebas

Este proyecto utiliza una base de datos separada para pruebas (`trazambiental_test`) que se resetea automáticamente antes de cada ejecución de tests.

### Configuración Inicial

1. **Crear la base de datos de pruebas** (solo la primera vez):

```bash
# Opción 1: Con psql
createdb trazambiental_test

# Opción 2: SQL directo
psql -U tu_usuario -c "CREATE DATABASE trazambiental_test;"
```

2. **Verificar que la BD existe**:

```bash
psql -l | grep trazambiental_test
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests (resetea y seed la BD automáticamente)
npm run test

# Ejecutar tests sin resetear la BD
npm run test:only

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Variables de Entorno

Los tests usan automáticamente la base de datos de pruebas configurada en `jest.setup.js`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trazambiental_test?schema=public"
```

### Datos de Prueba

La base de datos de pruebas se seed automáticamente con:

- 4 usuarios de prueba (admin, transportista, gestor, generador)
- Configuración de metas del año actual
- Datos mínimos necesarios para ejecutar los tests

**Usuarios de prueba:**

- admin@test.com / test123
- transportista@test.com / test123
- gestor@test.com / test123
- generador@test.com / test123

### Troubleshooting

Si los tests fallan por problemas de BD:

1. **Verificar que PostgreSQL está corriendo:**

```bash
pg_isready
```

2. **Verificar permisos del usuario:**

```bash
psql -U tu_usuario -c "SELECT current_user, current_database();"
```

3. **Resetear manualmente la BD de pruebas:**

```bash
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/trazambiental_test?schema=public" npx prisma db push --force-reset
node scripts/seed-test-data.js
```

4. **Ejecutar solo los tests sin setup:**

```bash
npm run test:only
```

### Base de Datos Normal

La base de datos normal (`trazambiental`) **NO se ve afectada** por los tests. Puedes seguir usando el sistema normalmente después de ejecutar tests.
