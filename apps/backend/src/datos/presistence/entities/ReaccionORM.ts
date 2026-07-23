import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('reacciones')
@Index(['usuarioId', 'experienciaId'], { unique: true })
export class ReaccionORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Index()
  @Column({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;
}
