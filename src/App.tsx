import { useState, useEffect } from 'react';
import { useEquipos } from './hooks/useEquipos';
import { Encabezado } from './components/Encabezado';
import { ListaEquipos } from './components/ListaEquipos';
import { FormularioPrestamo } from './components/FormularioPrestamo';
import { TablaPrestamos } from './components/TablaPrestamos';
import type { Equipo, Prestamo } from './types';
import { api } from './services/api';

export function App() {
  const { equipos, setEquipos, loading: loadingEquipos, error: errorEquipos, refetch } = useEquipos();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipoASeleccionar, setEquipoASeleccionar] = useState<Equipo | null>(null);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [devolviendoId, setDevolviendoId] = useState<number | null>(null);

  // Cargar préstamos activos al iniciar la app
  useEffect(() => {
    api.getPrestamosActivos().then(setPrestamos).catch(() => {});
  }, []);

  // Manejador para registrar préstamo
  const handleGuardarPrestamo = async (datos: { solicitante: string; carne: string; fechaLimite: string; curso?: string }) => {
    if (!equipoASeleccionar) return;
    setSubmitting(true);

    try {
      const nuevoPrestamo: Omit<Prestamo, 'id'> = {
        equipoId: equipoASeleccionar.id,
        solicitante: datos.solicitante,
        carne: datos.carne,
        fechaPrestamo: new Date().toISOString(),
        fechaLimite: datos.fechaLimite,
        devuelto: false,
        curso: datos.curso,
      };

      const prestamoCreado = await api.crearPrestamo(nuevoPrestamo);
      await api.actualizarEstadoEquipo(equipoASeleccionar.id, false);

      // Actualización inmutable del estado
      setPrestamos((prev) => [...prev, prestamoCreado]);
      setEquipos((prev) => prev.map((e) => (e.id === equipoASeleccionar.id ? { ...e, disponible: false } : e)));
      setEquipoASeleccionar(null);
    } catch (err) {
      alert('Error al guardar el préstamo. Verifique que la API esté encendida.');
    } finally {
      setSubmitting(false);
    }
  };

  // Manejador para devolver préstamo
  const handleDevolver = async (prestamoId: number, equipoId: number) => {
    setDevolviendoId(prestamoId);
    try {
      await api.marcarPrestamoDevuelto(prestamoId);
      await api.actualizarEstadoEquipo(equipoId, true);

      setPrestamos((prev) => prev.filter((p) => p.id !== prestamoId));
      setEquipos((prev) => prev.map((e) => (e.id === equipoId ? { ...e, disponible: true } : e)));
    } catch (err) {
      alert('Error al procesar la devolución.');
    } finally {
      setDevolviendoId(null);
    }
  };

  // Filtros combinados (búsqueda por nombre + filtro por categoría)
  const equiposFiltrados = equipos.filter((e) => {
    const coincideNombre = e.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = categoriaFiltro ? e.categoria === categoriaFiltro : true;
    return coincideNombre && coincideCat;
  });

  const disponiblesCount = equipos.filter((e) => e.disponible).length;

  if (loadingEquipos) {
    return <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Cargando inventario del laboratorio...</div>;
  }

  if (errorEquipos) {
    return (
      <div style={{ padding: '2rem', color: '#991b1b', fontFamily: 'sans-serif' }}>
        <h2>Error al conectar con la API</h2>
        <p>{errorEquipos}</p>
        <button onClick={refetch} style={{ padding: '8px 16px', cursor: 'pointer' }}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      <Encabezado totalEquipos={equipos.length} disponiblesCount={disponiblesCount} />

      <main>
        <h2>Inventario de Equipos</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />
          <select 
            value={categoriaFiltro} 
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            style={{ padding: '8px' }}
          >
            <option value="">Todas las categorías</option>
            <option value="Raspberry Pi">Raspberry Pi</option>
            <option value="Arduino">Arduino</option>
            <option value="Sensor">Sensor</option>
          </select>
        </div>

        <ListaEquipos equipos={equiposFiltrados} onPrestar={(equipo) => setEquipoASeleccionar(equipo)} />

        <h2 style={{ marginTop: '2.5rem' }}>Préstamos Activos</h2>
        <TablaPrestamos prestamos={prestamos} equipos={equipos} onDevolver={handleDevolver} loadingId={devolviendoId} />

        {equipoASeleccionar && (
          <FormularioPrestamo
            equipo={equipoASeleccionar}
            onGuardar={handleGuardarPrestamo}
            onCancelar={() => setEquipoASeleccionar(null)}
            loading={submitting}
          />
        )}
      </main>
    </div>
  );
}

export default App;