import type { IUsuarioRepository } from '../../../../application/gateway/repositories/IUsuarioRepository';
import { NotFoundException } from '../../../../application/exceptions/AppException';

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
