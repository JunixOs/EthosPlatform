import { Etiqueta } from "../../../logica/domain/entities/Etiqueta";
import { EtiquetaORM } from "../entities/EtiquetaORM";

export class EtiquetaMapper {
    static toDomain(orm: EtiquetaORM): Etiqueta {
        return new Etiqueta(            
            orm.id,
            orm.nombre,
            orm.slug,
            orm.creadoEn
        );
    }

    static toORM(domain: Etiqueta): Partial<EtiquetaORM> {
        return {
            id: domain.id,
            nombre: domain.nombre,
            slug: domain.slug,
            creadoEn: domain.creadoEn
        }
    }
}