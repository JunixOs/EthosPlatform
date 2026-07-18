export class Respuesta {
  constructor(
    private readonly id: string,
    private readonly experienciaId: string,
    private readonly usuarioId: string,
    private contenido: string,
    private readonly creadaEn: Date = new Date(),
    private actualizadaEn: Date = new Date(),
  ) {
    this.validarContenido(contenido);
  }

  private validarContenido(contenido: string): void {
    if (contenido.trim().length < 1) {
      throw new Error('El contenido de la respuesta no puede estar vacío');
    }
    if (contenido.length > 2000) {
      throw new Error('El contenido de la respuesta no puede superar 2000 caracteres');
    }
  }

  getId(): string { return this.id; }
  getExperienciaId(): string { return this.experienciaId; }
  getUsuarioId(): string { return this.usuarioId; }
  getContenido(): string { return this.contenido; }
  getCreadaEn(): Date { return this.creadaEn; }
  getActualizadaEn(): Date { return this.actualizadaEn; }

  editar(nuevoContenido: string): void {
    this.validarContenido(nuevoContenido);
    this.contenido = nuevoContenido;
    this.actualizadaEn = new Date();
  }
}
