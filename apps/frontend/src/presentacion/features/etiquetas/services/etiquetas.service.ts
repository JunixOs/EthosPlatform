import { api } from '@shared/services/api';
import type { Experiencia } from '@features/experiencias/types/experiencia.types';

export interface Etiqueta {
  id: string;
  nombre: string;
  slug: string;
}

export const etiquetasService = {
  async listar(): Promise<Etiqueta[]> {
    const res = await api.get<{ data: Etiqueta[] }>('/etiquetas');
    return res.data;
  },

  async buscarPorEtiqueta(slug: string, page = 1, limit = 10): Promise<{ data: Experiencia[]; total: number; page: number; limit: number }> {
    const res = await api.get<{ data: Experiencia[]; total: number; page: number; limit: number }>(
      `/etiquetas/${slug}/experiencias?page=${page}&limit=${limit}`
    );
    return res;
  },

  async asociar(experienciaId: string, nombres: string[]): Promise<{ etiquetas: Etiqueta[] }> {
    const res = await api.put<{ data: { etiquetas: Etiqueta[] } }>(`/experiencias/${experienciaId}/etiquetas`, { nombres });
    return res.data;
  },
};
