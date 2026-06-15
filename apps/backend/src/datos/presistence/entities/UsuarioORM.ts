import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

import { ExperienciaORM } from './ExperienciaORM';
import { ExperienciaEtiquetaORM } from './ExperienciaEtiquetaORM';
import { SesionORM } from './SesionORM';

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

  // === Relacion con "Experiencia" ===
  @OneToMany(
    () => ExperienciaORM,
    experiencia => experiencia.usuario
  )
  experiencias!: ExperienciaORM[];
  // === Relacion con "Experiencia" ===
  
  // === Relacion con "Experiencia_Etiqueta" ===
  @OneToOne(
    () => ExperienciaEtiquetaORM,
    ee => ee.usuario
  )
  experienciaEtiqueta!: ExperienciaEtiquetaORM;
  // === Relacion con "Experiencia_Etiqueta" ===
  
  // === Relacion con "Sesion" ===
  @OneToMany(
    () => SesionORM,
    sesion => sesion.usuario
  )
  sesiones!: SesionORM[];
  // === Relacion con "Sesion" ===
}
