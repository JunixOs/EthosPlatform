import type { Request, Response } from 'express';
import type { AsociarEtiquetasUseCase } from '../../../../application/features/etiquetas/AsociarEtiquetasUseCase';
import type { BuscarPorEtiquetaUseCase } from '../../../../application/features/etiquetas/BuscarPorEtiquetaUseCase';
import type { ListarEtiquetasUseCase } from '../../../../application/features/etiquetas/ListarEtiquetasUseCase';
import { ExperienciaHttpMapper } from '../../experiencias/mappers/ExperienciaHttpMapper';

export class EtiquetasController {
  constructor(
    private readonly asociarUC: AsociarEtiquetasUseCase,
    private readonly buscarUC: BuscarPorEtiquetaUseCase,
    private readonly listarUC: ListarEtiquetasUseCase,
  ) {}

  /** PUT /api/experiencias/:id/etiquetas */
  asociar = async (req: Request, res: Response): Promise<void> => {
    const { id: experienciaId } = req.params as { id: string };
    const usuarioId = req.user!.sub;
    const { nombres } = req.body as { nombres: string[] };
    const result = await this.asociarUC.execute({ experienciaId, usuarioId, nombresEtiquetas: nombres ?? [] });
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };

  /** GET /api/etiquetas/:slug/experiencias */
  buscarPorEtiqueta = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params as { slug: string };
    const page = Number(req.query['page'] ?? 1);
    const limit = Number(req.query['limit'] ?? 10);
    const result = await this.buscarUC.execute(slug, page, limit);
    res.json({
      success: true,
      data: result.data.map(ExperienciaHttpMapper.toResponse),
      total: result.total,
      page: result.page,
      limit: result.limit,
      errorMessage: '',
      errorCode: '',
      httpErrorCode: '',
    });
  };

  /** GET /api/etiquetas */
  listar = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.listarUC.execute();
    res.json({ success: true, data: result, errorMessage: '', errorCode: '', httpErrorCode: '' });
  };
}
