import { Reporte } from '../../../logica/domain/entities/Reporte';
import type { ReporteORM } from '../entities/ReporteORM';
import type { TipoReporteEnum } from '../../../logica/domain/enum/index';

export class ReporteMapper {
  static toDomain(orm: ReporteORM): Reporte {
    return new Reporte(
      orm.id,
      orm.reporterId,
      orm.experienciaId,
      orm.tipo as TipoReporteEnum,
      orm.descripcion,
      orm.estado,
      orm.creadoEn,
    );
  }

  static toORM(domain: Reporte): Partial<ReporteORM> {
    return {
      id: domain.getId(),
      reporterId: domain.getReporterId(),
      experienciaId: domain.getExperienciaId(),
      tipo: domain.getTipo(),
      descripcion: domain.getDescripcion(),
      estado: domain.getEstado(),
      creadoEn: domain.getCreadoEn(),
    };
  }
}
