// Opcional: copia esto en la raiz de tu proyecto SOLO si quieres que el editor
// (VS Code, WebStorm) marque los mismos errores que CI mientras escribes.
// Si no existe, el workflow genera uno equivalente al vuelo.

import spira from '@spira-mexico/eslint-config';

export default spira;

// --- Variante con ajustes del proyecto ---------------------------------------
//
// import { spiraConfig } from '@spira-mexico/eslint-config';
//
// export default spiraConfig({
//   framework: 'react',            // auto por defecto
//   angularPrefix: 'spira',        // solo Angular
//   ignores: ['src/generado/**'],  // rutas extra a ignorar
//   extend: [
//     {
//       name: 'proyecto/ajustes',
//       files: ['src/legacy/**/*.js'],
//       rules: { 'id-length': 'off' },
//     },
//   ],
// });
