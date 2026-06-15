import type { IFavoritoRepository } from '../../gateway/repositories/IFavoritoRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import type { Experiencia } from '../../../domain/entities/Experiencia';

export interface ListarFavoritosResult {
  data: Experiencia[];
  total: number;
  page: number;
  limit: number;
}

export class ListarFavoritosUseCase {
  constructor(
    private readonly favoritoRepo: IFavoritoRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(usuarioId: string, page: number, limit: number): Promise<ListarFavoritosResult> {
    const { data: favoritos, total } = await this.favoritoRepo.findByUsuarioId(usuarioId, page, limit);

    const experiencias = await Promise.all(
      favoritos.map((f) => this.experienciaRepo.findById(f.getExperienciaId())),
    );

    const data = experiencias.filter((e): e is Experiencia => e !== null);
    return { data, total, page, limit };
  }
}
