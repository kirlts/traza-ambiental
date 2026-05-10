# Seeders de Perfiles Legales

Este documento describe los seeders creados para establecer perfiles legales verificados para Transportistas y Gestores, lo cual es **requerido** para que puedan operar en el sistema según las HU-027 (Transportistas) y HU-029 (Gestores).

## 📋 Seeders Disponibles

### 1. `012-20251225-perfiles-legales-transportista-seeder.ts`

**Propósito**: Crear perfiles legales **verificados** para todos los transportistas del sistema.

**Requisito**: Los transportistas deben tener un perfil legal con `status = 'VERIFICADO'` para poder **aceptar solicitudes de retiro**.

**Qué hace**:

- Busca todos los usuarios con rol "Transportista"
- Crea o actualiza sus perfiles legales (`carrier_legal_profiles`)
- Establece el estado como `VERIFICADO`
- Marca todos los documentos como verificados:
  - `isRetcVerified = true`
  - `isResolutionVerified = true`
  - `isSinaderVerified = true`

**Ejecutar**:

```bash
npx tsx prisma/012-20251225-perfiles-legales-transportista-seeder.ts
```

### 2. `013-20251225-perfiles-legales-gestor-seeder.ts`

**Propósito**: Crear perfiles legales **verificados** para todos los gestores del sistema.

**Requisito**: Los gestores necesitan un perfil legal verificado para poder recibir y procesar residuos.

**Qué hace**:

- Busca todos los usuarios con rol "Gestor"
- Crea o actualiza sus perfiles legales (`manager_legal_profiles`)
- Establece el estado como `VERIFICADO`
- Configura:
  - Identidad (RETC)
  - Operativa (Resolución Sanitaria, capacidad 10,000 ton/año)
  - Ecosistema (Módulo REP, Partner GRANSIC)

**Ejecutar**:

```bash
npx tsx prisma/013-20251225-perfiles-legales-gestor-seeder.ts
```

## 🚀 Ejecución

### Ejecutar un seeder específico

```bash
# Solo transportistas
npx tsx prisma/012-20251225-perfiles-legales-transportista-seeder.ts

# Solo gestores
npx tsx prisma/013-20251225-perfiles-legales-gestor-seeder.ts
```

### Ejecutar todos los seeders (incluidos estos)

```bash
npm run seed
```

Esto ejecutará automáticamente todos los seeders en orden numérico, incluyendo los perfiles legales.

## 🔍 Verificación

### Verificar transportistas

```bash
psql -d trazambiental -c "
  SELECT u.name, u.email, c.status, c.\"isRetcVerified\", c.\"isResolutionVerified\", c.\"isSinaderVerified\"
  FROM carrier_legal_profiles c
  JOIN users u ON c.\"carrierId\" = u.id;
"
```

### Verificar gestores

```bash
psql -d trazambiental -c "
  SELECT u.name, u.email, m.status, m.\"isRetcVerified\", m.\"isResolutionVerified\", m.\"authorizedCapacity\"
  FROM manager_legal_profiles m
  JOIN users u ON m.\"managerId\" = u.id;
"
```

## 📝 Notas Importantes

### Para Transportistas

- **Sin perfil legal verificado**: El transportista verá solicitudes disponibles pero **NO podrá aceptarlas**
- **Error esperado**: `"Debes completar tu validación legal (RETC, Res. Sanitaria, SINADER) para aceptar solicitudes"`
- **Solución**: Ejecutar el seeder 012

### Para Gestores

- Los gestores también requieren perfiles legales verificados para operaciones de recepción y procesamiento
- Se configura una capacidad autorizada por defecto de **10,000 toneladas/año**

### Datos de Prueba

Los archivos de evidencia apuntan a rutas dummy:

- `/uploads/dummy/retc-test.pdf`
- `/uploads/dummy/resolucion-test.pdf`
- `/uploads/dummy/sinader-test.pdf`

Estos archivos no existen físicamente pero están registrados en la base de datos para propósitos de prueba.

## 🔄 Actualización de Usuarios Existentes

Los seeders son **idempotentes**:

- Si el perfil ya existe y está verificado → Se omite
- Si el perfil existe pero no está verificado → Se actualiza a VERIFICADO
- Si el perfil no existe → Se crea como VERIFICADO

## 🎯 Casos de Uso

### Desarrollo Local

```bash
# Después de configurar usuarios de prueba
npm run seed
```

### Testing

```bash
# Crear perfiles solo para transportistas en testing
npx tsx prisma/012-20251225-perfiles-legales-transportista-seeder.ts
```

### Ambiente de Staging

```bash
# Verificar perfiles antes de pruebas de integración
npx tsx prisma/012-20251225-perfiles-legales-transportista-seeder.ts
npx tsx prisma/013-20251225-perfiles-legales-gestor-seeder.ts
```

## 📚 Referencias

- **HU-027**: Validación Legal de Transportistas
- **HU-029**: Validación Legal de Gestores
- **Modelos Prisma**:
  - `CarrierLegalProfile` (líneas 185-217 en schema.prisma)
  - `ManagerLegalProfile` (líneas 221-252 en schema.prisma)
