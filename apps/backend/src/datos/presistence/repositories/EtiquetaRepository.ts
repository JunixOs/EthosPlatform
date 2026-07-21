import { In, type DataSource, type Repository } from 'typeorm';
import type { IEtiquetaRepository } from '../../../logica/application/gateway/repositories/IEtiquetaRepository';
import type { Etiqueta } from '../../../logica/domain/entities/Etiqueta';
import { EtiquetaORM } from '../entities/EtiquetaORM';
import { ExperienciaEtiquetaORM } from '../entities/ExperienciaEtiquetaORM';
import { EtiquetaMapper } from '../mappers/EtiquetaMapper';

export class EtiquetaRepository implements IEtiquetaRepository {
  private readonly repo: Repository<EtiquetaORM>;
  private readonly joinRepo: Repository<ExperienciaEtiquetaORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(EtiquetaORM);
    this.joinRepo = dataSource.getRepository(ExperienciaEtiquetaORM);
  }

  async findById(id: string): Promise<Etiqueta | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? EtiquetaMapper.toDomain(orm) : null;
  }

  async findBySlug(slug: string): Promise<Etiqueta | null> {
    const orm = await this.repo.findOneBy({ slug: slug.toLowerCase() });
    return orm ? EtiquetaMapper.toDomain(orm) : null;
  }

  async findByNombre(nombre: string): Promise<Etiqueta | null> {
    const orm = await this.repo.findOneBy({ nombre: nombre.toLowerCase() });
    return orm ? EtiquetaMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Etiqueta[]> {
    const orms = await this.repo.find({ order: { nombre: 'ASC' } });
    return orms.map(EtiquetaMapper.toDomain);
  }

  async findByExperienciaId(experienciaId: string): Promise<Etiqueta[]> {
    const joins = await this.joinRepo.find({ where: { experienciaId } });
    if (joins.length === 0) return [];
    const orms = await this.repo.findBy({ id: In(joins.map((j) => j.etiquetaId)) });
    return orms.map(EtiquetaMapper.toDomain);
  }

  async save(etiqueta: Etiqueta): Promise<void> {
    await this.repo.save(EtiquetaMapper.toORM(etiqueta));
  }

  async asociarAExperiencia(experienciaId: string, etiquetaId: string): Promise<void> {
    await this.joinRepo.save({ experienciaId, etiquetaId });
  }

  async desasociarDeExperiencia(experienciaId: string, etiquetaId: string): Promise<void> {
    await this.joinRepo.delete({ experienciaId, etiquetaId });
  }

  async findExperienciasByEtiquetaId(etiquetaId: string, page: number, limit: number): Promise<{ experienciaIds: string[]; total: number }> {
    const [joins, total] = await this.joinRepo.findAndCount({
      where: { etiquetaId },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { experienciaIds: joins.map((j) => j.experienciaId), total };
  }
}
