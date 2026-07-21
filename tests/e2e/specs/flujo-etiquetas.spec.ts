import { test, expect } from '@playwright/test';

test.describe('Flujo de etiquetas', () => {
  test('crear experiencia con etiquetas', async ({ page }) => {
    await page.goto('/experiencias/nueva');

    const titulo = `Exp Etiquetas E2E ${Date.now()}`;
    await page.getByLabel(/título/i).fill(titulo);
    await page.getByLabel(/descripción/i).fill('Descripción con etiquetas');
    await page.locator('textarea').nth(1).fill('Moral test');
    await page.locator('textarea').nth(2).fill('Ética test');

    // Las etiquetas se asocian desde el detalle (sección "Editar etiquetas"),
    // no en el formulario de creación.
    await page.getByRole('button', { name: /guardar borrador/i }).click();
    await expect(page).toHaveURL(/\/experiencias\/[0-9a-f-]+$/, { timeout: 8000 });

    const tagInput = page.locator('input[placeholder*="Escribe y presiona Enter"]').first();
    await tagInput.fill('etica');
    await tagInput.press('Enter');
    await tagInput.fill('moral');
    await tagInput.press('Enter');

    await page.getByRole('button', { name: /guardar etiquetas/i }).click();

    // Verificar que las etiquetas aparecen
    await expect(page.getByText('#etica')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('#moral')).toBeVisible({ timeout: 5000 });
  });

  test('buscar por etiqueta redirige a /buscar con filtro', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    // Buscar una etiqueta visible en el listado o detalle
    const tagLink = page.locator('a:has-text("#")').first();
    if (await tagLink.count() === 0) {
      test.skip(true, 'Sin etiquetas para clickear');
      return;
    }

    await tagLink.click();
    await expect(page).toHaveURL(/\/buscar\?etiqueta=/, { timeout: 5000 });
  });
});
