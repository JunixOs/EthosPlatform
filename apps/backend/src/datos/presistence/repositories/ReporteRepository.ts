import type { DataSource, Repository } from 'typeorm';
import type { IReporteRepository, PaginatedReportesResult } from '../../../logica/application/gateway/repositories/IReporteRepository';
import type { Reporte } from '../../../logica/domain/entities/Reporte';
import { ReporteORM } from '../entities/ReporteORM';
import { ReporteMapper } from '../mappers/ReporteMapper';

export class ReporteRepository implements IReporteRepository {
  private readonly repo: Repository<ReporteORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(ReporteORM);
  }

  async findById(id: string): Promise<Reporte | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? ReporteMapper.toDomain(orm) : null;
  }

  async findByExperienciaId(experienciaId: string): Promise<Reporte[]> {
    const orms = await this.repo.find({ where: { experienciaId }, order: { creadoEn: 'DESC' } });
    return orms.map(ReporteMapper.toDomain);
  }

  async findByReporterId(reporterId: string): Promise<Reporte[]> {
    const orms = await this.repo.find({ where: { reporterId }, order: { creadoEn: 'DESC' } });
    return orms.map(ReporteMapper.toDomain);
  }

  async findPendientes(page: number, limit: number): Promise<PaginatedReportesResult> {
    const [orms, total] = await this.repo.findAndCount({
      where: { estado: 'pendiente' },
      order: { creadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(ReporteMapper.toDomain), total, page, limit };
  }

  async save(reporte: Reporte): Promise<void> {
    await this.repo.save(ReporteMapper.toORM(reporte));
  }

  async update(reporte: Reporte): Promise<void> {
    await this.repo.save(ReporteMapper.toORM(reporte));
  }

  async existeReporteDeUsuario(reporterId: string, experienciaId: string): Promise<boolean> {
    const count = await this.repo.count({ where: { reporterId, experienciaId } });
    return count > 0;
  }
}
