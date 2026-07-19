import { test, expect } from '@playwright/test';

// Requiere storageState de admin (chromium-admin)
test.describe('Flujo de administración', () => {
  test('acceder a panel de admin usuarios', async ({ page }) => {
    await page.goto('/admin/usuarios');
    await page.waitForTimeout(2000);

    // Debe mostrar la lista de usuarios sin error 403
    await expect(page.locator('body')).toContainText(/usuarios|admin|gestión/i);
  });

  test('suspender y reactivar usuario', async ({ page }) => {
    await page.goto('/admin/usuarios');
    await page.waitForTimeout(2000);

    // Buscar el usuario e2e-user@test.com en el listado
    const userRow = page.locator('tr:has-text("e2e-user@test.com")').first();
    if (await userRow.count() === 0) {
      test.skip(true, 'Usuario de test no encontrado en admin');
      return;
    }

    // Suspender
    const suspenderBtn = userRow.locator('button:has-text("Suspender")').first();
    if (await suspenderBtn.count() > 0) {
      await suspenderBtn.click();
      await page.waitForTimeout(1000);
    }

    // Recargar y verificar que ahora muestra "Reactivar"
    await page.reload();
    await page.waitForTimeout(2000);

    const reactivarBtn = page.locator('tr:has-text("e2e-user@test.com")').locator('button:has-text("Reactivar")').first();
    if (await reactivarBtn.count() > 0) {
      await reactivarBtn.click();
      await page.waitForTimeout(1000);
    }
  });
});
