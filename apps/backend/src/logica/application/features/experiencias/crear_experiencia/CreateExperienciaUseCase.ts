import { v4 as uuidv4 } from 'uuid';
import { Experiencia } from '../../../../domain/entities/Experiencia';
import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import type { CreateExperienciaCommand } from './CreateExperienciaCommand';

export class CreateExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(cmd: CreateExperienciaCommand): Promise<{ id: string }> {
    const id = uuidv4();
    const experiencia = new Experiencia(
      id,
      cmd.usuarioId,
      cmd.titulo,
      cmd.descripcion,
      cmd.reflexionMoral,
      cmd.reflexionEtica,
    );

    if (cmd.publicar) {
      experiencia.publicar();
    }

    await this.experienciaRepo.save(experiencia);
    return { id };
  }
}
