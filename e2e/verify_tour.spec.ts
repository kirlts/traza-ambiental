import { test, expect } from '@playwright/test';

test('Verify guided tour flow', async ({ page }) => {
  // Start on demo hub
  await page.goto('http://localhost:3000/demo');

  // Verify updated terminology
  await expect(page.getByRole('heading', { name: 'Seleccione un Perfil de Usuario' })).toBeVisible();

  // Start guided tour
  const startBtn = page.getByRole('button', { name: 'Comenzar Recorrido Guiado' });
  await expect(startBtn).toBeVisible();
  await startBtn.click();

  // Navigates manually since tour just activates state in context
  await page.getByRole('link', { name: 'Generador (Minera)' }).click();

  // Should navigate to Generador and show tour overlay
  await expect(page).toHaveURL(/.*\/demo\/generador/);
  await expect(page.getByText('Tour Interactivo Activo')).toBeVisible();
  await expect(page.getByText('Paso 1: Perfil Generador')).toBeVisible();

  // Take screenshot of Generador with tour active
  await page.screenshot({ path: '/home/jules/verification/tour-step-1.png' });

  // Add a request
  await page.getByRole('button', { name: 'Nueva Solicitud' }).click();
  await page.getByPlaceholder('Ej: 45').fill('50');
  await page.getByRole('button', { name: 'Publicar Solicitud', exact: true }).click();

  // Next step in tour
  await page.getByRole('link', { name: 'Siguiente Perfil' }).click();
  await expect(page).toHaveURL(/.*\/demo\/transportista/);
  await expect(page.getByText('Paso 2: Perfil Logístico')).toBeVisible();

  // Take screenshot of Transportista with tour active
  await page.screenshot({ path: '/home/jules/verification/tour-step-2.png' });

  // Accept and deliver
  await page.getByRole('button', { name: 'Aceptar Viaje' }).first().click();
  await page.getByRole('button', { name: 'Declarar Carga Subida' }).first().click();
  await page.getByRole('button', { name: 'Entregar en Planta' }).first().click();

  // Next step in tour
  await page.getByRole('link', { name: 'Siguiente Perfil' }).click();
  await expect(page).toHaveURL(/.*\/demo\/gestor/);
  await expect(page.getByText('Paso 3: Planta Valorizadora')).toBeVisible();

  // Take screenshot of Gestor with tour active
  await page.screenshot({ path: '/home/jules/verification/tour-step-3.png' });

  // Final steps
  await page.getByRole('button', { name: 'Iniciar Pesaje en Romana' }).first().click();
  await page.getByPlaceholder('Ej: 46.2').fill('50');
  await page.getByRole('button', { name: 'Validar' }).click();
  // We use force: true because the tour overlay might block the button on small viewports
  await page.getByRole('button', { name: 'Tratar Neumáticos y Sellar (Emitir Certificado)' }).first().click({ force: true });

  // Esperar a que el toast o animaciones no estorben
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: 'Siguiente Perfil' }).click({ force: true });
  await page.waitForTimeout(1000);
  await expect(page).toHaveURL(/.*\/demo\/auditor/);
  await expect(page.getByText('Paso 4: Fiscalización Estatal')).toBeVisible();

  // Take screenshot of Auditor with tour active
  await page.screenshot({ path: '/home/jules/verification/tour-step-4.png' });

  await page.getByRole('link', { name: 'Siguiente Perfil' }).click();

  // Verify completion overlay
  await expect(page.getByText('¡Recorrido Completado!')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/tour-complete.png' });
});