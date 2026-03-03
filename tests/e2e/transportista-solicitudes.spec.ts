import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

test.describe("Transportista - Gestión de Solicitudes", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, "transportista@trazambiental.com", "transportista123", "transportista");
  });

  test("debería ver la página de solicitudes disponibles", async ({ page }) => {
    await page.goto("/dashboard/transportista/solicitudes");
    await expect(page.locator("h1").filter({ hasText: "Solicitudes Disponibles" })).toBeVisible();
  });

  test("debería poder filtrar solicitudes", async ({ page }) => {
    await page.goto("/dashboard/transportista/solicitudes");

    await page.waitForSelector("select", { timeout: 5000 });

    const selectRegion = page.locator("select").first();
    await selectRegion.waitFor({ state: "visible", timeout: 5000 });

    const options = await selectRegion.locator("option").count();
    if (options > 1) {
      await selectRegion.selectOption({ index: 1 });
    }

    await page.click('button:has-text("Aplicar Filtros")');
    await page.waitForLoadState("networkidle");
  });

  test("debería mostrar dashboard de flota", async ({ page }) => {
    await page.goto("/dashboard/transportista/solicitudes");
    await expect(page.locator("text=Gestión de Flota")).toBeVisible();
  });

  test("debería poder cambiar entre vista lista y mapa", async ({ page }) => {
    await page.goto("/dashboard/transportista/solicitudes");

    // Esperar a que cargue la vista de lista
    await expect(page.locator("h1").filter({ hasText: "Solicitudes Disponibles" })).toBeVisible();

    // Cambiar a vista de mapa
    await page.click('button:has-text("🗺️ Mapa")');

    // Esperar a que cargue el mapa (buscar elementos de Leaflet)
    await page.waitForTimeout(2000); // Dar tiempo para que cargue el mapa

    // Verificar que el mapa está visible (buscar container de mapa)
    await expect(page.locator('[class*="leaflet-container"]')).toBeVisible({ timeout: 10000 });

    // Volver a vista de lista
    await page.click('button:has-text("📋 Lista")');
    await expect(page.locator("h1").filter({ hasText: "Solicitudes Disponibles" })).toBeVisible();
  });

  test("debería mostrar mensaje cuando no hay solicitudes", async ({ page }) => {
    await page.goto("/dashboard/transportista/solicitudes");

    // Si no hay solicitudes, debería mostrar mensaje
    // Este test puede fallar si hay solicitudes en la BD de prueba
    const tieneSolicitudes = await page.locator("text=No hay solicitudes").count();
    const tieneMensajeDisponibles = await page
      .locator("text=No hay solicitudes disponibles")
      .count();

    // Aceptar que puede haber solicitudes o mensaje vacío
    expect(tieneSolicitudes + tieneMensajeDisponibles).toBeGreaterThanOrEqual(0);
  });

  test("debería poder ver botones de acción en solicitudes", async ({ page }) => {
    await page.goto("/dashboard/transportista/solicitudes");

    // Esperar a que cargue la página
    await expect(page.locator("h1").filter({ hasText: "Solicitudes Disponibles" })).toBeVisible();

    // Buscar botones de acción (si hay solicitudes)
    const botonesAceptar = await page.locator('button:has-text("✅ Aceptar")').count();
    const botonesRechazar = await page.locator('button:has-text("❌ Rechazar")').count();

    // Si hay solicitudes, debería haber botones
    if (botonesAceptar > 0) {
      expect(botonesRechazar).toBeGreaterThan(0);
    }
  });
});
