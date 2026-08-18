/**
 * Rutas que ESLint nunca debe revisar, sin importar el framework.
 * Se exporta por separado para poder reutilizarlo en cualquier preset.
 */
export const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/out/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.angular/**',
  '**/.output/**',
  '**/.vercel/**',
  '**/.turbo/**',
  '**/vendor/**',
  '**/*.min.js',
  '**/*.bundle.js',
];

/** Bloque de flat config con solo los ignores globales. */
export default [
  {
    name: 'spira/ignores',
    ignores: IGNORE_PATTERNS,
  },
];
