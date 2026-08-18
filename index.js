import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import ignoresConfig, { IGNORE_PATTERNS } from './configs/ignores.js';
import baseConfig from './configs/base.js';
import typescriptConfig from './configs/typescript.js';
import reactConfig from './configs/react.js';
import htmlConfig from './configs/html.js';
import { angularConfig } from './configs/angular.js';

export { IGNORE_PATTERNS };
export { angularConfig };

/**
 * Lee el package.json del proyecto que esta usando la config.
 *
 * @param {string} cwd raiz del proyecto
 * @returns {object|null} el package.json parseado, o null si no existe/no es valido
 */
function readProjectManifest(cwd) {
  try {
    return JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Detecta el framework del proyecto a partir de sus dependencias.
 * Mismo criterio que usa el workflow reutilizable de CI.
 *
 * @param {string} [cwd] raiz del proyecto
 * @returns {'react'|'angular'|'html'} framework detectado
 */
export function detectFramework(cwd = process.cwd()) {
  const manifest = readProjectManifest(cwd);
  if (!manifest) return 'html';

  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
    ...manifest.peerDependencies,
  };

  if (dependencies['@angular/core']) return 'angular';
  if (dependencies.react || dependencies.next || dependencies['react-dom']) return 'react';

  return 'html';
}

/**
 * Arma la configuracion de Spira para un proyecto.
 *
 * @param {object} [options]
 * @param {'auto'|'react'|'angular'|'html'} [options.framework] framework a usar; `auto` lo detecta
 * @param {string|string[]} [options.angularPrefix] prefijo de selectores para Angular
 * @param {string[]} [options.ignores] rutas extra a ignorar
 * @param {object[]} [options.extend] bloques de flat config que se agregan al final
 * @param {string} [options.cwd] raiz del proyecto para la deteccion
 * @returns {object[]} flat config lista para exportar desde eslint.config.js
 */
export function spiraConfig(options = {}) {
  const {
    framework = 'auto',
    angularPrefix = 'app',
    ignores = [],
    extend = [],
    cwd = process.cwd(),
  } = options;

  const target = framework === 'auto' ? detectFramework(cwd) : framework;

  const config = [
    ...ignoresConfig,
    ...(ignores.length > 0 ? [{ name: 'spira/ignores/proyecto', ignores }] : []),
    ...baseConfig,
    ...typescriptConfig,
  ];

  if (target === 'react') config.push(...reactConfig);
  if (target === 'angular') config.push(...angularConfig({ prefix: angularPrefix }));

  // El HTML plano se revisa siempre: hasta un proyecto React tiene su index.html.
  config.push(...htmlConfig);

  return [...config, ...extend];
}

export default spiraConfig();
