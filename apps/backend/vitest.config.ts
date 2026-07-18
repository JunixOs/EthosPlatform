import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.spec.ts',
        'src/datos/presistence/entities/*.ts',
        'src/infrastructure/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
