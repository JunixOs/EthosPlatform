import type { Favorito } from '../../../domain/entities/Favorito';

export interface IFavoritoRepository {
  findByUsuarioAndExperiencia(usuarioId: string, experienciaId: string): Promise<Favorito | null>;
  findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<{ data: Favorito[]; total: number }>;
  save(favorito: Favorito): Promise<void>;
  delete(usuarioId: string, experienciaId: string): Promise<void>;
  countByExperienciaId(experienciaId: string): Promise<number>;
}
