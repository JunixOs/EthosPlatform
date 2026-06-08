import { Experiencia } from '../../../logica/domain/entities/Experiencia';
import { EstadoExperienciaEnum } from '../../../logica/domain/enum/index';
import type { ExperienciaORM } from '../entities/ExperienciaORM';

export class ExperienciaMapper {
  static toDomain(orm: ExperienciaORM): Experiencia {
    return new Experiencia(
      orm.id,
      orm.usuarioId,
      orm.titulo,
      orm.descripcion,
      orm.reflexionMoral,
      orm.reflexionEtica,
      orm.estado as EstadoExperienciaEnum,
      orm.creadaEn,
      orm.actualizadaEn,
    );
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
