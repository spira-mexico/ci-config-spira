import angular from 'angular-eslint';
import { scopeTo } from './scope.js';

/** Archivos TypeScript de un proyecto Angular. */
export const NG_TS_FILES = ['**/*.ts'];

/** Templates externos de componentes (los inline se procesan aparte). */
export const NG_TEMPLATE_FILES = ['**/*.component.html'];

/**
 * Construye el preset de Angular con el prefijo de selectores de la app.
 *
 * @param {{ prefix?: string | string[] }} [options] prefijo de selectores, `app` por defecto
 * @returns {object[]} bloques de flat config
 */
export function angularConfig({ prefix = 'app' } = {}) {
  const prefixes = Array.isArray(prefix) ? prefix : [prefix];

  return [
    ...scopeTo(NG_TS_FILES, angular.configs.tsRecommended),
    {
      name: 'spira/angular/ts',
      files: NG_TS_FILES,
      processor: angular.processInlineTemplates,
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: prefixes, style: 'kebab-case' },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: prefixes, style: 'camelCase' },
        ],
        '@angular-eslint/pipe-prefix': ['error', { prefixes }],
        '@angular-eslint/use-lifecycle-interface': 'error',
        '@angular-eslint/no-empty-lifecycle-method': 'error',
        '@angular-eslint/prefer-output-readonly': 'error',
        '@angular-eslint/no-output-on-prefix': 'error',
        '@angular-eslint/component-class-suffix': 'error',
        '@angular-eslint/directive-class-suffix': 'error',
        '@angular-eslint/use-injectable-provided-in': 'warn',
        '@angular-eslint/prefer-on-push-component-change-detection': 'warn',

        // Los decoradores de Angular usan nombres que no son camelCase puro.
        '@typescript-eslint/naming-convention': 'off',
      },
    },
    ...scopeTo(NG_TEMPLATE_FILES, angular.configs.templateRecommended),
    ...scopeTo(NG_TEMPLATE_FILES, angular.configs.templateAccessibility),
    {
      name: 'spira/angular/template',
      files: NG_TEMPLATE_FILES,
      rules: {
        '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: true }],
        '@angular-eslint/template/no-negated-async': 'error',
        '@angular-eslint/template/use-track-by-function': 'warn',
        '@angular-eslint/template/no-duplicate-attributes': 'error',
        '@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 5 }],
      },
    },
  ];
}

export default angularConfig();
