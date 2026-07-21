import type { DataSource, Repository } from 'typeorm';
import type { IAuditoriaRepository, PaginatedAuditoriaResult } from '../../../logica/application/gateway/repositories/IAuditoriaRepository';
import type { Auditoria } from '../../../logica/domain/entities/Auditoria';
import { AuditoriaORM } from '../entities/AuditoriaORM';
import { AuditoriaMapper } from '../mappers/AuditoriaMapper';

export class AuditoriaRepository implements IAuditoriaRepository {
  private readonly repo: Repository<AuditoriaORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(AuditoriaORM);
  }

  async save(auditoria: Auditoria): Promise<void> {
    await this.repo.save(AuditoriaMapper.toORM(auditoria));
  }

  async findAll(page: number, limit: number): Promise<PaginatedAuditoriaResult> {
    const [orms, total] = await this.repo.findAndCount({
      order: { creadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(AuditoriaMapper.toDomain), total, page, limit };
  }

  async findByAdminId(adminId: string, page: number, limit: number): Promise<PaginatedAuditoriaResult> {
    const [orms, total] = await this.repo.findAndCount({
      where: { adminId },
      order: { creadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(AuditoriaMapper.toDomain), total, page, limit };
  }

  async findByEntidad(entidad: string, entidadId: string): Promise<Auditoria[]> {
    const orms = await this.repo.find({
      where: { entidad, entidadId },
      order: { creadoEn: 'DESC' },
    });
    return orms.map(AuditoriaMapper.toDomain);
  }
}
