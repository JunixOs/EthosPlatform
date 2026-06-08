import type { IExperienciaRepository, PaginatedResult } from '../../../gateway/repositories/IExperienciaRepository';
import type { Experiencia } from '../../../../domain/entities/Experiencia';

export interface ListExperienciasQuery {
  page?: number;
  limit?: number;
  usuarioId?: string;
}

export class ListExperienciasUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(query: ListExperienciasQuery): Promise<PaginatedResult<Experiencia>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if (query.usuarioId !== undefined) {
      return this.experienciaRepo.findByUsuarioId(query.usuarioId, page, limit);
    }

    return this.experienciaRepo.findPublicadas(page, limit);
  }
}
