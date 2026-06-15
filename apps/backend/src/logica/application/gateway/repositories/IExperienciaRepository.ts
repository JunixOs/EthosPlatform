import type { Experiencia } from '../../../domain/entities/Experiencia';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type SortOrder = 'date' | 'popularity';

export interface SearchExperienciasOptions {
  q: string;
  page: number;
  limit: number;
}

export interface IExperienciaRepository {
  findById(id: string): Promise<Experiencia | null>;
  findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<PaginatedResult<Experiencia>>;
  findPublicadas(page: number, limit: number, sort?: SortOrder): Promise<PaginatedResult<Experiencia>>;
  search(options: SearchExperienciasOptions): Promise<PaginatedResult<Experiencia>>;
  findRelacionadasPorAutor(experienciaId: string, usuarioId: string, limit: number): Promise<Experiencia[]>;
  findRelacionadas(experienciaId: string, limit: number): Promise<Experiencia[]>;
  save(experiencia: Experiencia): Promise<void>;
  update(experiencia: Experiencia): Promise<void>;
  delete(id: string): Promise<void>;
  countByUsuarioId(usuarioId: string): Promise<number>;
}
