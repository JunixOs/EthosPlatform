export interface CreateExperienciaCommand {
  usuarioId: string;
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
  publicar?: boolean;
}
