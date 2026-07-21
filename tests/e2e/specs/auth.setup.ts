import { test as setup, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate as regular user', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('tu@correo.com').fill('e2e-user@test.com');
  await page.getByPlaceholder('••••••••').fill('TestPass123');
  await page.getByRole('button', { name: 'Ingresar' }).click();

  // Esperar redirección a experiencias (indica login exitoso)
  await expect(page).toHaveURL('/experiencias', { timeout: 5000 });

  // Guardar estado (localStorage con token + cookies)
  await page.context().storageState({ path: authFile });
});
