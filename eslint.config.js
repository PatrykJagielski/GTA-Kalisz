import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'dist-server/', 'node_modules/'] },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        // podstawiane przez scripts/build.mjs (esbuild define)
        __CITY_URL__: 'readonly', __CITY_BYTES__: 'readonly', __DEBUG__: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      // moduł ma robić jedną rzecz: dłuższy plik to sygnał, żeby go podzielić
      'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'server/**/*.mjs', 'eslint.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.node },
  },
];
