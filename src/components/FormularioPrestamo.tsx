import { useState, type FormEvent } from 'react';
import type { Equipo } from '../types';

interface FormularioPrestamoProps {
  equipo: Equipo;
  onGuardar: (datos: { solicitante: string; carne: string; fechaLimite: string; curso?: string }) => void;
  onCancelar: () => void;
  loading: boolean;
}

export const FormularioPrestamo = ({ equipo, onGuardar, onCancelar, loading }: FormularioPrestamoProps) => {
  const [solicitante, setSolicitante] = useState('');
  const [carne, setCarne] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [curso, setCurso] = useState('');
  
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validar = (): boolean => {
    const nuevosErrores: Record<string, string> = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // 1. Solicitante obligatorio y >= 5 caracteres
    if (!solicitante.trim() || solicitante.trim().length < 5) {
      nuevosErrores.solicitante = 'El solicitante es obligatorio y debe tener al menos 5 caracteres.';
    }

    // 2. Carné con formato 0000-00-00000
    const regexCarne = /^\d{4}-\d{2}-\d{5}$/;
    if (!regexCarne.test(carne)) {
      nuevosErrores.carne = 'El carné debe tener el formato exacto 0000-00-00000.';
    }

    // 3. Fecha límite entre hoy y máximo 7 días (Regla de tu variante)
    if (!fechaLimite) {
      nuevosErrores.fechaLimite = 'Debe seleccionar una fecha límite.';
    } else {
      const fechaSeleccionada = new Date(fechaLimite);
      const maxFecha = new Date();
      maxFecha.setDate(hoy.getDate() + 7);

      if (fechaSeleccionada < hoy) {
        nuevosErrores.fechaLimite = 'La fecha límite no puede ser anterior a hoy.';
      } else if (fechaSeleccionada > maxFecha) {
        nuevosErrores.fechaLimite = 'Para tu variante, el préstamo no puede superar los 7 días.';
      }
    }

    // 4. Regla Adicional de tu variante: Si es Arduino, exige el campo "Curso"
    if (equipo.categoria === 'Arduino' && !curso.trim()) {
      nuevosErrores.curso = 'Para equipos Arduino es obligatorio especificar el Curso.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validar()) {
      onGuardar({
        solicitante,
        carne,
        fechaLimite: new Date(fechaLimite).toISOString(),
        curso: equipo.categoria === 'Arduino' ? curso : undefined,
      });
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '380px', color: '#1e293b' }}>
        <h2 style={{ marginTop: 0 }}>Prestar: {equipo.nombre}</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Solicitante:</label>
          <input type="text" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
          {errores.solicitante && <p style={{ color: 'red', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errores.solicitante}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Carné (Ej: 0902-23-19820):</label>
          <input type="text" value={carne} onChange={(e) => setCarne(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
          {errores.carne && <p style={{ color: 'red', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errores.carne}</p>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Fecha Límite (Máx. 7 días):</label>
          <input type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
          {errores.fechaLimite && <p style={{ color: 'red', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errores.fechaLimite}</p>}
        </div>

        {/* Campo condicional para variante Arduino */}
        {equipo.categoria === 'Arduino' && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Curso (Requerido para Arduino):</label>
            <input type="text" value={curso} onChange={(e) => setCurso(e.target.value)} style={{ width: '100%', padding: '6px', boxSizing: 'border-box' }} />
            {errores.curso && <p style={{ color: 'red', fontSize: '0.8rem', margin: '4px 0 0 0' }}>{errores.curso}</p>}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>{loading ? 'Guardando...' : 'Confirmar Préstamo'}</button>
          <button type="button" onClick={onCancelar} disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};