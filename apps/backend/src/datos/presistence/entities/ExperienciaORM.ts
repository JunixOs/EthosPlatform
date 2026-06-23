import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('experiencias')
export class ExperienciaORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Column({ type: 'varchar', length: 255 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'text', name: 'reflexion_moral' })
  reflexionMoral!: string;

  @Column({ type: 'text', name: 'reflexion_etica' })
  reflexionEtica!: string;

  @Column({ type: 'varchar', length: 20, default: 'borrador' })
  estado!: string;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;

  @UpdateDateColumn({ name: 'actualizada_en' })
  actualizadaEn!: Date;
}
