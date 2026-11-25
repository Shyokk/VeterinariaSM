/** Aviso reutilizable. tipo: success | danger | warning | info */
export default function Mensaje({ tipo = 'danger', children, alCerrar }) {
  if (!children) return null;
  return (
    <div className={`alert alert-${tipo} ${alCerrar ? 'alert-dismissible' : ''}`} role={tipo === 'danger' ? 'alert' : 'status'}>
      {children}
      {alCerrar && <button type="button" className="btn-close" aria-label="Cerrar" onClick={alCerrar} />}
    </div>
  );
}
