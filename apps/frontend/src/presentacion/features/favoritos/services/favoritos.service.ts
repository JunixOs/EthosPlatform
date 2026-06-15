import { api } from '../../../shared/services/api';
import type { Experiencia } from '../../experiencias/types/experiencia.types';

export const favoritosService = {
  async toggle(experienciaId: string): Promise<{ accion: 'agregado' | 'eliminado'; experienciaId: string }> {
    const res = await api.post<{ accion: 'agregado' | 'eliminado'; experienciaId: string }>(
      `/api/favoritos/${experienciaId}`,
    );
    return res.data;
  },

  async getMios(page = 1): Promise<{ data: Experiencia[]; total: number; page: number; limit: number }> {
    const res = await api.get<{ data: Experiencia[]; total: number; page: number; limit: number }>(
      `/api/favoritos/mios?page=${page}`,
    );
    return res.data;
  },
};
