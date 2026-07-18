import type { Auditoria } from '../../../domain/entities/Auditoria';

export interface PaginatedAuditoriaResult {
  data: Auditoria[];
  total: number;
  page: number;
  limit: number;
}

export interface IAuditoriaRepository {
  save(auditoria: Auditoria): Promise<void>;
  findAll(page: number, limit: number): Promise<PaginatedAuditoriaResult>;
  findByAdminId(adminId: string, page: number, limit: number): Promise<PaginatedAuditoriaResult>;
  findByEntidad(entidad: string, entidadId: string): Promise<Auditoria[]>;
}
