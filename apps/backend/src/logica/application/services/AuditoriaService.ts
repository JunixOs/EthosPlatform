import type { IAuditoriaRepository } from '../gateway/repositories/IAuditoriaRepository';
import { Auditoria } from '../../domain/entities/Auditoria';
import { v4 as uuidv4 } from 'uuid';

export interface RegistrarAuditoriaCommand {
  adminId: string;
  accion: string;
  entidad: string;
  entidadId: string;
  detalles?: string;
}

export class AuditoriaService {
  constructor(private readonly auditoriaRepo: IAuditoriaRepository) {}

  async registrar(cmd: RegistrarAuditoriaCommand): Promise<void> {
    const registro = new Auditoria(
      uuidv4(),
      cmd.adminId,
      cmd.accion,
      cmd.entidad,
      cmd.entidadId,
      cmd.detalles ?? null,
    );
    await this.auditoriaRepo.save(registro);
  }
}
