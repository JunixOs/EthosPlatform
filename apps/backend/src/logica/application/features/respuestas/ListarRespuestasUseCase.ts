import type { IRespuestaRepository, PaginatedRespuestasResult } from '../../gateway/repositories/IRespuestaRepository';

export class ListarRespuestasUseCase {
  constructor(private readonly respuestaRepo: IRespuestaRepository) {}

  async execute(experienciaId: string, page: number, limit: number): Promise<PaginatedRespuestasResult> {
    return this.respuestaRepo.findByExperienciaId(experienciaId, page, limit);
  }
}
