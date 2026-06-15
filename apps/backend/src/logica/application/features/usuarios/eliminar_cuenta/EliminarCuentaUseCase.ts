import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import type { ISesionRepository } from '../../../gateway/repositories/ISesionRepository';
import { NotFoundException } from '../../../exceptions/AppException';
import bcrypt from 'bcryptjs';

export class EliminarCuentaUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly sesionRepo: ISesionRepository,
  ) {}

  async execute(usuarioId: string, passwordConfirmacion: string): Promise<void> {
    const usuario = await this.usuarioRepo.findById(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario');

    const passwordOk = await bcrypt.compare(passwordConfirmacion, usuario.getPasswordHash());
    if (!passwordOk) {
      throw new Error('Contraseña incorrecta.');
    }

    await this.sesionRepo.deleteAllByUsuarioId(usuarioId);
    await this.usuarioRepo.delete(usuarioId);
  }
}
