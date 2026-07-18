import type { IPaginaEquipoRepository } from '../../gateway/repositories/IPaginaEquipoRepository';
import { NotFoundException } from '../../exceptions/AppException';

export interface PaginaEquipoResult {
  id: string;
  titulo: string;
  contenido: string;
  miembros: { nombre: string; rol: string; fotoUrl?: string; bio?: string }[];
  actualizadoEn: Date;
}

export class ObtenerPaginaEquipoUseCase {
  constructor(private readonly repo: IPaginaEquipoRepository) {}

  async execute(): Promise<PaginaEquipoResult> {
    const pagina = await this.repo.find();
    if (!pagina) {
      // Devolver contenido por defecto si no existe
      return {
        id: 'default',
        titulo: 'Nuestro Equipo',
        contenido: 'Conoce al equipo detrás de EthosPlatform.',
        miembros: [],
        actualizadoEn: new Date(),
      };
    }

    return {
      id: pagina.getId(),
      titulo: pagina.getTitulo(),
      contenido: pagina.getContenido(),
      miembros: pagina.getMiembros(),
      actualizadoEn: pagina.getActualizadoEn(),
    };
  }
}
