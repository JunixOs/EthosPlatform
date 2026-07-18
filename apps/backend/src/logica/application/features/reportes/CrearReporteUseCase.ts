import type { IReporteRepository } from '../../gateway/repositories/IReporteRepository';
import type { IExperienciaRepository } from '../../gateway/repositories/IExperienciaRepository';
import { Reporte } from '../../../domain/entities/Reporte';
import { NotFoundException, ConflictException, ValidationException } from '../../exceptions/AppException';
import { v4 as uuidv4 } from 'uuid';
import type { TipoReporteEnum } from '../../../../datos/presistence/entities/ReporteORM';

export interface CrearReporteCommand {
  reporterId: string;
  experienciaId: string;
  tipo: TipoReporteEnum;
  descripcion?: string | undefined;
}

export interface CrearReporteResult {
  id: string;
  estado: string;
}

export class CrearReporteUseCase {
  constructor(
    private readonly reporteRepo: IReporteRepository,
    private readonly experienciaRepo: IExperienciaRepository,
  ) {}

  async execute(cmd: CrearReporteCommand): Promise<CrearReporteResult> {
    const experiencia = await this.experienciaRepo.findById(cmd.experienciaId);
    if (!experiencia) throw new NotFoundException('Experiencia');
    if (!experiencia.isPublicada()) {
      throw new ValidationException('No puedes reportar una experiencia no publicada.');
    }

    const yaReportado = await this.reporteRepo.existeReporteDeUsuario(cmd.reporterId, cmd.experienciaId);
    if (yaReportado) {
      throw new ConflictException('Ya has reportado esta experiencia anteriormente.');
    }

    const reporte = new Reporte(
      uuidv4(),
      cmd.reporterId,
      cmd.experienciaId,
      cmd.tipo,
      cmd.descripcion ?? null,
    );
    await this.reporteRepo.save(reporte);

    return { id: reporte.getId(), estado: reporte.getEstado() };
  }
}
