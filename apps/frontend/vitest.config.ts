import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.spec.tsx',
        'src/**/*.types.ts',
        'src/infrastructure/**',
        'src/main.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src/presentacion',
      '@app': '/src/presentacion/app',
      '@features': '/src/presentacion/features',
      '@layout': '/src/presentacion/layout',
      '@pages': '/src/presentacion/pages',
      '@shared': '/src/presentacion/shared',
      '@widgets': '/src/presentacion/widgets',
    },
  },
});
