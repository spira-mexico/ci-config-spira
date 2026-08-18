# ci-config-spira

El corazón del CI de **Spira México**: aquí viven las reglas de ESLint de la
organización y el workflow reutilizable que las aplica.

Un dev que arranca un proyecto nuevo escribe **un archivo de 8 líneas** y ya
tiene lint con las reglas de la casa, detección de framework y build. Nunca
copia configuraciones, nunca las edita, nunca se desincronizan entre repos.

```
ci-config-spira
├── index.js                     ← la config de ESLint (auto-detecta framework)
├── configs/                     ← presets: base, typescript, react, angular, html
├── .github/workflows/
│   ├── ci-node.yml              ← ⭐ workflow reutilizable (workflow_call)
│   ├── publish-config.yml       ← publica el paquete en GitHub Packages
│   └── self-check.yml           ← este repo se revisa a sí mismo
├── examples/                    ← lo que el dev copia en su proyecto
└── test/                        ← pruebas de que cada regla sigue disparando
```

---

## 1. Qué hace el dev (los 8 renglones)

En su proyecto, `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    uses: spira-mexico/ci-config-spira/.github/workflows/ci-node.yml@v1
    secrets:
      registry-token: ${{ secrets.GITHUB_TOKEN }}
```

Eso es todo. No necesita instalar ESLint, ni crear `eslint.config.js`, ni saber
qué reglas hay. El workflow:

1. instala las dependencias (detecta npm / yarn / pnpm por el lockfile),
2. instala ESLint + las reglas de Spira si el proyecto no las trae,
3. genera una config de ESLint si el proyecto no tiene una,
4. corre el lint y publica los errores **como anotaciones en el diff del PR**
   más un resumen con las reglas más rotas,
5. detecta el framework (React / Angular / HTML) y corre el build correcto,
6. sube el reporte JSON como artifact.

> **Tip:** si además quieres ver los mismos errores en el editor mientras
> escribes, copia `examples/eslint.config.js` a la raíz de tu proyecto e
> instala el paquete. Es opcional: CI funciona sin eso.

---

## 2. Las reglas

Se dividen en tres bloques, más los presets por framework.

### Variables modernas (`configs/base.js`)

| Regla | Qué exige |
| --- | --- |
| `no-var` | `let` / `const`, nunca `var` |
| `prefer-const` | si no se reasigna, es `const` |
| `one-var` | una declaración por variable |
| `no-implicit-globals` | nada de fugas al scope global |
| `block-scoped-var` | usar la variable dentro de su bloque |

### Nombres descriptivos

| Regla | Qué exige |
| --- | --- |
| `id-length` | mínimo 3 caracteres, con excepciones sensatas (`i`, `id`, `db`, `el`…) |
| `camelcase` | `camelCase` en variables y funciones |
| `new-cap` | constructores en `PascalCase` |
| `@typescript-eslint/naming-convention` | `PascalCase` en tipos, `UPPER_CASE` en constantes |

Los payloads de APIs externas (`objectLiteralProperty`, `typeProperty`) quedan
libres: no forzamos `camelCase` en llaves que llegan de un backend ajeno.

### Código muerto

| Regla | Qué caza |
| --- | --- |
| `unused-imports/no-unused-imports` | imports que ya nadie usa (con autofix) |
| `unused-imports/no-unused-vars` | variables y argumentos sin uso (`_algo` se perdona) |
| `no-unreachable`, `no-unreachable-loop` | código después de `return` / loops imposibles |
| `no-unused-private-class-members` | campos privados olvidados |
| `no-useless-return`, `no-useless-catch`, `no-lone-blocks` | ruido sin efecto |
| `no-constant-binary-expression` | condiciones que siempre dan lo mismo |

### Por framework

- **TypeScript** — `typescript-eslint` recomendado, sin type-checking (rápido y
  no depende de un `tsconfig` válido), `consistent-type-imports`, `no-explicit-any`.
- **React** — `jsx-key`, `no-unstable-nested-components`,
  `jsx-no-constructed-context-values`, reglas de hooks, JSX transform moderno
  (no hace falta `import React`).
- **Angular** — selectores con prefijo, `use-lifecycle-interface`,
  `no-empty-lifecycle-method`, más las reglas de templates
  (`*.component.html`) incluyendo accesibilidad.
- **HTML** — estructura (`require-doctype`, `require-lang`), accesibilidad
  (`require-img-alt`, `require-input-label`, `no-positive-tabindex`) y
  seguridad (`no-target-blank`, `prefer-https`).

Las excepciones son intencionales y están acotadas: archivos `*.config.js` y
`scripts/` permiten `console` y nombres cortos; los archivos `*.test.js` /
`*.spec.js` relajan `id-length`.

### Lo que estas reglas NO hacen

**No tocan el formato.** Nada de indentación, comillas, punto y coma o saltos
de línea — eso es trabajo de Prettier o del editor. Un CI que se pone rojo por
un espacio es un CI que la gente aprende a ignorar.

### Versión de ESLint

El paquete pide `eslint ^9.7.0` y ahí se queda por ahora: con ESLint 10,
`eslint-plugin-react` truena
(`contextOrFilename.getFilename is not a function`). El workflow **no instala
`eslint` a secas** justamente por esto: lee el `peerDependencies` del paquete e
instala ese rango. Cuando el plugin de React soporte la 10, se amplía el rango
aquí y todos los repos lo toman solos.

---

## 3. Opciones del workflow

Todas opcionales. Ver `examples/ci-personalizado.yml`.

| Input | Default | Para qué |
| --- | --- | --- |
| `node-version` | `22` | versión de Node |
| `working-directory` | `.` | carpeta del proyecto (monorepos) |
| `package-manager` | `auto` | `npm` / `yarn` / `pnpm` |
| `framework` | `auto` | forzar `react`, `angular`, `html` o `none` |
| `angular-prefix` | `app` | prefijo de selectores Angular |
| `lint-paths` | `.` | qué revisa ESLint |
| `max-warnings` | `-1` | `0` hace que los warnings también rompan el build |
| `run-lint` / `run-build` / `run-tests` | `true` / `true` / `false` | qué etapas correr |
| `build-command` | *(vacío)* | comando explícito, gana sobre la detección |
| `config-source` | `git` | `git` o `registry` (GitHub Packages) |
| `config-version` | `v1` | tag/branch o rango semver de las reglas |
| `runs-on` | `ubuntu-latest` | runner |

**Secret:** `registry-token` — un token con `read:packages`. Con
`config-source: git` sirve para clonar este repo si es privado; con
`config-source: registry` para bajar el paquete. En la mayoría de los casos
basta `${{ secrets.GITHUB_TOKEN }}`.

### Cómo detecta el framework

Lee las dependencias del `package.json` del proyecto:

- `@angular/core` → **angular**
- `react`, `react-dom` o `next` → **react**
- cualquier otra cosa (o sin `package.json`) → **html**

Y para el build: si existe script `build` en el `package.json`, lo corre con el
gestor detectado. Si no y es Angular, corre `ng build --configuration production`.
Si es sitio estático, no compila nada.

---

## 4. Distribuir las reglas

Hay dos formas y el workflow soporta las dos.

### A) Directo del repo por URL de git (para empezar, sin registro)

Es el default (`config-source: git`). No hay nada que publicar: basta con
mover el tag `v1`. Para instalarlo a mano en un proyecto:

```bash
npm install --save-dev github:spira-mexico/ci-config-spira#v1
```

### B) GitHub Packages (registro privado de la org)

```bash
# 1. Crear un release en GitHub con tag vX.Y.Z
#    → publish-config.yml publica el paquete y mueve el tag v1

# 2. En el proyecto que lo consume, .npmrc:
@spira-mexico:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}

# 3. Instalar
npm install --save-dev @spira-mexico/eslint-config
```

Y en el workflow del proyecto: `config-source: registry`.

### Versionado

Los proyectos apuntan a `@v1`. Al publicar un release no-prerelease, el tag
`v1` se mueve solo al último `1.x`, así que todos los repos reciben reglas
nuevas sin tocar nada.

- Regla nueva en `warn`, o corrección → **patch/minor**.
- Regla nueva en `error` que puede romper builds → **major** (`v2`), y los
  repos migran cuando puedan.

---

## 5. Trabajar en este repo

```bash
npm install
npm run lint    # el repo se revisa con sus propias reglas
npm test        # verifica que cada regla siga disparando
```

Los tests de `test/reglas.test.js` corren ESLint sobre fixtures con errores a
propósito (`test/fixtures/`) y verifican que se reporten las reglas esperadas
en JS, TypeScript, React, Angular y HTML. **Si agregas una regla importante,
agrégale una fixture**: es lo que evita que una regla se apague en silencio.

### Probar el workflow completo

Los tests de arriba prueban las reglas. Para probar el **workflow** —detección
de framework, instalación, build— está el repo
[pruebas-ci](https://github.com/spira-mexico/pruebas-ci), que trae tres apps de
ejemplo y un simulador que corre los pasos reales de `ci-node.yml` en tu
máquina, sin push:

```bash
cd ../pruebas-ci
node simular-ci.mjs todos            # las tres apps deben pasar
node simular-ci.mjs todos --sucio    # con errores a proposito: deben fallar
```

Vale la pena correrlo **antes de mover el tag `v1`**, porque ese tag actualiza
el CI de todos los repos de la organización a la vez.

## Licencia

MIT — ver [LICENSE](LICENSE).
