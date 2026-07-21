import { Auditoria } from '../../../logica/domain/entities/Auditoria';
import type { AuditoriaORM } from '../entities/AuditoriaORM';

export class AuditoriaMapper {
  static toDomain(orm: AuditoriaORM): Auditoria {
    return new Auditoria(
      orm.id,
      orm.adminId,
      orm.accion,
      orm.entidad,
      orm.entidadId,
      orm.detalles,
      orm.creadoEn,
    );
  }

  static toORM(domain: Auditoria): Partial<AuditoriaORM> {
    return {
      id: domain.getId(),
      adminId: domain.getAdminId(),
      accion: domain.getAccion(),
      entidad: domain.getEntidad(),
      entidadId: domain.getEntidadId(),
      detalles: domain.getDetalles(),
      creadoEn: domain.getCreadoEn(),
    };
  }
}
