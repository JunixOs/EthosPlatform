import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from '../../../../domain/entities/Usuario';
import { Email } from '../../../../domain/value_objects/Email';
import { Password } from '../../../../domain/value_objects/Password';
import { RolEnum } from '../../../../domain/enum/RolEnum';
import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { ConflictException, ValidationException } from '../../../exceptions/AppException';
import type { RegisterCommand } from './RegisterCommand';

export class RegisterUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(cmd: RegisterCommand): Promise<{ id: string }> {
    const password = new Password(cmd.password);

    let email: Email;
    try {
      email = new Email(cmd.correo);
    } catch {
      throw new ValidationException('El correo electrónico no es válido.');
    }

    const existing = await this.usuarioRepo.findByEmail(email.getValue());
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese correo.');
    }

    const passwordHash = await bcrypt.hash(password.getValue(), 10);
    const id = uuidv4();
    const usuario = new Usuario({ id, nombre: cmd.nombre.trim(), email, passwordHash, rol: RolEnum.USER });

    await this.usuarioRepo.save(usuario);
    return { id };
  }
}
