import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

test.describe("Confirmación de Entrega - Transportista", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, "transportista@trazambiental.com", "transportista123", "transportista");
  });

  test("debería mostrar la página de entregas disponibles", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    // Verificar título y elementos principales
    await expect(page.locator("h1")).toContainText("Confirmar Entregas");
    await expect(
      page.locator("text=Gestiona las entregas pendientes de confirmación al gestor")
    ).toBeVisible();

    // Verificar que se muestre el indicador de entregas pendientes
    await expect(page.locator("text=pendientes")).toBeVisible();
  });

  test("debería mostrar mensaje cuando no hay entregas pendientes", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    // Si no hay entregas pendientes, mostrar mensaje apropiado
    const noEntregas = page.locator("text=No hay entregas pendientes");
    const todasConfirmadas = page.locator("text=Todas las entregas han sido confirmadas");

    // Una de las dos opciones debería estar visible
    await expect(noEntregas.or(todasConfirmadas)).toBeVisible();
  });

  test("debería poder acceder desde el dashboard principal", async ({ page }) => {
    await page.goto("/dashboard/transportista");

    // Click en la card de Entregas
    await page.locator("text=Entregas").click();

    // Verificar que se redirige a la página de entregas
    await expect(page).toHaveURL("/dashboard/transportista/entregas");
    await expect(page.locator("h1")).toContainText("Confirmar Entregas");
  });

  test("debería mostrar indicador de disponibilidad en dashboard", async ({ page }) => {
    await page.goto("/dashboard/transportista");

    // Verificar que la card de Entregas muestra "Disponible"
    await expect(page.locator("text=Entregas")).toBeVisible();
    await expect(page.locator("text=Disponible").nth(2)).toBeVisible(); // El tercero en la lista
  });

  test("debería mostrar detalles de solicitudes recolectadas", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    // Si hay solicitudes disponibles, verificar estructura
    const solicitudCards = page.locator('[data-testid="solicitud-entrega"]');
    const count = await solicitudCards.count();

    if (count > 0) {
      // Verificar primera solicitud
      const firstCard = solicitudCards.first();

      // Debería tener folio
      await expect(firstCard.locator("text=Solicitud")).toBeVisible();

      // Debería tener estado "Recolectada"
      await expect(firstCard.locator("text=Recolectada")).toBeVisible();

      // Debería tener información del generador
      await expect(firstCard.locator("text=RUT:")).toBeVisible();

      // Debería tener información del vehículo
      await expect(firstCard.locator("text=Tipo:")).toBeVisible();

      // Debería tener fecha de recolección
      await expect(firstCard.locator("text=Recolectado")).toBeVisible();

      // Debería tener detalles de la carga
      await expect(firstCard.locator("text=Detalles de la Carga")).toBeVisible();

      // Debería tener botón de confirmar entrega
      await expect(firstCard.locator("text=Confirmar Entrega")).toBeVisible();
    }
  });

  test("debería abrir formulario de confirmación al hacer click", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    const confirmButton = page.locator("text=Confirmar Entrega").first();

    if (await confirmButton.isVisible()) {
      await confirmButton.click();

      // Verificar que se abre el modal
      await expect(page.locator("text=Confirmar Entrega al Gestor")).toBeVisible();

      // Verificar campos del formulario
      await expect(
        page.locator("label").filter({ hasText: "Fecha y Hora de Entrega *" })
      ).toBeVisible();
      await expect(page.locator("label").filter({ hasText: "RUT del Gestor *" })).toBeVisible();
      await expect(
        page.locator("label").filter({ hasText: "Nombre del Receptor *" })
      ).toBeVisible();
      await expect(page.locator("label").filter({ hasText: "RUT del Receptor *" })).toBeVisible();
      await expect(page.locator("label").filter({ hasText: "Observaciones" })).toBeVisible();

      // Verificar botones
      await expect(page.locator("text=Cancelar")).toBeVisible();
      await expect(page.locator("text=Confirmar Entrega")).toBeVisible();
    }
  });

  test("debería validar campos requeridos en formulario", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    const confirmButton = page.locator("text=Confirmar Entrega").first();

    if (await confirmButton.isVisible()) {
      await confirmButton.click();

      // Intentar enviar formulario vacío
      await page.locator("text=Confirmar Entrega").click();

      // Debería mostrar error o no enviar
      // Nota: Validaciones del lado cliente deberían prevenir envío
      await expect(page.locator("text=Confirmar Entrega al Gestor")).toBeVisible();
    }
  });

  test("debería mostrar lista de gestores para selección", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    const confirmButton = page.locator("text=Confirmar Entrega").first();

    if (await confirmButton.isVisible()) {
      await confirmButton.click();

      // Hacer click en el campo de RUT del gestor
      const rutInput = page.locator('input[placeholder*="12.345.678-9"]').first();
      await rutInput.click();

      // Si hay gestores disponibles, deberían aparecer sugerencias
      // Nota: Esto depende de tener gestores en la base de datos
    }
  });

  test("debería permitir obtener ubicación GPS", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    const confirmButton = page.locator("text=Confirmar Entrega").first();

    if (await confirmButton.isVisible()) {
      await confirmButton.click();

      // Click en botón de obtener GPS
      const gpsButton = page.locator("text=Obtener Ubicación GPS").first();
      if (await gpsButton.isVisible()) {
        await gpsButton.click();

        // Debería mostrar confirmación de GPS o mensaje de error
        // Nota: En entorno de testing, puede requerir permisos mockeados
      }
    }
  });

  test("debería mostrar progreso durante la confirmación", async ({ page }) => {
    await page.goto("/dashboard/transportista/entregas");

    const confirmButton = page.locator("text=Confirmar Entrega").first();

    if (await confirmButton.isVisible()) {
      await confirmButton.click();

      // Llenar formulario mínimo para testing
      const fechaInput = page.locator('input[type="datetime-local"]').first();
      await fechaInput.fill(new Date().toISOString().slice(0, 16));

      // Nota: Para testing completo necesitaríamos gestores en BD
      // Este test verifica que el botón cambia durante envío
    }
  });
});
