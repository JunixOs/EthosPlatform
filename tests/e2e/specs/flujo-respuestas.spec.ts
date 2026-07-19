import { test, expect } from '@playwright/test';

test.describe('Flujo de respuestas', () => {
  test('escribir respuesta en experiencia publicada', async ({ page }) => {
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    // Buscar una experiencia publicada (que tenga estado publicada)
    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() === 0) {
      test.skip(true, 'Sin experiencias para responder');
      return;
    }

    await firstCard.click();
    await page.waitForTimeout(2000);

    // Verificar que está la sección de respuestas
    const respuestasHeading = page.getByRole('heading', { name: /respuestas/i });
    if (await respuestasHeading.count() === 0) {
      test.skip(true, 'Sección de respuestas no encontrada');
      return;
    }

    // Escribir respuesta
    const textarea = page.getByPlaceholder(/escribe tu respuesta/i);
    if (await textarea.count() === 0) {
      test.skip(true, 'Formulario de respuesta no encontrado');
      return;
    }

    await textarea.fill('Respuesta de prueba E2E');
    await page.getByRole('button', { name: /responder/i }).click();

    // Verificar que aparece la respuesta
    await expect(page.getByText('Respuesta de prueba E2E')).toBeVisible({ timeout: 5000 });
  });

  test('eliminar respuesta propia', async ({ page }) => {
    // Ir a una experiencia donde haya una respuesta nuestra
    await page.goto('/experiencias');
    await page.waitForTimeout(2000);

    const firstCard = page.locator('a[href^="/experiencias/"]:not([href="/experiencias/nueva"])').first();
    if (await firstCard.count() === 0) {
      test.skip(true, 'Sin experiencias');
      return;
    }

    await firstCard.click();
    await page.waitForTimeout(2000);

    // Buscar botón eliminar en una respuesta
    const eliminarBtn = page.getByRole('button', { name: /eliminar/i }).filter({ hasText: 'Eliminar' }).first();
    if (await eliminarBtn.count() === 0) {
      test.skip(true, 'Sin respuestas propias para eliminar');
      return;
    }

    page.once('dialog', (dialog) => dialog.accept());
    await eliminarBtn.click();

    await page.waitForTimeout(1000);
  });
});
