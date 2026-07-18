import type { Respuesta } from '../../../domain/entities/Respuesta';

export interface PaginatedRespuestasResult {
  data: Respuesta[];
  total: number;
  page: number;
  limit: number;
}

export interface IRespuestaRepository {
  findById(id: string): Promise<Respuesta | null>;
  findByExperienciaId(experienciaId: string, page: number, limit: number): Promise<PaginatedRespuestasResult>;
  findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<PaginatedRespuestasResult>;
  save(respuesta: Respuesta): Promise<void>;
  update(respuesta: Respuesta): Promise<void>;
  delete(id: string): Promise<void>;
  countByExperienciaId(experienciaId: string): Promise<number>;
}
