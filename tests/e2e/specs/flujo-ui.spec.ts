import { test, expect } from '@playwright/test';

test.describe('Dark mode persistente', () => {
  test('alternar tema y persistir tras recarga', async ({ page }) => {
    await page.goto('/');

    const btn = page.getByRole('button', { name: 'Cambiar tema' });
    await expect(btn).toBeVisible();

    // Verificar tema inicial (light por defecto)
    const initialClass = await page.locator('html').getAttribute('class');
    const wasDark = initialClass?.includes('dark') ?? false;

    // Alternar
    await btn.click();
    await page.waitForTimeout(500);

    const afterClass = await page.locator('html').getAttribute('class');
    const isDark = afterClass?.includes('dark') ?? false;
    expect(isDark).toBe(!wasDark);

    // Recargar y verificar persistencia
    await page.reload();
    await page.waitForTimeout(500);

    const reloadedClass = await page.locator('html').getAttribute('class');
    const stillDark = reloadedClass?.includes('dark') ?? false;
    expect(stillDark).toBe(isDark);

    // Restaurar tema original
    if (stillDark !== wasDark) {
      await btn.click();
    }
  });
});
