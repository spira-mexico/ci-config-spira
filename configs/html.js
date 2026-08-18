import html from '@html-eslint/eslint-plugin';

/** HTML plano. Los templates de Angular los revisa el preset de Angular. */
export const HTML_FILES = ['**/*.html'];
export const HTML_IGNORES = ['**/*.component.html'];

/**
 * Preset de HTML/sitios estaticos: estructura valida, accesibilidad y SEO minimo.
 */
export default [
  {
    ...html.configs['flat/recommended'],
    name: 'spira/html/recommended',
    files: HTML_FILES,
    ignores: HTML_IGNORES,
  },
  {
    // El preset recomendado de @html-eslint trae reglas de formato. Las
    // apagamos: el formato es trabajo de Prettier o del editor, no del lint
    // compartido. Si el CI pelea por indentacion, la gente lo empieza a ignorar.
    name: 'spira/html/sin-formato',
    files: HTML_FILES,
    ignores: HTML_IGNORES,
    rules: {
      '@html-eslint/indent': 'off',
      '@html-eslint/quotes': 'off',
      '@html-eslint/attrs-newline': 'off',
      '@html-eslint/element-newline': 'off',
      '@html-eslint/no-extra-spacing-tags': 'off',
      '@html-eslint/no-extra-spacing-attrs': 'off',
      '@html-eslint/no-extra-spacing-text': 'off',
      '@html-eslint/no-multiple-empty-lines': 'off',
      '@html-eslint/no-trailing-spaces': 'off',
      '@html-eslint/require-closing-tags': 'off',
      '@html-eslint/sort-attrs': 'off',
    },
  },
  {
    name: 'spira/html',
    files: HTML_FILES,
    ignores: HTML_IGNORES,
    rules: {
      // Estructura y metadatos.
      '@html-eslint/require-doctype': 'error',
      '@html-eslint/require-lang': 'error',
      '@html-eslint/require-title': 'error',
      '@html-eslint/require-meta-charset': 'error',
      '@html-eslint/require-meta-viewport': 'error',
      '@html-eslint/require-meta-description': 'warn',
      '@html-eslint/no-duplicate-in-head': 'error',

      // Accesibilidad.
      '@html-eslint/require-img-alt': 'error',
      '@html-eslint/require-button-type': 'error',
      '@html-eslint/require-input-label': 'error',
      '@html-eslint/require-frame-title': 'error',
      '@html-eslint/no-positive-tabindex': 'error',
      '@html-eslint/no-skip-heading-levels': 'error',
      '@html-eslint/no-multiple-h1': 'error',
      '@html-eslint/no-invalid-role': 'error',
      '@html-eslint/no-abstract-roles': 'error',
      '@html-eslint/no-aria-hidden-on-focusable': 'error',
      '@html-eslint/no-empty-headings': 'warn',
      '@html-eslint/no-non-scalable-viewport': 'error',

      // Seguridad y mantenimiento.
      '@html-eslint/no-target-blank': 'error',
      '@html-eslint/prefer-https': 'warn',
      '@html-eslint/no-inline-styles': 'warn',
      '@html-eslint/no-duplicate-id': 'error',
      '@html-eslint/no-duplicate-attrs': 'error',
      '@html-eslint/no-obsolete-tags': 'error',

      // Nombres descriptivos tambien en los ids del markup.
      '@html-eslint/id-naming-convention': ['warn', 'kebab-case'],

      // Avisa de features aun no disponibles en todos los navegadores.
      '@html-eslint/use-baseline': 'warn',
    },
  },
];
