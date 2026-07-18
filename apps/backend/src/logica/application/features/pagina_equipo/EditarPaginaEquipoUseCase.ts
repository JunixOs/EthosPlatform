import type { IPaginaEquipoRepository } from '../../gateway/repositories/IPaginaEquipoRepository';
import { PaginaEquipo, type MiembroEquipo } from '../../../domain/entities/PaginaEquipo';
import { v4 as uuidv4 } from 'uuid';

export interface EditarPaginaEquipoCommand {
  titulo: string;
  contenido: string;
  miembros: MiembroEquipo[];
}

export class EditarPaginaEquipoUseCase {
  constructor(private readonly repo: IPaginaEquipoRepository) {}

  async execute(cmd: EditarPaginaEquipoCommand): Promise<void> {
    let pagina = await this.repo.find();
    if (!pagina) {
      pagina = new PaginaEquipo(uuidv4(), cmd.titulo, cmd.contenido, cmd.miembros);
    } else {
      pagina.editar(cmd.titulo, cmd.contenido, cmd.miembros);
    }
    await this.repo.save(pagina);
  }
}
