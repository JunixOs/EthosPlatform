import { EstadoExperienciaEnum } from '../enum/index';

export interface ExperienciaProps {
  id: string;
  usuarioId: string;
  titulo: string;
  descripcion: string;
  reflexionMoral: string;
  reflexionEtica: string;
  estado?: EstadoExperienciaEnum;
  creadaEn?: Date;
  actualizadaEn?: Date;
}

export class Experiencia {
  private readonly id: string;
  private readonly usuarioId: string;
  private titulo: string;
  private descripcion: string;
  private reflexionMoral: string;
  private reflexionEtica: string;
  private estado: EstadoExperienciaEnum;
  private readonly creadaEn: Date;
  private actualizadaEn: Date;

  constructor(props: ExperienciaProps) {
    this.id = props.id;
    this.usuarioId = props.usuarioId;
    this.titulo = props.titulo;
    this.descripcion = props.descripcion;
    this.reflexionMoral = props.reflexionMoral;
    this.reflexionEtica = props.reflexionEtica;
    this.estado = props.estado ?? EstadoExperienciaEnum.BORRADOR;
    this.creadaEn = props.creadaEn ?? new Date();
    this.actualizadaEn = props.actualizadaEn ?? new Date();
  }

  getId(): string {
    return this.id;
  }

  getUsuarioId(): string {
    return this.usuarioId;
  }

  getTitulo(): string {
    return this.titulo;
  }

  getDescripcion(): string {
    return this.descripcion;
  }

  getReflexionMoral(): string {
    return this.reflexionMoral;
  }

  getReflexionEtica(): string {
    return this.reflexionEtica;
  }

  getEstado(): EstadoExperienciaEnum {
    return this.estado;
  }

  isPublicada(): boolean {
    return this.estado === EstadoExperienciaEnum.PUBLICADA;
  }

  getCreadaEn(): Date {
    return this.creadaEn;
  }

  getActualizadaEn(): Date {
    return this.actualizadaEn;
  }

  editar(
    titulo: string,
    descripcion: string,
    reflexionMoral: string,
    reflexionEtica: string,
  ): void {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.reflexionMoral = reflexionMoral;
    this.reflexionEtica = reflexionEtica;
    this.actualizadaEn = new Date();
  }

  publicar(): void {
    if (this.titulo.trim() === '' || this.descripcion.trim() === '') {
      throw new Error('La experiencia debe tener título y descripción');
    }
    this.estado = EstadoExperienciaEnum.PUBLICADA;
    this.actualizadaEn = new Date();
  }

  guardarBorrador(): void {
    if (this.estado !== EstadoExperienciaEnum.PUBLICADA) {
      this.estado = EstadoExperienciaEnum.BORRADOR;
    }
    this.actualizadaEn = new Date();
  }

  archivar(): void {
    this.estado = EstadoExperienciaEnum.ARCHIVADA;
    this.actualizadaEn = new Date();
  }
}
