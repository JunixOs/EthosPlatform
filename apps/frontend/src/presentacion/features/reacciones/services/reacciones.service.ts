import { api } from '@shared/services/api';

export interface ToggleReaccionResult {
  accion: 'agregado' | 'eliminado';
  experienciaId: string;
  totalReacciones: number;
}

export interface ContarReaccionesResult {
  experienciaId: string;
  total: number;
  usuarioHaReaccionado: boolean;
}

export const reaccionesService = {
  async toggle(experienciaId: string): Promise<ToggleReaccionResult> {
    const res = await api.post<{ data: ToggleReaccionResult }>(`/experiencias/${experienciaId}/reacciones`);
    return res.data;
  },

  async contar(experienciaId: string): Promise<ContarReaccionesResult> {
    const res = await api.get<{ data: ContarReaccionesResult }>(`/experiencias/${experienciaId}/reacciones`);
    return res.data;
  },
};
