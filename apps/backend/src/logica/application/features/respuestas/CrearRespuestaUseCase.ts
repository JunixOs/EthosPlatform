import type { IRespuestaRepository } from '../../gateway/repositories/IRespuestaRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { Respuesta } from '../../../domain/entities/Respuesta';
import { NotFoundException, ForbiddenException } from '../../exceptions/AppException';
import { v4 as uuidv4 } from 'uuid';

export interface CrearRespuestaCommand {
  experienciaId: string;
  usuarioId: string;
  contenido: string;
}

export interface CrearRespuestaResult {
  id: string;
  experienciaId: string;
  usuarioId: string;
  contenido: string;
  creadaEn: Date;
}

export class CrearRespuestaUseCase {
  constructor(
    private readonly respuestaRepo: IRespuestaRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(cmd: CrearRespuestaCommand): Promise<CrearRespuestaResult> {
    const experiencia = await this.experienciaRepo.findById(cmd.experienciaId);
    if (!experiencia) throw new NotFoundException('Experiencia');
    if (!experiencia.isPublicada()) {
      throw new ForbiddenException('No puedes responder a una experiencia no publicada.');
    }

    const respuesta = new Respuesta(uuidv4(), cmd.experienciaId, cmd.usuarioId, cmd.contenido);
    await this.respuestaRepo.save(respuesta);

    return {
      id: respuesta.getId(),
      experienciaId: respuesta.getExperienciaId(),
      usuarioId: respuesta.getUsuarioId(),
      contenido: respuesta.getContenido(),
      creadaEn: respuesta.getCreadaEn(),
    };
  }
}
