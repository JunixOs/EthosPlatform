import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // `declare global { namespace Express { ... } }` is the standard way to
      // augment Express's Request type — not an ES2015-module alternative case.
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  },
]);
