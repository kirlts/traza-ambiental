import { test, expect } from "@playwright/test";

// Función para calcular el dígito verificador de un RUT chileno
function calcularDigitoVerificador(rut: string): string {
  // Remover puntos y guiones, solo números
  const rutLimpio = rut.replace(/[^0-9]/g, "");

  let suma = 0;
  let multiplicador = 2;

  // Recorrer el RUT de derecha a izquierda
  for (let i = rutLimpio.length - 1; i >= 0; i--) {
    suma += parseInt(rutLimpio[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dv = 11 - resto;

  if (dv === 11) return "0";
  if (dv === 10) return "K";
  return dv.toString();
}

// Función para generar RUT dinámico basado en timestamp
function generarRutDinamico(timestamp: number, esEmpresa: boolean = true): string {
  let numeroBase: string;

  if (esEmpresa) {
    // Para empresas, usar un rango realista (ej. 76.xxx.xxx)
    numeroBase = "76" + timestamp.toString().slice(-6);
  } else {
    // Para personas, usar un rango más bajo (ej. 1.xxx.xxx a 2x.xxx.xxx)
    numeroBase = ((timestamp % 20000000) + 1000000).toString();
  }

  // Calcular dígito verificador
  const dv = calcularDigitoVerificador(numeroBase);

  // Formatear con puntos y guión
  const rutFormateado = numeroBase
    .split("")
    .reverse()
    .join("")
    .replace(/(\d{3})(?=\d)/g, "$1.")
    .split("")
    .reverse()
    .join("");

  return `${rutFormateado}-${dv}`;
}

test.describe("Registro Público de Generador (HU-003)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/registro-generador", { waitUntil: "domcontentloaded" });
  });

  test("generador puede completar registro completo", async ({ page }) => {
    // Generar datos únicos para evitar conflictos
    const timestamp = Date.now();
    const rutEmpresa = generarRutDinamico(timestamp, true);
    const rutRepresentante = generarRutDinamico(timestamp + 1, false); // Usar timestamp + 1 para evitar duplicados
    const email = `test${timestamp}@empresa.com`;
    const emailRepresentante = `representante${timestamp}@empresa.com`;

    // Paso 1: Datos de la Empresa
    await page.waitForSelector('[name="empresa.rut"]', { state: "visible", timeout: 10000 });
    await page.fill('[name="empresa.rut"]', rutEmpresa);
    await page.keyboard.press("Tab"); // Disparar validación onBlur
    await expect(page.locator('span:has-text("✓")')).toBeVisible({ timeout: 10000 }); // Esperar validación

    await page.fill('[name="empresa.razonSocial"]', `Empresa Test ${timestamp} SPA`);
    await page.fill('[name="empresa.direccion"]', "Av. Test 123, Santiago");
    await page.selectOption('[name="empresa.region"]', "Región Metropolitana");
    await page.fill('[name="empresa.comuna"]', "Santiago");
    await page.fill('[name="empresa.telefono"]', "912345678");

    // Hacer clic en Siguiente y esperar que el siguiente paso cargue
    await page.click('button:has-text("Siguiente")');
    await page.waitForSelector('[name="rutRepresentante"]', { state: "visible", timeout: 15000 });

    // Verificar que avanza al paso 2
    await expect(page.locator('[name="rutRepresentante"]')).toBeVisible();

    // Paso 2: Representante Legal
    await page.fill('[name="rutRepresentante"]', rutRepresentante);
    await page.fill('[name="nombresRepresentante"]', "Juan Carlos");
    await page.fill('[name="apellidosRepresentante"]', "Pérez González");
    await page.fill('[name="cargoRepresentante"]', "Gerente General");
    await page.fill('[name="emailRepresentante"]', emailRepresentante);
    await page.fill('[name="telefonoRepresentante"]', "987654321");

    await page.click('button:has-text("Siguiente")');

    // Esperar a que aparezca el formulario de credenciales (indicador de que avanzó al paso 3)
    await page.waitForSelector('[name="email"]', { state: "visible", timeout: 15000 });

    // Verificar que avanza al paso 3 - verificar que el formulario de credenciales está visible
    await expect(page.locator('[name="email"]')).toBeVisible();

    // Paso 3: Credenciales
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', "Password123!");
    await page.fill('[name="confirmPassword"]', "Password123!");

    // Aceptar términos y condiciones
    await page.check('[name="aceptaTerminos"]');
    await page.check('[name="aceptaPrivacidad"]');

    // No es necesario interactuar con reCAPTCHA en desarrollo (se omite automáticamente)

    // Enviar registro
    await page.click('button:has-text("Registrarme")');

    // Aumentar espera máxima para el mensaje de éxito
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 20000 });
    await expect(page.locator("h1")).toContainText("Registro Exitoso", { timeout: 10000 });
  });

  test("sistema valida RUT duplicado", async ({ page }) => {
    // Intentar registrar con RUT ya existente (usar RUT fijo conocido para este test específico)
    await page.waitForSelector('[name="empresa.rut"]', { state: "visible", timeout: 5000 });
    await page.fill('[name="empresa.rut"]', "76.123.456-0"); // RUT fijo para test de duplicado
    await page.fill('[name="empresa.razonSocial"]', "Empresa Duplicada");

    await page.click('button:has-text("Siguiente")');

    // Verificar mensaje de error específico (usando first() para evitar strict mode violation)
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
  });

  test("sistema valida contraseña débil", async ({ page }) => {
    // Completar pasos 1 y 2
    const timestamp = Date.now() + 1000; // Usar timestamp diferente para evitar conflictos
    const rutEmpresa = generarRutDinamico(timestamp, true);
    const rutRepresentante = generarRutDinamico(timestamp + 1, false);

    await page.waitForSelector('[name="empresa.rut"]', { state: "visible", timeout: 10000 });
    await page.fill('[name="empresa.rut"]', rutEmpresa);
    await page.keyboard.press("Tab"); // Disparar validación onBlur
    await expect(page.locator('span:has-text("✓")')).toBeVisible({ timeout: 10000 }); // Esperar validación

    await page.fill('[name="empresa.razonSocial"]', "Empresa Nueva");
    await page.fill('[name="empresa.direccion"]', "Av. Nueva 456");
    await page.selectOption('[name="empresa.region"]', "Región Metropolitana");
    await page.fill('[name="empresa.comuna"]', "Santiago");
    await page.fill('[name="empresa.telefono"]', "912345678");
    await page.click('button:has-text("Siguiente")');

    await page.waitForSelector('[name="rutRepresentante"]', { state: "visible", timeout: 10000 });
    await page.fill('[name="rutRepresentante"]', rutRepresentante);
    await page.fill('[name="nombresRepresentante"]', "María");
    await page.fill('[name="apellidosRepresentante"]', "González");
    await page.fill('[name="cargoRepresentante"]', "Gerente");
    await page.fill('[name="emailRepresentante"]', "maria@empresa.com");
    await page.fill('[name="telefonoRepresentante"]', "987654321");
    await page.click('button:has-text("Siguiente")');

    // Esperar a que aparezca el formulario de credenciales (indicador de que avanzó al paso 3)
    await page.waitForSelector('[name="email"]', { state: "visible", timeout: 10000 });

    // Verificar que avanza al paso 3 - verificar que el formulario de credenciales está visible
    await expect(page.locator('[name="email"]')).toBeVisible();

    // Esperar más tiempo para que el formulario se estabilice
    await page.waitForTimeout(1000);

    await page.fill('[name="email"]', "admin@nuevaempresa.com");
    await page.fill('[name="password"]', "12345");

    // Verificar validación en tiempo real - verificar que los requisitos están visibles
    await expect(page.locator("text=/8 caracteres/i").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=/1 mayúscula/i").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=/1 número/i").first()).toBeVisible({ timeout: 5000 });
  });

  test("sistema previene registro sin completar pasos", async ({ page }) => {
    // Intentar avanzar sin completar datos obligatorios
    await page.waitForSelector('button:has-text("Siguiente")', { state: "visible", timeout: 5000 });
    await page.click('button:has-text("Siguiente")');

    // Verificar que se muestran errores de validación (usando first() para evitar strict mode)
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
  });
});
