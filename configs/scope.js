/**
 * Aplica un patron de archivos a uno o varios bloques de flat config.
 * Los presets de terceros (typescript-eslint, angular-eslint, react) vienen sin
 * `files`, asi que sin esto se aplicarian a todo el repo.
 *
 * @param {string[]} files patrones glob a los que debe limitarse la config
 * @param {object|object[]} configs bloque o bloques de flat config
 * @returns {object[]} los mismos bloques, ya limitados
 */
export function scopeTo(files, configs) {
  const blocks = Array.isArray(configs) ? configs : [configs];

  return blocks.map((block) => ({
    ...block,
    files: block.files ?? files,
  }));
}

export default scopeTo;
