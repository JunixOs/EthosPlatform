import type { ISesionRepository } from '../../../gateway/repositories/ISesionRepository';
import { UnauthorizedException } from '../../../exceptions/AppException';

export class LogoutUseCase {
  constructor(private readonly sesionRepo: ISesionRepository) {}

  async execute(token: string): Promise<void> {
    const sesion = await this.sesionRepo.findByToken(token);
    if (!sesion) throw new UnauthorizedException();
    await this.sesionRepo.deleteByToken(token);
  }
}
