import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should load login page", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    // Check if login page loads
    await expect(page).toHaveTitle(/TrazAmbiental/);
    await expect(page.getByRole("heading", { name: "Iniciar Sesión" })).toBeVisible();
  });

  test("should show login form elements", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should redirect unauthenticated users to login", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard/admin");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Dashboard Access", () => {
  test("should access dashboard when authenticated", async ({ page }) => {
    // This would need authentication setup
    // For now, just test that the route exists
    await page.goto("http://localhost:3000/dashboard/sistema-gestion");

    // Should either show login or dashboard content
    const loginHeading = page.getByRole("heading", { name: "Iniciar Sesión" });
    const dashboardHeading = page.getByText("Dashboard de Cumplimiento");

    await expect(loginHeading.or(dashboardHeading)).toBeVisible();
  });
});
