import tseslint from 'typescript-eslint';
import { scopeTo } from './scope.js';

/** Extensiones que cubre el preset de TypeScript. */
export const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];

/**
 * Preset de TypeScript. Solo reglas que NO requieren type-checking, para que
 * corra rapido en CI y no dependa de que exista un tsconfig valido.
 */
export default [
  ...scopeTo(TS_FILES, tseslint.configs.recommended),
  {
    name: 'spira/typescript',
    files: TS_FILES,
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // El codigo muerto lo reporta unused-imports (mismo mensaje en JS y TS).
      '@typescript-eslint/no-unused-vars': 'off',

      // Nombres descriptivos, version TypeScript.
      camelcase: 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
        // Payloads de APIs externas: no forzamos camelCase en llaves de objetos.
        { selector: ['objectLiteralProperty', 'typeProperty'], format: null },
        { selector: 'import', format: null },
      ],

      // Reglas base que tienen version TS y hay que cambiar para evitar falsos positivos.
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': [
        'warn',
        { allow: ['arrowFunctions', 'constructors', 'decoratedFunctions'] },
      ],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: false, typedefs: false },
      ],

      // Calidad de tipos.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-inferrable-types': 'error',
    },
  },
  {
    name: 'spira/typescript/declarations',
    files: ['**/*.d.ts'],
    rules: {
      'id-length': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
];
