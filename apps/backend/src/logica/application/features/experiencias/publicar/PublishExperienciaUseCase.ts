import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { NotFoundException, ForbiddenException } from '../../../exceptions/AppException';

export class PublishExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(id: string, usuarioId: string): Promise<void> {
    const experiencia = await this.experienciaRepo.findById(id);
    if (!experiencia) throw new NotFoundException('Experiencia');

    if (experiencia.getUsuarioId() !== usuarioId) {
      throw new ForbiddenException('No puedes publicar esta experiencia.');
    }

    experiencia.publicar();
    await this.experienciaRepo.update(experiencia);
  }
}
