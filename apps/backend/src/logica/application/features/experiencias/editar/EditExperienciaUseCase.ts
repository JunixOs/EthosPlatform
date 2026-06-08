import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { NotFoundException, ForbiddenException } from '../../../exceptions/AppException';
import type { EditExperienciaCommand } from './EditExperienciaCommand';

export class EditExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(cmd: EditExperienciaCommand): Promise<void> {
    const experiencia = await this.experienciaRepo.findById(cmd.id);
    if (!experiencia) throw new NotFoundException('Experiencia');

    if (experiencia.getUsuarioId() !== cmd.usuarioId) {
      throw new ForbiddenException('No puedes editar esta experiencia.');
    }

    experiencia.editar(cmd.titulo, cmd.descripcion, cmd.reflexionMoral, cmd.reflexionEtica);
    await this.experienciaRepo.update(experiencia);
  }
}
