/* Fixture con errores a proposito. */
import { readFileSync } from 'node:fs';

type usuario_mal_nombrado = { id: string };

export function procesar(datos: any): usuario_mal_nombrado {
  var resultado = datos;
  return resultado;
}
