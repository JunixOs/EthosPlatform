import type { DataSource, Repository } from 'typeorm';
import type { IPaginaEquipoRepository } from '../../../logica/application/gateway/repositories/IPaginaEquipoRepository';
import type { PaginaEquipo } from '../../../logica/domain/entities/PaginaEquipo';
import { PaginaEquipoORM } from '../entities/PaginaEquipoORM';
import { PaginaEquipoMapper } from '../mappers/PaginaEquipoMapper';

export class PaginaEquipoRepository implements IPaginaEquipoRepository {
  private readonly repo: Repository<PaginaEquipoORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(PaginaEquipoORM);
  }

  async find(): Promise<PaginaEquipo | null> {
    const orm = await this.repo.findOne({ where: {} });
    return orm ? PaginaEquipoMapper.toDomain(orm) : null;
  }

  async save(pagina: PaginaEquipo): Promise<void> {
    await this.repo.save(PaginaEquipoMapper.toORM(pagina));
  }
}
