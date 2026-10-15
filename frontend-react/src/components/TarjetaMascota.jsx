
function TarjetaMascota({ nombre, especie, edad }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{nombre}</h5>

        <p className="card-text">
          <strong>Especie:</strong> {especie}
        </p>

        <p className="card-text">
          <strong>Edad:</strong> {edad}
        </p>
      </div>
    </div>
  );
}

export default TarjetaMascota;
