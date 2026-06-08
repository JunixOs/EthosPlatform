import { RolEnum } from '../enum/RolEnum';
import { Email } from '../value_objects/Email';

export class Usuario {
  private id: string;
  private nombre: string;
  private email: Email;
  private passwordHash: string;
  private rol: RolEnum;
  private perfilPublico: boolean;
  private suspendido: boolean;
  private suspendidoHasta: Date | null;
  private creadoEn: Date;

  constructor(
    id: string,
    nombre: string,
    email: Email,
    passwordHash: string,
    rol: RolEnum = RolEnum.USER,
    perfilPublico: boolean = true,
    creadoEn: Date = new Date(),
  ) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = passwordHash;
    this.rol = rol;
    this.perfilPublico = perfilPublico;
    this.suspendido = false;
    this.suspendidoHasta = null;
    this.creadoEn = creadoEn;
  }

  getId(): string {
    return this.id;
  }

  getNombre(): string {
    return this.nombre;
  }

  getEmail(): Email {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getRol(): RolEnum {
    return this.rol;
  }

  isPerfilPublico(): boolean {
    return this.perfilPublico;
  }

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

  editarPerfil(nombre: string, perfilPublico: boolean): void {
    this.nombre = nombre;
    this.perfilPublico = perfilPublico;
  }

  cambiarPassword(nuevoHash: string): void {
    this.passwordHash = nuevoHash;
  }

  getCreadoEn(): Date {
    return this.creadoEn;
  }
}
