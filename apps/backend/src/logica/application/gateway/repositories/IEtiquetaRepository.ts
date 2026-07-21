import type { Etiqueta } from '../../../domain/entities/Etiqueta';

export interface IEtiquetaRepository {
  findById(id: string): Promise<Etiqueta | null>;
  findBySlug(slug: string): Promise<Etiqueta | null>;
  findByNombre(nombre: string): Promise<Etiqueta | null>;
  findAll(): Promise<Etiqueta[]>;
  findByExperienciaId(experienciaId: string): Promise<Etiqueta[]>;
  save(etiqueta: Etiqueta): Promise<void>;
  asociarAExperiencia(experienciaId: string, etiquetaId: string): Promise<void>;
  desasociarDeExperiencia(experienciaId: string, etiquetaId: string): Promise<void>;
  findExperienciasByEtiquetaId(etiquetaId: string, page: number, limit: number): Promise<{ experienciaIds: string[]; total: number }>;
}
