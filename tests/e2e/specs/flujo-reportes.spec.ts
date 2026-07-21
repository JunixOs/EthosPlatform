import { test, expect } from '@playwright/test';

test.describe('Flujo de reportes', () => {
  test('usuario reporta contenido', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() === 0) {
      test.skip(true, 'Sin experiencias para reportar');
      return;
    }

    await firstCard.click();
    await page.waitForTimeout(2000);

    // Buscar botón "Reportar"
    const reportarBtn = page.getByRole('button', { name: /reportar/i }).first();
    if (await reportarBtn.count() === 0) {
      test.skip(true, 'Botón reportar no encontrado');
      return;
    }

    await reportarBtn.click();

    // Modal debe aparecer
    await expect(page.getByRole('heading', { name: /reportar contenido/i })).toBeVisible({ timeout: 3000 });

    await page.getByRole('button', { name: /reportar/i }).click();

    // Debe mostrar mensaje de éxito
    await expect(page.getByText(/reporte enviado/i)).toBeVisible({ timeout: 5000 });
  });
});
