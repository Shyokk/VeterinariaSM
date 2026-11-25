export default function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="text-center text-secondary py-4" role="status" aria-live="polite">
      <div className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
      {texto}
    </div>
  );
}
