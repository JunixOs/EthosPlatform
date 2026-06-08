import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sesiones')
export class SesionORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

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
