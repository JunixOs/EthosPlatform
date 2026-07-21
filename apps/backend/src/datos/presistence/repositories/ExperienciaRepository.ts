import type { DataSource, Repository } from 'typeorm';
import type {
  IExperienciaRepository,
  PaginatedResult,
  SortOrder,
  SearchExperienciasOptions,
} from '../../../logica/application/gateway/repositories/IExperienciaRepository';
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
    return { data: orms.map(ExperienciaMapper.toDomain), total, page, limit };
  }

  async findPublicadas(page: number, limit: number, sort: SortOrder = 'date'): Promise<PaginatedResult<Experiencia>> {
    if (sort === 'popularity') {
      const raw = await this.repo
        .createQueryBuilder('e')
        .leftJoin('reacciones', 'r', 'r.experiencia_id = e.id')
        .where('e.estado = :estado', { estado: EstadoExperienciaEnum.PUBLICADA })
        .groupBy('e.id')
        .orderBy('COUNT(r.id)', 'DESC')
        .addOrderBy('e.creada_en', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return { data: raw[0].map(ExperienciaMapper.toDomain), total: raw[1], page, limit };
    }

    const [orms, total] = await this.repo.findAndCount({
      where: { estado: EstadoExperienciaEnum.PUBLICADA },
      order: { creadaEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(ExperienciaMapper.toDomain), total, page, limit };
  }

  async search(options: SearchExperienciasOptions): Promise<PaginatedResult<Experiencia>> {
    const { q, page, limit } = options;
    const term = `%${q}%`;

    const [orms, total] = await this.repo
      .createQueryBuilder('e')
      .where('e.estado = :estado', { estado: EstadoExperienciaEnum.PUBLICADA })
      .andWhere('(LOWER(e.titulo) LIKE LOWER(:term) OR LOWER(e.descripcion) LIKE LOWER(:term))', { term })
      .orderBy('e.creada_en', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data: orms.map(ExperienciaMapper.toDomain), total, page, limit };
  }

  async findRelacionadasPorAutor(experienciaId: string, usuarioId: string, limit: number): Promise<Experiencia[]> {
    const orms = await this.repo
      .createQueryBuilder('e')
      .where('e.usuarioId = :usuarioId', { usuarioId })
      .andWhere('e.id != :experienciaId', { experienciaId })
      .andWhere('e.estado = :estado', { estado: EstadoExperienciaEnum.PUBLICADA })
      .orderBy('e.creadaEn', 'DESC')
      .take(limit)
      .getMany();

    return orms.map(ExperienciaMapper.toDomain);
  }

  async findRelacionadas(experienciaId: string, limit: number): Promise<Experiencia[]> {
    const orms = await this.repo
      .createQueryBuilder('e')
      .where('e.id != :experienciaId', { experienciaId })
      .andWhere('e.estado = :estado', { estado: EstadoExperienciaEnum.PUBLICADA })
      .orderBy('e.creadaEn', 'DESC')
      .take(limit)
      .getMany();

    return orms.map(ExperienciaMapper.toDomain);
  }

  async save(experiencia: Experiencia): Promise<void> {
    await this.repo.save(ExperienciaMapper.toORM(experiencia));
  }

  async update(experiencia: Experiencia): Promise<void> {
    await this.repo.save(ExperienciaMapper.toORM(experiencia));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async countByUsuarioId(usuarioId: string): Promise<number> {
    return this.repo.count({ where: { usuarioId } });
  }
}
