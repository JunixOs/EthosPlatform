import type { IExperienciaRepository, PaginatedResult } from '../../../gateway/repositories/IExperienciaRepository';
import { ValidationException } from '../../../exceptions/AppException';
import type { Experiencia } from '../../../../domain/entities/Experiencia';

export class BuscarExperienciasUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(q: string, page: number, limit: number): Promise<PaginatedResult<Experiencia>> {
    if (!q.trim()) throw new ValidationException('El término de búsqueda no puede estar vacío.');
    return this.experienciaRepo.search({ q: q.trim(), page, limit });
  }
}
