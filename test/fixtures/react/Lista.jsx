/* Fixture con errores a proposito. */
export function Lista({ elementos }) {
  return (
    <ul>
      {elementos.map((elemento) => (
        <li>{elemento.nombre}</li>
      ))}
    </ul>
  );
}
