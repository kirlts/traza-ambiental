import { test, expect } from "@playwright/test";
import { loginAsUser } from "../tests/helpers/auth";
import * as fs from "fs";
import * as path from "path";

test.describe("Integración RETC - Admin (HU-037)", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, "admin");
    await page.waitForTimeout(1000);
    await page.goto("/dashboard/admin/integraciones/retc", { waitUntil: "domcontentloaded" });
    // Esperar a que los elementos principales carguen
    await page.waitForSelector('input[type="file"]', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test("admin puede ver página de integración RETC", async ({ page }) => {
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*integraciones\/retc$/);

    // Verificar elementos principales usando selectores más robustos
    // Intentar encontrar el heading de Integración RETC o Carga Masiva
    const headingRetc = page.getByRole("heading", { name: /Integración RETC/i });
    const headingCarga = page.getByRole("heading", { name: /Carga Masiva/i });

    // Verificar que al menos uno de los headings está visible
    const retcVisible = await headingRetc.isVisible().catch(() => false);
    const cargaVisible = await headingCarga.isVisible().catch(() => false);

    expect(retcVisible || cargaVisible).toBe(true);

    // Verificar que hay un input de archivo
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible({ timeout: 10000 });
  });

  test("admin puede ver estadísticas de establecimientos", async ({ page }) => {
    // Verificar que se muestran estadísticas
    const statsCard = page.locator("text=Total Establecimientos, text=Última Actualización");
    await expect(statsCard).toBeVisible({ timeout: 10000 });
  });

  test("admin puede subir archivo CSV", async ({ page }) => {
    // Crear archivo CSV de prueba en memoria
    const csvContent = `ID;RAZON_SOCIAL;DIRECCION;COMUNA;REGION;RUBRO;ESTADO
VU-TEST-001;Empresa Test S.A.;Av. Test 123;Santiago;Metropolitana;Manufactura;ACTIVO
VU-TEST-002;Empresa Test 2 Ltda.;Calle Test 456;Valparaíso;Valparaíso;Comercio;ACTIVO`;

    // Crear archivo temporal
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFile = path.join(tempDir, "test-retc.csv");
    fs.writeFileSync(tempFile, csvContent);

    try {
      // Seleccionar archivo
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(tempFile);
      await page.waitForTimeout(1000);

      // Verificar que el archivo se seleccionó
      await expect(page.locator("text=test-retc.csv")).toBeVisible({ timeout: 5000 });

      // Hacer clic en importar
      const importButton = page.locator('button:has-text("Importar"), button:has-text("Subir")');
      await importButton.click();

      // Esperar procesamiento
      await page.waitForTimeout(3000);

      // Verificar mensaje de éxito o estadísticas actualizadas
      const successMessage = page.locator("text=completada, text=procesados, text=éxito");
      await expect(successMessage).toBeVisible({ timeout: 15000 });
    } finally {
      // Limpiar archivo temporal
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });

  test("admin ve error si sube archivo no CSV", async ({ page }) => {
    // Crear archivo de texto plano
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFile = path.join(tempDir, "test.txt");
    fs.writeFileSync(tempFile, "Este no es un CSV");

    try {
      // Intentar seleccionar archivo no CSV
      const fileInput = page.locator('input[type="file"]');

      // El input debería tener accept=".csv" que previene selección de otros tipos
      // Pero si se fuerza, debería mostrar error
      await fileInput.setInputFiles(tempFile);
      await page.waitForTimeout(1000);

      // Verificar mensaje de error
      const errorMessage = page.locator("text=CSV, text=formato, text=inválido");
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    } finally {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });

  test("admin puede ver tabla de últimos registros importados", async ({ page }) => {
    // Verificar que hay una tabla de últimos registros
    const table = page.locator('table, [role="table"]');
    await expect(table).toBeVisible({ timeout: 10000 });

    // Verificar columnas
    await expect(page.getByRole("columnheader", { name: /ID RETC/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /Razón Social/i })).toBeVisible();
  });
});
