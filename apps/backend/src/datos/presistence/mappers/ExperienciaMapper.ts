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

  static toORM(
    experiencia_domain_entity: Experiencia,
  ): Partial<ExperienciaORM> {
    return {
      id: experiencia_domain_entity.getId(),
      usuarioId: experiencia_domain_entity.getUsuarioId(),
      titulo: experiencia_domain_entity.getTitulo(),
      descripcion: experiencia_domain_entity.getDescripcion(),
      reflexionMoral: experiencia_domain_entity.getReflexionMoral(),
      reflexionEtica: experiencia_domain_entity.getReflexionEtica(),
      estado: experiencia_domain_entity.getEstado(),
    };
  }
}
