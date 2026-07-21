import type { IRespuestaRepository } from '../../gateway/repositories/IRespuestaRepository';
import { NotFoundException, ForbiddenException } from '../../exceptions/AppException';

export class EliminarRespuestaUseCase {
  constructor(private readonly respuestaRepo: IRespuestaRepository) {}

  async execute(respuestaId: string, usuarioId: string, rol: string): Promise<void> {
    const respuesta = await this.respuestaRepo.findById(respuestaId);
    if (!respuesta) throw new NotFoundException('Respuesta');

    const esAutor = respuesta.getUsuarioId() === usuarioId;
    const esAdmin = rol === 'admin';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('No puedes eliminar esta respuesta.');
    }

    await this.respuestaRepo.delete(respuestaId);
  }
}
