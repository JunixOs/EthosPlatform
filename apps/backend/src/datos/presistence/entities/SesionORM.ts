import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioORM } from './UsuarioORM';

@Entity('sesiones')
export class SesionORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  // === Relacion con "Usuario" ===
  @Column({
    name: 'usuario_id',
    type: 'uuid'
  })
  usuarioId!: string;

  @ManyToOne(
    () => UsuarioORM,
    usuario => usuario.sesiones
  )
  @JoinColumn({
    name: 'usuario_id'
  })
  usuario!: UsuarioORM;
  // === Relacion con "Usuario" ===

  @Column({ type: 'text', unique: true })
  token!: string;

  @Column({ type: 'varchar', length: 10 })
  tipo!: string;

  @Column({ type: 'timestamp', name: 'expira_en' })
  expiraEn!: Date;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;
}
