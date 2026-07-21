import { test, expect } from '@playwright/test';

const TEST_EMAIL = `e2e-register-${Date.now()}@test.com`;

// Este test corre sin storageState (público)
test.describe('Flujo Auth completo', () => {
  test('registro → login automático → redirección a home', async ({ page }) => {
    await page.goto('/registro');

    await page.getByPlaceholder('Tu nombre').fill('E2E Registro');
    await page.getByPlaceholder('tu@correo.com').fill(TEST_EMAIL);
    await page.getByPlaceholder('Mín. 8 caracteres, 1 mayúscula, 1 número').fill('RegPass123');
    await page.getByPlaceholder('Repite tu contraseña').fill('RegPass123');

    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    // Después de registro exitoso, debe redirigir a login o experiencias
    await expect(page).toHaveURL(/\/(login|experiencias|)$/, { timeout: 8000 });

    // Si redirigió a login, iniciar sesión
    if (page.url().includes('/login')) {
      await page.getByPlaceholder('tu@correo.com').fill(TEST_EMAIL);
      await page.getByPlaceholder('••••••••').fill('RegPass123');
      await page.getByRole('button', { name: 'Ingresar' }).click();
    }

    // Verificar que está logueado (navbar muestra nombre de usuario)
    await expect(page.getByRole('button', { name: 'E2E Registro' })).toBeVisible({ timeout: 5000 });
  });

  test('login con credenciales correctas redirige a experiencias', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('tu@correo.com').fill('e2e-user@test.com');
    await page.getByPlaceholder('••••••••').fill('TestPass123');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL('/experiencias', { timeout: 5000 });
    await expect(page.getByRole('button', { name: 'E2E User' })).toBeVisible();
  });

  test('logout elimina sesión y redirige', async ({ page }) => {
    // Login primero
    await page.goto('/login');
    await page.getByPlaceholder('tu@correo.com').fill('e2e-user@test.com');
    await page.getByPlaceholder('••••••••').fill('TestPass123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/experiencias', { timeout: 5000 });

    // Abrir dropdown de usuario y cerrar sesión
    await page.getByRole('button', { name: 'E2E User' }).click();
    await page.getByRole('button', { name: 'Cerrar sesión' }).click();

    // Después de logout, debe mostrar botones de auth
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible({ timeout: 5000 });
  });
});
