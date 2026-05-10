# 🔄 Auto-Sincronización de Prisma

## 📋 Descripción

Este sistema garantiza que la base de datos siempre esté sincronizada con el schema de Prisma antes de iniciar el servidor de desarrollo, evitando errores como:

```
The column `users.estadoVerificacion` does not exist in the current database.
```

## 🚀 Funcionamiento

### Scripts Automatizados

Cada vez que ejecutas `npm run dev`, el sistema automáticamente:

1. **Sincroniza la base de datos** con `prisma db push`
   - Crea tablas faltantes
   - Agrega columnas nuevas
   - Actualiza tipos de datos
   - Crea índices

2. **Genera el cliente de Prisma** con `prisma generate`
   - Regenera los tipos TypeScript
   - Actualiza el cliente de Prisma con los últimos cambios

### Comandos Afectados

Los siguientes comandos ahora incluyen auto-sincronización:

- `npm run dev` - Servidor principal (puerto 80 con dominio local)
- `npm run dev:server` - Servidor alternativo (puerto 80)
- `npm run dev:default` - Servidor en puerto 3000

### Script Independiente

También puedes sincronizar manualmente en cualquier momento:

```bash
npm run prisma:sync
```

## 📁 Archivos Creados/Modificados

### Nuevo Script: `scripts/sync-prisma.js`

Script modular que maneja la sincronización de Prisma. Se puede usar:

- Como módulo importado por otros scripts
- Como comando independiente

### Modificado: `scripts/start-dev.js`

Ahora incluye sincronización automática antes de iniciar el servidor.

### Modificado: `package.json`

Nuevos scripts agregados:

```json
{
  "prisma:sync": "node scripts/sync-prisma.js",
  "predev:server": "node scripts/sync-prisma.js",
  "predev:default": "node scripts/sync-prisma.js"
}
```

> **Nota:** Los scripts con prefijo `pre` se ejecutan automáticamente antes del script principal.

## ✅ Beneficios

1. **Desarrollo sin interrupciones**: No más errores de columnas faltantes
2. **Sincronización automática**: No necesitas recordar ejecutar comandos manualmente
3. **Equipos distribuidos**: Todos los desarrolladores obtienen el schema actualizado automáticamente
4. **Cambios en ramas**: Al cambiar de rama, el schema se sincroniza automáticamente

## 🔍 Salida del Script

Cuando ejecutas `npm run dev`, verás:

```
╔═══════════════════════════════════════════════════════════╗
║  🚀 Iniciando Servidor de Desarrollo                    ║
╚═══════════════════════════════════════════════════════════╝

🔄 Sincronizando base de datos con Prisma...
✅ Base de datos sincronizada correctamente
🔄 Generando cliente de Prisma...
✅ Cliente de Prisma generado correctamente

🔧 Iniciando Next.js con Turbopack...
...
```

## ⚠️ Consideraciones

### Desarrollo Local

- `prisma db push` no crea archivos de migración
- Es perfecto para desarrollo rápido
- Los cambios se aplican directamente a la base de datos

### Producción

Para producción, usa migraciones:

```bash
npm run db:migrate  # Crea una migración
npm run db:deploy   # Aplica migraciones en producción
```

### Errores

Si la sincronización falla:

1. Revisa que la base de datos esté ejecutándose
2. Verifica la conexión en `.env`
3. Revisa que el schema sea válido con `npx prisma validate`

## 🛠️ Mantenimiento

### Desactivar Auto-Sincronización

Si necesitas desactivar temporalmente la sincronización:

1. Comenta las líneas en `scripts/start-dev.js`:

```javascript
// await syncPrisma();
```

2. O elimina los scripts `predev:*` de `package.json`

### Debug

Para ver la salida completa de Prisma, modifica `scripts/sync-prisma.js`:

```javascript
execSync("npx prisma db push", {
  stdio: "inherit", // Cambiar de 'pipe' a 'inherit'
  encoding: "utf-8",
});
```

## 📚 Referencias

- [Prisma DB Push](https://www.prisma.io/docs/concepts/components/prisma-migrate/db-push)
- [Prisma Generate](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [NPM Scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts)

---

**Fecha de creación:** 13 de noviembre de 2025  
**Última actualización:** 13 de noviembre de 2025
