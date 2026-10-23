import type { Equipo, Prestamo } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(`Error en la solicitud: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const api = {
  getEquipos: async (): Promise<Equipo[]> => {
    const res = await fetch(`${API_URL}/equipos`);
    return handleResponse(res);
  },
  
  getPrestamosActivos: async (): Promise<Prestamo[]> => {
    const res = await fetch(`${API_URL}/prestamos?devuelto=false`);
    return handleResponse(res);
  },

  crearPrestamo: async (prestamo: Omit<Prestamo, 'id'>): Promise<Prestamo> => {
    const res = await fetch(`${API_URL}/prestamos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prestamo),
    });
    return handleResponse(res);
  },

  actualizarEstadoEquipo: async (equipoId: number, disponible: boolean): Promise<Equipo> => {
    const res = await fetch(`${API_URL}/equipos/${equipoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible }),
    });
    return handleResponse(res);
  },

  marcarPrestamoDevuelto: async (prestamoId: number): Promise<Prestamo> => {
    const res = await fetch(`${API_URL}/prestamos/${prestamoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devuelto: true }),
    });
    return handleResponse(res);
  }
};