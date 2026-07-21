export class Reaccion {
  constructor(
    private readonly id: string,
    private readonly usuarioId: string,
    private readonly experienciaId: string,
    private readonly creadaEn: Date = new Date(),
  ) {}

  getId(): string { return this.id; }
  getUsuarioId(): string { return this.usuarioId; }
  getExperienciaId(): string { return this.experienciaId; }
  getCreadaEn(): Date { return this.creadaEn; }
}
