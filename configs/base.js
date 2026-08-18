import eslintJs from '@eslint/js';
import globals from 'globals';
import unusedImports from 'eslint-plugin-unused-imports';

/** Extensiones de JavaScript/TypeScript que cubre el preset base. */
export const JS_FILES = ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}'];

/**
 * Identificadores cortos que si permitimos aunque `id-length` pida 3 letras:
 * son convenciones universales, no nombres flojos.
 */
export const SHORT_NAME_EXCEPTIONS = [
  '_',
  'i',
  'j',
  'k',
  'x',
  'y',
  'z',
  'id',
  'db',
  'fs',
  'os',
  'ok',
  'to',
  'on',
  'up',
  'ms',
  't',
  'el',
  'ev',
];

/**
 * Preset base de Spira: aplica a cualquier proyecto JS/TS, con o sin framework.
 * Tres bloques de reglas: variables modernas, nombres descriptivos y codigo muerto.
 */
export default [
  {
    ...eslintJs.configs.recommended,
    name: 'spira/base/eslint-recommended',
    files: JS_FILES,
  },
  {
    name: 'spira/base',
    files: JS_FILES,
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // --- Variables modernas -------------------------------------------------
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-implicit-globals': 'error',
      'no-undef-init': 'error',
      'one-var': ['error', 'never'],
      'block-scoped-var': 'error',

      // --- Nombres descriptivos -----------------------------------------------
      'id-length': [
        'error',
        {
          min: 3,
          max: 45,
          properties: 'never',
          exceptions: SHORT_NAME_EXCEPTIONS,
        },
      ],
      camelcase: [
        'error',
        {
          properties: 'never',
          ignoreDestructuring: false,
          ignoreImports: true,
          ignoreGlobals: true,
          allow: ['^UNSAFE_', '^_{1,2}[a-z]'],
        },
      ],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'no-underscore-dangle': ['warn', { allowAfterThis: true, enforceInMethodNames: false }],

      // --- Codigo muerto ------------------------------------------------------
      'no-unused-vars': 'off', // lo cubre unused-imports con mejor autofix
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'no-unused-labels': 'error',
      'no-useless-return': 'error',
      'no-useless-catch': 'error',
      'no-useless-concat': 'error',
      'no-useless-rename': 'error',
      'no-lone-blocks': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-function': ['warn', { allow: ['arrowFunctions', 'constructors'] }],
      'no-constant-binary-expression': 'error',
      'no-constant-condition': ['error', { checkLoops: 'allExceptWhileTrue' }],

      // --- Higiene general ----------------------------------------------------
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'multi-line'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-assign': ['error', 'always'],
      'no-param-reassign': ['error', { props: false }],
      'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions' }],
      'no-nested-ternary': 'error',
      'no-else-return': ['warn', { allowElseIf: false }],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'object-shorthand': ['error', 'always'],
      'dot-notation': 'error',
      'require-await': 'error',
      'max-depth': ['warn', 4],
      'max-params': ['warn', 5],
      complexity: ['warn', { max: 15 }],
    },
  },
  {
    // Archivos de configuracion y scripts: nombres cortos y console son normales.
    name: 'spira/base/config-files',
    files: [
      '**/*.config.{js,mjs,cjs,ts,mts,cts}',
      '**/*.conf.{js,mjs,cjs,ts}',
      '**/scripts/**/*.{js,mjs,cjs,ts}',
      '**/.*rc.{js,mjs,cjs}',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'no-console': 'off',
      'id-length': 'off',
    },
  },
  {
    // Tests: variables cortas y funciones vacias son parte del estilo.
    name: 'spira/base/tests',
    files: [
      '**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,mjs,cjs,jsx,ts,tsx}',
      '**/{test,tests}/**/*.{test,spec}.{js,mjs,cjs,jsx,ts,tsx}',
    ],
    rules: {
      'id-length': 'off',
      'no-empty-function': 'off',
      'max-params': 'off',
    },
  },
];
