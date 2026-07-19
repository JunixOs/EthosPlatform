import { api } from '@shared/services/api';

export interface MiembroEquipo {
  nombre: string;
  rol: string;
  fotoUrl?: string;
  bio?: string;
}

export interface PaginaEquipo {
  id: string;
  titulo: string;
  contenido: string;
  miembros: MiembroEquipo[];
  actualizadoEn: string;
}

export const paginaEquipoService = {
  async obtener(): Promise<PaginaEquipo> {
    const res = await api.get<{ data: PaginaEquipo }>('/pagina-equipo');
    return res.data;
  },

  async editar(data: { titulo: string; contenido: string; miembros: MiembroEquipo[] }): Promise<void> {
    await api.put('/admin/pagina-equipo', data);
  },
};
