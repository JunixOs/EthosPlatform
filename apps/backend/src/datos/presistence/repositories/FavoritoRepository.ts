import type { DataSource, Repository } from 'typeorm';
import type { IFavoritoRepository } from '../../../logica/application/gateway/repositories/IFavoritoRepository';
import { Favorito } from '../../../logica/domain/entities/Favorito';
import { FavoritoORM } from '../entities/FavoritoORM';

export class FavoritoRepository implements IFavoritoRepository {
  private readonly repo: Repository<FavoritoORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(FavoritoORM);
  }

  async findByUsuarioAndExperiencia(usuarioId: string, experienciaId: string): Promise<Favorito | null> {
    const orm = await this.repo.findOneBy({ usuarioId, experienciaId });
    return orm ? new Favorito(orm.usuarioId, orm.experienciaId, orm.guardadoEn) : null;
  }

  async findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<{ data: Favorito[]; total: number }> {
    const [orms, total] = await this.repo.findAndCount({
      where: { usuarioId },
      order: { guardadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    const data = orms.map((o) => new Favorito(o.usuarioId, o.experienciaId, o.guardadoEn));
    return { data, total };
  }

  async save(favorito: Favorito): Promise<void> {
    await this.repo.save({
      usuarioId: favorito.getUsuarioId(),
      experienciaId: favorito.getExperienciaId(),
    });
  }

  async delete(usuarioId: string, experienciaId: string): Promise<void> {
    await this.repo.delete({ usuarioId, experienciaId });
  }

  async countByExperienciaId(experienciaId: string): Promise<number> {
    return this.repo.count({ where: { experienciaId } });
  }
}
