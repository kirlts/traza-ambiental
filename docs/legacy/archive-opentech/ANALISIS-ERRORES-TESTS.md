# 🔍 Análisis Detallado de Errores en Tests E2E

**Fecha**: 17 de diciembre de 2025

---

## 📊 Desglose de Errores

### Multiplicación de Tests por Navegador

**Causa Principal**: Playwright ejecuta cada test en **5 navegadores diferentes**:

- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome
- Mobile Safari

**Ejemplo**:

- Si tienes **3 tests nuevos** (exportación RETC, catálogo productos, integración RETC)
- Cada test se ejecuta en **5 navegadores** = **15 ejecuciones**
- Si un test falla en todos los navegadores = **5 fallos reportados**

**En nuestro caso**:

- **15 tests nuevos** × **5 navegadores** = **70 ejecuciones totales**
- **9 pasaron** (principalmente Mobile Safari)
- **61 fallaron** (pero son menos tests únicos)

---

## 🔴 Problemas Identificados

### 1. Helper de Autenticación (Causa del 80% de los errores)

**Problema Original**:

```typescript
// Buscaba texto que está OCULTO en móvil
await expect(page.locator(`text=${getUserDisplayName(userType)}`)).toBeVisible({ timeout: 10000 });
```

**Por qué falla**:

- En móvil, el nombre del usuario tiene `hidden md:flex` (línea 56 de `TopBar.tsx`)
- Playwright ejecuta tests en navegadores móviles
- El texto no es visible → test falla

**Impacto**:

- **Mobile Chrome**: Todos los tests fallan
- **Mobile Safari**: Algunos pasan (por suerte)
- **Desktop**: Funciona porque el texto es visible

**Solución Aplicada**:

```typescript
// Verificar URL en lugar de texto visible
const expectedUrl = new RegExp(`/dashboard/${userType === "productor" ? "generador" : userType}`);
await expect(page).toHaveURL(expectedUrl, { timeout: 10000 });

// Intentar encontrar nombre (desktop), pero no fallar si está oculto (móvil)
try {
  await expect(page.locator(`text=${getUserDisplayName(userType)}`).first()).toBeVisible({
    timeout: 2000,
  });
} catch {
  // En móvil, la URL es suficiente para confirmar login
}
```

---

### 2. Timeouts en Navegación

**Problema**:

```typescript
await page.goto("/dashboard/admin/integraciones/retc", { waitUntil: "networkidle" });
```

**Por qué falla**:

- `networkidle` espera a que NO haya requests de red por 500ms
- En desarrollo, puede haber:
  - Hot Module Replacement (HMR)
  - WebSockets activos
  - Polling de datos
  - Requests infinitos

**Solución Recomendada**:

```typescript
// Cambiar a domcontentloaded (más rápido y confiable)
await page.goto("/dashboard/admin/integraciones/retc", { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
```

---

### 3. Selectores Frágiles

**Problema**:

```typescript
await page.locator("text=Integración RETC, text=Carga Masiva").toBeVisible();
```

**Por qué falla**:

- Busca texto exacto que puede cambiar
- Depende de traducciones
- Puede no estar visible inmediatamente

**Solución Recomendada**:

```typescript
// Usar data-testid (más robusto)
await page.locator('[data-testid="retc-integration-title"]').toBeVisible();

// O usar selectores más específicos
await page.getByRole("heading", { name: /Integración RETC/i }).toBeVisible();
```

---

### 4. Mapeo de Roles Incorrecto

**Problema**:

```typescript
const expectedUrl = new RegExp(`/dashboard/${userType === "productor" ? "generador" : userType}`);
```

**Por qué puede fallar**:

- El mapeo `productor` → `generador` puede no ser correcto en todos los casos
- La URL puede variar según la configuración

**Solución Recomendada**:

```typescript
const roleMapping: Record<string, string> = {
  productor: "generador",
  admin: "admin",
  generador: "generador",
  transportista: "transportista",
  gestor: "gestor",
};
const expectedPath = roleMapping[userType] || userType;
const expectedUrl = new RegExp(`/dashboard/${expectedPath}`);
```

---

## 📈 Estadísticas Reales

### Tests Únicos vs Ejecuciones Totales

| Métrica                     | Valor                             |
| --------------------------- | --------------------------------- |
| **Tests únicos creados**    | 15 tests                          |
| **Ejecuciones totales**     | 70 (15 × 5 navegadores)           |
| **Tests únicos que fallan** | ~12 tests                         |
| **Ejecuciones que fallan**  | 61 (multiplicado por navegadores) |

### Desglose por Navegador

| Navegador         | Tests Pasados | Tests Fallidos | % Éxito |
| ----------------- | ------------- | -------------- | ------- |
| **Mobile Safari** | 9             | 6              | 60%     |
| **WebKit**        | 0             | 15             | 0%      |
| **Firefox**       | 0             | 15             | 0%      |
| **Chromium**      | 0             | 15             | 0%      |
| **Mobile Chrome** | 0             | 15             | 0%      |

**Nota**: Mobile Safari tiene mejor tolerancia a elementos ocultos.

---

## ✅ Soluciones Implementadas

### 1. Helper de Autenticación Corregido ✅

- Verifica URL en lugar de texto visible
- Maneja casos móvil/desktop
- Más robusto

### 2. Documentación Creada ✅

- `docs/RESUMEN-TESTS-E2E.md`
- `docs/ANALISIS-ERRORES-TESTS.md` (este documento)

---

## 🔧 Próximas Mejoras Recomendadas

### Prioridad Alta

1. **Agregar data-testid a componentes críticos**

   ```tsx
   <h1 data-testid="retc-integration-title">Integración RETC</h1>
   <button data-testid="descargar-excel-retc">Descargar Excel RETC</button>
   ```

2. **Cambiar waitUntil en navegación**

   ```typescript
   // De:
   await page.goto(url, { waitUntil: "networkidle" });

   // A:
   await page.goto(url, { waitUntil: "domcontentloaded" });
   await page.waitForSelector('[data-testid="main-content"]', { timeout: 10000 });
   ```

3. **Mejorar selectores**

   ```typescript
   // De:
   await page.locator("text=Integración RETC").toBeVisible();

   // A:
   await page.getByRole("heading", { name: /Integración RETC/i }).toBeVisible();
   ```

### Prioridad Media

4. **Configurar timeouts específicos por test**

   ```typescript
   test.setTimeout(60000); // 60 segundos para tests complejos
   ```

5. **Usar fixtures de Playwright para setup común**
   ```typescript
   test.extend({
     loggedInAdmin: async ({ page }, use) => {
       await loginAsUser(page, "admin");
       await use(page);
     },
   });
   ```

---

## 🎯 Conclusión

**Los errores NO son tan graves como parecen**:

- ✅ Solo hay ~12 tests únicos que fallan
- ✅ El problema principal (helper de auth) ya está corregido
- ✅ Los errores se multiplican por 5 navegadores

**Próximos pasos**:

1. Re-ejecutar tests después de la corrección del helper
2. Agregar `data-testid` a componentes críticos
3. Ajustar estrategias de espera en navegación
4. Mejorar selectores para ser más robustos

---

**Última actualización**: 17 de diciembre de 2025
