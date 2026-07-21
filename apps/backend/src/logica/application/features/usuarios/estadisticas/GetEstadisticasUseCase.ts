import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import type { IFavoritoRepository } from '../../../gateway/repositories/IFavoritoRepository';
import { NotFoundException } from '../../../exceptions/AppException';

export interface EstadisticasResult {
  usuarioId: string;
  totalExperiencias: number;
  totalFavoritos: number;
  miembroDesde: Date;
}

export class GetEstadisticasUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly experienciaRepo: IExperienciaRepository,
    private readonly favoritoRepo: IFavoritoRepository,
  ) {}

  async execute(usuarioId: string): Promise<EstadisticasResult> {
    const usuario = await this.usuarioRepo.findById(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario');

    const [totalExperiencias, favoritosInfo] = await Promise.all([
      this.experienciaRepo.countByUsuarioId(usuarioId),
      this.favoritoRepo.findByUsuarioId(usuarioId, 1, 1),
    ]);

    return {
      usuarioId,
      totalExperiencias,
      totalFavoritos: favoritosInfo.total,
      miembroDesde: usuario.getCreadoEn(),
    };
  }
}
