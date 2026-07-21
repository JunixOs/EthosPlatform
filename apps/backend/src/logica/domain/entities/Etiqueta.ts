export class Etiqueta {
  constructor(
    private readonly id: string,
    private readonly nombre: string,
    private readonly slug: string,
    private readonly creadaEn: Date = new Date(),
  ) {
    this.validarNombre(nombre);
  }

  private validarNombre(nombre: string): void {
    if (nombre.trim().length < 1) {
      throw new Error('El nombre de la etiqueta no puede estar vacío');
    }
    if (nombre.length > 50) {
      throw new Error('El nombre de la etiqueta no puede superar 50 caracteres');
    }
  }

  getId(): string { return this.id; }
  getNombre(): string { return this.nombre; }
  getSlug(): string { return this.slug; }
  getCreadaEn(): Date { return this.creadaEn; }
}
