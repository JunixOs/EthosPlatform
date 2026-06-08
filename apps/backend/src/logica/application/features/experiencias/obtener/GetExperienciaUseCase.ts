import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { NotFoundException } from '../../../exceptions/AppException';
import type { Experiencia } from '../../../../domain/entities/Experiencia';

export class GetExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(id: string): Promise<Experiencia> {
    const experiencia = await this.experienciaRepo.findById(id);
    if (!experiencia) throw new NotFoundException('Experiencia');
    return experiencia;
  }
}
