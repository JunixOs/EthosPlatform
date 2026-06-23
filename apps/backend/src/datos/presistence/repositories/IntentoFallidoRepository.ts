import type { DataSource, Repository } from 'typeorm';
import type { IIntentoFallidoRepository } from '../../../logica/application/gateway/repositories/IIntentoFallidoRepository';
import { IntentoFallido } from '../../../logica/domain/entities/IntentoFallido';
import { IntentoFallidoORM } from '../entities/IntentoFallidoORM';

export class IntentoFallidoRepository implements IIntentoFallidoRepository {
  private readonly repo: Repository<IntentoFallidoORM>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(IntentoFallidoORM);
  }

  async findRecientesByCorreo(correo: string, minutosAtras = 15): Promise<IntentoFallido[]> {
    const desde = new Date(Date.now() - minutosAtras * 60000);
    const orms = await this.repo
      .createQueryBuilder('i')
      .where('i.correo = :correo', { correo })
      .andWhere('i.fechaIntento > :desde', { desde })
      .getMany();

    return orms.map(
      (o) => new IntentoFallido(o.id, o.correo, o.ip, o.fechaIntento),
    );
  }

  async save(intento: IntentoFallido): Promise<void> {
    await this.repo.save({
      id: intento.getId(),
      correo: intento.getCorreo(),
      ip: intento.getIp(),
      fechaIntento: intento.getFechaIntento(),
    });
  }

  async deleteByCorreo(correo: string): Promise<void> {
    await this.repo.delete({ correo });
  }
}
