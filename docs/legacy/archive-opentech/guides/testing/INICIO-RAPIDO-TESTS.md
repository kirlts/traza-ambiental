# 🚀 Inicio Rápido - Sistema de Pruebas

## ⚡ Configuración en 3 Pasos

### 1️⃣ Crear Base de Datos de Pruebas (Solo Primera Vez)

```bash
createdb trazambiental_test
```

### 2️⃣ Ejecutar Tests

```bash
npm run test
```

### 3️⃣ ¡Listo! 🎉

---

## 📋 Comandos Principales

| Comando                 | Descripción                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run test`          | **Ejecuta todos los tests** (resetea BD automáticamente) |
| `npm run test:only`     | Ejecuta tests sin resetear BD                            |
| `npm run test:watch`    | Modo watch (desarrollo)                                  |
| `npm run test:coverage` | Tests con cobertura de código                            |

---

## 🎯 Lo Importante

### ✅ Lo que SÍ hace:

- ✅ Resetea `trazambiental_test` antes de cada ejecución
- ✅ Carga datos de prueba automáticamente
- ✅ Ejecuta 247 tests
- ✅ Muestra estadísticas al final

### ❌ Lo que NO hace:

- ❌ NO toca tu base de datos normal (`trazambiental`)
- ❌ NO afecta tus datos de desarrollo
- ❌ NO requiere configuración manual

---

## 👥 Usuarios de Prueba

Después de ejecutar los tests, tendrás estos usuarios disponibles:

```
Email: admin@test.com
Password: test123
Rol: Administrador

Email: transportista@test.com
Password: test123
Rol: Transportista

Email: gestor@test.com
Password: test123
Rol: Gestor

Email: generador@test.com
Password: test123
Rol: Generador
```

---

## 🔧 Troubleshooting

### ❌ Error: "Base de datos no existe"

```bash
createdb trazambiental_test
```

### ❌ Error: "PostgreSQL no está corriendo"

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### ❌ Error: "Prisma Client no generado"

```bash
npx prisma generate
```

### ❌ Quiero resetear manualmente la BD de pruebas

```bash
node scripts/setup-test-db.js
```

---

## 📊 Estado Actual

```
✅ 209 tests pasando (84.6%)
❌ 38 tests fallando (15.4%)

🎯 Objetivo: 95% de tests pasando
📈 Progreso: Excelente base inicial
```

---

## 📚 Documentación Completa

- 📖 **[INFORME-TESTS-FINAL.md](./INFORME-TESTS-FINAL.md)** - Informe detallado completo
- 📖 **[README-TESTS.md](./README-TESTS.md)** - Guía completa de configuración

---

## 🆘 ¿Necesitas Ayuda?

1. Ejecuta el script de verificación:

   ```bash
   ./scripts/verificar-tests.sh
   ```

2. Revisa los logs de tests:

   ```bash
   npm run test 2>&1 | tee test-output.log
   ```

3. Ejecuta tests específicos:
   ```bash
   npm run test:only -- path/to/test.ts
   ```

---

## ✨ Características Destacadas

- 🛡️ **Seguro:** Tu BD normal está protegida
- ⚡ **Rápido:** Setup automático en segundos
- 🔄 **Reproducible:** Mismos datos en cada ejecución
- 📊 **Predecible:** Tests consistentes
- 🚀 **Fácil:** Un solo comando

---

## 🎉 ¡Eso es Todo!

Ya puedes ejecutar tests sin preocuparte por tu base de datos normal.

```bash
npm run test
```

**¡Happy Testing! 🧪✨**
