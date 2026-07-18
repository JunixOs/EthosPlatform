import type { IExperienciaRepository, PaginatedResult } from '../../../gateway/repositories/IExperienciaRepository';
import type { Experiencia } from '../../../../domain/entities/Experiencia';

export interface ListExperienciasPorUsuarioQuery {
  usuarioId: string;
  page?: number;
  limit?: number;
}

export class ListExperienciasPorUsuarioUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(query: ListExperienciasPorUsuarioQuery): Promise<PaginatedResult<Experiencia>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    return this.experienciaRepo.findByUsuarioId(query.usuarioId, page, limit);
  }
}
