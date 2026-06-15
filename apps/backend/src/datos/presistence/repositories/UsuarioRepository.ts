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

  async findAll(page: number, limit: number): Promise<{ data: Usuario[]; total: number }> {
    const [orms, total] = await this.repo.findAndCount({
      order: { creadoEn: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: orms.map(UsuarioMapper.toDomain), total };
  }

  async save(usuario: Usuario): Promise<void> {
    await this.repo.save(UsuarioMapper.toORM(usuario));
  }

  async update(usuario: Usuario): Promise<void> {
    await this.repo.save(UsuarioMapper.toORM(usuario));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
