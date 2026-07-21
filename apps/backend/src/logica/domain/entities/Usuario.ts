import { RolEnum } from '../enum/RolEnum';
import { Email } from '../value_objects/Email';

export interface UsuarioProps {
  id: string;
  nombre: string;
  email: Email;
  passwordHash: string;
  rol?: RolEnum;
  perfilPublico?: boolean;
  creadoEn?: Date;
  biografia?: string | null;
  fotoPerfil?: string | null;
}

export class Usuario {
  private readonly id: string;
  private nombre: string;
  private readonly email: Email;
  private passwordHash: string;
  private rol: RolEnum;
  private perfilPublico: boolean;
  private suspendido: boolean;
  private suspendidoHasta: Date | null;
  private biografia: string | null;
  private fotoPerfil: string | null;
  private readonly creadoEn: Date;

  constructor(props: UsuarioProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.rol = props.rol ?? RolEnum.USER;
    this.perfilPublico = props.perfilPublico ?? true;
    this.suspendido = false;
    this.suspendidoHasta = null;
    this.biografia = props.biografia ?? null;
    this.fotoPerfil = props.fotoPerfil ?? null;
    this.creadoEn = props.creadoEn ?? new Date();
  }

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getEmail(): Email { return this.email; }
  getPasswordHash(): string { return this.passwordHash; }
  getRol(): RolEnum { return this.rol; }
  isPerfilPublico(): boolean { return this.perfilPublico; }
  getBiografia(): string | null { return this.biografia; }
  getFotoPerfil(): string | null { return this.fotoPerfil; }
  getCreadoEn(): Date { return this.creadoEn; }
  getSuspendidoHasta(): Date | null { return this.suspendidoHasta; }

  isSuspendido(): boolean {
    return this.suspendido && (!this.suspendidoHasta || this.suspendidoHasta > new Date());
  }

  suspender(hasta: Date): void {
    this.suspendido = true;
    this.suspendidoHasta = hasta;
  }

  reactivar(): void {
    this.suspendido = false;
    this.suspendidoHasta = null;
  }

  asignarRol(nuevoRol: RolEnum): void {
    this.rol = nuevoRol;
  }

  editarPerfil(nombre: string, perfilPublico: boolean, biografia?: string | null): void {
    this.nombre = nombre.trim();
    this.perfilPublico = perfilPublico;
    if (biografia !== undefined) this.biografia = biografia;
  }

  editarNombreVisible(nombre: string): void {
    this.nombre = nombre.trim();
  }

  setBiografia(bio: string | null): void {
    this.biografia = bio;
  }

  setFotoPerfil(url: string | null): void {
    this.fotoPerfil = url;
  }

  setPrivacidad(publica: boolean): void {
    this.perfilPublico = publica;
  }

  cambiarPassword(nuevoHash: string): void {
    this.passwordHash = nuevoHash;
  }
}
