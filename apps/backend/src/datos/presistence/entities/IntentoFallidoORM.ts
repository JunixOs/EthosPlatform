import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('intentos_fallidos')
export class IntentoFallidoORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  correo!: string;

  @Column({ type: 'varchar', length: 50 })
  ip!: string;

  @CreateDateColumn({ name: 'fecha_intento' })
  fechaIntento!: Date;
}
