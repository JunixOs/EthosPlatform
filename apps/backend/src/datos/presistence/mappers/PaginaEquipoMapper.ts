import { PaginaEquipo, type MiembroEquipo } from '../../../logica/domain/entities/PaginaEquipo';
import type { PaginaEquipoORM } from '../entities/PaginaEquipoORM';

export class PaginaEquipoMapper {
  static toDomain(orm: PaginaEquipoORM): PaginaEquipo {
    const miembros: MiembroEquipo[] = orm.miembros ? JSON.parse(orm.miembros) : [];
    return new PaginaEquipo(orm.id, orm.titulo, orm.contenido, miembros, orm.actualizadoEn);
  }

  static toORM(domain: PaginaEquipo): Partial<PaginaEquipoORM> {
    return {
      id: domain.getId(),
      titulo: domain.getTitulo(),
      contenido: domain.getContenido(),
      miembros: JSON.stringify(domain.getMiembros()),
      actualizadoEn: domain.getActualizadoEn(),
    };
  }
}
