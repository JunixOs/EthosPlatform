import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:16000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    // Setup: crea sesiones reutilizables
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Tests públicos (no requieren login)
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Tests autenticados (reutilizan storageState)
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      grep: /auth|favoritos|respuestas|reacciones|etiquetas|reportes|experiencias-crud/,
    },

    // Tests de administración
    {
      name: 'chromium-admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
      grep: /admin/,
    },
  ],
});
