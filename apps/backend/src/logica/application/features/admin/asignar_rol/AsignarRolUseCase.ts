import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { NotFoundException, ValidationException } from '../../../exceptions/AppException';
import { RolEnum } from '../../../../domain/enum/RolEnum';

export class AsignarRolUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(targetId: string, nuevoRol: string): Promise<void> {
    if (!Object.values(RolEnum).includes(nuevoRol as RolEnum)) {
      throw new ValidationException(`Rol inválido. Valores permitidos: ${Object.values(RolEnum).join(', ')}.`);
    }

    const usuario = await this.usuarioRepo.findById(targetId);
    if (!usuario) throw new NotFoundException('Usuario');

    usuario.asignarRol(nuevoRol as RolEnum);
    await this.usuarioRepo.update(usuario);
  }
}
