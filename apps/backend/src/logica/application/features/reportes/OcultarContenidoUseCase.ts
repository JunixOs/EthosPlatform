import type { IReporteRepository } from '../../gateway/repositories/IReporteRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { NotFoundException } from '../../exceptions/AppException';

export class OcultarContenidoUseCase {
  constructor(
    private readonly reporteRepo: IReporteRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(reporteId: string): Promise<void> {
    const reporte = await this.reporteRepo.findById(reporteId);
    if (!reporte) throw new NotFoundException('Reporte');

    const experiencia = await this.experienciaRepo.findById(reporte.getExperienciaId());
    if (!experiencia) throw new NotFoundException('Experiencia');

    experiencia.archivar();
    await this.experienciaRepo.update(experiencia);
    reporte.resolver();
    await this.reporteRepo.update(reporte);
  }
}
