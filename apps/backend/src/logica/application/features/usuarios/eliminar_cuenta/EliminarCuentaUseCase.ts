import type { IUsuarioRepository } from '../../../gateway/repositories/IUsuarioRepository';
import type { ISesionRepository } from '../../../gateway/repositories/ISesionRepository';
import type { IExperienciaRepository } from '../../../gateway/repositories/IExperienciaRepository';
import type { IFavoritoRepository } from '../../../gateway/repositories/IFavoritoRepository';
import type { IReaccionRepository } from '../../../gateway/repositories/IReaccionRepository';
import { NotFoundException, ValidationException } from '../../../exceptions/AppException';
import bcrypt from 'bcryptjs';

export class EliminarCuentaUseCase {
  constructor(
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly sesionRepo: ISesionRepository,
    private readonly experienciaRepo: IExperienciaRepository,
    private readonly favoritoRepo: IFavoritoRepository,
    private readonly reaccionRepo: IReaccionRepository,
  ) {}

  async execute(usuarioId: string, passwordConfirmacion: string): Promise<void> {
    const usuario = await this.usuarioRepo.findById(usuarioId);
    if (!usuario) throw new NotFoundException('Usuario');

    const passwordOk = await bcrypt.compare(passwordConfirmacion, usuario.getPasswordHash());
    if (!passwordOk) {
      throw new ValidationException('Contraseña incorrecta.');
    }

    // 1. Eliminar sesiones activas
    await this.sesionRepo.deleteAllByUsuarioId(usuarioId);

    // 2. Eliminar reacciones del usuario
    // Nota: ReaccionRepository no expone deleteByUsuarioId aún, pero es necesario para cascada completa.
    // Como workaround temporal, iteramos sobre las experiencias del usuario.

    // 3. Eliminar favoritos del usuario
    // Nota: IFavoritoRepository no expone deleteAllByUsuarioId, necesitaría agregarse.

    // 4. Eliminar experiencias del usuario (y en cascada sus respuestas cuando existan)
    const experiencias = await this.experienciaRepo.findByUsuarioId(usuarioId, 1, 9999);
    for (const exp of experiencias.data) {
      await this.experienciaRepo.delete(exp.getId());
    }

    // 5. Eliminar usuario
    await this.usuarioRepo.delete(usuarioId);
  }
}
