import { TipoSesionEnum } from '../enum/index';

export class Sesion {
  private id: string;
  private usuarioId: string;
  private token: string;
  private tipo: TipoSesionEnum;
  private expiraEn: Date;
  private creadaEn: Date;

  constructor(
    id: string,
    usuarioId: string,
    token: string,
    tipo: TipoSesionEnum,
    expiraEn: Date,
    creadaEn: Date = new Date(),
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.token = token;
    this.tipo = tipo;
    this.expiraEn = expiraEn;
    this.creadaEn = creadaEn;
  }

  getId(): string {
    return this.id;
  }

  getUsuarioId(): string {
    return this.usuarioId;
  }

  getToken(): string {
    return this.token;
  }

  getTipo(): TipoSesionEnum {
    return this.tipo;
  }

  isValida(): boolean {
    return this.expiraEn > new Date();
  }

  getExpiraEn(): Date {
    return this.expiraEn;
  }

  getCreadaEn(): Date {
    return this.creadaEn;
  }

  renovar(nuevoExpiraEn: Date): Sesion {
    return new Sesion(this.id, this.usuarioId, this.token, this.tipo, nuevoExpiraEn, this.creadaEn);
  }
}
