import { Usuario } from '../../../logica/domain/entities/Usuario';
import { Email } from '../../../logica/domain/value_objects/Email';
import { RolEnum } from '../../../logica/domain/enum/RolEnum';
import type { UsuarioORM } from '../entities/UsuarioORM';

export class UsuarioMapper {
  static toDomain(orm: UsuarioORM): Usuario {
    const usuario = new Usuario(
      orm.id,
      orm.nombre,
      new Email(orm.correo),
      orm.passwordHash,
      orm.rol as RolEnum,
      orm.perfilPublico,
      orm.creadoEn,
      orm.biografia ?? null,
      orm.fotoPerfil ?? null,
    );
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
