import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('sesiones')
export class SesionORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Column({ type: 'text', unique: true })
  token!: string;

  @Column({ type: 'varchar', length: 10 })
  tipo!: string;

  @Column({ type: 'timestamp', name: 'expira_en' })
  expiraEn!: Date;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;
}
