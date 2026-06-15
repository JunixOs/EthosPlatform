import { Sesion } from '../../../logica/domain/entities/Sesion';
import { Usuario } from '../../../logica/domain/entities/Usuario';
import { TipoSesionEnum } from '../../../logica/domain/enum/index';
import type { SesionORM } from '../entities/SesionORM';

export class SesionMapper {
  static toDomain(orm: SesionORM): Sesion {
    return new Sesion(
      orm.id,
      orm.usuarioId,
      orm.token,
      orm.tipo as TipoSesionEnum,
      orm.expiraEn,
      orm.creadaEn,
    );
  }

  static toORM(domain: Sesion): Partial<SesionORM> {
    return {
      id: domain.getId(),
      usuarioId: domain.getUsuarioId(),
      token: domain.getToken(),
      tipo: domain.getTipo(),
      expiraEn: domain.getExpiraEn(),
    };
  }
}
