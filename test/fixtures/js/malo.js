/* Fixture con errores a proposito. No editar para "arreglarlo". */
var contador = 0;
const a = 1;
const sin_camel_case = 2;
const noSeUsa = 3;

export function sumar(uno, dos) {
  return uno + dos + a + sin_camel_case;
  contador = contador + 1;
}
