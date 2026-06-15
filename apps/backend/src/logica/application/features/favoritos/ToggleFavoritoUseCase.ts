import type { IFavoritoRepository } from '../../gateway/repositories/IFavoritoRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { Favorito } from '../../../domain/entities/Favorito';
import { NotFoundException } from '../../exceptions/AppException';

export interface ToggleFavoritoResult {
  accion: 'agregado' | 'eliminado';
  experienciaId: string;
}

export class ToggleFavoritoUseCase {
  constructor(
    private readonly favoritoRepo: IFavoritoRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(usuarioId: string, experienciaId: string): Promise<ToggleFavoritoResult> {
    const experiencia = await this.experienciaRepo.findById(experienciaId);
    if (!experiencia) throw new NotFoundException('Experiencia');

    const existing = await this.favoritoRepo.findByUsuarioAndExperiencia(usuarioId, experienciaId);

    if (existing) {
      await this.favoritoRepo.delete(usuarioId, experienciaId);
      return { accion: 'eliminado', experienciaId };
    }

    await this.favoritoRepo.save(new Favorito(usuarioId, experienciaId));
    return { accion: 'agregado', experienciaId };
  }
}
