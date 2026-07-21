import type { IReaccionRepository } from '../../gateway/repositories/IReaccionRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { Reaccion } from '../../../domain/entities/Reaccion';
import { NotFoundException } from '../../exceptions/AppException';
import { v4 as uuidv4 } from 'uuid';

export interface ToggleReaccionResult {
  accion: 'agregado' | 'eliminado';
  experienciaId: string;
  totalReacciones: number;
}

export class ToggleReaccionUseCase {
  constructor(
    private readonly reaccionRepo: IReaccionRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(usuarioId: string, experienciaId: string): Promise<ToggleReaccionResult> {
    const experiencia = await this.experienciaRepo.findById(experienciaId);
    if (!experiencia) throw new NotFoundException('Experiencia');

    const existing = await this.reaccionRepo.findByUsuarioAndExperiencia(usuarioId, experienciaId);

    if (existing) {
      await this.reaccionRepo.delete(existing.getId());
      const total = await this.reaccionRepo.countByExperienciaId(experienciaId);
      return { accion: 'eliminado', experienciaId, totalReacciones: total };
    }

    const reaccion = new Reaccion(uuidv4(), usuarioId, experienciaId);
    await this.reaccionRepo.save(reaccion);
    const total = await this.reaccionRepo.countByExperienciaId(experienciaId);
    return { accion: 'agregado', experienciaId, totalReacciones: total };
  }
}
