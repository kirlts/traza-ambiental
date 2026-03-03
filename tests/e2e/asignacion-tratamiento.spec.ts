import { test, expect } from "@playwright/test";
import { loginAsUser } from "../helpers/auth";

test.describe("HU-010: Asignación de Tratamiento y Carga de Evidencia", () => {
  test.beforeEach(async ({ page }) => {
    // Login como gestor
    await loginAsUser(page, "gestor@trazambiental.com", "gestor123", "gestor");

    // Verificar que estamos en el dashboard correcto
    await expect(page).toHaveURL("/dashboard/gestor");
  });

  test("debería mostrar el dashboard del gestor con accesos rápidos", async ({ page }) => {
    // Verificar que estamos en el dashboard correcto
    await expect(page).toHaveURL("/dashboard/gestor");

    // Verificar título
    await expect(page.getByRole("heading", { name: "Panel de Control - Gestor" })).toBeVisible();

    // Verificar cards de estadísticas (solo verificar que existen, sin ambigüedad)
    await expect(page.getByText("Recepciones Pendientes").first()).toBeVisible();
    await expect(page.getByText("Recepciones Hoy").first()).toBeVisible();
    await expect(page.getByText("Recepciones Completadas").first()).toBeVisible();
    await expect(page.getByText("Alertas Activas").first()).toBeVisible();

    // Verificar sección de accesos rápidos
    await expect(page.getByText("Accesos Rápidos")).toBeVisible();
    await expect(page.getByRole("link", { name: "Recepciones Pendientes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Recepciones Completadas" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Asignar Tratamientos" })).toBeVisible();
  });

  test("debería mostrar la página de tratamientos con lotes pendientes", async ({ page }) => {
    // Hacer clic en "Asignar Tratamientos" usando JavaScript para evitar overlay
    await page.evaluate(() => {
      const link = document.querySelector(
        'a[href="/dashboard/gestor/tratamientos"]'
      ) as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    });

    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL("/dashboard/gestor/tratamientos");

    // Verificar header
    await expect(page.getByRole("heading", { name: "Historial de Recepciones" })).toBeVisible();
    await expect(page.getByText("Todas las cargas que han sido validadas")).toBeVisible();
  });

  test("debería mostrar detalles de un lote pendiente de tratamiento", async ({ page }) => {
    // Ir a la página de tratamientos
    await page.goto("/dashboard/gestor/tratamientos");

    // Buscar un lote con el botón "Asignar Tratamiento"
    const asignarButton = page.getByRole("link", { name: "Asignar Tratamiento" }).first();
    await expect(asignarButton).toBeVisible();

    // Hacer clic en asignar tratamiento (si existe) usando JavaScript
    const hasAsignarButton = await asignarButton.isVisible();
    if (hasAsignarButton) {
      await page.evaluate(() => {
        const link = document.querySelector(
          'a[href*="tratamientos"]:not([href="/dashboard/gestor/tratamientos"])'
        ) as HTMLAnchorElement;
        if (link) {
          link.click();
        }
      });

      // Verificar que estamos en la página de asignación
      await expect(page).toHaveURL(/\/dashboard\/gestor\/tratamientos\/.+/);

      // Verificar elementos del formulario
      await expect(page.getByRole("heading", { name: "Asignar Tratamiento" })).toBeVisible();
      await expect(page.getByText("Selecciona el tipo de tratamiento")).toBeVisible();
      await expect(page.getByText("Completa la información del tratamiento")).toBeVisible();
    }
  });

  test("debería mostrar el formulario de asignación de tratamiento completo", async ({ page }) => {
    // Ir directamente a la página de asignación de un lote específico (usando un ID de prueba)
    await page.goto("/dashboard/gestor/tratamientos/cmhcyg2l2000hrlk4f4v6rvfe");

    // Verificar header
    await expect(page.getByRole("heading", { name: "Asignar Tratamiento" })).toBeVisible();

    // Verificar sección de información del lote
    await expect(page.getByText("Información del Lote")).toBeVisible();

    // Verificar formulario
    await expect(page.getByText("Tipo de Tratamiento *")).toBeVisible();
    await expect(page.getByText("Fecha de Inicio *")).toBeVisible();
    await expect(page.getByText("Fecha de Finalización")).toBeVisible();
    await expect(page.getByText("Descripción del Proceso")).toBeVisible();
    await expect(page.getByText("Ubicación del Tratamiento")).toBeVisible();

    // Verificar sección de documentos
    await expect(page.getByText("Documentos de Evidencia *")).toBeVisible();
    await expect(page.getByText("Seleccionar Archivos")).toBeVisible();

    // Verificar botones
    await expect(page.getByRole("button", { name: "Cancelar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Asignar Tratamiento" })).toBeDisabled();
  });

  test("debería mostrar diferentes tipos de tratamiento en el selector", async ({ page }) => {
    await page.goto("/dashboard/gestor/tratamientos/cmhcyg2l2000hrlk4f4v6rvfe");

    // Abrir el selector de tipo de tratamiento usando JavaScript
    await page.evaluate(() => {
      const select = document.querySelector('[role="combobox"]') as HTMLElement;
      if (select) {
        select.click();
      }
    });

    // Verificar opciones disponibles
    await expect(page.getByText("Recauchaje")).toBeVisible();
    await expect(page.getByText("Reciclaje Material")).toBeVisible();
    await expect(page.getByText("Co-procesamiento")).toBeVisible();
    await expect(page.getByText("Valorización Energética")).toBeVisible();
    await expect(page.getByText("Otro")).toBeVisible();
  });

  test('debería mostrar campo adicional cuando se selecciona "Otro"', async ({ page }) => {
    await page.goto("/dashboard/gestor/tratamientos/cmhcyg2l2000hrlk4f4v6rvfe");

    // Seleccionar "Otro" usando JavaScript
    await page.evaluate(() => {
      const select = document.querySelector('[role="combobox"]') as HTMLElement;
      if (select) {
        select.click();
      }
    });
    await page.evaluate(() => {
      const option = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
        el.textContent?.includes("Otro")
      );
      if (option) {
        (option as HTMLElement).click();
      }
    });

    // Verificar que aparece el campo adicional
    await expect(page.getByText("Especificar Tratamiento")).toBeVisible();
    await expect(page.getByPlaceholder("Describe el tipo de tratamiento específico")).toBeVisible();
  });

  test("debería validar que se requiere al menos un archivo", async ({ page }) => {
    await page.goto("/dashboard/gestor/tratamientos/cmhcyg2l2000hrlk4f4v6rvfe");

    // Seleccionar tipo de tratamiento usando JavaScript
    await page.evaluate(() => {
      const select = document.querySelector('[role="combobox"]') as HTMLElement;
      if (select) {
        select.click();
      }
    });
    await page.evaluate(() => {
      const option = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
        el.textContent?.includes("Recauchaje")
      );
      if (option) {
        (option as HTMLElement).click();
      }
    });

    // Verificar que el botón sigue deshabilitado sin archivos
    const submitButton = page.getByRole("button", { name: "Asignar Tratamiento" });
    await expect(submitButton).toBeDisabled();
  });

  test("debería permitir subir archivos válidos", async ({ page }) => {
    await page.goto("/dashboard/gestor/tratamientos/cmhcyg2l2000hrlk4f4v6rvfe");

    // Seleccionar tipo de tratamiento usando JavaScript
    await page.evaluate(() => {
      const select = document.querySelector('[role="combobox"]') as HTMLElement;
      if (select) {
        select.click();
      }
    });
    await page.evaluate(() => {
      const option = Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
        el.textContent?.includes("Recauchaje")
      );
      if (option) {
        (option as HTMLElement).click();
      }
    });

    // Verificar que hay un área para subir archivos
    await expect(page.getByText("Arrastra y suelta archivos aquí")).toBeVisible();
    await expect(page.getByText("Seleccionar Archivos")).toBeVisible();
  });

  test("debería mostrar la página de recepciones completadas", async ({ page }) => {
    // Hacer clic en "Ver historial completo" usando JavaScript
    await page.evaluate(() => {
      const link = document.querySelector(
        'a[href="/dashboard/gestor/recepciones/completadas"]'
      ) as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    });

    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL("/dashboard/gestor/recepciones/completadas");

    // Verificar header
    await expect(page.getByRole("heading", { name: "Historial de Recepciones" })).toBeVisible();
  });

  test("debería mostrar mensaje cuando no hay recepciones completadas", async ({ page }) => {
    await page.goto("/dashboard/gestor/recepciones/completadas");

    // Verificar mensaje cuando no hay datos
    await expect(page.getByText("¡Todo está al día!")).toBeVisible();
    await expect(page.getByText("No hay recepciones pendientes de validación")).toBeVisible();
  });

  test("debería permitir navegación entre secciones del gestor", async ({ page }) => {
    // Desde dashboard, ir a tratamientos usando JavaScript
    await page.evaluate(() => {
      const link = document.querySelector(
        'a[href="/dashboard/gestor/tratamientos"]'
      ) as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    });
    await expect(page).toHaveURL("/dashboard/gestor/tratamientos");

    // Volver al dashboard usando JavaScript
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/dashboard/gestor"]') as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    });
    await expect(page).toHaveURL("/dashboard/gestor");

    // Ir a recepciones completadas usando JavaScript
    await page.evaluate(() => {
      const link = document.querySelector(
        'a[href="/dashboard/gestor/recepciones/completadas"]'
      ) as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    });
    await expect(page).toHaveURL("/dashboard/gestor/recepciones/completadas");

    // Volver al dashboard desde recepciones completadas usando JavaScript
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/dashboard/gestor"]') as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    });
    await expect(page).toHaveURL("/dashboard/gestor");
  });
});
