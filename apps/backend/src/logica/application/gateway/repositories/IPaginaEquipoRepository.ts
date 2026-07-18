import type { PaginaEquipo } from '../../../domain/entities/PaginaEquipo';

export interface IPaginaEquipoRepository {
  find(): Promise<PaginaEquipo | null>;
  save(pagina: PaginaEquipo): Promise<void>;
}
