import type { Equipo } from '../types';

interface TarjetaEquipoProps {
  equipo: Equipo;
  onPrestar: (equipo: Equipo) => void;
}

export const TarjetaEquipo = ({ equipo, onPrestar }: TarjetaEquipoProps) => {
  return (
    <div style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', width: '240px', backgroundColor: '#f8fafc' }}>
      <h3>{equipo.nombre}</h3>
      <p>Categoría: <strong>{equipo.categoria}</strong></p>
      <div style={{ margin: '0.5rem 0' }}>
        <span style={{
          backgroundColor: equipo.disponible ? '#22c55e' : '#ef4444',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.85rem'
        }}>
          {equipo.disponible ? 'Disponible' : 'Prestado'}
        </span>
      </div>
      <button 
        disabled={!equipo.disponible}
        onClick={() => onPrestar(equipo)}
        style={{
          marginTop: '0.5rem',
          padding: '6px 12px',
          cursor: equipo.disponible ? 'pointer' : 'not-allowed',
          width: '100%'
        }}
      >
        Prestar
      </button>
    </div>
  );
};