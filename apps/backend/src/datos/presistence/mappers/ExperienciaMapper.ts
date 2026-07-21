import { Experiencia } from '../../../logica/domain/entities/Experiencia';
import { EstadoExperienciaEnum } from '../../../logica/domain/enum/index';
import type { ExperienciaORM } from '../entities/ExperienciaORM';

export class ExperienciaMapper {
  static toDomain(orm: ExperienciaORM): Experiencia {
    return new Experiencia({
      id: orm.id,
      usuarioId: orm.usuarioId,
      titulo: orm.titulo,
      descripcion: orm.descripcion,
      reflexionMoral: orm.reflexionMoral,
      reflexionEtica: orm.reflexionEtica,
      estado: orm.estado as EstadoExperienciaEnum,
      creadaEn: orm.creadaEn,
      actualizadaEn: orm.actualizadaEn,
    });
  }

  static toORM(domain: Experiencia): Partial<ExperienciaORM> {
    return {
      id: domain.getId(),
      usuarioId: domain.getUsuarioId(),
      titulo: domain.getTitulo(),
      descripcion: domain.getDescripcion(),
      reflexionMoral: domain.getReflexionMoral(),
      reflexionEtica: domain.getReflexionEtica(),
      estado: domain.getEstado(),
    };
  }
}
