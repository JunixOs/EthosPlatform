import { Etiqueta } from '../../../logica/domain/entities/Etiqueta';
import type { EtiquetaORM } from '../entities/EtiquetaORM';

export class EtiquetaMapper {
  static toDomain(orm: EtiquetaORM): Etiqueta {
    return new Etiqueta(orm.id, orm.nombre, orm.slug, orm.creadaEn);
  }

  static toORM(domain: Etiqueta): Partial<EtiquetaORM> {
    return {
      id: domain.getId(),
      nombre: domain.getNombre(),
      slug: domain.getSlug(),
      creadaEn: domain.getCreadaEn(),
    };
  }
}
