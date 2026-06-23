import type { DataSource, Repository } from 'typeorm';
import type { IUsuarioRepository } from '../../../logica/application/gateway/repositories/IUsuarioRepository';
import type { Usuario } from '../../../logica/domain/entities/Usuario';
import { UsuarioORM } from '../entities/UsuarioORM';
import { UsuarioMapper } from '../mappers/UsuarioMapper';

export class UsuarioRepository implements IUsuarioRepository {
  private readonly repo: Repository<UsuarioORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(UsuarioORM);
  }

  async findById(id: string): Promise<Usuario | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? UsuarioMapper.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const orm = await this.repo.findOneBy({ correo: email });
    return orm ? UsuarioMapper.toDomain(orm) : null;
  }

  async save(usuario: Usuario): Promise<void> {
    const data = UsuarioMapper.toORM(usuario);
    await this.repo.save(data);
  }

  async update(usuario: Usuario): Promise<void> {
    const data = UsuarioMapper.toORM(usuario);
    await this.repo.save(data);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
