import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
export class UsuarioORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  nombre!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  correo!: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  rol!: string;

  @Column({ type: 'boolean', name: 'perfil_publico', default: true })
  perfilPublico!: boolean;

  @Column({ type: 'boolean', default: false })
  suspendido!: boolean;

  @Column({ type: 'timestamp', name: 'suspendido_hasta', nullable: true })
  suspendidoHasta!: Date | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}
