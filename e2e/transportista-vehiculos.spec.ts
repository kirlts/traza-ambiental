import { test, expect } from "@playwright/test";

test.describe("Flujo de Vehículos Transportista", () => {
  test("debe crear un vehículo y mostrarlo en la lista inmediatamente", async ({ page }) => {
    // 1. Login
    await page.goto("http://localhost:3000/login");
    await page.fill('input[type="email"]', "transportista@trazambiental.com");
    await page.fill('input[type="password"]', "transportista123");
    await page.click('button[type="submit"]');

    // Esperar redirección al dashboard (puede tardar un poco la primera vez)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // 2. Navegar a vehículos
    await page.goto("http://localhost:3000/dashboard/transportista/vehiculos");

    // 3. Click en Agregar Vehículo
    // Usamos first() porque puede haber dos botones si la lista está vacía
    await page.getByRole("button", { name: "Agregar Vehículo" }).first().click();

    // Esperar a que cargue la página de nuevo vehículo
    await expect(page).toHaveURL(/\/nuevo/);

    // 4. Llenar formulario
    // Generar patente única: AB-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const patente = `TE-${randomNum}`;

    await page.fill('input[id="patente"]', patente);

    // Seleccionar tipo: Click en el trigger y luego en la opción
    // En shadcn/ui el select trigger suele ser un button con role combobox
    await page.click('button[role="combobox"]');
    await page.getByRole("option", { name: "Camión" }).first().click();

    await page.fill('input[id="capacidad"]', "5000");

    // 5. Guardar
    await page.click('button[type="submit"]');

    // 6. Verificar redirección y aparición en lista
    await expect(page).toHaveURL("http://localhost:3000/dashboard/transportista/vehiculos");

    // Verificar que la patente está visible inmediatamente
    // Esto confirmará que la invalidación de la query funcionó
    await expect(page.getByText(patente)).toBeVisible({ timeout: 5000 });
  });

  test("debe editar un vehículo y actualizar la lista inmediatamente", async ({ page }) => {
    // Escuchar logs de consola
    page.on("console", (msg) => console.log(`BROWSER LOG: ${msg.text()}`));

    // 1. Login (podríamos optimizar esto con un setup global, pero por ahora repetimos)
    await page.goto("http://localhost:3000/login");
    await page.fill('input[type="email"]', "transportista@trazambiental.com");
    await page.fill('input[type="password"]', "transportista123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // 2. Crear un vehículo primero para asegurarnos de tener uno para editar
    await page.goto("http://localhost:3000/dashboard/transportista/vehiculos/nuevo");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const patenteOriginal = `ED-${randomNum}`;

    await page.fill('input[id="patente"]', patenteOriginal);
    await page.click('button[role="combobox"]');
    await page.getByRole("option", { name: "Furgón" }).first().click();
    await page.fill('input[id="capacidad"]', "1000");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("http://localhost:3000/dashboard/transportista/vehiculos");
    await expect(page.getByText(patenteOriginal)).toBeVisible();

    // 3. Editar el vehículo creado
    // Buscamos la tarjeta que contiene la patente y hacemos click en Editar
    // Esto depende de la estructura del DOM.
    // Opción A: Buscar el botón editar dentro del contenedor que tiene el texto de la patente.
    // Opción B: Navegar directamente si supiéramos el ID, pero no lo sabemos.

    // Vamos a buscar el botón "Editar" que está cerca de la patente.
    // Playwright tiene localizadores relativos potentes.
    const _unused = page.locator(".space-y-4", { hasText: patenteOriginal }).locator(".."); // Subimos al padre (CardContent) o Card
    // En la implementación actual, el botón Editar está en un div de acciones al final del CardContent
    // Vamos a buscar el botón "Editar" dentro de la tarjeta que contiene la patente

    // Aproximación más robusta: Encontrar el contenedor (Card) que tiene el texto de la patente
    // const _unused = page.locator("div.rounded-xl", { hasText: patenteOriginal }).first();
    // O mejor, buscar por texto y subir

    // Dado el HTML:
    // <Card> ... <h3...>{patente}</h3> ... <Button>Editar</Button> ... </Card>

    // Hacemos click en el botón Editar que esté dentro de una tarjeta que contenga la patente
    // Nota: El botón dice "Editar" y tiene el icono.
    await page
      .locator("div.border-2", { hasText: patenteOriginal })
      .getByRole("button", { name: "Editar" })
      .click();

    // 4. Cambiar capacidad
    const nuevaCapacidad = "2500";
    await page.fill('input[id="capacidad"]', nuevaCapacidad);

    // Verificar que el valor se actualizó antes de enviar
    await expect(page.locator('input[id="capacidad"]')).toHaveValue(nuevaCapacidad);

    await page.click('button[type="submit"]');

    // 5. Verificar actualización en lista
    // Esperar mensaje de éxito o redirección
    await expect(page).toHaveURL("http://localhost:3000/dashboard/transportista/vehiculos", {
      timeout: 15000,
    });

    // Verificar que la nueva capacidad aparece en la tarjeta
    // La tarjeta muestra "Peso usado / Capacidad kg"
    // Buscamos el texto que contenga "2500 kg"
    await expect(page.getByText(`${nuevaCapacidad} kg`)).toBeVisible();
  });
});
