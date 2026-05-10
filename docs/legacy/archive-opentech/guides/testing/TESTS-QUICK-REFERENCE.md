# 🚀 Referencia Rápida - Tests

## ⚡ Comandos Esenciales

```bash
# Test completo con reset de BD
npm run test

# Test rápido (sin reset)
npm run test:only

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage
```

## 📊 Estado Actual

```
✅ 16 Test Suites (100%)
✅ 243 Tests (100%)
⏱️  < 1 segundo
```

## 🎯 Archivos de Test Principales

### Emails (82 tests)

- `__tests__/lib/emails/send.test.ts` - Envío de emails
- `__tests__/lib/emails/send-api.test.ts` - API de envío
- `__tests__/lib/emails/templates.test.ts` - Templates

### API (68 tests)

- `__tests__/api/admin/aprobaciones-api.test.ts` - Aprobaciones
- `__tests__/api/user/documentos-api.test.ts` - Documentos

### Utilidades (26 tests)

- `src/__tests__/utils/validarRUT.test.ts` - Validación RUT

## 🔧 Crear Nuevos Tests

### Template Básico

```typescript
import { describe, it, expect, beforeEach } from "@jest/globals";

describe("Mi Funcionalidad", () => {
  beforeEach(() => {
    // Setup aquí
    jest.clearAllMocks();
  });

  it("debería hacer algo específico", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

### Test con Mocks

```typescript
import { mockSendMail } from '../../__mocks__/nodemailer'

it('debería enviar email', async () => {
  mockSendMail.mockResolvedValueOnce({
    messageId: 'test-123'
  })

  const result = await sendEmail(...)

  expect(result).toBe(true)
  expect(mockSendMail).toHaveBeenCalled()
})
```

### Test con Prisma

```typescript
import { mockPrisma } from '../../__mocks__/prisma'

it('debería crear usuario', async () => {
  mockPrisma.user.create.mockResolvedValueOnce({
    id: '1',
    email: 'test@test.com'
  })

  const user = await createUser(...)

  expect(user.id).toBe('1')
})
```

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"

```bash
# Verificar que los paths estén bien configurados
npm run test:only -- --verbose
```

### Error: "Database connection failed"

```bash
# Crear la BD de pruebas
createdb trazambiental_test

# Ejecutar setup
npm run test
```

### Tests lentos

```bash
# Usar test:only para evitar reset de BD
npm run test:only

# Ejecutar suite específica
npm run test:only __tests__/lib/emails/send.test.ts
```

### Mocks no funcionan

```typescript
// Asegurarse de limpiar mocks
beforeEach(() => {
  jest.clearAllMocks()
})

// Usar mockOnce para comportamiento temporal
mockFunction.mockResolvedValueOnce(...)
```

## 📝 Mejores Prácticas

### 1. Nombres Descriptivos

```typescript
// ❌ Malo
it("test 1", () => {});

// ✅ Bueno
it("debería retornar error cuando el email es inválido", () => {});
```

### 2. Arrange-Act-Assert

```typescript
it("debería calcular total correctamente", () => {
  // Arrange - Preparar datos
  const items = [{ price: 10 }, { price: 20 }];

  // Act - Ejecutar función
  const total = calculateTotal(items);

  // Assert - Verificar resultado
  expect(total).toBe(30);
});
```

### 3. Un Assert por Concepto

```typescript
// ✅ Bueno - Múltiples expects del mismo concepto
it("debería crear usuario completo", () => {
  const user = createUser(data);

  expect(user.email).toBe("test@test.com");
  expect(user.name).toBe("Test User");
  expect(user.role).toBe("Admin");
});
```

### 4. Usar describe para Agrupar

```typescript
describe("sendEmail", () => {
  describe("cuando el email es válido", () => {
    it("debería enviar el mensaje", () => {});
    it("debería retornar true", () => {});
  });

  describe("cuando hay error", () => {
    it("debería retornar false", () => {});
    it("debería loggear el error", () => {});
  });
});
```

## 🎯 Cobertura por Módulo

| Módulo      | Tests | Estado  |
| ----------- | ----- | ------- |
| Emails      | 82    | ✅ 100% |
| API         | 68    | ✅ 100% |
| Utilidades  | 26    | ✅ 100% |
| Integración | 50    | ✅ 100% |
| Mocks       | 5     | ✅ 100% |

## 📚 Documentación Completa

- `TESTS-FINAL-REPORT.md` - Informe completo y detallado
- `README-TESTS.md` - Guía extensa de tests
- `test.env.example` - Configuración de variables

## 🔗 Enlaces Útiles

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)

---

**Última actualización**: 13 de noviembre de 2025  
**Estado**: ✅ 100% Tests Pasando
