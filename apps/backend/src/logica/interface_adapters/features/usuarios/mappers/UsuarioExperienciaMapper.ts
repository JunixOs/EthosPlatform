import type { Experiencia } from '../../../../domain/entities/Experiencia';

export interface UsuarioExperienciaResponseDTO {
  id: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
  estado: string;
  creadaEn: string;
  actualizadaEn: string;
}

export class UsuarioExperienciaMapper {
  static toResponse(experiencia: Experiencia): UsuarioExperienciaResponseDTO {
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
