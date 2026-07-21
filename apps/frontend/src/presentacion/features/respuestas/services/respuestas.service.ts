import { api } from '@shared/services/api';

export interface Respuesta {
  id: string;
  experienciaId: string;
  usuarioId: string;
  contenido: string;
  creadaEn: string;
}

export const respuestasService = {
  async listar(experienciaId: string, page = 1, limit = 10): Promise<{ data: Respuesta[]; total: number; page: number; limit: number }> {
    const res = await api.get<{ data: Respuesta[]; total: number; page: number; limit: number }>(
      `/experiencias/${experienciaId}/respuestas?page=${page}&limit=${limit}`
    );
    return res;
  },

  async crear(experienciaId: string, contenido: string): Promise<Respuesta> {
    const res = await api.post<{ data: Respuesta }>(`/experiencias/${experienciaId}/respuestas`, { contenido });
    return res.data;
  },

  async eliminar(respuestaId: string): Promise<void> {
    await api.delete(`/respuestas/${respuestaId}`);
  },
};
