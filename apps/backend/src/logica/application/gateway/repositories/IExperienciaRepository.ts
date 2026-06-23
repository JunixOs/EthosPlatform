import type { Experiencia } from '../../../domain/entities/Experiencia';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IExperienciaRepository {
  findById(id: string): Promise<Experiencia | null>;
  findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<PaginatedResult<Experiencia>>;
  findPublicadas(page: number, limit: number): Promise<PaginatedResult<Experiencia>>;
  save(experiencia: Experiencia): Promise<void>;
  update(experiencia: Experiencia): Promise<void>;
  delete(id: string): Promise<void>;
}
