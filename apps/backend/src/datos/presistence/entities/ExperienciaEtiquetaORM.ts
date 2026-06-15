import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn
} from 'typeorm'
import { ExperienciaORM } from './ExperienciaORM';
import { EtiquetaORM } from './EtiquetaORM';
import { UsuarioORM } from './UsuarioORM';

@Entity('experiencia_etiqueta')
export class ExperienciaEtiquetaORM {

    // === PK ===
    @PrimaryColumn({
        name: 'experiencia_id',
        type: 'uuid'
    })
    experienciaId!: string;
    
    @PrimaryColumn({
        name: 'etiqueta_id',
        type: 'uuid'
    })
    etiquetaId!: string;
    // === PK ===

    // === Relacion con "Experiencias" ===
    @ManyToOne(
        () => ExperienciaORM,
        experiencia => experiencia.etiquetas,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'experiencia_id'
    })
    experiencia!: ExperienciaORM;
    // === Relacion con "Experiencias" ===
    
    // === Relacion con "Etiquetas" ===
    @ManyToOne(
        () => EtiquetaORM,
        etiqueta => etiqueta.experiencias,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn({
        name: 'etiqueta_id'
    })
    etiqueta!: EtiquetaORM;
    // === Relacion con "Etiquetas" ===

    @CreateDateColumn({
        name: "asignado_en"
    })
    asignadoEn!: Date;

    // === Relacion con "Usuarios" ===
    @Column({
        name: 'usuario_id',
        type: 'uuid'
    })
    usuarioId!: string;
    
    @OneToOne(
        () => UsuarioORM,
        usuario => usuario.experienciaEtiqueta
    )
    @JoinColumn({
        name: 'usuario_id'
    })
    usuario!: UsuarioORM;
    // === Relacion con "Usuarios" ===
}