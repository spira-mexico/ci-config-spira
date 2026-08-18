// Este repo se revisa a si mismo con sus propias reglas.
import spira from './index.js';

export default [
  ...spira,
  {
    name: 'spira/repo/fixtures',
    // Las fixtures tienen errores a proposito: las revisa el test, no el lint.
    ignores: ['test/fixtures/**'],
  },
];
