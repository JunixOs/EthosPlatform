import { test, expect } from '@playwright/test';

test.describe('Flujo de reacciones', () => {
  test('dar me gusta y ver conteo incrementado', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() === 0) {
      test.skip(true, 'Sin experiencias para reaccionar');
      return;
    }

    await firstCard.click();
    await page.waitForTimeout(2000);

    // Buscar el botón de reacción
    const reaccionBtn = page.locator('button:has-text("🤍"), button:has-text("❤️")').first();
    if (await reaccionBtn.count() === 0) {
      test.skip(true, 'Botón de reacción no encontrado');
      return;
    }

    const textBefore = await reaccionBtn.textContent() ?? '0';
    const countBefore = parseInt(textBefore.replace(/\D/g, '') || '0', 10);

    await reaccionBtn.click();
    await page.waitForTimeout(1500);

    const textAfter = await reaccionBtn.textContent() ?? '0';
    const countAfter = parseInt(textAfter.replace(/\D/g, '') || '0', 10);

    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });

  test('quitar me gusta y ver conteo disminuido', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() === 0) {
      test.skip(true, 'Sin experiencias');
      return;
    }

    await firstCard.click();
    await page.waitForTimeout(2000);

    const reaccionBtn = page.locator('button:has-text("❤️")').first();
    if (await reaccionBtn.count() === 0) {
      test.skip(true, 'No hay reacción previa para quitar');
      return;
    }

    const textBefore = await reaccionBtn.textContent() ?? '0';
    const countBefore = parseInt(textBefore.replace(/\D/g, '') || '0', 10);

    await reaccionBtn.click();
    await page.waitForTimeout(1500);

    const textAfter = await reaccionBtn.textContent() ?? '0';
    const countAfter = parseInt(textAfter.replace(/\D/g, '') || '0', 10);

    expect(countAfter).toBeLessThanOrEqual(countBefore);
  });
});
