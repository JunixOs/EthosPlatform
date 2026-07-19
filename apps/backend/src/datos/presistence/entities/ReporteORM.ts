import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { TipoReporteEnum } from '../../../logica/domain/enum/index';

@Entity('reportes')
export class ReporteORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid', name: 'reporter_id' })
  reporterId!: string;

  @Column({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @Column({ type: 'enum', enum: TipoReporteEnum })
  tipo!: TipoReporteEnum;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  estado!: string;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;
}
