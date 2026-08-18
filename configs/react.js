import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { scopeTo } from './scope.js';

/** Archivos con JSX. */
export const JSX_FILES = ['**/*.{jsx,tsx}'];

/** Los hooks tambien viven en archivos sin JSX (hooks propios, stores, etc.). */
export const HOOK_FILES = ['**/*.{js,jsx,mjs,ts,tsx}'];

/**
 * Preset de React: reglas de JSX + reglas de hooks.
 * Asume el JSX transform moderno (no hace falta `import React`).
 */
export default [
  ...scopeTo(JSX_FILES, react.configs.flat.recommended),
  ...scopeTo(JSX_FILES, react.configs.flat['jsx-runtime']),
  {
    ...reactHooks.configs.flat['recommended-latest'],
    name: 'spira/react/hooks',
    files: HOOK_FILES,
  },
  {
    name: 'spira/react',
    files: JSX_FILES,
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Los tipos los da TypeScript o PropTypes segun el proyecto, no lo forzamos.
      'react/prop-types': 'off',

      // Errores reales de render.
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/no-array-index-key': 'warn',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
      'react/no-danger': 'warn',

      // Limpieza de JSX.
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-pascal-case': 'error',
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: ['function-declaration', 'arrow-function'],
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },
];
