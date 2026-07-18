import type { TipoReporteEnum } from '../../../datos/presistence/entities/ReporteORM';

export class Reporte {
  constructor(
    private readonly id: string,
    private readonly reporterId: string,
    private readonly experienciaId: string,
    private readonly tipo: TipoReporteEnum,
    private readonly descripcion: string | null,
    private readonly estado: string = 'pendiente',
    private readonly creadoEn: Date = new Date(),
  ) {}

  getId(): string { return this.id; }
  getReporterId(): string { return this.reporterId; }
  getExperienciaId(): string { return this.experienciaId; }
  getTipo(): TipoReporteEnum { return this.tipo; }
  getDescripcion(): string | null { return this.descripcion; }
  getEstado(): string { return this.estado; }
  getCreadoEn(): Date { return this.creadoEn; }

  resolver(): void {
    if (this.estado !== 'pendiente') {
      throw new Error('El reporte ya fue resuelto');
    }
    (this as any).estado = 'resuelto';
  }
}
