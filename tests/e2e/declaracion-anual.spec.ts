import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

test.describe("Declaración Anual de Productor (HU-012)", () => {
  test.beforeEach(async ({ page }) => {
    // Login como productor usando helper
    await loginAsUser(page, "productor");

    // Esperar más tiempo para que la sesión se establezca completamente en webkit
    await page.waitForTimeout(2000);

    // Navegar directamente a declaración anual
    await page.goto("/dashboard/productor/declaracion-anual", { waitUntil: "networkidle" });

    // Esperar a que la página cargue completamente
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Verificar que estamos en la página correcta y no hay redirección a login
    await expect(page).toHaveURL(/.*declaracion-anual$/);
  });

  test("productor puede completar declaración anual", async ({ page }) => {
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Verificar que se muestra el período activo
    await expect(page.locator('[data-testid="periodo-activo"]')).toContainText("2024", {
      timeout: 10000,
    });
    await expect(page.locator('[data-testid="fecha-limite"]')).toContainText("31 de marzo", {
      timeout: 10000,
    });

    // Completar categoría A (Vehículos livianos)
    await page.fill('[data-testid="categoria-a-cantidad"]', "100000");
    await page.fill('[data-testid="categoria-a-peso"]', "2500");

    // Completar categoría B (Vehículos pesados)
    await page.fill('[data-testid="categoria-b-cantidad"]', "10000");
    await page.fill('[data-testid="categoria-b-peso"]', "500");

    // Esperar a que se calculen los totales
    await page.waitForTimeout(1000);

    // Verificar cálculo automático de totales (formato chileno con punto)
    await expect(page.locator('[data-testid="total-unidades"]')).toContainText("110.000", {
      timeout: 10000,
    });
    await expect(page.locator('[data-testid="total-toneladas"]')).toContainText("3.000", {
      timeout: 10000,
    });

    // Verificar metas calculadas (formato chileno)
    await expect(page.locator('[data-testid="meta-recoleccion"]')).toContainText("750.000 kg", {
      timeout: 10000,
    });
    await expect(page.locator('[data-testid="meta-valorizacion"]')).toContainText("600.000 kg", {
      timeout: 10000,
    });

    // Enviar declaración
    await page.click('button:has-text("Enviar Declaración")');

    // Confirmar envío
    await page.click('button:has-text("Confirmar")');

    // Esperar más tiempo para que aparezca el mensaje de éxito
    await page.waitForTimeout(2000);

    // Verificar mensaje de éxito en el estado de la declaración
    await expect(page.locator('[data-testid="estado-declaracion"]')).toContainText(
      "Declaración enviada exitosamente",
      { timeout: 10000 }
    );

    // Verificar que se genera folio
    await expect(page.locator('[data-testid="folio"]')).toContainText("DECL-202", {
      timeout: 10000,
    });
  });

  test("productor puede guardar como borrador", async ({ page }) => {
    // Esperar a que la página se cargue completamente
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Completar solo categoría A
    await page.fill('[data-testid="categoria-a-cantidad"]', "50000");
    await page.fill('[data-testid="categoria-a-peso"]', "1250");

    // Guardar como borrador
    await page.click('button:has-text("Guardar Borrador")');

    // Verificar mensaje de confirmación con mayor timeout
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      "Borrador guardado"
    );

    // Recargar página y verificar que se mantienen los datos
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Esperar a que los datos se carguen desde el servidor - esperar a que el input tenga el valor
    await page.waitForFunction(
      () => {
        const input = document.querySelector(
          '[data-testid="categoria-a-cantidad"]'
        ) as HTMLInputElement;
        return input && input.value !== "" && input.value !== "0";
      },
      { timeout: 10000 }
    );

    // Verificar que los valores se mantienen
    await expect(page.locator('[data-testid="categoria-a-cantidad"]')).toHaveValue("50000");
    await expect(page.locator('[data-testid="categoria-a-peso"]')).toHaveValue("1250");
  });

  test("sistema valida datos requeridos", async ({ page }) => {
    // Verificar que estamos en la página correcta antes de continuar
    await expect(page).toHaveURL(/.*declaracion-anual$/);

    // Esperar a que la página cargue completamente
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);

    // Limpiar cualquier dato existente en los campos
    await page.fill('[data-testid="categoria-a-cantidad"]', "0");
    await page.fill('[data-testid="categoria-a-peso"]', "0");
    await page.fill('[data-testid="categoria-b-cantidad"]', "0");
    await page.fill('[data-testid="categoria-b-peso"]', "0");

    // Esperar a que se actualice el estado
    await page.waitForTimeout(1000);

    // Verificar que el botón está deshabilitado sin datos
    const enviarBtn = page.locator('button:has-text("Enviar Declaración")');
    await expect(enviarBtn).toBeDisabled();

    // Completar datos mínimos requeridos en categoría A
    await page.fill('[data-testid="categoria-a-cantidad"]', "1000");
    await page.fill('[data-testid="categoria-a-peso"]', "25");

    // Esperar más tiempo para que se actualice el estado
    await page.waitForTimeout(1000);

    // Verificar que el botón se habilita con datos válidos
    await expect(enviarBtn).toBeEnabled();
  });

  test("productor puede ver historial de declaraciones", async ({ page }) => {
    // Verificar que estamos logueados antes de navegar
    await expect(page).toHaveURL(/.*declaracion-anual$/);

    // Esperar más tiempo para asegurar que la sesión está estable
    await page.waitForTimeout(2000);

    // Navegar al historial - usar goto directo para evitar problemas con sidebar oculto en mobile
    await page.goto("/dashboard/productor/declaracion-anual/historial", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await page.waitForLoadState("domcontentloaded");

    // Esperar a que la página se cargue completamente y verificar que no hay redirección a login
    await page.waitForTimeout(3000);

    // Verificar que estamos en la página correcta y no hay redirección a login
    await expect(page).toHaveURL(/.*historial$/, { timeout: 15000 });

    // Verificar que se muestra la tabla de declaraciones
    await expect(page.locator('[data-testid="historial-table"]')).toBeVisible({ timeout: 15000 });

    // Verificar columnas de la tabla (usando getByRole para ser más específico)
    const table = page.locator('[data-testid="historial-table"]');
    await expect(table.getByRole("columnheader", { name: "Año" })).toBeVisible({ timeout: 10000 });
    await expect(table.getByRole("columnheader", { name: "Estado" })).toBeVisible({
      timeout: 10000,
    });
    await expect(table.getByRole("columnheader", { name: "Total Unidades" })).toBeVisible({
      timeout: 10000,
    });
    await expect(table.getByRole("columnheader", { name: "Total Toneladas" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("productor puede descargar comprobante", async ({ page }) => {
    // Verificar que estamos logueados antes de navegar
    await expect(page).toHaveURL(/.*declaracion-anual$/);

    // Esperar más tiempo para asegurar que la sesión está estable
    await page.waitForTimeout(2000);

    // Navegar al historial - usar goto directo
    await page.goto("/dashboard/productor/declaracion-anual/historial", {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await page.waitForLoadState("domcontentloaded");

    // Esperar a que la página se cargue completamente y verificar que no hay redirección a login
    await page.waitForTimeout(3000);

    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*historial$/, { timeout: 15000 });

    // Verificar que la tabla está visible
    await expect(page.locator('[data-testid="historial-table"]')).toBeVisible({ timeout: 15000 });

    // Aumentar timeout para el evento de descarga
    const downloadPromise = page.waitForEvent("download", { timeout: 15000 });
    await page.click('[data-testid="descargar-comprobante"]');
    const download = await downloadPromise;

    // Verificar que se descarga el PDF
    expect(download.suggestedFilename()).toMatch(/Comprobante_DECL-.*\.pdf/);
  });
});
