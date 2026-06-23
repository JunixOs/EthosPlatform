import { api } from '../../../shared/services/api';
import type { ApiResponse, PaginatedResponse } from '../../../shared/types/api.types';
import type { Experiencia, CreateExperienciaDTO, UpdateExperienciaDTO } from '../types/experiencia.types';

export const experienciasService = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<Experiencia>> {
    return api.get<PaginatedResponse<Experiencia>>(`/experiencias?page=${page}&limit=${limit}`);
  },

  async listMias(usuarioId: string, page = 1): Promise<PaginatedResponse<Experiencia>> {
    return api.get<PaginatedResponse<Experiencia>>(`/experiencias?usuarioId=${usuarioId}&page=${page}&limit=10`);
  },

  async getById(id: string): Promise<Experiencia> {
    const res = await api.get<ApiResponse<Experiencia>>(`/experiencias/${id}`);
    return res.data;
  },

  async create(data: CreateExperienciaDTO): Promise<{ id: string }> {
    const res = await api.post<ApiResponse<{ id: string }>>('/experiencias', data);
    return res.data;
  },

  async update(id: string, data: UpdateExperienciaDTO): Promise<void> {
    await api.put(`/experiencias/${id}`, data);
  },

  async publish(id: string): Promise<void> {
    await api.patch(`/experiencias/${id}/publicar`);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/experiencias/${id}`);
  },
};
