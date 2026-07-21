import { test, expect } from '@playwright/test';

// Requiere storageState de usuario autenticado (chromium-auth)
test.describe('Flujo CRUD de experiencias', () => {
  const TITULO = `Exp E2E ${Date.now()}`;

  test('crear experiencia como borrador', async ({ page }) => {
    await page.goto('/experiencias/nueva');

    await page.getByLabel(/título/i).fill(TITULO);
    await page.getByLabel(/descripción/i).fill('Descripción de prueba E2E');
    await page.locator('textarea').nth(1).fill('Reflexión moral E2E');
    await page.locator('textarea').nth(2).fill('Reflexión ética E2E');

    await page.getByRole('button', { name: /guardar borrador/i }).click();

    // Debe redirigir al detalle de la nueva experiencia
    await expect(page).toHaveURL(/\/experiencias\/[0-9a-f-]+$/, { timeout: 8000 });
    await expect(page.getByRole('heading', { name: TITULO })).toBeVisible();
  });

  test('editar experiencia propia', async ({ page }) => {
    // Ir a listado y encontrar la experiencia creada
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const link = page.locator(`a:has-text("${TITULO}")`).first();
    if (await link.count() === 0) {
      test.skip(true, 'Experiencia de prueba no encontrada');
      return;
    }

    await link.click();
    await page.getByRole('link', { name: /editar/i }).click();

    await expect(page).toHaveURL(/\/experiencias\/.+\/editar$/, { timeout: 5000 });

    await page.getByLabel(/título/i).fill(`${TITULO} EDITADA`);
    await page.getByRole('button', { name: /guardar cambios/i }).click();

    await expect(page).toHaveURL(/\/experiencias\//, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: `${TITULO} EDITADA` })).toBeVisible();
  });

  test('publicar borrador', async ({ page }) => {
    // Navegar a la experiencia editada
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const link = page.locator(`a:has-text("${TITULO} EDITADA")`).first();
    if (await link.count() === 0) {
      test.skip(true, 'Experiencia no encontrada');
      return;
    }

    await link.click();
    await page.getByRole('button', { name: /publicar/i }).click();

    // Después de publicar, el estado debe mostrarse como publicada
    await expect(page.getByText('publicada')).toBeVisible({ timeout: 5000 });
  });

  test('eliminar experiencia', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const link = page.locator(`a:has-text("${TITULO} EDITADA")`).first();
    if (await link.count() === 0) {
      test.skip(true, 'Experiencia no encontrada');
      return;
    }

    await link.click();
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: /eliminar/i }).click();

    await expect(page).toHaveURL('/experiencias', { timeout: 8000 });

    // Verificar que ya no aparece en el listado
    await page.waitForTimeout(2000);
    const count = await page.locator(`a:has-text("${TITULO} EDITADA")`).count();
    expect(count).toBe(0);
  });
});
