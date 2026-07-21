import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import { NotFoundException, ValidationException } from '../../../exceptions/AppException';

export interface SuspenderUsuarioCommand {
  targetId: string;
  diasSuspension: number;
}

export class SuspenderUsuarioUseCase {
  constructor(private readonly usuarioRepo: IUsuarioRepository) {}

  async execute(cmd: SuspenderUsuarioCommand): Promise<void> {
    if (cmd.diasSuspension < 1 || cmd.diasSuspension > 365) {
      throw new ValidationException('La suspensión debe ser entre 1 y 365 días.');
    }

    const usuario = await this.usuarioRepo.findById(cmd.targetId);
    if (!usuario) throw new NotFoundException('Usuario');

    const hasta = new Date(Date.now() + cmd.diasSuspension * 24 * 60 * 60 * 1000);
    usuario.suspender(hasta);
    await this.usuarioRepo.update(usuario);
  }
}
