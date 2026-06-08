import type { Sesion } from '../../../domain/entities/Sesion';

export interface ISesionRepository {
  findByToken(token: string): Promise<Sesion | null>;
  findActiveByUsuarioId(usuarioId: string): Promise<Sesion[]>;
  save(sesion: Sesion): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteAllByUsuarioId(usuarioId: string): Promise<void>;
}
