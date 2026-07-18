import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('etiquetas')
export class EtiquetaORM {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug!: string;

  @CreateDateColumn({ name: 'creada_en' })
  creadaEn!: Date;
}
