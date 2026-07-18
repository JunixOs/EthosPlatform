export class Auditoria {
  constructor(
    private readonly id: string,
    private readonly adminId: string,
    private readonly accion: string,
    private readonly entidad: string,
    private readonly entidadId: string,
    private readonly detalles: string | null,
    private readonly creadoEn: Date = new Date(),
  ) {}

  getId(): string { return this.id; }
  getAdminId(): string { return this.adminId; }
  getAccion(): string { return this.accion; }
  getEntidad(): string { return this.entidad; }
  getEntidadId(): string { return this.entidadId; }
  getDetalles(): string | null { return this.detalles; }
  getCreadoEn(): Date { return this.creadoEn; }
}
