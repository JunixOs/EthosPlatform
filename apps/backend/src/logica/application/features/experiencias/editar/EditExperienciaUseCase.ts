import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import { NotFoundException, ForbiddenException, ValidationException } from '../../../exceptions/AppException';
import type { EditExperienciaCommand } from './EditExperienciaCommand';

const MIN_CHARS = 10;

function validarCampo(valor: string, campo: string): void {
  if (valor.trim().length < MIN_CHARS) {
    throw new ValidationException(`El campo "${campo}" debe tener al menos ${MIN_CHARS} caracteres.`);
  }
}

export class EditExperienciaUseCase {
  constructor(private readonly experienciaRepo: IExperienciaRepository) {}

  async execute(cmd: EditExperienciaCommand): Promise<void> {
    validarCampo(cmd.descripcion, 'descripción');
    validarCampo(cmd.reflexionMoral, 'reflexión moral');
    validarCampo(cmd.reflexionEtica, 'reflexión ética');

    const experiencia = await this.experienciaRepo.findById(cmd.id);
    if (!experiencia) throw new NotFoundException('Experiencia');

    if (experiencia.getUsuarioId() !== cmd.usuarioId) {
      throw new ForbiddenException('No puedes editar esta experiencia.');
    }

    experiencia.editar(cmd.titulo, cmd.descripcion, cmd.reflexionMoral, cmd.reflexionEtica);
    await this.experienciaRepo.update(experiencia);
  }
}
