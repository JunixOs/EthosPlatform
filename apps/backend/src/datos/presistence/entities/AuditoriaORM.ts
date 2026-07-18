import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('auditoria')
export class AuditoriaORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid', name: 'admin_id' })
  adminId!: string;

  @Column({ type: 'varchar', length: 50 })
  accion!: string;

  @Column({ type: 'varchar', length: 20 })
  entidad!: string;

  @Column({ type: 'uuid', name: 'entidad_id' })
  entidadId!: string;

  @Column({ type: 'text', nullable: true })
  detalles!: string | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;
}
