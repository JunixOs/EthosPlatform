import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { NotFoundException, ValidationException } from '../../../exceptions/AppException';

export class EditarFotoPerfilUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(usuarioId: string, fotoUrl: string | null): Promise<void> {
    const usuario = await this.usuarioRepo.findById(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario');

    if (fotoUrl !== null && fotoUrl.length > 500) {
      throw new ValidationException('La URL de la foto es demasiado larga.');
    }

    usuario.setFotoPerfil(fotoUrl);
    await this.usuarioRepo.update(usuario);
  }
}
