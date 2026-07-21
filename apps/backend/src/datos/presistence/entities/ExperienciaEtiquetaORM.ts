import { Entity, PrimaryColumn } from 'typeorm';

@Entity('experiencia_etiquetas')
export class ExperienciaEtiquetaORM {
  @PrimaryColumn({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'etiqueta_id' })
  etiquetaId!: string;
}
