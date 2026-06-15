export class Favorito {
  constructor(
    private readonly usuarioId: string,
    private readonly experienciaId: string,
    private readonly guardadoEn: Date = new Date(),
  ) {}

  getUsuarioId(): string { return this.usuarioId; }
  getExperienciaId(): string { return this.experienciaId; }
  getGuardadoEn(): Date { return this.guardadoEn; }
}
