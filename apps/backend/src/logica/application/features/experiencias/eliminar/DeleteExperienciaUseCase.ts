import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { NotFoundException, ForbiddenException } from '../../../exceptions/AppException';
import { RolEnum } from '../../../../domain/enum/RolEnum';

export class DeleteExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(id: string, usuarioId: string, rol: string): Promise<void> {
    const experiencia = await this.experienciaRepo.findById(id);
    if (!experiencia) throw new NotFoundException('Experiencia');

    if (experiencia.getUsuarioId() !== usuarioId && rol !== RolEnum.ADMIN) {
      throw new ForbiddenException('No puedes eliminar esta experiencia.');
    }

    await this.experienciaRepo.delete(id);
  }
}
