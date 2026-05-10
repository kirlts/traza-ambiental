# 🔧 Soluciones para Tests Fallidos

**Fecha**: 17 de diciembre de 2025

---

## 📋 Análisis de Tests que Fallan

### Tests Únicos que Fallan: ~12 tests

---

## 1. Exportación RETC (3 tests)

### Problema 1: Timeout en `networkidle`

**Test**: `exportacion-retc-productor.spec.ts` - Todos los tests
**Causa**: `waitUntil: 'networkidle'` espera que NO haya requests por 500ms, pero en desarrollo hay HMR activo
**Solución**: Cambiar a `domcontentloaded` + espera explícita

### Problema 2: Selector de botón no encuentra texto

**Test**: `productor puede descargar Excel RETC después de guardar borrador`
**Causa**: Busca texto exacto que puede variar o tener emoji
**Solución**: Usar selector más robusto o agregar `data-testid`

### Problema 3: Test vacío

**Test**: `muestra error si intenta descargar sin borrador`
**Causa**: No hace ninguna verificación real
**Solución**: Eliminar o implementar correctamente

---

## 2. Catálogo Productos (6 tests)

### Problema 1: Selectores de columnas no encuentran elementos

**Test**: `admin puede ver listado de productos`
**Causa**: Busca `columnheader` con texto que puede no estar visible inmediatamente
**Solución**: Esperar a que la tabla cargue completamente antes de verificar columnas

### Problema 2: Selector de filtro no funciona

**Test**: `admin puede filtrar por categoría`
**Causa**: `select, [role="combobox"]` puede seleccionar el elemento incorrecto
**Solución**: Usar selector más específico o `data-testid`

### Problema 3: Modal no se encuentra

**Test**: `admin puede crear nuevo producto`
**Causa**: Selector `[role="dialog"], .modal` puede no encontrar el modal de shadcn/ui
**Solución**: Usar selector específico de shadcn/ui o `data-testid`

### Problema 4: Selector de categoría en formulario

**Test**: `admin puede crear nuevo producto`
**Causa**: `select[name="categoria"]` puede no existir (shadcn usa Select component)
**Solución**: Usar selector de shadcn Select o `data-testid`

### Problema 5: Test permisivo

**Test**: `admin no puede eliminar producto en uso`
**Causa**: Usa `if` statements que hacen que el test pase siempre
**Solución**: Hacer el test más estricto o eliminarlo si no es crítico

---

## 3. Integración RETC (5 tests)

### Problema 1: Timeout en `networkidle`

**Test**: Todos los tests
**Causa**: Mismo problema que exportación RETC
**Solución**: Cambiar a `domcontentloaded`

### Problema 2: Selector de texto no encuentra elementos

**Test**: `admin puede ver página de integración RETC`
**Causa**: `text=Integración RETC, text=Carga Masiva` busca texto que puede estar en diferentes elementos
**Solución**: Usar selector más específico o `data-testid`

### Problema 3: Archivos temporales

**Test**: `admin puede subir archivo CSV`
**Causa**: Crear archivos en `temp/` puede fallar en CI o diferentes sistemas
**Solución**: Usar `path.join` correctamente y manejar errores

---

## ✅ Soluciones Aplicadas

### 1. Cambiar `waitUntil: 'networkidle'` a `domcontentloaded`

```typescript
// Antes
await page.goto("/dashboard/...", { waitUntil: "networkidle" });

// Después
await page.goto("/dashboard/...", { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
```

### 2. Mejorar selectores

```typescript
// Antes
await page.locator("text=Integración RETC").toBeVisible();

// Después
await page.getByRole("heading", { name: /Integración RETC/i }).toBeVisible();
// O mejor aún:
await page.locator('[data-testid="retc-title"]').toBeVisible();
```

### 3. Esperar elementos antes de interactuar

```typescript
// Antes
await page.fill('[data-testid="categoria-a-cantidad"]', "50000");

// Después
await page.waitForSelector('[data-testid="categoria-a-cantidad"]', { timeout: 10000 });
await page.fill('[data-testid="categoria-a-cantidad"]', "50000");
```

---

## 🎯 Prioridad de Correcciones

### Alta Prioridad (Aplicar primero)

1. ✅ Cambiar `networkidle` a `domcontentloaded` en todos los tests
2. ✅ Mejorar helper de autenticación (ya hecho)
3. ✅ Agregar esperas explícitas antes de interactuar

### Media Prioridad

4. ⏳ Agregar `data-testid` a componentes críticos
5. ⏳ Mejorar selectores de modales y formularios
6. ⏳ Corregir test de eliminar producto en uso

### Baja Prioridad

7. ⏳ Eliminar tests vacíos o no críticos
8. ⏳ Mejorar manejo de archivos temporales

---

**Última actualización**: 17 de diciembre de 2025
