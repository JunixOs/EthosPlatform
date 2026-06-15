import { 
  Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn,
  OneToMany, 
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { UsuarioORM } from './UsuarioORM';
import { ExperienciaEtiquetaORM } from './ExperienciaEtiquetaORM';

@Entity('experiencias')
export class ExperienciaORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  // === Relacion con "Usuarios" FK ===
  @Column({
    name: 'usuario_id',
    type: 'uuid'
  })
  usuarioId!: string;
  
  @ManyToOne(
    () => UsuarioORM,
    usuario => usuario.experiencias
  )
  @JoinColumn({
    name: 'usuario_id'
  })
  usuario!: UsuarioORM;
  // === Relacion con "Usuarios" FK ===

  @Column({ type: 'varchar', length: 255 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'text', name: 'reflexion_moral' })
  reflexionMoral!: string;

  @Column({ type: 'text', name: 'reflexion_etica' })
  reflexionEtica!: string;

  @Column({ type: 'varchar', length: 20, default: 'borrador' })
  estado!: string;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;

  @UpdateDateColumn({ name: 'actualizada_en' })
  actualizadaEn!: Date;

  // Relacion con "Experiencia_Etiquetas"
  @OneToMany(
    () => ExperienciaEtiquetaORM,
    ee => ee.experiencia
  )
  etiquetas!: ExperienciaEtiquetaORM[];
  // Relacion con "Experiencia_Etiquetas"
}
