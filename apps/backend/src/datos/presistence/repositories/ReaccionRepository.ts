import type { DataSource, Repository } from 'typeorm';
import type { IReaccionRepository } from '../../../logica/application/gateway/repositories/IReaccionRepository';
import { Reaccion } from '../../../logica/domain/entities/Reaccion';
import { ReaccionORM } from '../entities/ReaccionORM';

export class ReaccionRepository implements IReaccionRepository {
  private readonly repo: Repository<ReaccionORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ReaccionORM);
  }

  async findByUsuarioAndExperiencia(usuarioId: string, experienciaId: string): Promise<Reaccion | null> {
    const orm = await this.repo.findOneBy({ usuarioId, experienciaId });
    return orm ? new Reaccion(orm.id, orm.usuarioId, orm.experienciaId, orm.creadaEn) : null;
  }

  async countByExperienciaId(experienciaId: string): Promise<number> {
    return this.repo.count({ where: { experienciaId } });
  }

  async save(reaccion: Reaccion): Promise<void> {
    await this.repo.save({
      id: reaccion.getId(),
      usuarioId: reaccion.getUsuarioId(),
      experienciaId: reaccion.getExperienciaId(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
