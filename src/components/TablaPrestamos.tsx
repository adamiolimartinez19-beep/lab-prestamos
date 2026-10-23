import type { Prestamo, Equipo } from '../types';

interface TablaPrestamosProps {
  prestamos: Prestamo[];
  equipos: Equipo[];
  onDevolver: (prestamoId: number, equipoId: number) => void;
  loadingId: number | null;
}

export const TablaPrestamos = ({ prestamos, equipos, onDevolver, loadingId }: TablaPrestamosProps) => {
  const hoy = new Date();

  return (
    <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem', borderColor: '#cbd5e1' }}>
      <thead>
        <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b' }}>
          <th>Equipo</th>
          <th>Solicitante</th>
          <th>Carné</th>
          <th>Curso</th>
          <th>Fecha Límite</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {prestamos.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', color: '#64748b' }}>No hay préstamos activos</td>
          </tr>
        ) : (
          prestamos.map((p) => {
            const equipo = equipos.find((e) => e.id === p.equipoId);
            const esVencido = new Date(p.fechaLimite) < hoy && !p.devuelto;

            return (
              <tr key={p.id} style={{ backgroundColor: esVencido ? '#fee2e2' : 'transparent', color: esVencido ? '#991b1b' : 'inherit' }}>
                <td>{equipo ? equipo.nombre : `Equipo #${p.equipoId}`}</td>
                <td>{p.solicitante}</td>
                <td>{p.carne}</td>
                <td>{p.curso || 'N/A'}</td>
                <td>
                  {new Date(p.fechaLimite).toLocaleDateString()} 
                  {esVencido && <strong style={{ color: '#dc2626', marginLeft: '6px' }}>(Vencido)</strong>}
                </td>
                <td>
                  <button 
                    onClick={() => onDevolver(p.id, p.equipoId)} 
                    disabled={loadingId === p.id}
                    style={{ padding: '4px 8px', cursor: 'pointer' }}
                  >
                    {loadingId === p.id ? 'Devolviendo...' : 'Devolver'}
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};