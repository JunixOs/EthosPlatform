import { Entity, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('favoritos')
export class FavoritoORM {
  @PrimaryColumn({ type: 'uuid', name: 'usuario_id' })
  usuarioId!: string;

  @Index()
  @PrimaryColumn({ type: 'uuid', name: 'experiencia_id' })
  experienciaId!: string;

  @CreateDateColumn({ name: 'guardado_en' })
  guardadoEn!: Date;
}
