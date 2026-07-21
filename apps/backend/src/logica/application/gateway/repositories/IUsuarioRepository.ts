import type { Usuario } from '../../../domain/entities/Usuario';

export interface IUsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: string): Promise<Usuario | null>;
  findAll(page: number, limit: number): Promise<{ data: Usuario[]; total: number }>;
  save(usuario: Usuario): Promise<void>;
  update(usuario: Usuario): Promise<void>;
  delete(id: string): Promise<void>;
}
