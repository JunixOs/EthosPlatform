import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { NotFoundException } from '../../../exceptions/AppException';
import type { Experiencia } from '../../../../domain/entities/Experiencia';

export class GetRelacionadasUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async ejecutarPorAutor(experienciaId: string): Promise<Experiencia[]> {
    const exp = await this.experienciaRepo.findById(experienciaId);
    if (!exp) throw new NotFoundException('Experiencia');
    return this.experienciaRepo.findRelacionadasPorAutor(experienciaId, exp.getUsuarioId(), 5);
  }

  async ejecutarRelacionadas(experienciaId: string): Promise<Experiencia[]> {
    const exp = await this.experienciaRepo.findById(experienciaId);
    if (!exp) throw new NotFoundException('Experiencia');
    return this.experienciaRepo.findRelacionadas(experienciaId, 5);
  }
}
