import type { DataSource, Repository } from 'typeorm';
import type { ISesionRepository } from '../../../logica/application/gateway/repositories/ISesionRepository';
import type { Sesion } from '../../../logica/domain/entities/Sesion';
import { SesionORM } from '../entities/SesionORM';
import { SesionMapper } from '../mappers/SesionMapper';

export class SesionRepository implements ISesionRepository {
  private readonly repo: Repository<SesionORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(SesionORM);
  }

  async findByToken(token: string): Promise<Sesion | null> {
    const orm = await this.repo.findOneBy({ token });
    return orm ? SesionMapper.toDomain(orm) : null;
  }

  async findActiveByUsuarioId(usuarioId: string): Promise<Sesion[]> {
    const orms = await this.repo
      .createQueryBuilder('s')
      .where('s.usuarioId = :usuarioId', { usuarioId })
      .andWhere('s.expiraEn > NOW()')
      .getMany();
    return orms.map(SesionMapper.toDomain);
  }

  async save(sesion: Sesion): Promise<void> {
    const data = SesionMapper.toORM(sesion);
    await this.repo.save(data);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repo.delete({ token });
  }

  async deleteAllByUsuarioId(usuarioId: string): Promise<void> {
    await this.repo.delete({ usuarioId });
  }
}
