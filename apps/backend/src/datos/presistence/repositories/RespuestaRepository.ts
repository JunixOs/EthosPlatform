import type { DataSource, Repository } from 'typeorm';
import type { IRespuestaRepository, PaginatedRespuestasResult } from '../../../logica/application/gateway/repositories/IRespuestaRepository';
import type { Respuesta } from '../../../logica/domain/entities/Respuesta';
import { RespuestaORM } from '../entities/RespuestaORM';
import { RespuestaMapper } from '../mappers/RespuestaMapper';

export class RespuestaRepository implements IRespuestaRepository {
  private readonly repo: Repository<RespuestaORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(RespuestaORM);
  }

  async findById(id: string): Promise<Respuesta | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? RespuestaMapper.toDomain(orm) : null;
  }

  async findByExperienciaId(experienciaId: string, page: number, limit: number): Promise<PaginatedRespuestasResult> {
    const [orms, total] = await this.repo.findAndCount({
      where: { experienciaId },
      order: { creadaEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(RespuestaMapper.toDomain), total, page, limit };
  }

  async findByUsuarioId(usuarioId: string, page: number, limit: number): Promise<PaginatedRespuestasResult> {
    const [orms, total] = await this.repo.findAndCount({
      where: { usuarioId },
      order: { creadaEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(RespuestaMapper.toDomain), total, page, limit };
  }

  async save(respuesta: Respuesta): Promise<void> {
    await this.repo.save(RespuestaMapper.toORM(respuesta));
  }

  async update(respuesta: Respuesta): Promise<void> {
    await this.repo.save(RespuestaMapper.toORM(respuesta));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async countByExperienciaId(experienciaId: string): Promise<number> {
    return this.repo.count({ where: { experienciaId } });
  }
}
