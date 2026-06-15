import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { NotFoundException, ConflictException, ValidationException } from '../../../exceptions/AppException';
import { Email } from '../../../../domain/value_objects/Email';
import { RolEnum } from '../../../../domain/enum/RolEnum';

export interface EditarUsuarioAdminCommand {
  targetId: string;
  nombre: string;
  correo: string;
  rol: string;
  perfilPublico: boolean;
}

export class EditarUsuarioAdminUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(cmd: EditarUsuarioAdminCommand): Promise<void> {
    if (!Object.values(RolEnum).includes(cmd.rol as RolEnum)) {
      throw new ValidationException(`Rol inválido: ${cmd.rol}`);
    }

    let email: Email;
    try {
      email = new Email(cmd.correo);
    } catch {
      throw new ValidationException('Correo electrónico inválido.');
    }

    const usuario = await this.usuarioRepo.findById(cmd.targetId);
    if (!usuario) throw new NotFoundException('Usuario');

    if (email.getValue() !== usuario.getEmail().getValue()) {
      const existing = await this.usuarioRepo.findByEmail(email.getValue());
      if (existing) throw new ConflictException('Ya existe una cuenta con ese correo.');
    }

    usuario.editarPerfil(cmd.nombre, cmd.perfilPublico);
    usuario.asignarRol(cmd.rol as RolEnum);
    await this.usuarioRepo.update(usuario);
  }
}
