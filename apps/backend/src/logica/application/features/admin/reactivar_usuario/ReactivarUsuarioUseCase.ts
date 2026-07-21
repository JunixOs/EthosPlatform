import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { NotFoundException } from '../../../exceptions/AppException';

export class ReactivarUsuarioUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(id: string): Promise<void> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario');
    }
    usuario.reactivar();
    await this.usuarioRepo.update(usuario);
  }
}
