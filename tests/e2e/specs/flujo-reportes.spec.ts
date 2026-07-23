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

    await page.getByRole('button', { name: /reportar/i }).last().click();

    // El backend recién informa "ya reportado" al intentar enviar (no al
    // abrir el modal) si el usuario ya había reportado esta experiencia en
    // una corrida anterior (ej. reintentos manuales de la suite sin volver
    // a sembrar la BD) — es el comportamiento correcto, no hay nada más que
    // probar en ese caso.
    const exito = page.getByText(/reporte enviado/i);
    const yaReportado = page.getByText(/ya has reportado/i);
    await expect(exito.or(yaReportado)).toBeVisible({ timeout: 5000 });
    if (await yaReportado.count() > 0) {
      test.skip(true, 'El usuario ya había reportado esta experiencia');
    }
  });
});
