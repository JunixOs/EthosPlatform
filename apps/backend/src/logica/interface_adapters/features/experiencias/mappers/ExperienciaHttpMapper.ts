import type { Experiencia } from '../../../../domain/entities/Experiencia';
import type { ExperienciaResponseDTO } from '../dtos/response/ExperienciaResponseDTO';

export class ExperienciaHttpMapper {
  static toResponse(experiencia: Experiencia): ExperienciaResponseDTO {
    return {
      id: experiencia.getId(),
      usuarioId: experiencia.getUsuarioId(),
      titulo: experiencia.getTitulo(),
      descripcion: experiencia.getDescripcion(),
      reflexionMoral: experiencia.getReflexionMoral(),
      reflexionEtica: experiencia.getReflexionEtica(),
      estado: experiencia.getEstado(),
      creadaEn: experiencia.getCreadaEn().toISOString(),
      actualizadaEn: experiencia.getActualizadaEn().toISOString(),
    };
  }
}
