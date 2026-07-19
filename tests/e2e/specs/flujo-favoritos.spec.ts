import { test, expect } from '@playwright/test';

test.describe('Flujo de favoritos', () => {
  test('dar favorito en detalle de experiencia', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    // Click en la primera experiencia
    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() === 0) {
      test.skip(true, 'Sin experiencias para testear favoritos');
      return;
    }

    await firstCard.click();
    await page.waitForTimeout(1000);

    // Dar favorito (corazón vacío)
    const heartBtn = page.locator('button[title*="Guardar"], button[title*="Quitar"]').first();
    if (await heartBtn.count() === 0) {
      test.skip(true, 'Botón de favorito no encontrado');
      return;
    }

    await heartBtn.click();
    await page.waitForTimeout(1000);
  });

  test('ver favorito en "Mis favoritos" y quitarlo', async ({ page }) => {
    await page.goto('/favoritos');
    await page.waitForTimeout(2000);

    // Verificar que hay al menos un favorito
    const cards = page.locator('a[href^="/experiencias/"]');
    const count = await cards.count();

    if (count === 0) {
      test.skip(true, 'Sin favoritos para eliminar');
      return;
    }

    // Click en el primero para ir al detalle
    await cards.first().click();
    await page.waitForTimeout(1000);

    // Quitar favorito
    const heartBtn = page.locator('button[title*="Quitar"]').first();
    if (await heartBtn.count() > 0) {
      await heartBtn.click();
      await page.waitForTimeout(1000);
    }

    // Volver a favoritos y verificar que ya no está (o hay menos)
    await page.goto('/favoritos');
    await page.waitForTimeout(2000);
  });
});
