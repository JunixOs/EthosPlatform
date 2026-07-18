import type { IReaccionRepository } from '../../gateway/repositories/IReaccionRepository';

export interface ContarReaccionesResult {
  experienciaId: string;
  total: number;
  usuarioHaReaccionado: boolean;
}

export class ContarReaccionesUseCase {
  constructor(private readonly reaccionRepo: IReaccionRepository) {}

  async execute(experienciaId: string, usuarioId?: string): Promise<ContarReaccionesResult> {
    const total = await this.reaccionRepo.countByExperienciaId(experienciaId);
    const usuarioHaReaccionado = usuarioId
      ? (await this.reaccionRepo.findByUsuarioAndExperiencia(usuarioId, experienciaId)) !== null
      : false;
    return { experienciaId, total, usuarioHaReaccionado };
  }
}
