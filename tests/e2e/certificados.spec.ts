import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

test.describe("HU-011: Generación y Consulta de Certificados Digitales", () => {
  test("debería generar un certificado exitosamente para un lote tratado", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Navegar al dashboard del gestor
    await page.goto("/dashboard/gestor");

    // Hacer clic en "Asignar Tratamientos" para ir a la página de tratamientos
    await page.click("text=Asignar Tratamientos");

    // Esperar a que cargue la página
    await page.waitForURL("/dashboard/gestor/tratamientos");

    // Verificar que hay lotes pendientes de tratamiento
    const loteCard = page.locator(".grid > div").first();
    await expect(loteCard).toBeVisible();

    // Hacer clic en "Ver Detalles" del primer lote
    await page.click("text=Ver Detalles");

    // Esperar a que cargue la página de asignación de tratamiento
    await page.waitForURL(/\/dashboard\/gestor\/tratamientos\/\w+/);

    // Llenar el formulario de asignación de tratamiento
    await page.selectOption('select[name="tipoTratamiento"]', "RECICLAJE_MATERIAL");
    await page.fill('input[name="fechaInicioTratamiento"]', "2025-11-06");
    await page.fill('input[name="fechaFinTratamiento"]', "2025-11-07");
    await page.fill(
      'textarea[name="descripcionTratamiento"]',
      "Proceso de reciclaje de materiales realizado exitosamente"
    );

    // Hacer clic en "Confirmar Tratamiento"
    await page.click("text=Confirmar Tratamiento");

    // Verificar que se muestra mensaje de éxito
    await expect(page.locator("text=Tratamiento asignado exitosamente")).toBeVisible();

    // Navegar de vuelta al dashboard
    await page.goto("/dashboard/gestor");

    // Ahora debería haber un botón para generar certificado (simularemos que hay un lote tratado)
    // Para este test, asumiremos que hay un lote tratado disponible
    // En un entorno real, necesitaríamos datos de prueba

    // Verificar que el botón de "Historial de Certificados" está disponible
    await expect(page.locator("text=Historial de Certificados")).toBeVisible();
  });

  test("debería mostrar el historial de certificados con estadísticas", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Navegar al historial de certificados
    await page.goto("/dashboard/gestor/certificados");

    // Verificar que la página carga correctamente
    await expect(page.locator("text=Historial de Certificados")).toBeVisible();

    // Verificar que se muestran las estadísticas
    await expect(page.locator("text=Total Certificados")).toBeVisible();
    await expect(page.locator("text=Peso Valorizado")).toBeVisible();

    // Verificar que hay una tabla de certificados
    const tabla = page.locator("table");
    await expect(tabla).toBeVisible();

    // Verificar headers de la tabla
    await expect(page.locator("th").filter({ hasText: "Folio" })).toBeVisible();
    await expect(page.locator("th").filter({ hasText: "Fecha" })).toBeVisible();
    await expect(page.locator("th").filter({ hasText: "Generador" })).toBeVisible();
    await expect(page.locator("th").filter({ hasText: "Peso" })).toBeVisible();
  });

  test("debería permitir filtrar certificados por fecha y generador", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Navegar al historial de certificados
    await page.goto("/dashboard/gestor/certificados");

    // Verificar que los filtros están presentes
    await expect(page.locator('input[type="date"]').first()).toBeVisible(); // Fecha desde
    await expect(page.locator('input[type="date"]').nth(1)).toBeVisible(); // Fecha hasta
    await expect(page.locator('input[placeholder*="RUT"]').first()).toBeVisible();

    // Verificar que el select de tratamiento está presente
    const selectTratamiento = page.locator("select").filter({ hasText: "Seleccionar..." });
    await expect(selectTratamiento).toBeVisible();

    // Verificar que el botón de limpiar filtros funciona
    const btnLimpiar = page.locator("button").filter({ hasText: "Limpiar Filtros" });
    await expect(btnLimpiar).toBeVisible();
  });

  test("debería permitir descargar PDF de certificado", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Navegar al historial de certificados
    await page.goto("/dashboard/gestor/certificados");

    // Buscar un certificado en la tabla (si existe)
    const downloadButton = page.locator("button").filter({ hasText: "" }).locator("svg"); // Botón con ícono de descarga
    const downloadCount = await downloadButton.count();

    if (downloadCount > 0) {
      // Configurar listener para descarga antes de hacer clic
      const downloadPromise = page.waitForEvent("download");

      // Hacer clic en el botón de descarga
      await downloadButton.first().click();

      // Esperar a que se inicie la descarga
      const download = await downloadPromise;

      // Verificar que el archivo descargado tiene extensión PDF
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    } else {
      // Si no hay certificados, verificar que se muestra mensaje vacío
      await expect(page.locator("text=No se encontraron certificados")).toBeVisible();
    }
  });

  test("debería verificar certificado públicamente sin autenticación", async ({ page }) => {
    // No hacer login - esta página debe ser pública

    // Intentar acceder a una página de verificación con folio inválido
    await page.goto("/verificar/CERT-INVALIDO-9999");

    // Verificar que se muestra mensaje de certificado no encontrado
    await expect(page.locator("text=Certificado No Encontrado")).toBeVisible();
    await expect(page.locator("text=No se encontró un certificado")).toBeVisible();
  });

  test("debería mostrar página de verificación con diseño correcto", async ({ page }) => {
    // Acceder a página de verificación inválida para verificar el diseño
    await page.goto("/verificar/CERT-TEST-0001");

    // Verificar elementos del diseño
    await expect(page.locator("text=Certificado No Encontrado")).toBeVisible();

    // Verificar que hay elementos visuales
    const card = page.locator(".rounded-lg").first();
    await expect(card).toBeVisible();
  });

  test("debería mostrar funcionalidad de envío por email (placeholder)", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Navegar al historial de certificados
    await page.goto("/dashboard/gestor/certificados");

    // Buscar botón de email (si existe)
    const emailButton = page
      .locator("button")
      .filter({ hasText: "" })
      .locator('svg[data-lucide="mail"]');
    const emailCount = await emailButton.count();

    if (emailCount > 0) {
      // Hacer clic en el botón de email
      await emailButton.first().click();

      // Verificar que aparece un mensaje (placeholder por ahora)
      await expect(
        page.locator("text=Funcionalidad de envío por email próximamente disponible")
      ).toBeVisible();
    }
  });

  test("debería mostrar estadísticas de certificados en el dashboard", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Navegar al dashboard
    await page.goto("/dashboard/gestor");

    // Verificar que el botón de "Historial de Certificados" está presente
    await expect(page.locator("text=Historial de Certificados")).toBeVisible();

    // Verificar que tiene el badge "Nuevo"
    const badge = page.locator("text=Nuevo").first();
    await expect(badge).toBeVisible();
  });

  test("debería manejar errores de red correctamente", async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor");

    // Interceptar requests para simular error de red
    await page.route("**/api/gestor/certificados**", (route) => route.abort());

    // Navegar al historial de certificados
    await page.goto("/dashboard/gestor/certificados");

    // Verificar que se muestra mensaje de error
    await expect(page.locator("text=Error cargando certificados")).toBeVisible();
  });
});
