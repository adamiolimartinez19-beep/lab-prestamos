interface EncabezadoProps {
  totalEquipos: number;
  disponiblesCount: number;
}

export const Encabezado = ({ totalEquipos, disponiblesCount }: EncabezadoProps) => {
  return (
    <header style={{ padding: '1rem', backgroundColor: '#1e293b', color: 'white', marginBottom: '1.5rem', borderRadius: '8px' }}>
      <h1>Préstamos Lab — 0902-23-1982</h1>
      <p><strong>{disponiblesCount}</strong> de <strong>{totalEquipos}</strong> equipos disponibles</p>
    </header>
  );
};