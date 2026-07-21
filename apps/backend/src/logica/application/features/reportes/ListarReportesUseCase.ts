import type { IReporteRepository, PaginatedReportesResult } from '../../gateway/repositories/IReporteRepository';

export class ListarReportesUseCase {
  constructor(private readonly reporteRepo: IReporteRepository) {}

  async execute(page: number, limit: number): Promise<PaginatedReportesResult> {
    return this.reporteRepo.findPendientes(page, limit);
  }
}
