import type { Request, Response } from 'express';
import type { CrearReporteUseCase } from '../../../../application/features/reportes/CrearReporteUseCase';
import type { ListarReportesUseCase } from '../../../../application/features/reportes/ListarReportesUseCase';
import type { OcultarContenidoUseCase } from '../../../../application/features/reportes/OcultarContenidoUseCase';
import type { TipoReporteEnum } from '../../../../domain/enum/index';

export class ReportesController {
  constructor(
    private readonly crearUC: CrearReporteUseCase,
    private readonly listarUC: ListarReportesUseCase,
    private readonly ocultarUC: OcultarContenidoUseCase,
  ) {}

  /** POST /api/reportes */
  crear = async (req: Request, res: Response): Promise<void> => {
    const reporterId = req.user!.sub;
    const { experienciaId, tipo, descripcion } = req.body as { experienciaId: string; tipo: TipoReporteEnum; descripcion?: string };
    const result = await this.crearUC.execute({ reporterId, experienciaId, tipo, descripcion });
    res.status(201).json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/admin/reportes — listar reportes pendientes */
  listarPendientes = async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const result = await this.listarUC.execute(page, limit);
    res.json({ success: true, data: result.data, total: result.total, page: result.page, limit: result.limit, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** PATCH /api/admin/reportes/:id/ocultar */
  ocultar = async (req: Request, res: Response): Promise<void> => {
    const { id: reporteId } = req.params as { id: string };
    await this.ocultarUC.execute(reporteId);
    res.json({ success: true, data: null, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
