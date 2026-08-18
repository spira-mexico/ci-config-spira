import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { ESLint } from 'eslint';

import { spiraConfig, detectFramework } from '../index.js';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '..');

/**
 * Corre ESLint sobre una fixture con el preset indicado y devuelve
 * los IDs de reglas que reportaron algo.
 *
 * @param {string} rutaRelativa fixture a revisar, relativa a la raiz del repo
 * @param {'react'|'angular'|'html'} framework preset a usar
 * @returns {Promise<string[]>} reglas que dispararon
 */
async function reglasQueDisparan(rutaRelativa, framework) {
  const linter = new ESLint({
    cwd: RAIZ,
    overrideConfigFile: true,
    overrideConfig: spiraConfig({ framework, cwd: RAIZ }),
  });

  const resultados = await linter.lintFiles([resolve(RAIZ, rutaRelativa)]);

  return resultados.flatMap((resultado) =>
    resultado.messages.map((mensaje) => mensaje.ruleId).filter(Boolean),
  );
}

test('el preset base marca var, nombres pobres y codigo muerto', async () => {
  const reglas = await reglasQueDisparan('test/fixtures/js/malo.js', 'html');

  for (const esperada of [
    'no-var',
    'id-length',
    'camelcase',
    'unused-imports/no-unused-vars',
    'no-unreachable',
  ]) {
    assert.ok(reglas.includes(esperada), `falto reportar ${esperada}: ${reglas.join(', ')}`);
  }
});

test('el preset de TypeScript marca any, nombres de tipos e imports muertos', async () => {
  const reglas = await reglasQueDisparan('test/fixtures/ts/malo.ts', 'html');

  for (const esperada of [
    '@typescript-eslint/no-explicit-any',
    '@typescript-eslint/naming-convention',
    'unused-imports/no-unused-imports',
    'no-var',
  ]) {
    assert.ok(reglas.includes(esperada), `falto reportar ${esperada}: ${reglas.join(', ')}`);
  }
});

test('el preset de React marca listas sin key', async () => {
  const reglas = await reglasQueDisparan('test/fixtures/react/Lista.jsx', 'react');

  assert.ok(reglas.includes('react/jsx-key'), `reglas: ${reglas.join(', ')}`);
});

test('el preset de Angular marca selector y lifecycle vacio', async () => {
  const reglas = await reglasQueDisparan('test/fixtures/angular/mal.component.ts', 'angular');

  for (const esperada of [
    '@angular-eslint/component-selector',
    '@angular-eslint/no-empty-lifecycle-method',
  ]) {
    assert.ok(reglas.includes(esperada), `falto reportar ${esperada}: ${reglas.join(', ')}`);
  }
});

test('el preset de Angular revisa los templates de componentes', async () => {
  const reglas = await reglasQueDisparan('test/fixtures/angular/mal.component.html', 'angular');

  assert.ok(
    reglas.includes('@angular-eslint/template/no-negated-async'),
    `reglas: ${reglas.join(', ')}`,
  );
});

test('el preset de HTML marca accesibilidad y metadatos faltantes', async () => {
  const reglas = await reglasQueDisparan('test/fixtures/html/malo.html', 'html');

  for (const esperada of [
    '@html-eslint/require-lang',
    '@html-eslint/require-img-alt',
    '@html-eslint/require-button-type',
  ]) {
    assert.ok(reglas.includes(esperada), `falto reportar ${esperada}: ${reglas.join(', ')}`);
  }
});

test('la deteccion de framework lee las dependencias del proyecto', () => {
  assert.equal(detectFramework(RAIZ), 'html');
  assert.equal(detectFramework(resolve(RAIZ, 'no-existe')), 'html');
});
