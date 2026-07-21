import { test as setup, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../playwright/.auth/admin.json');

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('tu@correo.com').fill('e2e-admin@test.com');
  await page.getByPlaceholder('••••••••').fill('AdminPass123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  // Esperar redirección a experiencias (indica login exitoso)
  await expect(page).toHaveURL('/experiencias', { timeout: 5000 });

  await page.context().storageState({ path: authFile });
});
