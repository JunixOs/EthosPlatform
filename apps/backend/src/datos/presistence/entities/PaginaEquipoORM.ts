import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('pagina_equipo')
export class PaginaEquipoORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ type: 'text' })
  contenido!: string;

  @Column({ type: 'text', nullable: true })
  miembros!: string | null; // JSON string

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn!: Date;
}
