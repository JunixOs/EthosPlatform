export interface MiembroEquipo {
  nombre: string;
  rol: string;
  fotoUrl?: string;
  bio?: string;
}

export class PaginaEquipo {
  constructor(
    private readonly id: string,
    private titulo: string,
    private contenido: string,
    private miembros: MiembroEquipo[],
    private actualizadoEn: Date = new Date(),
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.titulo.trim().length < 1) throw new Error('El título no puede estar vacío');
    if (this.contenido.trim().length < 1) throw new Error('El contenido no puede estar vacío');
  }

  getId(): string { return this.id; }
  getTitulo(): string { return this.titulo; }
  getContenido(): string { return this.contenido; }
  getMiembros(): MiembroEquipo[] { return this.miembros; }
  getActualizadoEn(): Date { return this.actualizadoEn; }

  editar(titulo: string, contenido: string, miembros: MiembroEquipo[]): void {
    this.titulo = titulo;
    this.contenido = contenido;
    this.miembros = miembros;
    this.actualizadoEn = new Date();
    this.validar();
  }
}
