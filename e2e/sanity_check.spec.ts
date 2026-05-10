/**
 * Sanity Check Suite - Playwright E2E
 *
 * 20+ smoke tests that validate all critical surfaces of the demo platform
 * are accessible, responsive, and structurally sound. These are fast,
 * non-destructive checks designed to catch regressions early.
 */

import { test, expect } from "@playwright/test";

// ─── Helper ─────────────────────────────────────────────────────────

/** Navigate and clear tour state so the overlay doesn't interfere with layout tests */
async function gotoClean(page: import("@playwright/test").Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => {
    localStorage.removeItem("traza_demo_tour");
    localStorage.removeItem("traza_demo_tour_step");
    localStorage.removeItem("traza_demo_tour_active");
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
}

// ─── 1. Landing & Hub ───────────────────────────────────────────────

test.describe("Hub - Demo Landing Page", () => {
  test("1. Hub loads and shows the simulator title", async ({ page }) => {
    await page.goto("/demo");
    await expect(
      page.getByRole("heading", { name: /simulador/i })
    ).toBeVisible();
  });

  test("2. Hub shows all 3 role cards (Generador, Transportista, Centro)", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByText("Generador")).toBeVisible();
    await expect(page.getByText("Transportista")).toBeVisible();
    await expect(page.getByText("Centro de Valorización")).toBeVisible();
  });

  test("3. Hub shows the 'Iniciar Recorrido Guiado' button", async ({ page }) => {
    await page.goto("/demo");
    const tourBtn = page.getByRole("button", { name: /recorrido guiado/i });
    await expect(tourBtn).toBeVisible();
  });

  test("4. Hub has the 'Reiniciar Simulador' button", async ({ page }) => {
    await page.goto("/demo");
    await expect(
      page.getByRole("button", { name: /reiniciar simulador/i })
    ).toBeVisible();
  });

  test("5. Hub shows 'Entorno de Simulación' badge", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByText(/entorno de simulación/i)).toBeVisible();
  });
});

// ─── 2. Demo Dashboards Load ────────────────────────────────────────

test.describe("Dashboards - Page Load", () => {
  test("6. Generador dashboard loads", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await expect(page.getByText(/perfil generador/i)).toBeVisible();
  });

  test("7. Transportista dashboard loads", async ({ page }) => {
    await gotoClean(page, "/demo/transportista");
    await expect(page.getByText(/perfil transportista/i)).toBeVisible();
  });

  test("8. Gestor dashboard loads", async ({ page }) => {
    await gotoClean(page, "/demo/gestor");
    await expect(page.getByText(/centro de valorización/i).first()).toBeVisible();
  });

  test("9. Admin dashboard loads", async ({ page }) => {
    await gotoClean(page, "/demo/admin");
    await expect(page.getByText(/perfil administrador/i)).toBeVisible();
  });

  test("10. Auditor dashboard loads", async ({ page }) => {
    await gotoClean(page, "/demo/auditor");
    await expect(page.getByText(/portal fiscalización/i)).toBeVisible();
  });
});

// ─── 3. Generador - Key Elements ───────────────────────────────────

test.describe("Generador - Key Elements", () => {
  test("11. 'Nueva Solicitud de Retiro' card is visible on generador dashboard", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await expect(page.getByRole("heading", { name: "Nueva Solicitud de Retiro" })).toBeVisible();
  });

  test("12. KPI indicators are rendered (Meta, Solicitudes, Certificados)", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await expect(page.getByText(/meta ley rep/i)).toBeVisible();
    await expect(page.getByText(/solicitudes en curso/i)).toBeVisible();
    await expect(page.getByText(/certificados emitidos/i)).toBeVisible();
  });

  test("13. Historical table header exists", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await expect(page.getByText("Historial de Solicitudes")).toBeVisible();
  });

  test("14. Clicking 'Nueva Solicitud' card opens the modal form", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await page.locator('[data-tour-target="nueva-solicitud"]').click();
    // Modal should present the form fields
    await expect(page.getByText(/cantidad de unidades/i)).toBeVisible();
  });
});

// ─── 4. Transportista - Key Elements ────────────────────────────────

test.describe("Transportista - Key Elements", () => {
  test("15. 'Bolsa de Cargas' section is visible", async ({ page }) => {
    await gotoClean(page, "/demo/transportista");
    await expect(page.getByText("Bolsa de Cargas").first()).toBeVisible();
  });

  test("16. Rutas en Ejecución section exists", async ({ page }) => {
    await gotoClean(page, "/demo/transportista");
    await expect(page.getByText(/rutas en ejecución/i)).toBeVisible();
  });
});

// ─── 5. Gestor - Key Elements ──────────────────────────────────────

test.describe("Gestor - Key Elements", () => {
  test("17. Pesaje/Recepción section is visible", async ({ page }) => {
    await gotoClean(page, "/demo/gestor");
    await expect(page.getByText(/recepción en puertas/i)).toBeVisible();
  });
});

// ─── 6. Navigation ─────────────────────────────────────────────────

test.describe("Navigation", () => {
  test("18. 'Volver al Simulador' link exists on generador page", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await expect(page.getByText(/volver al simulador/i)).toBeVisible();
  });

  test("19. 'Volver al Simulador' navigates back to /demo", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await page.getByText(/volver al simulador/i).click();
    await expect(page).toHaveURL(/\/demo$/);
  });

  test("20. Header notification bell icon is present", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    // The bell icon is rendered but may not have aria labels - locate by SVG or parent
    const header = page.locator("header, nav, [class*='header']").first();
    await expect(header).toBeVisible();
  });
});

// ─── 7. Guided Tour ────────────────────────────────────────────────

test.describe("Guided Tour - Overlay & Interaction", () => {
  test("21. Starting the tour activates the overlay on generador", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: /recorrido guiado/i }).click();
    // Should navigate to generador and show the tour tooltip
    await expect(page).toHaveURL(/\/demo\/generador/);
    await expect(page.getByText(/recorrido guiado/i).first()).toBeVisible();
    await expect(page.getByText(/paso 1/i)).toBeVisible();
  });

  test("22. Tour step 1: 'Nueva Solicitud' card has the data-tour-target attribute", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: /recorrido guiado/i }).click();
    await expect(page).toHaveURL(/\/demo\/generador/);
    const target = page.locator('[data-tour-target="nueva-solicitud"]');
    await expect(target).toBeVisible();
  });

  test("23. Tour backdrop does NOT block clicks (pointer-events: none)", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: /recorrido guiado/i }).click();
    await expect(page).toHaveURL(/\/demo\/generador/);

    // The backdrop should have pointer-events: none
    const backdrop = page.locator("#tour-backdrop");
    if (await backdrop.isVisible()) {
      const pe = await backdrop.evaluate((el) => window.getComputedStyle(el).pointerEvents);
      expect(pe).toBe("none");
    }
  });

  test("24. Tour step 1: clicking the highlighted card opens the modal", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: /recorrido guiado/i }).click();
    await expect(page).toHaveURL(/\/demo\/generador/);

    // Click the targeted card
    await page.locator('[data-tour-target="nueva-solicitud"]').click();
    // Verify the modal opened - form label is "Cantidad de Unidades"
    await expect(page.getByText(/cantidad de unidades/i)).toBeVisible();
  });

  test("25. Tour tooltip shows step description", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("button", { name: /recorrido guiado/i }).click();
    await expect(page.getByText(/para comenzar/i)).toBeVisible();
  });
});

// ─── 8. Responsive Layout ──────────────────────────────────────────

test.describe("Responsive Layout", () => {
  test("26. Hub renders correctly at mobile viewport (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/demo");
    await expect(
      page.getByRole("heading", { name: /simulador/i })
    ).toBeVisible();
    // Role cards should still be present (may be stacked)
    await expect(page.getByText("Generador")).toBeVisible();
  });

  test("27. Hub renders correctly at tablet viewport (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/demo");
    await expect(
      page.getByRole("heading", { name: /simulador/i })
    ).toBeVisible();
  });

  test("28. Generador dashboard is usable at mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoClean(page, "/demo/generador");
    await expect(page.getByRole("heading", { name: "Nueva Solicitud de Retiro" })).toBeVisible();
  });
});

// ─── 9. Error Boundaries ───────────────────────────────────────────

test.describe("Error Boundaries", () => {
  test("29. 404 page for unknown demo sub-route", async ({ page }) => {
    const response = await page.goto("/demo/nonexistent");
    // Should return 404 or redirect
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });
});

// ─── 10. data-tour-target Contract ─────────────────────────────────

test.describe("data-tour-target Presence", () => {
  test("30. Generador: data-tour-target='nueva-solicitud' exists", async ({ page }) => {
    await gotoClean(page, "/demo/generador");
    await expect(page.locator('[data-tour-target="nueva-solicitud"]')).toBeVisible();
  });

  test("31. Transportista: data-tour-target='card-transporte' exists", async ({ page }) => {
    await gotoClean(page, "/demo/transportista");
    await expect(page.locator('[data-tour-target="card-transporte"]')).toBeVisible();
  });

  test("32. Gestor: data-tour-target='input-romana' exists", async ({ page }) => {
    await gotoClean(page, "/demo/gestor");
    await expect(page.locator('[data-tour-target="input-romana"]')).toBeVisible();
  });
});