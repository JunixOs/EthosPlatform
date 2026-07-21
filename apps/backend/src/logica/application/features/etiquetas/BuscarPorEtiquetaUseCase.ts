import type { IEtiquetaRepository } from '../../gateway/repositories/IEtiquetaRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { NotFoundException } from '../../exceptions/AppException';
import type { Experiencia } from '../../../domain/entities/Experiencia';

export interface BuscarPorEtiquetaResult {
  data: Experiencia[];
  total: number;
  page: number;
  limit: number;
}

export class BuscarPorEtiquetaUseCase {
  constructor(
    private readonly etiquetaRepo: IEtiquetaRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(slug: string, page: number, limit: number): Promise<BuscarPorEtiquetaResult> {
    const etiqueta = await this.etiquetaRepo.findBySlug(slug);
    if (!etiqueta) throw new NotFoundException('Etiqueta');

    const { experienciaIds, total } = await this.etiquetaRepo.findExperienciasByEtiquetaId(etiqueta.getId(), page, limit);
    const experiencias = await Promise.all(experienciaIds.map((id) => this.experienciaRepo.findById(id)));
    const data = experiencias.filter((e): e is Experiencia => e !== null && e.isPublicada());

    return { data, total, page, limit };
  }
}
