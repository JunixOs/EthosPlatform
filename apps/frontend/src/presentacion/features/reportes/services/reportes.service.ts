import { api } from '@shared/services/api';

export interface CrearReporteDTO {
  experienciaId: string;
  tipo: 'spam' | 'contenido_inapropiado' | 'acoso' | 'informacion_falsa' | 'otro';
  descripcion?: string;
}

export const reportesService = {
  async crear(data: CrearReporteDTO): Promise<{ id: string; estado: string }> {
    const res = await api.post<{ data: { id: string; estado: string } }>('/reportes', data);
    return res.data;
  },
};
