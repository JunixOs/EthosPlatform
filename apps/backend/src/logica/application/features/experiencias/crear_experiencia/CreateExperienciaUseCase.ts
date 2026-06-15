import { v4 as uuidv4 } from 'uuid';
import { Experiencia } from '../../../../domain/entities/Experiencia';
import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { ValidationException } from '../../../exceptions/AppException';
import type { CreateExperienciaCommand } from './CreateExperienciaCommand';

const MIN_CHARS = 10;

function validarCampo(valor: string, campo: string): void {
  if (valor.trim().length < MIN_CHARS) {
    throw new ValidationException(`El campo "${campo}" debe tener al menos ${MIN_CHARS} caracteres.`);
  }
}

export class CreateExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(cmd: CreateExperienciaCommand): Promise<{ id: string }> {
    validarCampo(cmd.descripcion, 'descripción');
    validarCampo(cmd.reflexionMoral, 'reflexión moral');
    validarCampo(cmd.reflexionEtica, 'reflexión ética');

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
