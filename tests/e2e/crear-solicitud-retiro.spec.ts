/**
 * Test E2E para creación de Solicitud de Retiro
 * HU-003B: Crear Solicitud de Retiro de NFU
 *
 * @requires Playwright
 */

import { test, expect, Page } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

test.describe("HU-003B: Crear Solicitud de Retiro", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, "generador");
  });

  test("Debe mostrar botón de Nueva Solicitud en dashboard", async ({ page }) => {
    // Verificar que existe el botón
    const botonNuevaSolicitud = page.locator('button:has-text("Nueva Solicitud")');
    await expect(botonNuevaSolicitud).toBeVisible();
  });

  test("Flujo completo: Crear solicitud exitosamente", async ({ page }) => {
    // 1. Navegar a nueva solicitud
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Verificar que estamos en Paso 1
    await expect(page.locator("text=Paso 1")).toBeVisible();
    await expect(page.locator("text=Información del Retiro")).toBeVisible();

    // 2. PASO 1 - Información del Retiro
    await page.fill(
      'input[name="direccionRetiro"]',
      "Av. Libertador Bernardo O'Higgins 1449, Santiago"
    );

    // Seleccionar región
    await page.click('select[name="region"]');
    await page.selectOption('select[name="region"]', { label: "Región Metropolitana" });

    // Esperar a que se carguen las comunas
    await page.waitForTimeout(500);

    // Seleccionar comuna
    await page.click('select[name="comuna"]');
    await page.selectOption('select[name="comuna"]', { label: "Santiago" });

    // Seleccionar fecha (3 días en el futuro)
    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 3);
    const fechaFormateada = fechaFutura.toISOString().split("T")[0]; // YYYY-MM-DD
    await page.fill('input[name="fechaPreferida"]', fechaFormateada);

    // Seleccionar horario
    await page.check('input[value="Mañana"]');

    // Ir al siguiente paso
    await page.click('button:has-text("Siguiente")');

    // Verificar que estamos en Paso 2
    await expect(page.locator("text=Paso 2")).toBeVisible();
    await expect(page.locator("text=Detalles de NFU")).toBeVisible();

    // 3. PASO 2 - Detalles de NFU
    await page.fill('input[name="categoriaA_cantidad"]', "50");
    await page.fill('input[name="categoriaA_pesoEst"]', "400");

    await page.fill('input[name="categoriaB_cantidad"]', "10");
    await page.fill('input[name="categoriaB_pesoEst"]', "800");

    // Verificar que se calculan los totales
    await expect(page.locator("text=60 unidades")).toBeVisible();
    await expect(page.locator("text=1200")).toBeVisible(); // kg totales

    // Ir al siguiente paso
    await page.click('button:has-text("Siguiente")');

    // Verificar que estamos en Paso 3
    await expect(page.locator("text=Paso 3")).toBeVisible();
    await expect(page.locator("text=Contacto")).toBeVisible();

    // 4. PASO 3 - Contacto e Instrucciones
    await page.fill('input[name="nombreContacto"]', "María González");
    await page.fill('input[name="telefonoContacto"]', "+56987654321");
    await page.fill(
      'textarea[name="instrucciones"]',
      "Tocar timbre del segundo piso. Disponible todo el día."
    );

    // Aceptar términos y condiciones
    await page.check('input[name="aceptarTerminos"]');

    // Enviar solicitud
    await page.click('button:has-text("Enviar Solicitud")');

    // 5. Verificar mensaje de éxito
    await expect(page.locator("text=Solicitud Creada Exitosamente")).toBeVisible({
      timeout: 10000,
    });

    // Verificar que se muestra un folio
    const folio = page.locator("text=/SOL-\\d{8}-\\d{4}/");
    await expect(folio).toBeVisible();

    // Verificar que hay botones de acción
    await expect(page.locator('button:has-text("Ver Mi Solicitud")')).toBeVisible();
    await expect(page.locator('button:has-text("Crear Nueva")')).toBeVisible();
  });

  test("Debe validar campos requeridos en Paso 1", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Intentar avanzar sin llenar campos
    await page.click('button:has-text("Siguiente")');

    // Verificar mensajes de error
    await expect(page.locator("text=La dirección es requerida")).toBeVisible();
    await expect(page.locator("text=La región es requerida")).toBeVisible();
    await expect(page.locator("text=La comuna es requerida")).toBeVisible();
    await expect(page.locator("text=La fecha es requerida")).toBeVisible();
  });

  test("Debe validar fecha no pasada en Paso 1", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Llenar campos básicos
    await page.fill('input[name="direccionRetiro"]', "Calle Test 123");
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.waitForTimeout(300);
    await page.selectOption('select[name="comuna"]', { index: 1 });

    // Ingresar fecha pasada
    const fechaPasada = new Date();
    fechaPasada.setDate(fechaPasada.getDate() - 1);
    const fechaFormateada = fechaPasada.toISOString().split("T")[0];
    await page.fill('input[name="fechaPreferida"]', fechaFormateada);

    // Intentar avanzar
    await page.click('button:has-text("Siguiente")');

    // Verificar error
    await expect(page.locator("text=/fecha.*pasada/i")).toBeVisible();
  });

  test("Debe validar que al menos una categoría tenga cantidad en Paso 2", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Completar Paso 1
    await page.fill('input[name="direccionRetiro"]', "Calle Test 456");
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.waitForTimeout(300);
    await page.selectOption('select[name="comuna"]', { index: 1 });

    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 2);
    const fechaFormateada = fechaFutura.toISOString().split("T")[0];
    await page.fill('input[name="fechaPreferida"]', fechaFormateada);

    await page.click('button:has-text("Siguiente")');

    // En Paso 2, dejar todas las cantidades en 0
    await page.fill('input[name="categoriaA_cantidad"]', "0");
    await page.fill('input[name="categoriaA_pesoEst"]', "0");
    await page.fill('input[name="categoriaB_cantidad"]', "0");
    await page.fill('input[name="categoriaB_pesoEst"]', "0");

    // Intentar avanzar
    await page.click('button:has-text("Siguiente")');

    // Verificar error
    await expect(page.locator("text=/al menos una categoría/i")).toBeVisible();
  });

  test("Debe permitir volver al paso anterior", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Completar Paso 1
    await page.fill('input[name="direccionRetiro"]', "Calle Test 789");
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.waitForTimeout(300);
    await page.selectOption('select[name="comuna"]', { index: 1 });

    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 2);
    const fechaFormateada = fechaFutura.toISOString().split("T")[0];
    await page.fill('input[name="fechaPreferida"]', fechaFormateada);

    await page.click('button:has-text("Siguiente")');

    // Verificar que estamos en Paso 2
    await expect(page.locator("text=Paso 2")).toBeVisible();

    // Volver al Paso 1
    await page.click('button:has-text("Anterior")');

    // Verificar que estamos en Paso 1
    await expect(page.locator("text=Paso 1")).toBeVisible();

    // Verificar que los datos se mantuvieron
    const valorDireccion = await page.inputValue('input[name="direccionRetiro"]');
    expect(valorDireccion).toBe("Calle Test 789");
  });

  test("Debe mostrar indicador de progreso de pasos", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Verificar indicador en Paso 1
    const indicadorPaso1 = page.locator('[data-step="1"]');
    await expect(indicadorPaso1).toHaveClass(/active|current/);

    // Verificar que Paso 2 y 3 están deshabilitados o inactivos
    const indicadorPaso2 = page.locator('[data-step="2"]');
    const indicadorPaso3 = page.locator('[data-step="3"]');

    await expect(indicadorPaso2).not.toHaveClass(/active|current/);
    await expect(indicadorPaso3).not.toHaveClass(/active|current/);
  });

  test("Debe permitir guardar como borrador", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Llenar parcialmente
    await page.fill('input[name="direccionRetiro"]', "Dirección Borrador 123");
    await page.selectOption('select[name="region"]', { index: 1 });

    // Guardar borrador
    await page.click('button:has-text("Guardar Borrador")');

    // Verificar mensaje de éxito
    await expect(page.locator("text=/borrador.*guardado/i")).toBeVisible({ timeout: 5000 });

    // Navegar a lista de solicitudes
    await page.goto("/dashboard/generador/solicitudes");

    // Verificar que aparece el borrador
    await expect(page.locator("text=Borrador")).toBeVisible();
    await expect(page.locator("text=Dirección Borrador 123")).toBeVisible();
  });

  test("Debe validar formato de teléfono en Paso 3", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Completar Paso 1
    await page.fill('input[name="direccionRetiro"]', "Calle Teléfono 111");
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.waitForTimeout(300);
    await page.selectOption('select[name="comuna"]', { index: 1 });

    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 2);
    const fechaFormateada = fechaFutura.toISOString().split("T")[0];
    await page.fill('input[name="fechaPreferida"]', fechaFormateada);
    await page.click('button:has-text("Siguiente")');

    // Completar Paso 2
    await page.fill('input[name="categoriaA_cantidad"]', "20");
    await page.fill('input[name="categoriaA_pesoEst"]', "160");
    await page.click('button:has-text("Siguiente")');

    // En Paso 3, ingresar teléfono inválido
    await page.fill('input[name="nombreContacto"]', "Juan Pérez");
    await page.fill('input[name="telefonoContacto"]', "12345"); // Formato inválido

    await page.check('input[name="aceptarTerminos"]');
    await page.click('button:has-text("Enviar Solicitud")');

    // Verificar error de validación
    await expect(page.locator("text=/teléfono.*inválido/i")).toBeVisible();
  });

  test("Debe calcular totales automáticamente en Paso 2", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Completar Paso 1
    await page.fill('input[name="direccionRetiro"]', "Calle Cálculo 222");
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.waitForTimeout(300);
    await page.selectOption('select[name="comuna"]', { index: 1 });

    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 2);
    const fechaFormateada = fechaFutura.toISOString().split("T")[0];
    await page.fill('input[name="fechaPreferida"]', fechaFormateada);
    await page.click('button:has-text("Siguiente")');

    // Ingresar valores
    await page.fill('input[name="categoriaA_cantidad"]', "30");
    await page.fill('input[name="categoriaA_pesoEst"]', "240.5");
    await page.fill('input[name="categoriaB_cantidad"]', "15");
    await page.fill('input[name="categoriaB_pesoEst"]', "1200.75");

    // Verificar cálculos
    await expect(page.locator("text=45 unidades")).toBeVisible(); // 30 + 15
    await expect(page.locator("text=1441.25")).toBeVisible(); // 240.5 + 1200.75
  });

  test("Debe mostrar error si no acepta términos y condiciones", async ({ page }) => {
    await page.click('button:has-text("Nueva Solicitud")');
    await page.waitForURL("/dashboard/generador/solicitudes/nueva");

    // Completar todos los pasos sin aceptar términos
    // Paso 1
    await page.fill('input[name="direccionRetiro"]', "Calle Términos 333");
    await page.selectOption('select[name="region"]', { index: 1 });
    await page.waitForTimeout(300);
    await page.selectOption('select[name="comuna"]', { index: 1 });
    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 2);
    await page.fill('input[name="fechaPreferida"]', fechaFutura.toISOString().split("T")[0]);
    await page.click('button:has-text("Siguiente")');

    // Paso 2
    await page.fill('input[name="categoriaA_cantidad"]', "10");
    await page.fill('input[name="categoriaA_pesoEst"]', "80");
    await page.click('button:has-text("Siguiente")');

    // Paso 3 - No marcar términos
    await page.fill('input[name="nombreContacto"]', "Carlos Ruiz");
    await page.fill('input[name="telefonoContacto"]', "+56933445566");

    // Intentar enviar sin aceptar términos
    await page.click('button:has-text("Enviar Solicitud")');

    // Verificar error
    await expect(page.locator("text=/aceptar.*términos/i")).toBeVisible();
  });
});

test.describe("HU-003B: Restricciones de acceso", () => {
  test("Usuario no autenticado debe redirigir a login", async ({ page }) => {
    // Intentar acceder directamente sin login
    await page.goto("/dashboard/generador/solicitudes/nueva");

    // Debe redirigir a login
    await page.waitForURL("/login");
  });

  test("Usuario con rol distinto a Generador no debe poder acceder", async ({ page }) => {
    // Login como transportista
    await page.goto("/login");
    await page.fill('input[name="email"]', "transportista-test@test.com");
    await page.fill('input[name="password"]', "Password123!");
    await page.click('button[type="submit"]');

    // Intentar acceder a crear solicitud
    await page.goto("/dashboard/generador/solicitudes/nueva");

    // Debe mostrar error 403 o redirigir
    await expect(page.locator("text=/no.*autorizado|403|acceso.*denegado/i")).toBeVisible({
      timeout: 5000,
    });
  });
});
