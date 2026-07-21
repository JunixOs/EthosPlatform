import { defineConfig, devices } from '@playwright/test';

// Specs que requieren una sesión pre-autenticada (storageState) — solo corren
// bajo chromium-auth / chromium-admin, nunca en los proyectos públicos.
const PRIVATE_SPECS = [
  /flujo-admin\.spec\.ts/,
  /flujo-etiquetas\.spec\.ts/,
  /flujo-experiencias\.spec\.ts/,
  /flujo-favoritos\.spec\.ts/,
  /flujo-reacciones\.spec\.ts/,
  /flujo-reportes\.spec\.ts/,
  /flujo-respuestas\.spec\.ts/,
];

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
      testIgnore: PRIVATE_SPECS,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: PRIVATE_SPECS,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: PRIVATE_SPECS,
    },

    // Tests autenticados (reutilizan storageState)
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: PRIVATE_SPECS,
      testIgnore: /flujo-admin\.spec\.ts/,
    },

    // Tests de administración
    {
      name: 'chromium-admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup'],
      testMatch: /flujo-admin\.spec\.ts/,
    },
  ],
});
