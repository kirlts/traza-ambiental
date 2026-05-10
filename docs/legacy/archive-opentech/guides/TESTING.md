# 🧪 Guía de Testing - Sistema REP Chile

## 📋 Resumen

Este proyecto incluye una suite completa de tests automatizados para garantizar la calidad y estabilidad del código.

## 🛠️ Tecnologías de Testing

- **Jest**: Framework principal de testing
- **React Testing Library**: Para testing de componentes React
- **Playwright**: Para tests E2E (End-to-End)
- **Jest DOM**: Matchers adicionales para testing del DOM

## 📁 Estructura de Tests

```
src/__tests__/
├── components/          # Tests de componentes React
│   ├── KPICard.test.tsx
│   └── DashboardIntegration.test.tsx
├── hooks/               # Tests de hooks personalizados
│   └── useDebounce.test.ts
├── utils/               # Tests de utilidades
│   └── validarRUT.test.ts
└── api/                 # Tests de APIs
    └── auth.test.ts

e2e/                     # Tests End-to-End
└── auth.spec.ts
```

## 🚀 Ejecutar Tests

### Tests Unitarios

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar solo tests de integración
npm run test:integration

# Ejecutar solo tests de API
npm run test:api
```

### Tests E2E (Playwright)

```bash
# Ejecutar tests E2E (asegúrate de que el servidor esté corriendo)
npm run test:e2e:ui      # Modo UI interactivo
npm run test:e2e:headed  # Con navegador visible

# Ejecutar todos los tests (unitarios + E2E)
npm run test:all
```

### Cobertura de Código

```bash
# Generar reporte de cobertura
npm run test:coverage

# Para CI/CD
npm run test:ci
```

## 📝 Escribir Tests

### Test de Componente React

```typescript
import { render, screen } from '@testing-library/react'
import { KPICard } from '@/components/dashboard/KPICard'

describe('KPICard', () => {
  it('renders KPI card with correct content', () => {
    render(<KPICard titulo="Test" valor="100%" subtitulo="Test subtitle" icon="target" color="blue" />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
```

### Test de Hook Personalizado

```typescript
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  it("returns debounced value after delay", () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useDebounce("test", 500));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("test");
  });
});
```

### Test de API

```typescript
import { GET } from "@/app/api/auth/validate-rut/route";

// Mock de dependencias
jest.mock("@/lib/prisma", () => ({
  prisma: { user: { findFirst: jest.fn() } },
}));

describe("/api/auth/validate-rut", () => {
  it("validates existing RUT", async () => {
    // Arrange
    const mockPrisma = require("@/lib/prisma").prisma;
    mockPrisma.user.findFirst.mockResolvedValue({ id: "1", rut: "12345678-5" });

    // Act
    const request = new NextRequest("http://localhost:3000/api/auth/validate-rut?rut=12345678-5");
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(200);
  });
});
```

### Test E2E con Playwright

```typescript
import { test, expect } from "@playwright/test";

test("should load login page", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await expect(page.locator("text=Iniciar Sesión")).toBeVisible();
});
```

## 🔧 Configuración

### Jest Config (`jest.config.js`)

- Configurado para Next.js
- Mapeo de módulos `@/` para imports absolutos
- Configuración especial para Windows (`maxWorkers: 1`)

### Setup de Jest (`jest.setup.js`)

- Configuración de Testing Library
- Mocks para Next.js router, auth, fetch
- Mocks para APIs del navegador (IntersectionObserver, ResizeObserver)

### Playwright Config (`playwright.config.ts`)

- Tests en múltiples navegadores (Chrome, Firefox, Safari)
- Tests móviles incluidos
- Servidor de desarrollo automático

## 🎯 Mejores Prácticas

### 1. Nombres Descriptivos

```typescript
// ✅ Bueno
describe('KPICard with blue color', () => { ... })

// ❌ Malo
describe('Test component', () => { ... })
```

### 2. Arrange, Act, Assert (AAA)

```typescript
it("should validate RUT", () => {
  // Arrange
  const validRut = "12345678-5";

  // Act
  const result = validarRUT(validRut);

  // Assert
  expect(result).toBe(true);
});
```

### 3. Mockear Dependencias Externas

```typescript
// Mock de API calls
global.fetch = jest.fn()

// Mock de librerías externas
jest.mock('next-auth/react', () => ({ ... }))
```

### 4. Cleanup Después de Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

## 📊 Cobertura Esperada

- **Componentes**: >80%
- **Hooks**: >90%
- **Utilidades**: >95%
- **APIs**: >70%

## 🚨 Troubleshooting

### Error: "spawn UNKNOWN"

- Configurar `maxWorkers: 1` en `jest.config.js`
- Verificar permisos de ejecución en Windows

### Error: "Cannot find module '@/...'"

- Verificar configuración de `moduleNameMapper` en Jest
- Asegurar que los paths de TypeScript estén configurados

### Tests E2E fallan

- Verificar que el servidor esté corriendo en `http://localhost:3000`
- Revisar configuración de `playwright.config.ts`

## 🔄 CI/CD Integration

Los tests están preparados para integración continua:

```yaml
# Ejemplo GitHub Actions
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:e2e
```

## 📈 Próximos Pasos

1. **Aumentar cobertura** en componentes complejos
2. **Agregar tests de performance** para componentes críticos
3. **Implementar testing visual** con herramientas como Chromatic
4. **Configurar testing de accesibilidad** con axe-core
5. **Agregar tests de carga** para APIs críticas

---

¡Los tests ayudan a mantener la calidad del código y prevenir regresiones! 🎉
