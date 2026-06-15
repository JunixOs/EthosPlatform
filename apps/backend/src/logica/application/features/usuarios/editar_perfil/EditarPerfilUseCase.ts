import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { NotFoundException } from '../../../exceptions/AppException';

export interface EditarPerfilCommand {
  usuarioId: string;
  nombre: string;
  biografia?: string | null;
  perfilPublico: boolean;
}

export class EditarPerfilUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(cmd: EditarPerfilCommand): Promise<void> {
    const usuario = await this.usuarioRepo.findById(cmd.usuarioId);
    if (!usuario) throw new NotFoundException('Usuario');

    usuario.editarPerfil(cmd.nombre, cmd.perfilPublico, cmd.biografia);
    await this.usuarioRepo.update(usuario);
  }
}
