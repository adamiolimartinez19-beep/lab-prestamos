import { useState, useEffect, useCallback } from 'react';
import type { Equipo } from '../types';
import { api } from '../services/api';

export const useEquipos = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEquipos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEquipos();
      setEquipos(data);
    } catch (err) {
      setError((err as Error).message || 'Error al conectar con la API de inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  return { equipos, setEquipos, loading, error, refetch: cargarEquipos };
};