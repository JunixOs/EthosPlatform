import type { DataSource, Repository } from 'typeorm';
import type { IExperienciaRepository, PaginatedResult } from '../../../logica/application/gateway/repositories/IExperienciaRepository';
import type { Experiencia } from '../../../logica/domain/entities/Experiencia';
import { EstadoExperienciaEnum } from '../../../logica/domain/enum/index';
import { ExperienciaORM } from '../entities/ExperienciaORM';
import { ExperienciaMapper } from '../mappers/ExperienciaMapper';

export class ExperienciaRepository implements IExperienciaRepository {
  private readonly repo: Repository<ExperienciaORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ExperienciaORM);
  }

  async findById(id: string): Promise<Experiencia | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? ExperienciaMapper.toDomain(orm) : null;
  }

  async findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<PaginatedResult<Experiencia>> {
    const [orms, total] = await this.repo.findAndCount({
      where: { usuarioId },
      order: { creadaEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orms.map(ExperienciaMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async findPublicadas(page: number, limit: number): Promise<PaginatedResult<Experiencia>> {
    const [orms, total] = await this.repo.findAndCount({
      where: { estado: EstadoExperienciaEnum.PUBLICADA },
      order: { creadaEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orms.map(ExperienciaMapper.toDomain),
      total,
      page,
      limit,
    };
  }

  async save(experiencia: Experiencia): Promise<void> {
    const data = ExperienciaMapper.toORM(experiencia);
    await this.repo.save(data);
  }

  async update(experiencia: Experiencia): Promise<void> {
    const data = ExperienciaMapper.toORM(experiencia);
    await this.repo.save(data);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
