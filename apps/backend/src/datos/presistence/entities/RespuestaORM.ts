import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('respuestas')
export class RespuestaORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @Index()
  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Column({ type: 'text' })
  contenido!: string;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;

  @UpdateDateColumn({ name: 'actualizada_en' })
  actualizadaEn!: Date;
}
