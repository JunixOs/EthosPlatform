import type { Reporte } from '../../../domain/entities/Reporte';

export interface PaginatedReportesResult {
  data: Reporte[];
  total: number;
  page: number;
  limit: number;
}

export interface IReporteRepository {
  findById(id: string): Promise<Reporte | null>;
  findByExperienciaId(experienciaId: string): Promise<Reporte[]>;
  findByReporterId(reporterId: string): Promise<Reporte[]>;
  findPendientes(page: number, limit: number): Promise<PaginatedReportesResult>;
  save(reporte: Reporte): Promise<void>;
  update(reporte: Reporte): Promise<void>;
  existeReporteDeUsuario(reporterId: string, experienciaId: string): Promise<boolean>;
}
