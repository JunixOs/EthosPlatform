import type { Reaccion } from '../../../domain/entities/Reaccion';

export interface IReaccionRepository {
  findByUsuarioAndExperiencia(usuarioId: string, experienciaId: string): Promise<Reaccion | null>;
  countByExperienciaId(experienciaId: string): Promise<number>;
  save(reaccion: Reaccion): Promise<void>;
  delete(id: string): Promise<void>;
}
