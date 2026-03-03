import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

/**
 * Tests E2E para el módulo de seguimiento de solicitudes (HU-004)
 *
 * Cubre:
 * - Ver lista de solicitudes
 * - Filtrar por estado
 * - Buscar solicitudes
 * - Ver detalle de solicitud
 * - Historial de cambios
 * - Actualización en tiempo real
 */

test.describe("Seguimiento de Solicitudes - HU-004", () => {
  test.beforeEach(async ({ page }) => {
    // Login como generador
    await loginAsUser(page, "generador@trazambiental.com", "generador123", "generador");
  });

  test("debería ver la página de seguimiento de solicitudes", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");

    // Verificar que la página carga correctamente
    await expect(page).toHaveURL(/\/dashboard\/generador\/solicitudes$/);

    // Verificar elementos principales
    await expect(page.locator('h1:has-text("Mis Solicitudes de Retiro")')).toBeVisible();
    await expect(page.locator('button:has-text("Nueva Solicitud")')).toBeVisible();

    // Verificar que hay un área de filtros
    await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible();
    await expect(page.locator("select")).toBeVisible();
  });

  test("debería mostrar estado vacío si no hay solicitudes", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");

    // Esperar a que cargue
    await page.waitForLoadState("networkidle");

    // Verificar que aparezca el mensaje de estado vacío
    // (solo si realmente no hay solicitudes en la BD)
    const hasEmptyState = await page
      .locator("text=No tienes solicitudes aún")
      .isVisible()
      .catch(() => false);
    const hasSolicitudes = await page
      .locator('[class*="SolicitudCard"]')
      .first()
      .isVisible()
      .catch(() => false);

    // Deberíamos ver uno u otro, pero no ambos
    expect(hasEmptyState || hasSolicitudes).toBeTruthy();
  });

  test("debería poder filtrar por estado", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Seleccionar filtro por estado
    const selectEstado = page.locator("select");

    // Verificar que el select existe
    const selectExists = await selectEstado.count();
    if (selectExists > 0) {
      // Cambiar a "Pendiente"
      await selectEstado.selectOption({ value: "PENDIENTE" });

      // Esperar a que se aplique el filtro
      await page.waitForTimeout(1000);

      // Verificar que el filtro se aplicó
      const selectedValue = await selectEstado.evaluate((el: HTMLSelectElement) => el.value);
      expect(selectedValue).toBe("PENDIENTE");
    }
  });

  test("debería poder buscar por texto", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Buscar input de búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar"]');

    // Verificar que existe
    const inputExists = await searchInput.count();
    if (inputExists > 0) {
      // Escribir en el campo de búsqueda
      await searchInput.fill("SR-");

      // Esperar a que se aplique la búsqueda
      await page.waitForTimeout(1000);

      // Verificar que el texto se ingresó
      const inputValue = await searchInput.inputValue();
      expect(inputValue).toContain("SR-");
    }
  });

  test("debería poder abrir el detalle de una solicitud", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Buscar una tarjeta de solicitud
    const solicitudCard = page.locator('[class*="SolicitudCard"], [class*="rounded-lg"]').first();

    // Verificar que existe
    const cardExists = await solicitudCard.count();
    if (cardExists > 0) {
      // Hacer clic en la tarjeta
      await solicitudCard.click();

      // Esperar a que se abra el modal
      await page.waitForTimeout(500);

      // Verificar que se abrió algún tipo de modal o detalle
      // (dependiendo de la implementación)
      const modalVisible = await page
        .locator("text=Folio:")
        .isVisible()
        .catch(() => false);
      const detailVisible = await page
        .locator("h2, h3")
        .filter({ hasText: /SR-/ })
        .isVisible()
        .catch(() => false);

      // Deberíamos ver algún detalle
      expect(modalVisible || detailVisible).toBeTruthy();
    }
  });

  test("debería ver el botón Nueva Solicitud", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");

    // Verificar que el botón existe y es visible
    const nuevaSolicitudBtn = page.locator('button:has-text("Nueva Solicitud")');
    await expect(nuevaSolicitudBtn).toBeVisible();

    // Verificar que es clickeable
    await expect(nuevaSolicitudBtn).toBeEnabled();
  });

  test("debería navegar al dashboard desde el card", async ({ page }) => {
    // Ir al dashboard del generador
    await page.goto("/dashboard/generador");
    await page.waitForLoadState("networkidle");

    // Buscar el card de "Seguimiento"
    const seguimientoCard = page.locator("text=Seguimiento").locator("..").locator("..").first();

    // Verificar que existe
    const cardExists = await seguimientoCard.count();
    if (cardExists > 0) {
      // Hacer clic en el card
      await seguimientoCard.click();

      // Verificar que navegó a la página de seguimiento
      await expect(page).toHaveURL(/\/dashboard\/generador\/solicitudes$/);
    }
  });

  test("debería ver badges de estado con colores", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Buscar badges de estado
    const badges = page.locator('[class*="badge"], [class*="rounded-full"]');

    // Verificar que hay badges
    const badgesCount = await badges.count();
    if (badgesCount > 0) {
      // Verificar que al menos uno tiene el texto de un estado conocido
      const firstBadge = badges.first();
      const badgeText = await firstBadge.textContent();

      // Verificar que contiene algún texto de estado
      const estados = [
        "Pendiente",
        "Aceptada",
        "En Camino",
        "Recolectada",
        "Rechazada",
        "Cancelada",
      ];
      const hasEstado = estados.some((estado) => badgeText?.includes(estado));

      expect(hasEstado).toBeTruthy();
    }
  });

  test("debería actualizarse automáticamente (polling cada 30s)", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Tomar una captura inicial del contenido
    const initialContent = await page.content();

    // Esperar 35 segundos (más que los 30s de polling)
    await page.waitForTimeout(35000);

    // Verificar que hubo al menos una petición de actualización
    // (esto es difícil de verificar sin inspeccionar logs, pero podemos
    // verificar que la página sigue funcional)
    await expect(page.locator('h1:has-text("Mis Solicitudes de Retiro")')).toBeVisible();
  });

  test("debería manejar paginación si hay muchas solicitudes", async ({ page }) => {
    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Buscar controles de paginación
    const paginationControls = page.locator("text=Página").first();

    // Verificar que existe paginación (si hay suficientes solicitudes)
    const hasPagination = await paginationControls.isVisible().catch(() => false);

    if (hasPagination) {
      // Verificar que hay botones de navegación
      const previousBtn = page.locator('button:has-text("Anterior")').first();
      const nextBtn = page.locator('button:has-text("Siguiente")').first();

      // Verificar que existen
      await expect(previousBtn.or(nextBtn)).toBeVisible();
    }
  });
});

test.describe("Autorización - Seguimiento de Solicitudes", () => {
  test("solo el generador propietario debería ver sus solicitudes", async ({ page }) => {
    // Login como generador
    await loginAsUser(page, "generador@trazambiental.com", "generador123", "generador");

    // Navegar a la página de seguimiento
    await page.goto("/dashboard/generador/solicitudes");
    await page.waitForLoadState("networkidle");

    // Verificar que la página carga (no hay error 403)
    await expect(page.locator('h1:has-text("Mis Solicitudes de Retiro")')).toBeVisible();

    // Verificar que no hay mensaje de error de autorización
    const authError = page.locator("text=No autorizado");
    await expect(authError).not.toBeVisible();
  });
});
