import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reacciones')
export class ReaccionORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Column({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;
}
