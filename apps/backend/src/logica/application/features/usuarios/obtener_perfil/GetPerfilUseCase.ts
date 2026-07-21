import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import type { IFavoritoRepository } from '../../../gateway/repositories/IFavoritoRepository';
import { NotFoundException, ForbiddenException } from '../../../exceptions/AppException';

export interface PerfilPublicoResult {
  id: string;
  nombre: string;
  biografia: string | null;
  fotoPerfil: string | null;
  perfilPublico: boolean;
  rol: string;
  creadoEn: Date;
  estadisticas: {
    totalExperiencias: number;
    totalFavoritos: number;
    miembroDesde: number;
  };
}

export class GetPerfilUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly experienciaRepo: IExperienciaRepository,
    private readonly favoritoRepo: IFavoritoRepository,
  ) {}

  async execute(targetId: string, requesterId?: string): Promise<PerfilPublicoResult> {
    const usuario = await this.usuarioRepo.findById(targetId);
    if (!usuario) throw new NotFoundException('Usuario');

    if (!usuario.isPerfilPublico() && requesterId !== targetId) {
      throw new ForbiddenException('Este perfil es privado.');
    }

    const [totalExperiencias, favoritosInfo] = await Promise.all([
      this.experienciaRepo.countByUsuarioId(targetId),
      this.favoritoRepo.findByUsuarioId(targetId, 1, 1),
    ]);

    return {
      id: usuario.getId(),
      nombre: usuario.getNombre(),
      biografia: usuario.getBiografia(),
      fotoPerfil: usuario.getFotoPerfil(),
      perfilPublico: usuario.isPerfilPublico(),
      rol: usuario.getRol(),
      creadoEn: usuario.getCreadoEn(),
      estadisticas: {
        totalExperiencias,
        totalFavoritos: favoritosInfo.total,
        miembroDesde: usuario.getCreadoEn().getFullYear()
      },
    };
  }
}
