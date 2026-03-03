import { test, expect } from "@playwright/test";

test.describe("Sistema de Autenticación (HU-001)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("usuario puede iniciar sesión exitosamente", async ({ page }) => {
    // Llenar formulario de login con selectores más robustos
    await page.waitForSelector('[name="email"]', { state: "visible", timeout: 10000 });
    await page.fill('[name="email"]', "productor@trazambiental.com");
    await page.fill('[name="password"]', "productor123");

    // Hacer clic en iniciar sesión
    await page.click('button[type="submit"]');

    // Esperar a que se complete la navegación al dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 20000 });

    // Esperar a que la página se cargue completamente
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Verificar que se muestra el dashboard del productor
    await expect(page.locator("h1")).toContainText("Bienvenido", { timeout: 10000 });
  });

  test("sistema valida credenciales incorrectas", async ({ page }) => {
    // Intentar login con credenciales incorrectas
    await page.waitForSelector('[name="email"]', { state: "visible", timeout: 10000 });
    await page.fill('[name="email"]', "usuario@incorrecto.com");
    await page.fill('[name="password"]', "passwordincorrecto");

    await page.click('button[type="submit"]');

    // Esperar más tiempo para que se procese la validación
    await page.waitForTimeout(3000);

    // Verificar que se muestra mensaje de error usando data-testid específico
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="login-error"]')).toContainText(
      /Credenciales inválidas|Error/
    );

    // Verificar que permanece en la página de login
    await expect(page).toHaveURL(/\/login/);
  });

  test("sistema redirige a login cuando no hay sesión", async ({ page }) => {
    // Intentar acceder a dashboard sin sesión
    await page.goto("/dashboard");

    // Verificar redirección a login (puede incluir callbackUrl)
    await expect(page).toHaveURL(/\/login/);
  });

  test("usuario puede cerrar sesión", async ({ page }) => {
    // Login exitoso
    await page.waitForSelector('[name="email"]', { state: "visible", timeout: 10000 });
    await page.fill('[name="email"]', "productor@trazambiental.com");
    await page.fill('[name="password"]', "productor123");

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 20000 });

    // Esperar a que el dashboard se cargue completamente
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000);

    // Cerrar sesión
    await page.click('[data-testid="logout-button"]');

    // Verificar redirección a login
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
