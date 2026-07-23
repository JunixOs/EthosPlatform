import { Entity, PrimaryColumn, Index } from 'typeorm';

@Entity('experiencia_etiquetas')
export class ExperienciaEtiquetaORM {
  @PrimaryColumn({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @Index()
  @PrimaryColumn({ type: 'uuid', name: 'etiqueta_id' })
  etiquetaId!: string;
}
