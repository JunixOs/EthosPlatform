import { api } from '../../../shared/services/api';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.types';
import type { Experiencia, CreateExperienciaDTO, UpdateExperienciaDTO } from '@features/experiencias/types/experiencia.types';

export interface ListarOptions {
  page?: number;
  limit?: number;
  usuarioId?: string;
  sort?: 'date' | 'popularity';
}

export const experienciasService = {
  async listar(opts: ListarOptions = {}): Promise<PaginatedResponse<Experiencia>> {
    const { page = 1, limit = 10, usuarioId, sort } = opts;
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (usuarioId) params.set('usuarioId', usuarioId);
    if (sort) params.set('sort', sort);
    return api.get<PaginatedResponse<Experiencia>>(`/experiencias?${params.toString()}`);
  },

  /** @deprecated usar listar() */
  async list(page = 1, limit = 10): Promise<PaginatedResponse<Experiencia>> {
    return this.listar({ page, limit });
  },

  /** @deprecated usar listar() */
  async listMias(usuarioId: string, page = 1): Promise<PaginatedResponse<Experiencia>> {
    return this.listar({ page, limit: 10, usuarioId });
  },

  async buscar(q: string, page = 1, limit = 20): Promise<PaginatedResponse<Experiencia>> {
    const params = new URLSearchParams({ q, page: String(page), limit: String(limit) });
    return api.get<PaginatedResponse<Experiencia>>(`/experiencias/buscar?${params.toString()}`);
  },

  async getById(id: string): Promise<Experiencia> {
    const res = await api.get<ApiResponse<Experiencia>>(`/experiencias/${id}`);
    return res.data;
  },

  async getRelacionadas(id: string): Promise<Experiencia[]> {
    const res = await api.get<ApiResponse<Experiencia[]>>(`/experiencias/${id}/relacionadas`);
    return res.data;
  },

  async getRelacionadasAutor(id: string): Promise<Experiencia[]> {
    const res = await api.get<ApiResponse<Experiencia[]>>(`/experiencias/${id}/relacionadas-autor`);
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
