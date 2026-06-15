import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import type { ISesionRepository } from '../../../gateway/repositories/ISesionRepository';
import { NotFoundException } from '../../../exceptions/AppException';

export class EliminarUsuarioAdminUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly sesionRepo: ISesionRepository,
  ) {}

  async execute(targetId: string): Promise<void> {
    const usuario = await this.usuarioRepo.findById(targetId);
    if (!usuario) throw new NotFoundException('Usuario');

    await this.sesionRepo.deleteAllByUsuarioId(targetId);
    await this.usuarioRepo.delete(targetId);
  }
}
