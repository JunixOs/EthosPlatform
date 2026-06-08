export interface Experiencia {
  id: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
  estado: 'borrador' | 'publicada' | 'archivada';
  creadaEn: string;
  actualizadaEn: string;
}

export interface CreateExperienciaDTO {
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
  publicar?: boolean;
}

export interface UpdateExperienciaDTO {
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
}
