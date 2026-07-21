import { Respuesta } from '../../../logica/domain/entities/Respuesta';
import type { RespuestaORM } from '../entities/RespuestaORM';

export class RespuestaMapper {
  static toDomain(orm: RespuestaORM): Respuesta {
    return new Respuesta(
      orm.id,
      orm.experienciaId,
      orm.usuarioId,
      orm.contenido,
      orm.creadaEn,
      orm.actualizadaEn,
    );
  }

  static toORM(domain: Respuesta): Partial<RespuestaORM> {
    return {
      id: domain.getId(),
      experienciaId: domain.getExperienciaId(),
      usuarioId: domain.getUsuarioId(),
      contenido: domain.getContenido(),
      creadaEn: domain.getCreadaEn(),
      actualizadaEn: domain.getActualizadaEn(),
    };
  }
}
