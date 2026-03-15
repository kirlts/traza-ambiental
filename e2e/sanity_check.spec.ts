import { test, expect } from '@playwright/test';

test('Visual Sanity Check - All Views', async ({ page }) => {
  // 1. Hub (Main Demo Page)
  await page.goto('http://localhost:3000/demo');
  await expect(page.getByRole('heading', { name: 'Seleccione un Perfil de Usuario' })).toBeVisible();
  // Hide tour overlay to check pure layout
  await page.evaluate(() => {
    localStorage.removeItem('traza_demo_tour');
    localStorage.removeItem('traza_demo_tour_step');
  });
  await page.reload();
  await page.screenshot({ path: '/home/jules/verification/sanity-hub.png', fullPage: true });

  // 2. Generador
  await page.goto('http://localhost:3000/demo/generador');
  await expect(page.getByText('Perfil Generador')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/sanity-generador.png', fullPage: true });

  // 3. Transportista
  await page.goto('http://localhost:3000/demo/transportista');
  await expect(page.getByText('Perfil Transportista')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/sanity-transportista.png', fullPage: true });

  // 4. Gestor
  await page.goto('http://localhost:3000/demo/gestor');
  await expect(page.getByText('Perfil Gestor (Planta)')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/sanity-gestor.png', fullPage: true });

  // 5. Admin
  await page.goto('http://localhost:3000/demo/admin');
  await expect(page.getByText('Perfil Administrador')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/sanity-admin.png', fullPage: true });

  // 6. Auditor
  await page.goto('http://localhost:3000/demo/auditor');
  await expect(page.getByText('Portal Fiscalización (Auditor)')).toBeVisible();
  await page.screenshot({ path: '/home/jules/verification/sanity-auditor.png', fullPage: true });
});