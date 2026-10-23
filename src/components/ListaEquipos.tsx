import type { Equipo } from '../types';
import { TarjetaEquipo } from './TarjetaEquipo';

interface ListaEquiposProps {
  equipos: Equipo[];
  onPrestar: (equipo: Equipo) => void;
}

export const ListaEquipos = ({ equipos, onPrestar }: ListaEquiposProps) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {equipos.map((equipo) => (
        <TarjetaEquipo key={equipo.id} equipo={equipo} onPrestar={onPrestar} />
      ))}
    </div>
  );
};