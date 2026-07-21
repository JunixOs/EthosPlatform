import { Usuario } from '../../../logica/domain/entities/Usuario';
import { Email } from '../../../logica/domain/value_objects/Email';
import { RolEnum } from '../../../logica/domain/enum/RolEnum';
import type { UsuarioORM } from '../entities/UsuarioORM';

export class UsuarioMapper {
  static toDomain(orm: UsuarioORM): Usuario {
    const usuario = new Usuario({
      id: orm.id,
      nombre: orm.nombre,
      email: new Email(orm.correo),
      passwordHash: orm.passwordHash,
      rol: orm.rol as RolEnum,
      perfilPublico: orm.perfilPublico,
      creadoEn: orm.creadoEn,
      biografia: orm.biografia ?? null,
      fotoPerfil: orm.fotoPerfil ?? null,
    });
    if (orm.suspendido && orm.suspendidoHasta) {
      usuario.suspender(orm.suspendidoHasta);
    }
    return usuario;
  }

  static toORM(domain: Usuario): Partial<UsuarioORM> {
    return {
      id: domain.getId(),
      nombre: domain.getNombre(),
      correo: domain.getEmail().getValue(),
      passwordHash: domain.getPasswordHash(),
      rol: domain.getRol(),
      perfilPublico: domain.isPerfilPublico(),
      suspendido: domain.isSuspendido(),
      suspendidoHasta: domain.getSuspendidoHasta(),
      biografia: domain.getBiografia(),
      fotoPerfil: domain.getFotoPerfil(),
    };
  }
}
