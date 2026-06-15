import {
    Entity , PrimaryColumn , Column , CreateDateColumn,
    OneToMany
} from 'typeorm'
import { ExperienciaEtiquetaORM } from './ExperienciaEtiquetaORM';
import { ExperienciaORM } from './ExperienciaORM';

@Entity('etiquetas')
export class EtiquetaORM {
    @PrimaryColumn({ type: 'uuid' })
    id!: string;

    @Column({ type: 'varchar', name: 'nombre', length: 100, unique: true })
    nombre!: string;

    @Column({ type: 'string', name: 'slug', length: 120, unique: true })
    slug!: string;

    @CreateDateColumn({ name: 'creado_en' })
    creadoEn!: Date;

    // === Relacion con "Experiencia_Etiqueta" ===
    @OneToMany(
        () => ExperienciaEtiquetaORM,
        ee => ee.etiqueta
    )
    experiencias!: ExperienciaORM[];
    // === Relacion con "Experiencia_Etiqueta" ===

}